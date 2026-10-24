/**
 * Subset LXGW WenKai Screen for the fixed landing page.
 * Run once locally; the build does not call this.
 *
 *   pnpm subset-landing-font
 *
 * Expects tmp/LXGWWenKaiScreen.ttf (not committed).
 * Source: https://github.com/lxgw/LxgwWenKai-Screen/releases/download/v1.530/LXGWWenKaiScreen.ttf
 * Writes public/landing/fonts/lxgw-wenkai-screen.woff2
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fontmin from "fontmin";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcFont = path.join(root, "tmp", "LXGWWenKaiScreen.ttf");
const destDir = path.join(root, "public", "landing", "fonts");
const destFont = path.join(destDir, "lxgw-wenkai-screen.woff2");

function decodeEntities(value) {
	return value
		.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">");
}

function landingText() {
	const indexPath = path.join(root, "src", "pages", "index.astro");
	const cssPath = path.join(root, "public", "landing", "style.css");
	const configPath = path.join(root, "src", "config.ts");
	const index = fs.readFileSync(indexPath, "utf8");
	const css = fs.readFileSync(cssPath, "utf8");
	const config = fs.readFileSync(configPath, "utf8");
	const title = config.match(/title:\s*"([^"]*)"/)?.[1] ?? "";

	const html = index
		.split("---")
		.slice(2)
		.join("---")
		.replace(/<script[\s\S]*?<\/script>/gi, "")
		.replace(/<svg[\s\S]*?<\/svg>/gi, "")
		.replace(/<title[\s\S]*?<\/title>/gi, "")
		.replaceAll("{siteConfig.title}", title);

	const attrs = [];
	const attrRe = /\b(?:alt|aria-label|data-codes)="([^"]*)"/g;
	for (const match of html.matchAll(attrRe)) {
		attrs.push(decodeEntities(match[1]));
	}

	const text = decodeEntities(html.replace(/<[^>]+>/g, " "));
	const cssContent = [...css.matchAll(/content:\s*"([^"]*)"/g)].map((match) => match[1]);

	return [text, ...attrs, ...cssContent, "已抄录", title].join("");
}

function uniqueGlyphs(value) {
	const glyphs = [];
	const seen = new Set();
	for (const char of value) {
		if (char === "\n" || char === "\r" || char === "\t") continue;
		if (seen.has(char)) continue;
		seen.add(char);
		glyphs.push(char);
	}
	return glyphs.join("");
}

if (!fs.existsSync(srcFont)) {
	console.error(`Missing source font: ${srcFont}`);
	process.exit(1);
}

const text = uniqueGlyphs(landingText());
fs.mkdirSync(destDir, { recursive: true });

const fontmin = new Fontmin()
	.src(srcFont)
	.use(
		Fontmin.glyph({
			text,
			hinting: false,
		}),
	)
	.use(Fontmin.ttf2woff2())
	.dest(destDir);

fontmin.run((error, files) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}

	const woff2 = files.find((file) => file.path.endsWith(".woff2"));
	if (!woff2) {
		console.error("Fontmin did not emit a woff2 file");
		process.exit(1);
	}

	for (const file of fs.readdirSync(destDir)) {
		if (file.endsWith(".ttf")) {
			fs.unlinkSync(path.join(destDir, file));
		}
	}

	if (path.basename(woff2.path) !== path.basename(destFont)) {
		fs.renameSync(woff2.path, destFont);
	}

	const size = fs.statSync(destFont).size;
	console.log(`Glyphs (${[...text].length}): ${text}`);
	console.log(`Wrote ${destFont} (${size} bytes)`);
	process.exit(0);
});
