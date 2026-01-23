#!/usr/bin/env node
/**
 * 生成图片尺寸缓存脚本
 * 在本地开发时运行此脚本，生成图片尺寸缓存文件
 * 这样在 CI 构建时就可以使用缓存，而不需要访问外部图片
 * 
 * 使用方法: node scripts/generate-image-cache.js
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOGRAPHY_FILE = path.join(__dirname, "../public/photography.txt");
const CACHE_FILE = path.join(__dirname, "../public/photography-cache.json");

// 禁用系统代理环境变量
delete process.env.HTTP_PROXY;
delete process.env.HTTPS_PROXY;
delete process.env.http_proxy;
delete process.env.https_proxy;
delete process.env.NO_PROXY;
delete process.env.no_proxy;

// 创建不使用代理的 HTTP/HTTPS Agent
const httpAgent = new http.Agent({
	keepAlive: false,
	rejectUnauthorized: false, // 允许自签名证书（如果需要）
});

const httpsAgent = new https.Agent({
	keepAlive: false,
	rejectUnauthorized: false, // 允许自签名证书（如果需要）
});

/**
 * 通过 HTTP 请求获取图片尺寸（不使用系统代理）
 * @param {string} url - 图片 URL
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageSizeFromUrl(url) {
	return new Promise((resolve, reject) => {
		const urlObj = new URL(url);
		const client = urlObj.protocol === "https:" ? https : http;
		const agent = urlObj.protocol === "https:" ? httpsAgent : httpAgent;
		
		const options = {
			hostname: urlObj.hostname,
			port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
			path: urlObj.pathname + urlObj.search,
			method: "GET",
			timeout: 15000,
			agent: agent, // 使用自定义 agent，不使用系统代理
			headers: {
				"Range": "bytes=0-65535", // 只获取前 64KB（某些 JPEG 的 SOF marker 可能较靠后）
				"User-Agent": "Mozilla/5.0 (compatible; ImageSizeBot/1.0)",
			},
		};

		const req = client.request(options, (res) => {
			const contentType = res.headers["content-type"] || "";
			if (!contentType.startsWith("image/")) {
				reject(new Error("Not an image"));
				return;
			}

			let data = Buffer.alloc(0);
			
			res.on("data", (chunk) => {
				data = Buffer.concat([data, chunk]);
				// 64KB 足够读取图片头信息（某些 JPEG 的 SOF marker 可能较靠后）
				if (data.length >= 65536) {
					res.destroy();
					try {
						const size = parseImageSize(data, url);
						resolve(size);
					} catch (err) {
						reject(err);
					}
				}
			});
			
			res.on("end", () => {
				if (data.length > 0) {
					try {
						const size = parseImageSize(data, url);
						resolve(size);
					} catch (err) {
						reject(err);
					}
				} else {
					reject(new Error("No data received"));
				}
			});
		});
		
		req.on("error", reject);
		req.on("timeout", () => {
			req.destroy();
			reject(new Error("Request timeout"));
		});
		req.setTimeout(15000);
		req.end();
	});
}

/**
 * 解析图片尺寸（支持 JPEG, PNG, GIF, WebP）
 * @param {Buffer} buffer - 图片数据缓冲区
 * @param {string} url - 图片 URL（用于错误信息）
 * @returns {{width: number, height: number}}
 */
function parseImageSize(buffer, url) {
	// JPEG: FF D8 ... FF C0/C1/C2/C3 (SOF markers)
	if (buffer[0] === 0xff && buffer[1] === 0xd8) {
		let offset = 2;
		const maxOffset = Math.min(buffer.length - 8, 65536); // 最多检查 64KB
		
		while (offset < maxOffset) {
			if (buffer[offset] === 0xff) {
				const marker = buffer[offset + 1];
				
				// 跳过填充字节 (FF 00)
				if (marker === 0x00) {
					offset += 2;
					continue;
				}
				
				// SOF markers: C0, C1, C2, C3, C5, C6, C7, C9, CA, CB, CD, CE, CF
				if ((marker >= 0xc0 && marker <= 0xc3) || 
				    (marker >= 0xc5 && marker <= 0xc7) ||
				    marker === 0xc9 || marker === 0xca || marker === 0xcb ||
				    marker === 0xcd || marker === 0xce || marker === 0xcf) {
					// 确保有足够的数据
					if (offset + 8 >= buffer.length) {
						break;
					}
					// 跳过长度字段（2字节）和精度字段（1字节）
					const height = (buffer[offset + 5] << 8) | buffer[offset + 6];
					const width = (buffer[offset + 7] << 8) | buffer[offset + 8];
					if (width > 0 && height > 0 && width < 50000 && height < 50000) {
						return { width, height };
					}
				}
				
				// 跳过当前标记
				offset += 2;
				if (offset + 1 < buffer.length) {
					const segmentLength = (buffer[offset] << 8) | buffer[offset + 1];
					if (segmentLength < 2 || offset + segmentLength >= buffer.length) {
						break;
					}
					offset += segmentLength;
				} else {
					break;
				}
			} else {
				offset++;
			}
		}
		// 如果没找到 SOF，尝试使用 sharp 库（如果可用）
		throw new Error(`Could not find JPEG SOF marker in ${url}`);
	}
	
	// PNG: 89 50 4E 47 0D 0A 1A 0A ... IHDR chunk
	if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
		const width = buffer.readUInt32BE(16);
		const height = buffer.readUInt32BE(20);
		return { width, height };
	}
	
	// GIF: 47 49 46 38 (GIF8)
	if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
		const width = buffer.readUInt16LE(6);
		const height = buffer.readUInt16LE(8);
		return { width, height };
	}
	
	// WebP: RIFF ... WEBP ... VP8/VP8L
	if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
		// 查找 VP8 或 VP8L chunk
		let offset = 12; // 跳过 RIFF header
		while (offset < buffer.length - 8) {
			const chunkType = buffer.toString("ascii", offset, offset + 4);
			if (chunkType === "VP8 ") {
				// VP8 format
				const width = buffer.readUInt16LE(offset + 10) & 0x3fff;
				const height = buffer.readUInt16LE(offset + 12) & 0x3fff;
				return { width, height };
			} else if (chunkType === "VP8L") {
				// VP8L format
				const bits = buffer.readUInt32LE(offset + 5);
				const width = (bits & 0x3fff) + 1;
				const height = ((bits >> 14) & 0x3fff) + 1;
				return { width, height };
			}
			const chunkSize = buffer.readUInt32LE(offset + 4);
			offset += 8 + chunkSize;
		}
	}
	
	throw new Error(`Unsupported image format or invalid image: ${url}`);
}

async function generateCache() {
	try {
		// 读取图片 URL 列表
		const content = await fs.readFile(PHOTOGRAPHY_FILE, "utf-8");
		const urls = content
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0 && line.startsWith("http"));

		console.log(`Found ${urls.length} image URLs\n`);

		const cache = { images: {} };
		let successCount = 0;
		let failCount = 0;

		// 逐个获取图片尺寸
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			try {
				console.log(`[${i + 1}/${urls.length}] Processing: ${url}`);
				
				const { width, height } = await getImageSizeFromUrl(url);
				
				cache.images[url] = {
					url,
					width,
					height,
					timestamp: Date.now(),
				};
				successCount++;
				console.log(`✓ Success: ${width}x${height}\n`);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				console.error(`✗ Failed: ${errorMessage}\n`);
				// 不保存失败的图片到缓存，让构建时有机会重试
				failCount++;
			}
			
			// 添加小延迟，避免请求过快
			if (i < urls.length - 1) {
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

		// 保存缓存文件
		await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
		console.log(`\nCache generated successfully!`);
		console.log(`  Success: ${successCount}`);
		console.log(`  Failed: ${failCount}`);
		console.log(`  Cache file: ${CACHE_FILE}`);
	} catch (error) {
		console.error("Error generating cache:", error);
		process.exit(1);
	}
}

generateCache();
