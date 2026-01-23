# 🍥Fuwari (定制版)

> 本项目是 [Fuwari](https://github.com/saicaca/fuwari) 博客模板的深度定制版本。

## 🛠️ 维护指南

本项目包含一些特定的定制配置。以下是维护的关键点：

### 配置
- **站点配置**: `src/config.ts` 包含主要的站点设置（标题、作者、链接）。
- **摄影页面**: 摄影页面的图片通过 `public/photography.txt` 管理（或在 `src/pages/photography.astro` 中的自定义逻辑）。
- **友链页面**: 友链通过 `src/content/spec/friends.md` 管理（或在 `src/pages/friends.astro` 中的自定义逻辑）。

### 部署
- 在推送代码前，运行 `pnpm build` 检查是否有构建错误。
- 确保 `src/config.ts` 中引用的所有资源都可以访问。
- **图片优化**: 摄影页面和文章内的外部图片现在使用客户端动态加载，无需在构建时访问外部图片，构建更快更稳定。

### 一键更新脚本 🚀

使用 `pnpm update-and-deploy` 可以一次性完成：
1. 从 GitHub 仓库更新文章库
2. 处理文章格式转换
3. 生成图片尺寸缓存
4. 提交所有更改并推送到远程仓库

```bash
# 基本使用
pnpm update-and-deploy

# 跳过推送（只提交，不推送）
pnpm update-and-deploy --skip-push

# 跳过图片缓存生成
pnpm update-and-deploy --skip-cache

# 自定义提交信息
pnpm update-and-deploy --commit-message "feat: 更新文章"
```

详细使用说明请查看 [UPDATE_SCRIPT.md](docs/UPDATE_SCRIPT.md)

### 🤖 CI/CD 自动化工作流 (GitHub Actions)

本项目配置了多个自动化工作流，位于 `.github/workflows/` 目录下：

- **Deploy (astro.yml)**:
  - **触发**: 推送到 `main` 分支时自动运行。
  - **功能**: 自动从外部仓库 (`wxydejoy/post`) 拉取文章，进行格式处理，构建站点并部署到 GitHub Pages (分支 `public`)。
  - **注意**: 依赖 `secrets.CLONE`。

- **Update Photography (update-photography.yml)**:
  - **触发**: 每天 UTC 02:00 定时运行。
  - **功能**: 自动从指定图床相册抓取最新图片链接，并更新 `public/photography.txt`。

- **Bump Version (bump-version.yml)**:
  - **触发**: 代码推送到 `main` 分支时。
  - **功能**: 自动运行版本号递增脚本并提交。

---

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

一个基于 [Astro](https://astro.build) 构建的静态博客模板。

[**🖥️ 在线演示 (Vercel)**](https://fuwari.vercel.app)

![预览图](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 [中文文档](README.zh-CN.md)

## ✨ 特性

- [x] 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] 流畅的动画和页面过渡
- [x] 亮色 / 暗色模式
- [x] 可自定义主题颜色和横幅
- [x] 响应式设计
- [x] 基于 [Pagefind](https://pagefind.app/) 的搜索功能
- [x] [Markdown 扩展功能](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] 目录 (TOC)
- [x] RSS 订阅

## 🚀 快速开始

1. 创建你的博客仓库：
    - 从此模板 [生成新仓库](https://github.com/saicaca/fuwari/generate) 或 Fork 此仓库。
    - 或者运行以下命令之一：
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. 要在本地编辑你的博客，克隆你的仓库，运行 `pnpm install` 安装依赖。
    - 如果没有安装 [pnpm](https://pnpm.io)，请运行 `npm install -g pnpm`。
3. 编辑 `src/config.ts` 配置文件来自定义你的博客。
4. 运行 `pnpm new-post <filename>` 创建一篇新文章并在 `src/content/posts/` 中进行编辑。
5. 按照 [指南](https://docs.astro.build/en/guides/deploy/) 将你的博客部署到 Vercel、Netlify、GitHub Pages 等平台。部署前需要在 `astro.config.mjs` 中编辑站点配置。

## 📝 文章 Frontmatter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: 前端
draft: false
lang: zh_CN      # 仅当文章语言与 `config.ts` 中的站点语言不同时设置
---
```

## 🧩 Markdown 扩展语法

除了 Astro 默认支持的 [GitHub Flavored Markdown](https://github.github.com/gfm/) 外，还包含了一些额外的 Markdown 功能：

- 提示块 (Admonitions) ([预览和用法](https://fuwari.vercel.app/posts/markdown-extended/#admonitions))
- GitHub 仓库卡片 ([预览和用法](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards))
- 使用 Expressive Code 增强的代码块 ([预览](https://fuwari.vercel.app/posts/expressive-code/) / [文档](https://expressive-code.com/))

## ⚡ 命令

所有命令都在项目的根目录下运行：

| 命令 | 作用 |
|:---|:---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 在 `localhost:4321` 启动本地开发服务器 |
| `pnpm build` | 构建生产环境站点到 `./dist/` |
| `pnpm preview` | 在部署前本地预览构建结果 |
| `pnpm check` | 检查代码中的错误 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm new-post <filename>` | 创建一篇新文章 |
| `pnpm astro ...` | 运行 CLI 命令，如 `astro add`, `astro check` |
| `pnpm astro --help` | 获取 Astro CLI 帮助信息 |

## ✏️ 贡献

查看 [贡献指南](https://github.com/saicaca/fuwari/blob/main/CONTRIBUTING.md) 了解如何为本项目做出贡献。

## 📄 许可证

本项目基于 MIT 许可证开源。

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)
