#!/usr/bin/env node
/**
 * 处理从外部仓库拉取的文章
 * 将 frontmatter 格式从旧格式转换为新格式
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

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
		const frontmatterEnd = content.indexOf("---", 3);
		if (frontmatterEnd === -1) {
			console.warn(`Skipping ${filePath}: Invalid frontmatter format`);
			return false;
		}

		const frontmatterText = content.slice(3, frontmatterEnd).trim();
		const body = content.slice(frontmatterEnd + 3).trim();

		// 解析 frontmatter
		const lines = frontmatterText.split("\n");
		const frontmatter = {};
		
		for (const line of lines) {
			const colonIndex = line.indexOf(":");
			if (colonIndex === -1) continue;
			
			const key = line.slice(0, colonIndex).trim();
			let value = line.slice(colonIndex + 1).trim();
			
			// 移除引号
			if ((value.startsWith('"') && value.endsWith('"')) ||
			    (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			
			frontmatter[key] = value;
		}

		// 转换字段
		let modified = false;
		
		if (frontmatter.date && !frontmatter.published) {
			// 移除时间部分，只保留日期
			const dateValue = frontmatter.date.split(" ")[0];
			frontmatter.published = dateValue;
			delete frontmatter.date;
			modified = true;
		}

		if (frontmatter.cover && !frontmatter.image) {
			frontmatter.image = frontmatter.cover;
			delete frontmatter.cover;
			modified = true;
		}

		if (frontmatter.categories && !frontmatter.category) {
			// 如果 categories 是数组，取第一个
			const categoryValue = Array.isArray(frontmatter.categories) 
				? frontmatter.categories[0] 
				: frontmatter.categories;
			frontmatter.category = categoryValue;
			delete frontmatter.categories;
			modified = true;
		}

		// 如果修改了，重新写入文件
		if (modified) {
			const newFrontmatter = Object.entries(frontmatter)
				.map(([key, value]) => {
					if (Array.isArray(value)) {
						return `${key}: [${value.map(v => `"${v}"`).join(", ")}]`;
					}
					return `${key}: ${typeof value === "string" ? `"${value}"` : value}`;
				})
				.join("\n");

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
