# 一键更新脚本使用指南

## 简介

`update-and-deploy.js` 是一个自动化脚本，可以一次性完成以下操作：

1. ✅ 从 GitHub 仓库更新文章库
2. ✅ 处理文章格式转换
3. ✅ 生成图片尺寸缓存
4. ✅ 提交所有更改并推送到远程仓库

## 快速开始

### 基本使用

```bash
# 使用 npm scripts（推荐）
pnpm update-and-deploy
# 或
pnpm update

# 直接运行脚本
node scripts/update-and-deploy.js
```

### 命令行选项

```bash
# 跳过推送（只提交，不推送）
pnpm update-and-deploy --skip-push

# 跳过图片缓存生成
pnpm update-and-deploy --skip-cache

# 自定义提交信息
pnpm update-and-deploy --commit-message "feat: 更新文章和缓存"

# 组合使用
pnpm update-and-deploy --skip-cache --skip-push
```

## 详细说明

### 步骤说明

#### 1. 更新文章库
- 从配置的 GitHub 仓库 (`wxydejoy/post`) 克隆最新文章
- 将文章移动到 `src/content/posts/` 目录
- 清理 `.git` 和 `.github` 目录

#### 2. 处理文章格式
- 转换 frontmatter 格式：
  - `date:` → `published:`
  - `cover:` → `image:`
  - `categories:` → `category:`
  - 移除时间部分（保留日期）

#### 3. 生成图片缓存
- 读取 `public/photography.txt` 中的图片 URL
- 获取每个图片的尺寸信息
- 保存到 `public/photography-cache.json`

#### 4. 提交和推送
- 检查 Git 状态
- 添加所有更改到暂存区
- 提交更改（使用默认或自定义消息）
- 推送到远程仓库

## 使用场景

### 场景 1: 日常更新

当你更新了文章仓库，想要同步到博客：

```bash
pnpm update-and-deploy
```

### 场景 2: 只更新文章，不生成缓存

如果图片没有变化，可以跳过缓存生成：

```bash
pnpm update-and-deploy --skip-cache
```

### 场景 3: 本地测试

只想更新和提交，不推送到远程：

```bash
pnpm update-and-deploy --skip-push
```

### 场景 4: 完全手动控制

只运行更新脚本，手动处理 Git 操作：

```bash
# 只更新文章
node scripts/download-posts.js

# 只生成缓存
node scripts/generate-image-cache.js

# 然后手动提交和推送
git add -A
git commit -m "更新文章"
git push
```

## 配置

### 文章仓库配置

编辑 `scripts/download-posts.js` 修改仓库信息：

```javascript
const config = {
  owner: 'wxydejoy',      // GitHub 用户名
  repository: 'post',     // 仓库名
  branch: 'main',         // 分支名
  // ...
};
```

### 提交信息格式

默认提交信息格式：

```
chore: 更新文章库和图片缓存

- 从 GitHub 仓库更新文章
- 处理文章格式转换
- 生成图片尺寸缓存
- 自动更新于 2024-01-01 12:00:00
```

使用 `--commit-message` 可以自定义：

```bash
pnpm update-and-deploy --commit-message "docs: 更新技术文章"
```

## 故障排除

### 问题 1: Git 未安装

**错误信息**: `Git 未安装或不在 PATH 中`

**解决方案**: 安装 Git 并确保在 PATH 中

### 问题 2: 无法访问 GitHub 仓库

**错误信息**: `仓库克隆失败`

**解决方案**:
- 检查网络连接
- 确认仓库地址正确
- 如果仓库是私有的，需要配置 SSH 密钥或使用 HTTPS 认证

### 问题 3: 有未提交的更改

**错误信息**: 脚本会提示是否继续

**解决方案**:
- 输入 `y` 继续（这些更改会被包含在提交中）
- 输入 `n` 取消，先手动处理未提交的更改

### 问题 4: 推送失败

**错误信息**: `推送失败`

**解决方案**:
- 检查远程仓库配置: `git remote -v`
- 检查分支权限
- 手动推送: `git push origin <branch>`

### 问题 5: 图片缓存生成失败

**错误信息**: `图片缓存生成失败`

**解决方案**:
- 检查 `public/photography.txt` 文件是否存在
- 检查图片 URL 是否可访问
- 使用 `--skip-cache` 跳过缓存生成

## 最佳实践

1. **定期更新**: 建议每次更新文章后运行此脚本
2. **检查更改**: 脚本会显示将要提交的文件，确认后再继续
3. **备份重要更改**: 在运行脚本前，确保重要更改已备份
4. **使用分支**: 在功能分支上测试，确认无误后再合并到主分支
5. **查看日志**: 注意脚本输出的日志，及时发现和处理问题

## 安全提示

⚠️ **重要**: 此脚本会：
- 自动提交所有更改（包括未跟踪的文件）
- 自动推送到远程仓库

**建议**:
- 在运行前检查 Git 状态: `git status`
- 使用 `--skip-push` 先测试提交
- 在重要操作前创建备份分支

## 示例输出

```
============================================================
一键更新脚本
============================================================

[1/4] 更新文章库
执行: node scripts/download-posts.js
开始从 GitHub 下载文章...
✓ 文章库更新完成

[2/4] 处理文章格式转换
执行: node scripts/process-posts.js
✓ 文章格式处理完成

[3/4] 生成图片尺寸缓存
执行: node scripts/generate-image-cache.js
Found 10 image URLs
✓ 图片缓存生成完成

[4/4] 提交更改
将要提交的文件:
 M src/content/posts/article1.md
 M public/photography-cache.json
✓ 文件已添加到暂存区
✓ 更改已提交
✓ 已推送到 origin/main

============================================================
✓ 所有操作完成！
============================================================
```

## 相关脚本

- `scripts/download-posts.js` - 下载文章
- `scripts/process-posts.js` - 处理文章格式
- `scripts/generate-image-cache.js` - 生成图片缓存

## 贡献

如果发现问题或有改进建议，欢迎提交 Issue 或 PR！
