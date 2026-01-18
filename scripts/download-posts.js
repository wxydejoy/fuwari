#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 配置信息
const config = {
  owner: 'wxydejoy', // GitHub 仓库所有者
  repository: 'post', // GitHub 仓库名称
  branch: 'main', // 分支名称
  targetDir: path.join(process.cwd(), 'src', 'content', 'posts'), // 目标目录
  tempDir: path.join(process.cwd(), 'temp-posts') // 临时目录
};

console.log('开始从 GitHub 下载文章...');

// 确保临时目录不存在
if (fs.existsSync(config.tempDir)) {
  console.log('清理旧的临时目录...');
  execSync(`rm -rf ${config.tempDir}`);
}

// 确保目标目录存在
if (!fs.existsSync(config.targetDir)) {
  console.log('创建目标目录...');
  fs.mkdirSync(config.targetDir, { recursive: true });
}

// 克隆仓库
console.log(`克隆仓库 ${config.owner}/${config.repository}...`);
try {
  execSync(
    `git clone --depth 1 https://github.com/${config.owner}/${config.repository}.git ${config.tempDir}`,
    { stdio: 'inherit' }
  );
  console.log('仓库克隆成功！');
} catch (error) {
  console.error('仓库克隆失败:', error.message);
  process.exit(1);
}

// 移动文件到目标目录
console.log('移动文件到目标目录...');

// 检查仓库根目录下是否有post子目录
const tempPostDir = path.join(config.tempDir, 'post');
if (fs.existsSync(tempPostDir)) {
  // 如果有post子目录，直接移动其子内容到目标目录
  execSync(`mv ${tempPostDir}/* ${config.targetDir}/`, { stdio: 'inherit' });
} else {
  // 否则移动仓库根目录下的所有内容
  execSync(`mv ${config.tempDir}/* ${config.targetDir}/`, { stdio: 'inherit' });
}

// 清理不必要的文件
console.log('清理不必要的文件...');
if (fs.existsSync(path.join(config.targetDir, '.git'))) {
  fs.rmSync(path.join(config.targetDir, '.git'), { recursive: true, force: true });
}
if (fs.existsSync(path.join(config.targetDir, '.github'))) {
  fs.rmSync(path.join(config.targetDir, '.github'), { recursive: true, force: true });
}

// 转换 Markdown 文件格式
console.log('转换 Markdown 文件格式...');

// 递归遍历目录，处理所有 Markdown 文件
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 如果是目录，递归处理
      processMarkdownFiles(filePath);
    } else if (path.extname(file) === '.md') {
      // 如果是 Markdown 文件，处理 frontmatter
      console.log(`处理文件: ${filePath}`);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 转换 frontmatter
      const originalContent = content;
      content = content
        .replace(/date: /g, 'published: ') // 将 date: 替换为 published:
        .replace(/cover: /g, 'image: ') // 将 cover: 替换为 image:
        .replace(/categories: /g, 'category: ') // 将 categories: 替换为 category:
        .replace(/ [0-9]{2}:[0-9]{2}:[0-9]{2}/g, ''); // 移除时间部分
      
      if (originalContent !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`已转换: ${filePath}`);
      }
    }
  });
}

processMarkdownFiles(config.targetDir);

// 清理临时目录
console.log('清理临时目录...');
if (fs.existsSync(config.tempDir)) {
  fs.rmSync(config.tempDir, { recursive: true, force: true });
}

console.log('文章下载和转换完成！');
console.log(`文章已保存到 ${config.targetDir}`);
