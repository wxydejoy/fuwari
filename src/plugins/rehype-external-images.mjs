/**
 * Rehype 插件：将外部图片 URL 转换为普通 img 标签
 * 避免 Astro 的 Image 组件在构建时尝试优化外部图片
 */

import { visit } from "unist-util-visit";

/**
 * 检查 URL 是否是外部链接
 */
function isExternalUrl(url) {
	if (!url || typeof url !== "string") {
		return false;
	}
	return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Rehype 插件：处理外部图片
 */
export function rehypeExternalImages() {
	return (tree) => {
		visit(tree, "element", (node) => {
			// 查找所有 img 标签
			if (node.tagName === "img" && node.properties && node.properties.src) {
				const src = node.properties.src;
				
				// 如果是外部 URL，确保使用普通 img 标签（不进行优化）
				if (isExternalUrl(src)) {
					// 添加 loading="lazy" 和 decoding="async" 属性
					node.properties.loading = node.properties.loading || "lazy";
					node.properties.decoding = node.properties.decoding || "async";
					
					// 确保不会尝试优化
					node.properties["data-external"] = "true";
				}
			}
		});
	};
}
