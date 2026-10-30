/**
 * Rehype 插件：处理外部图片
 *
 * 1. 外部图片不交给 Astro 的 Image 组件处理，避免构建时依赖图床可用性
 * 2. 补充 loading / decoding
 * 3. 从 src/data/image-dims.json 注入真实宽高，让浏览器提前预留空间，消除 CLS
 *
 * image-dims.json 由 `node scripts/update-image-dims.mjs` 生成。
 */

import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";

const DIMS_FILE = path.join(process.cwd(), "src", "data", "image-dims.json");

let dims = {};
try {
	dims = JSON.parse(fs.readFileSync(DIMS_FILE, "utf8"));
} catch {
	// 没有尺寸表也能构建，只是少拿一点 CLS 收益
	dims = {};
}

function isExternalUrl(url) {
	if (!url || typeof url !== "string") {
		return false;
	}
	return url.startsWith("http://") || url.startsWith("https://");
}

/** 去掉查询串与 hash，兼容带签名参数的图床地址 */
function normalize(url) {
	return url.split("#")[0].split("?")[0];
}

export function rehypeExternalImages() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "img" || !node.properties?.src) return;

			const src = String(node.properties.src);
			if (!isExternalUrl(src)) return;

			node.properties.loading = node.properties.loading || "lazy";
			node.properties.decoding = node.properties.decoding || "async";
			node.properties["data-external"] = "true";

			const size = dims[src] ?? dims[normalize(src)];
			if (size && !node.properties.width) {
				node.properties.width = size.width;
				node.properties.height = size.height;
			}
		});
	};
}
