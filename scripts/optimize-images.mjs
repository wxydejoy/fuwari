#!/usr/bin/env node
/**
 * 落地页 / banner 图片优化
 *
 * 把 public/landing 下的原图（PNG/JPEG 体积过大）转成 WebP + AVIF，
 * 并把 banner 从外链下载后本地化。
 *
 * 原图迁到 assets/landing 保留，不再随站点发布。
 *
 * 用法: node scripts/optimize-images.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "assets", "landing");
const OUT_DIR = path.join(ROOT, "public", "landing");
const BANNER_DIR = path.join(ROOT, "public", "banner");

const BANNER_URL =
	"https://i.undf.cn/file/ob/616b27741d92418019d973e0e79add48.png";

function log(name, before, after) {
	const pct = ((1 - after / before) * 100).toFixed(0);
	console.log(
		`  ${name.padEnd(26)} ${(before / 1024).toFixed(0).padStart(5)}KB -> ${(after / 1024).toFixed(0).padStart(4)}KB  (-${pct}%)`,
	);
}

async function emit(input, output, width, format, options) {
	const buf = await sharp(input)
		.resize({ width, withoutEnlargement: true })
		[format](options)
		.toBuffer();
	await fs.writeFile(output, buf);
	return buf.length;
}

async function main() {
	await fs.mkdir(SRC_DIR, { recursive: true });
	await fs.mkdir(OUT_DIR, { recursive: true });
	await fs.mkdir(BANNER_DIR, { recursive: true });

	// 1. 把仍在 public 里的原图搬到 assets，避免随站点发布
	const moves = [
		["sprite.png", "sprite.png"],
		["card.jpg", "card.jpg"],
		["butterfly.webp", "butterfly.webp"],
	];
	for (const [from, to] of moves) {
		const src = path.join(OUT_DIR, from);
		const dest = path.join(SRC_DIR, to);
		try {
			await fs.access(dest);
		} catch {
			try {
				await fs.copyFile(src, dest);
			} catch {
				continue;
			}
		}
	}

	console.log("落地页图片:");
	const spriteSrc = path.join(SRC_DIR, "sprite.png");
	const spriteOrig = (await fs.stat(spriteSrc)).size;

	for (const w of [1040, 720, 480]) {
		const size = await emit(
			spriteSrc,
			path.join(OUT_DIR, `sprite-${w}.webp`),
			w,
			"webp",
			{ quality: 82 },
		);
		if (w === 1040) log("sprite.png -> webp", spriteOrig, size);
	}
	await emit(spriteSrc, path.join(OUT_DIR, "sprite-1040.avif"), 1040, "avif", {
		quality: 58,
	});

	const cardSrc = path.join(SRC_DIR, "card.jpg");
	const cardOrig = (await fs.stat(cardSrc)).size;
	log(
		"card.jpg -> webp@432",
		cardOrig,
		await emit(cardSrc, path.join(OUT_DIR, "card-432.webp"), 432, "webp", {
			quality: 80,
		}),
	);
	await emit(cardSrc, path.join(OUT_DIR, "card-432.avif"), 432, "avif", {
		quality: 55,
	});

	const flySrc = path.join(SRC_DIR, "butterfly.webp");
	const flyOrig = (await fs.stat(flySrc)).size;
	log(
		"butterfly -> webp@224",
		flyOrig,
		await emit(
			flySrc,
			path.join(OUT_DIR, "butterfly-224.webp"),
			224,
			"webp",
			{ quality: 82 },
		),
	);
	await emit(
		flySrc,
		path.join(OUT_DIR, "butterfly-224.avif"),
		224,
		"avif",
		{ quality: 55 },
	);

	// 2. banner 本地化
	console.log("\nBanner:");
	const res = await fetch(BANNER_URL);
	if (!res.ok) throw new Error(`banner download failed: ${res.status}`);
	const bannerBuf = Buffer.from(await res.arrayBuffer());
	const tmpBanner = path.join(ROOT, "tmp", "_banner.png");
	await fs.writeFile(tmpBanner, bannerBuf);

	for (const w of [1920, 1280]) {
		const size = await emit(
			tmpBanner,
			path.join(BANNER_DIR, `hero-${w}.webp`),
			w,
			"webp",
			{ quality: 78 },
		);
		if (w === 1920) log("banner PNG -> webp@1920", bannerBuf.length, size);
	}
	await emit(tmpBanner, path.join(BANNER_DIR, "hero-1920.avif"), 1920, "avif", {
		quality: 55,
	});
	await fs.unlink(tmpBanner);

	// 3. 清理已被替换的原文件
	for (const name of ["sprite.png", "card.jpg", "butterfly.webp"]) {
		try {
			await fs.unlink(path.join(OUT_DIR, name));
		} catch {
			/* 已经不在了 */
		}
	}

	console.log("\n完成。原图保留在 assets/landing/");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
