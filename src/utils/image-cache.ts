/**
 * 图片尺寸缓存工具
 * 用于在构建时缓存图片尺寸信息，避免重复下载
 */

import fs from "node:fs/promises";
import path from "node:path";

interface ImageCacheEntry {
	url: string;
	width: number;
	height: number;
	timestamp: number;
}

interface ImageCache {
	images: Record<string, ImageCacheEntry>;
}

const CACHE_FILE = path.join(process.cwd(), "public", "photography-cache.json");
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 天

/**
 * 从缓存文件读取图片尺寸
 */
export async function getImageSizeFromCache(
	url: string,
): Promise<{ width: number; height: number } | null> {
	try {
		const cacheContent = await fs.readFile(CACHE_FILE, "utf-8");
		const cache: ImageCache = JSON.parse(cacheContent);
		const entry = cache.images[url];

		if (entry) {
			// 检查缓存是否过期
			const now = Date.now();
			if (now - entry.timestamp < CACHE_EXPIRY) {
				return {
					width: entry.width,
					height: entry.height,
				};
			}
		}
	} catch (error) {
		// 缓存文件不存在或格式错误，忽略
	}

	return null;
}

/**
 * 保存图片尺寸到缓存
 */
export async function saveImageSizeToCache(
	url: string,
	width: number,
	height: number,
): Promise<void> {
	try {
		let cache: ImageCache = { images: {} };

		// 尝试读取现有缓存
		try {
			const cacheContent = await fs.readFile(CACHE_FILE, "utf-8");
			cache = JSON.parse(cacheContent);
		} catch {
			// 文件不存在，使用空缓存
		}

		// 更新缓存
		cache.images[url] = {
			url,
			width,
			height,
			timestamp: Date.now(),
		};

		// 确保目录存在
		const cacheDir = path.dirname(CACHE_FILE);
		await fs.mkdir(cacheDir, { recursive: true });

		// 写入缓存文件
		await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
	} catch (error) {
		// 缓存写入失败，不影响主流程
		// 使用 console.warn 因为 logger 可能不可用
		if (typeof console !== "undefined" && console.warn) {
			console.warn("Failed to save image cache:", error);
		}
	}
}

/**
 * 批量保存图片尺寸到缓存
 */
export async function saveImageSizesToCache(
	images: Array<{ url: string; width: number; height: number }>,
): Promise<void> {
	try {
		let cache: ImageCache = { images: {} };

		// 尝试读取现有缓存
		try {
			const cacheContent = await fs.readFile(CACHE_FILE, "utf-8");
			cache = JSON.parse(cacheContent);
		} catch {
			// 文件不存在，使用空缓存
		}

		// 批量更新缓存
		const now = Date.now();
		for (const img of images) {
			cache.images[img.url] = {
				url: img.url,
				width: img.width,
				height: img.height,
				timestamp: now,
			};
		}

		// 确保目录存在
		const cacheDir = path.dirname(CACHE_FILE);
		await fs.mkdir(cacheDir, { recursive: true });

		// 写入缓存文件
		await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
	} catch (error) {
		// 缓存写入失败，不影响主流程
		// 使用 console.warn 因为 logger 可能不可用
		if (typeof console !== "undefined" && console.warn) {
			console.warn("Failed to save image cache:", error);
		}
	}
}
