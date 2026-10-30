#!/usr/bin/env node
/**
 * 汇总外链图片的真实尺寸，供构建时注入 width/height，消除布局抖动（CLS）。
 *
 * 扫描 src/content/posts 与 public/photography.txt 中的图片 URL，
 * 只探测尚未记录过的地址，结果写入 src/data/image-dims.json。
 *
 * 用法: node scripts/update-image-dims.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src", "data", "image-dims.json");
const CONCURRENCY = 12;
const TIMEOUT_MS = 15000;

async function collectUrls() {
	const urls = new Set();

	const postsDir = path.join(ROOT, "src", "content", "posts");
	const walk = async (dir) => {
		for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				await walk(full);
				continue;
			}
			if (!/\.(md|mdx)$/.test(entry.name)) continue;
			const text = await fs.readFile(full, "utf8");
			for (const m of text.matchAll(
				/https?:\/\/[^\s)"']+?\.(?:jpg|jpeg|png|gif|webp|avif)/gi,
			)) {
				urls.add(m[0]);
			}
		}
	};
	await walk(postsDir);

	try {
		const txt = await fs.readFile(
			path.join(ROOT, "public", "photography.txt"),
			"utf8",
		);
		for (const line of txt.split("\n")) {
			const url = line.trim();
			if (url.startsWith("http")) urls.add(url);
		}
	} catch {
		/* 文件不存在就跳过 */
	}

	return [...urls];
}

async function measure(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, { signal: ctrl.signal });
		const type = res.headers.get("content-type") || "";
		if (!res.ok || !type.startsWith("image/")) return null;
		const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
		if (!meta.width || !meta.height) return null;
		return { width: meta.width, height: meta.height };
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

async function main() {
	await fs.mkdir(path.dirname(OUT), { recursive: true });

	let dims = {};
	try {
		dims = JSON.parse(await fs.readFile(OUT, "utf8"));
	} catch {
		dims = {};
	}

	const urls = await collectUrls();
	const missing = urls.filter((u) => !dims[u]);
	console.log(`图片总数 ${urls.length}，已有 ${urls.length - missing.length}，待探测 ${missing.length}`);

	let cursor = 0;
	let done = 0;
	let failed = 0;

	async function worker() {
		while (cursor < missing.length) {
			const url = missing[cursor++];
			const size = await measure(url);
			if (size) dims[url] = size;
			else failed++;
			done++;
			if (done % 20 === 0) console.log(`  进度 ${done}/${missing.length}`);
		}
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, worker));

	const sorted = Object.fromEntries(
		Object.entries(dims).sort(([a], [b]) => a.localeCompare(b)),
	);
	await fs.writeFile(OUT, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");

	console.log(`完成：记录 ${Object.keys(sorted).length} 条，本次失败 ${failed} 条`);
	console.log(`输出 ${path.relative(ROOT, OUT)}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
