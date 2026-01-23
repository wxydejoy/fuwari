#!/usr/bin/env node
/**
 * 处理从外部仓库拉取的文章
 * 将 frontmatter 格式从旧格式转换为新格式
 * 使用 js-yaml 正确解析和生成 YAML
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "../src/content/posts");

/**
 * 处理单个 Markdown 文件
 */
async function processPostFile(filePath) {
	try {
		const content = await fs.readFile(filePath, "utf-8");
		
		// 检查是否包含 frontmatter
		if (!content.startsWith("---")) {
			console.warn(`Skipping ${filePath}: No frontmatter found`);
			return false;
		}

		// 提取 frontmatter 和正文
		// 查找第二个 --- 的位置
		let frontmatterEnd = content.indexOf("---", 3);
		
		// 如果没有找到第二个 ---，尝试查找第一个换行后的内容
		if (frontmatterEnd === -1) {
			// 检查是否有格式错误的 frontmatter（date/tags 等在 --- 外面）
			const firstNewline = content.indexOf("\n", 3);
			if (firstNewline !== -1) {
				const afterFirstLine = content.slice(firstNewline + 1);
				// 如果后面有 date: 或 tags: 等字段，说明 frontmatter 格式错误
				if (afterFirstLine.match(/^(date|tags|categories|published):/m)) {
					// 尝试找到下一个 --- 或文件末尾
					const nextDash = afterFirstLine.indexOf("---");
					if (nextDash !== -1) {
						frontmatterEnd = firstNewline + 1 + nextDash;
					} else {
						// 没有找到结束标记，将整个内容作为 body，frontmatter 为空对象
						console.warn(`Warning ${filePath}: Malformed frontmatter, attempting to fix...`);
						frontmatterEnd = firstNewline;
					}
				} else {
					console.warn(`Skipping ${filePath}: Invalid frontmatter format`);
					return false;
				}
			} else {
				console.warn(`Skipping ${filePath}: Invalid frontmatter format`);
				return false;
			}
		}

		let frontmatterText = content.slice(3, frontmatterEnd).trim();
		let body = content.slice(frontmatterEnd + 3).trim();
		
		// 检查 body 中是否包含 frontmatter 字段（格式错误的情况）
		const bodyFrontmatterMatch = body.match(/^(date|tags|categories|published):/m);
		if (bodyFrontmatterMatch) {
			// 提取 body 中的 frontmatter 字段
			const bodyLines = body.split("\n");
			const newBodyLines = [];
			const extractedFields = {};
			
			for (let i = 0; i < bodyLines.length; i++) {
				const line = bodyLines[i];
				if (line.match(/^(date|tags|categories|published|cover|image):/)) {
					// 这是一个 frontmatter 字段，提取它
					const colonIndex = line.indexOf(":");
					if (colonIndex !== -1) {
						const key = line.slice(0, colonIndex).trim();
						let value = line.slice(colonIndex + 1).trim();
						
						// 处理多行值（如 tags 数组）
						if (i + 1 < bodyLines.length && bodyLines[i + 1].trim().startsWith("-")) {
							const arrayValues = [];
							i++; // 跳过当前行
							while (i < bodyLines.length && bodyLines[i].trim().startsWith("-")) {
								arrayValues.push(bodyLines[i].trim().slice(1).trim());
								i++;
							}
							i--; // 回退一步，因为外层循环会递增
							extractedFields[key] = arrayValues;
						} else {
							extractedFields[key] = value;
						}
					}
				} else if (line.trim() === "---") {
					// 遇到结束标记，后面的都是正文
					newBodyLines.push(...bodyLines.slice(i + 1));
					break;
				} else {
					newBodyLines.push(line);
				}
			}
			
			// 合并提取的字段到 frontmatter
			if (Object.keys(extractedFields).length > 0) {
				frontmatterText = frontmatterText ? `${frontmatterText}\n${Object.entries(extractedFields).map(([k, v]) => {
					if (Array.isArray(v)) {
						return `${k}:\n${v.map(item => `  - ${item}`).join("\n")}`;
					}
					return `${k}: ${v}`;
				}).join("\n")}` : Object.entries(extractedFields).map(([k, v]) => {
					if (Array.isArray(v)) {
						return `${k}:\n${v.map(item => `  - ${item}`).join("\n")}`;
					}
					return `${k}: ${v}`;
				}).join("\n");
				body = newBodyLines.join("\n");
			}
		}

		// 使用 js-yaml 解析 frontmatter
		let frontmatter;
		try {
			frontmatter = yaml.load(frontmatterText);
			if (!frontmatter || typeof frontmatter !== "object") {
				console.warn(`Skipping ${filePath}: Invalid frontmatter`);
				return false;
			}
		} catch (yamlError) {
			console.error(`Error parsing YAML in ${filePath}:`, yamlError.message);
			return false;
		}

		// 转换字段
		let modified = false;
		
		// date -> published (移除时间部分)
		if (frontmatter.date && !frontmatter.published) {
			const dateValue = frontmatter.date;
			if (typeof dateValue === "string") {
				// 移除时间部分，只保留日期
				frontmatter.published = dateValue.split(" ")[0].split("T")[0];
			} else if (dateValue instanceof Date) {
				// 如果是 Date 对象，转换为 YYYY-MM-DD 格式
				frontmatter.published = dateValue.toISOString().split("T")[0];
			} else {
				frontmatter.published = dateValue;
			}
			delete frontmatter.date;
			modified = true;
		}

		// cover -> image
		if (frontmatter.cover && !frontmatter.image) {
			frontmatter.image = frontmatter.cover;
			delete frontmatter.cover;
			modified = true;
		}

		// categories -> category
		if (frontmatter.categories && !frontmatter.category) {
			// 如果 categories 是数组，取第一个
			const categoryValue = Array.isArray(frontmatter.categories) 
				? frontmatter.categories[0] 
				: frontmatter.categories;
			frontmatter.category = categoryValue;
			delete frontmatter.categories;
			modified = true;
		}

		// 清理不需要的字段（可选，根据你的需求）
		// 删除一些旧格式的字段，如果它们不在 schema 中
		const fieldsToRemove = ["share", "poster", "abbrlink", "aside", "keywords", "banner"];
		for (const field of fieldsToRemove) {
			if (frontmatter[field] !== undefined) {
				delete frontmatter[field];
				modified = true;
			}
		}

		// 确保 tags 是数组格式
		if (frontmatter.tags !== undefined) {
			if (typeof frontmatter.tags === "string") {
				// 如果是字符串，尝试转换为数组
				if (frontmatter.tags.trim() === "") {
					frontmatter.tags = [];
				} else {
					// 尝试按逗号分割，或者作为单个标签
					frontmatter.tags = [frontmatter.tags];
				}
				modified = true;
			} else if (!Array.isArray(frontmatter.tags)) {
				frontmatter.tags = [];
				modified = true;
			}
		}

		// 确保 published 是字符串格式（YYYY-MM-DD）
		if (frontmatter.published) {
			if (frontmatter.published instanceof Date) {
				frontmatter.published = frontmatter.published.toISOString().split("T")[0];
				modified = true;
			} else if (typeof frontmatter.published === "string") {
				// 确保格式正确，移除时间部分
				const dateOnly = frontmatter.published.split(" ")[0].split("T")[0];
				if (dateOnly !== frontmatter.published) {
					frontmatter.published = dateOnly;
					modified = true;
				}
			}
		}

		// 如果修改了，重新写入文件
		if (modified) {
			// 使用 js-yaml 生成格式化的 YAML
			const newFrontmatter = yaml.dump(frontmatter, {
				lineWidth: -1, // 不限制行宽
				noRefs: true, // 不使用 YAML 引用
				quotingType: '"', // 使用双引号
				forceQuotes: false, // 只在必要时使用引号
				styles: {
					'!!null': 'empty', // null 值显示为空
				},
			}).trim();

			const newContent = `---\n${newFrontmatter}\n---\n\n${body}\n`;
			await fs.writeFile(filePath, newContent, "utf-8");
			return true;
		}

		return false;
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error);
		return false;
	}
}

/**
 * 递归处理目录中的所有 Markdown 文件
 */
async function processDirectory(dirPath) {
	try {
		const entries = await fs.readdir(dirPath, { withFileTypes: true });
		let processedCount = 0;

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name);

			if (entry.isDirectory()) {
				// 跳过 .git 和 .github 目录
				if (entry.name === ".git" || entry.name === ".github") {
					continue;
				}
				processedCount += await processDirectory(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				if (await processPostFile(fullPath)) {
					processedCount++;
				}
			}
		}

		return processedCount;
	} catch (error) {
		console.error(`Error processing directory ${dirPath}:`, error);
		return 0;
	}
}

/**
 * 主函数
 */
async function main() {
	try {
		// 检查目录是否存在
		const stats = await fs.stat(POSTS_DIR).catch(() => null);
		if (!stats || !stats.isDirectory()) {
			console.error(`Posts directory not found: ${POSTS_DIR}`);
			process.exit(1);
		}

		console.log(`Processing posts in ${POSTS_DIR}...`);
		const processedCount = await processDirectory(POSTS_DIR);
		console.log(`Processed ${processedCount} files.`);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
