// 将下载的守岸人官方图优化为 WebP 并输出到 public/shorekeeper/gallery
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "tmp/sk-gallery";
const OUT = "public/shorekeeper/gallery";
fs.mkdirSync(OUT, { recursive: true });

// [源文件, 输出名, 最大宽度, webp质量]
const jobs = [
	["lihui.png", "lihui.webp", 1040, 85],
	["promo1.jpg", "promo-horizontal.webp", 1916, 82],
	["promo2.jpg", "promo-vertical.webp", 1076, 82],
	["treasure1.png", "treasure-01.webp", 1024, 85],
	["treasure2.png", "treasure-02.webp", 1024, 85],
	["treasure3.png", "treasure-03.webp", 1024, 85],
	["home.png", "home.webp", 366, 85],
	["avatar.png", "avatar.webp", 256, 85],
	// 图标类保持 PNG（本来就小）
	["skill-resonance.png", "skill-resonance.png", null, null],
	["skill-circuit.png", "skill-circuit.png", null, null],
	["skill-liberation.png", "skill-liberation.png", null, null],
	["skill-intro.png", "skill-intro.png", null, null],
	["skill-outro.png", "skill-outro.png", null, null],
	["skill-innate1.png", "skill-innate1.png", null, null],
	["skill-innate2.png", "skill-innate2.png", null, null],
	["chain1.png", "chain-1.png", null, null],
	["chain2.png", "chain-2.png", null, null],
	["chain3.png", "chain-3.png", null, null],
	["chain4.png", "chain-4.png", null, null],
	["chain5.png", "chain-5.png", null, null],
	["chain6.png", "chain-6.png", null, null],
];

let before = 0;
let after = 0;
for (const [src, out, width, quality] of jobs) {
	const inPath = path.join(SRC, src);
	const outPath = path.join(OUT, out);
	before += fs.statSync(inPath).size;
	if (width) {
		await sharp(inPath).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(outPath);
	} else {
		fs.copyFileSync(inPath, outPath);
	}
	after += fs.statSync(outPath).size;
}

console.log(`完成 ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (省 ${((1 - after / before) * 100).toFixed(0)}%)`);
for (const f of fs.readdirSync(OUT)) {
	const kb = (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0);
	console.log(`  ${kb.padStart(6)}KB  ${f}`);
}
