#!/usr/bin/env node
/**
 * 一键更新脚本
 * 执行以下操作：
 * 1. 从 GitHub 仓库更新文章库
 * 2. 处理文章格式转换
 * 3. 生成图片尺寸缓存
 * 4. 提交所有更改并推送到远程仓库
 * 
 * 使用方法: node scripts/update-and-deploy.js [--skip-push] [--skip-cache] [--commit-message "自定义提交信息"]
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
const args = process.argv.slice(2);
const skipPush = args.includes("--skip-push");
const skipCache = args.includes("--skip-cache");
const commitMessageIndex = args.findIndex((arg) => arg === "--commit-message");
const commitMessage =
	commitMessageIndex !== -1 && args[commitMessageIndex + 1]
		? args[commitMessageIndex + 1]
		: null;

// 颜色输出
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	red: "\x1b[31m",
};

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
	log(`\n[${step}] ${message}`, colors.bright + colors.blue);
}

function logSuccess(message) {
	log(`✓ ${message}`, colors.green);
}

function logWarning(message) {
	log(`⚠ ${message}`, colors.yellow);
}

function logError(message) {
	log(`✗ ${message}`, colors.red);
}

// 检查命令是否存在
function commandExists(command) {
	try {
		execSync(`which ${command}`, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

// 检查 Git 状态
function checkGitStatus() {
	try {
		const status = execSync("git status --porcelain", {
			encoding: "utf-8",
		});
		return status.trim();
	} catch (error) {
		logError("无法检查 Git 状态");
		throw error;
	}
}

// 检查是否有未提交的更改
function hasUncommittedChanges() {
	const status = checkGitStatus();
	return status.length > 0;
}

// 执行命令
function execCommand(command, description, options = {}) {
	try {
		log(`执行: ${command}`);
		execSync(command, {
			stdio: "inherit",
			...options,
		});
		return true;
	} catch (error) {
		logError(`${description} 失败: ${error.message}`);
		if (options.continueOnError) {
			return false;
		}
		throw error;
	}
}

// 主函数
async function main() {
	log("\n" + "=".repeat(60), colors.bright);
	log("一键更新脚本", colors.bright + colors.blue);
	log("=".repeat(60), colors.bright);

	// 检查必要的命令
	if (!commandExists("git")) {
		logError("Git 未安装或不在 PATH 中");
		process.exit(1);
	}

	if (!commandExists("node")) {
		logError("Node.js 未安装或不在 PATH 中");
		process.exit(1);
	}

	// 检查是否在 Git 仓库中
	try {
		execSync("git rev-parse --git-dir", { stdio: "ignore" });
	} catch {
		logError("当前目录不是 Git 仓库");
		process.exit(1);
	}

	// 检查是否有未提交的更改（除了我们要提交的文件）
	const initialStatus = checkGitStatus();
	if (initialStatus) {
		logWarning("检测到未提交的更改:");
		log(initialStatus, colors.yellow);
		const readline = await import("readline");
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const answer = await new Promise((resolve) => {
			rl.question(
				"\n是否继续？这些更改将被包含在提交中 (y/n): ",
				resolve,
			);
		});
		rl.close();

		if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
			log("已取消操作");
			process.exit(0);
		}
	}

	// 步骤 1: 更新文章库
	logStep("1/4", "更新文章库");
	try {
		// 检查脚本是否存在
		const downloadScript = path.join(__dirname, "download-posts.js");
		if (!fs.existsSync(downloadScript)) {
			logError(`脚本不存在: ${downloadScript}`);
			process.exit(1);
		}

		execCommand(
			`node ${downloadScript}`,
			"更新文章库",
			{ continueOnError: false },
		);
		logSuccess("文章库更新完成");
	} catch (error) {
		logError("文章库更新失败，终止操作");
		process.exit(1);
	}

	// 步骤 2: 处理文章格式
	logStep("2/4", "处理文章格式转换");
	try {
		// 检查脚本是否存在
		const processScript = path.join(__dirname, "process-posts.js");
		if (!fs.existsSync(processScript)) {
			logWarning("process-posts.js 脚本不存在，跳过格式转换");
		} else {
			execCommand(
				`node ${processScript}`,
				"处理文章格式",
				{ continueOnError: true },
			);
			logSuccess("文章格式处理完成");
		}
	} catch (error) {
		logWarning("文章格式处理失败，继续执行...");
	}

	// 步骤 3: 生成图片缓存
	if (!skipCache) {
		logStep("3/4", "生成图片尺寸缓存");
		try {
			// 检查脚本是否存在
			const cacheScript = path.join(__dirname, "generate-image-cache.js");
			if (!fs.existsSync(cacheScript)) {
				logWarning("generate-image-cache.js 脚本不存在，跳过缓存生成");
			} else {
				execCommand(
					`node ${cacheScript}`,
					"生成图片缓存",
					{ continueOnError: true },
				);
				logSuccess("图片缓存生成完成");
			}
		} catch (error) {
			logWarning("图片缓存生成失败，继续执行...");
		}
	} else {
		logWarning("跳过图片缓存生成 (--skip-cache)");
	}

	// 步骤 4: 提交和推送
	logStep("4/4", "提交更改");

	// 检查是否有更改需要提交
	const finalStatus = checkGitStatus();
	if (!finalStatus) {
		logWarning("没有检测到任何更改，无需提交");
		if (!skipPush) {
			log("跳过推送");
		}
		process.exit(0);
	}

	// 显示将要提交的文件
	log("\n将要提交的文件:", colors.bright);
	log(finalStatus, colors.yellow);

	// 添加所有更改
	try {
		execCommand("git add -A", "添加文件到暂存区", {
			continueOnError: false,
		});
		logSuccess("文件已添加到暂存区");
	} catch (error) {
		logError("添加文件失败");
		process.exit(1);
	}

	// 生成提交信息
	const defaultMessage = `chore: 更新文章库和图片缓存

- 从 GitHub 仓库更新文章
- 处理文章格式转换
${!skipCache ? "- 生成图片尺寸缓存" : ""}
- 自动更新于 ${new Date().toLocaleString("zh-CN", {
		timeZone: "Asia/Shanghai",
	})}`;

	const message = commitMessage || defaultMessage;

	// 提交
	try {
		execCommand(
			`git commit -m ${JSON.stringify(message)}`,
			"提交更改",
			{ continueOnError: false },
		);
		logSuccess("更改已提交");
	} catch (error) {
		logError("提交失败");
		process.exit(1);
	}

	// 推送
	if (!skipPush) {
		log("\n推送到远程仓库...", colors.bright);
		try {
			// 获取当前分支名
			const branch = execSync("git rev-parse --abbrev-ref HEAD", {
				encoding: "utf-8",
			}).trim();

			execCommand(
				`git push origin ${branch}`,
				"推送到远程仓库",
				{ continueOnError: false },
			);
			logSuccess(`已推送到 origin/${branch}`);
		} catch (error) {
			logError("推送失败");
			logWarning("你可以稍后手动运行: git push");
			process.exit(1);
		}
	} else {
		logWarning("跳过推送 (--skip-push)");
		log("你可以稍后手动运行: git push");
	}

	// 完成
	log("\n" + "=".repeat(60), colors.bright);
	logSuccess("所有操作完成！");
	log("=".repeat(60) + "\n", colors.bright);
}

// 运行主函数
main().catch((error) => {
	logError(`发生错误: ${error.message}`);
	process.exit(1);
});
