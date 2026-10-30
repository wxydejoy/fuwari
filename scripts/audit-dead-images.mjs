import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// 1. 收集所有文章（含草稿）的外链图片
const postsDir = "src/content/posts";
const postMap = []; // { file, url, draft }

function walk(dir) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p);
		else if (e.name.endsWith(".md")) scanFile(p);
	}
}

const IMG_RE = /https?:\/\/[^\s)"'<>]+?\.(?:jpe?g|png|gif|webp|avif|bmp)(?=[\s)"'<>]|$)/gi;

function scanFile(file) {
	const text = fs.readFileSync(file, "utf8");
	const isDraft = /^draft:\s*true/m.test(text);
	const found = text.match(IMG_RE) || [];
	for (const u of new Set(found)) postMap.push({ file: path.relative(postsDir, file), url: u, draft: isDraft });
}

walk(postsDir);

const byUrl = new Map();
for (const { file, url, draft } of postMap) {
	if (!byUrl.has(url)) byUrl.set(url, { url, posts: new Map() });
	byUrl.get(url).posts.set(file, draft);
}
const urls = [...byUrl.values()];
const nDraftPosts = new Set(postMap.filter(p => p.draft).map(p => p.file)).size;
const nPubPosts = new Set(postMap.filter(p => !p.draft).map(p => p.file)).size;
console.log(`扫描完成: 发布文 ${nPubPosts} 篇 + 草稿 ${nDraftPosts} 篇, 唯一外链图 ${urls.length} 个`);

// 2. 并发探测（只读前 64KB 判断真实格式）
const results = [];
let i = 0;

async function worker() {
	while (i < urls.length) {
		const item = urls[i++];
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 15000);
		try {
			const res = await fetch(item.url, { signal: ctrl.signal });
			const ct = res.headers.get("content-type") || "";
			if (!res.ok) {
				results.push({ ...item, status: res.status, type: ct, alive: false });
			} else if (!ct.startsWith("image/")) {
				results.push({ ...item, status: res.status, type: ct, alive: false, note: "返回200但内容是" + ct });
			} else {
				const reader = res.body.getReader();
				const chunks = [];
				let got = 0;
				while (got < 65536) {
					const { done, value } = await reader.read();
					if (done) break;
					chunks.push(value); got += value.length;
				}
				reader.cancel().catch(() => {});
				const head = Buffer.concat(chunks).subarray(0, 64);
				const isImg = head.subarray(0, 3).toString("hex").startsWith("ffd8") ||
					head.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" ||
					head.subarray(0, 6).toString("ascii").startsWith("GIF8") ||
					head.subarray(0, 4).toString("ascii") === "RIFF";
				results.push({ ...item, status: res.status, type: ct, alive: isImg, note: isImg ? "" : "content-type是图片但内容不是" });
			}
		} catch (e) {
			results.push({ ...item, status: "ERR", alive: false, note: String(e.message || e).slice(0, 60) });
		} finally {
			clearTimeout(timer);
		}
	}
}

await Promise.all(Array.from({ length: 16 }, worker));

// 3. 汇总
const dead = results.filter(r => !r.alive);
const alive = results.filter(r => r.alive);
const hostOf = u => { try { return new URL(u).host; } catch { return "invalid"; } };

const deadByHost = {};
for (const d of dead) (deadByHost[hostOf(d.url)] ??= []).push(d);

const deadPub = dead.filter(d => [...d.posts.values()].some(v => v === false));
const deadDraftOnly = dead.length - deadPub.length;
console.log(`\n探测完成: 存活 ${alive.length} / 死链 ${dead.length}（其中影响线上的 ${deadPub.length}，仅草稿 ${deadDraftOnly}）`);
console.log("\n死链按域名分布:");
for (const [h, list] of Object.entries(deadByHost).sort((a, b) => b[1].length - a[1].length))
	console.log(`  ${String(list.length).padStart(4)}  ${h}`);

// 4. Markdown 报告
const rel = p => "src/content/posts/" + p;
let md = `# 文章死链图清单\n\n`;
md += `> 生成时间: ${new Date().toLocaleString("zh-CN")} · 扫描范围: \`src/content/posts\` 全部文章（含草稿）\n\n`;
md += `| 指标 | 数量 |\n|---|---|\n| 含图的非草稿文章 | ${nPubPosts} |\n| 含图的草稿文章 | ${nDraftPosts} |\n| 唯一外链图 | ${results.length} |\n| ✅ 存活 | ${alive.length} |\n| ❌ 死链 | ${dead.length} |\n| ❌ 死链中影响线上页面的 | ${deadPub.length} |\n| ❌ 死链中仅存在于草稿的 | ${deadDraftOnly} |\n\n`;
md += `> 判定标准：HTTP 200 但响应体不是图片（图床返回 404 页面）、非 200 状态码、或网络错误。\n\n`;

md += `## 死链按域名分布\n\n| 域名 | 数量 |\n|---|---|\n`;
for (const [h, list] of Object.entries(deadByHost).sort((a, b) => b[1].length - a[1].length))
	md += `| \`${h}\` | ${list.length} |\n`;

md += `\n## 死链明细（按文章分组，〔草稿〕标记不影响线上）\n\n`;
const deadByPost = new Map();
for (const d of dead) for (const [p, dr] of d.posts) {
	if (!deadByPost.has(p)) deadByPost.set(p, { draft: dr, items: [] });
	deadByPost.get(p).items.push(d);
}
for (const [post, { draft, items }] of [...deadByPost.entries()].sort((a, b) => b[1].items.length - a[1].items.length)) {
	md += `### ${draft ? "〔草稿〕" : ""}${rel(post)}（${items.length} 张）\n\n`;
	for (const d of items) {
		const reason = d.status === "ERR" ? `网络错误: ${d.note}` : d.note || `HTTP ${d.status}`;
		md += `- \`${d.url}\` — ${reason}\n`;
	}
	md += `\n`;
}

md += `\n## ✅ 存活图片明细\n\n`;
const aliveByPost = new Map();
for (const a of alive) for (const [p, dr] of a.posts) {
	if (!aliveByPost.has(p)) aliveByPost.set(p, { draft: dr, items: [] });
	aliveByPost.get(p).items.push(a);
}
for (const [post, { draft, items }] of [...aliveByPost.entries()].sort((a, b) => b[1].items.length - a[1].items.length)) {
	md += `### ${draft ? "〔草稿〕" : ""}${rel(post)}（${items.length} 张）\n\n`;
	for (const a of items) md += `- ${a.url}\n`;
	md += `\n`;
}

fs.writeFileSync("docs/dead-images-report.md", md);
fs.writeFileSync("tmp/dead-audit.json", JSON.stringify(results.map(r => ({ url: r.url, status: r.status, type: r.type, note: r.note, alive: r.alive, posts: [...r.posts].map(([p, dr]) => ({ file: rel(p), draft: dr })) })), null, 2));

// 5. CSV（便于筛选处理）
const esc = s => '"' + String(s).replaceAll('"', '""') + '"';
const csv = ["状态,是否草稿,域名,URL,文章,原因"];
for (const r of results)
	for (const [p, dr] of r.posts)
		csv.push([r.alive ? "存活" : "死链", dr ? "是" : "否", hostOf(r.url), esc(r.url), esc(rel(p)), esc(r.note || (r.status === "ERR" ? "网络错误" : "HTTP " + r.status))].join(","));
fs.writeFileSync("docs/dead-images-report.csv", "\uFEFF" + csv.join("\n"));

console.log(`\n报告已写入: docs/dead-images-report.md (${(fs.statSync("docs/dead-images-report.md").size / 1024).toFixed(1)} KB)`);
console.log(`CSV 已写入: docs/dead-images-report.csv`);
