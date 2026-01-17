
## 背景

![image](https://img.undf.top/ob/5a6e68e7ea68562b2499934f9f0402f4.png)

博客建立到现在已经近三年了，期间各种写作方式，各种主题，都折腾了不少，简单聊聊，分享一下。详细的操作方式这里就不啰嗦了，相信胆大心细的你肯定能解决。

## 关于主题

主题从最初的 [keep]( https://github.com/XPoet/hexo-theme-keep?tab=readme-ov-file )到有名的 [butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 被我折腾的花里胡哨，再然后折腾的尽头是极简，所以主题换成 [cards](https://github.com/ChrAlpha/hexo-theme-cards) 非常简约，但是时间久了看腻了，就换成了现在的 [stellar](https://github.com/xaoxuu/hexo-theme-stellar) 简约而又不简单。
现在是 [Fuwari](https://github.com/saicaca/fuwari).

## 关于发布流程

说到博客的写作流程，最初当然是最基础的 `hexo g` `hexo d` 发布到 Github 当然非常麻烦，后来学会了通过 Github Action 实现[自动部署](https://juejin.cn/post/6943895271751286821)这之后就方便了一些，开始尝试在线的编辑器，最初用过 [HexoPlusPlus](https://github.com/HexoPlusPlus/HexoPlusPlus) 类似于现在的 [QEXO](https://github.com/Qexo/Qexo) 都是在浏览器编辑文件，然后上传到 github 触发自动部署，但因为编辑器不太好使，而且不太方便，还是用 VScode 最舒服，就这样大概用了一年多。

不过，去年我开始用 Obsidian 记笔记，规划项目等等，所以就想把博客编辑放到这里，通过 [github-publisher](https://github.com/ObsidianPublisher/obsidian-github-publisher) 插件上传到 Github 触发 Action 实现部署

## 关于域名和备案

域名最初当然是 github 生成的[默认域名](https://wxydejoy.github.io) (现在这里是很久之前的 butterfly 主题博客)后来买了 `wxydejoy.top` 并通过阿里云进行备案（备案才能使用国内 CDN）后来觉得域名太长换了 `undf.top`。

备案的话，需要三个月以上的服务器才行，当时是 27 块通过新人优惠在阿里云买了三个月，然后就是填资料等电话等等等等，繁琐但不复杂。不过服务器到期后阿里云会发邮件警告：域名未指向服务（解决方案是建个 OSS 将域名指向它然后开启访问鉴权，通过 github Action 每周访问一次，这样就可以 0 成本实现）

## 关于网站加速与防御

刚开始，博客当然是使用 github page 部署，国内基本无法访问，后来使用 [Vercel](https://vercel.com/) 进行部署，速度也是一般般，类似的还有 [Cloudflare Page](https://pages.cloudflare.com/) 国内访问速度都很感人。

现在，使用的是[又拍云 CDN](https://www.upyun.com) 通过加入 [又拍云联盟](https://www.upyun.com/league) 实现，当然你也可以使用腾讯阿里等等，但是一定要开启各种防护，防止被攻击欠费（前段时间我就被刷了一点点流量，莫名其妙）。

2025.12 upyun 国外线路异常 刚好也工作了  准备迁移到腾讯 恰巧赶上EdgeOne（类似cloudflare）免费试用 所以。

防御第一条：禁止国外 IP 访问 CDN，通过 DNS 将其指向源站（Github），然后就是限制各种访问频率，一般小站访问量也不会太多，每分钟能有几百次差不多了。
## 更新日志

- [2026-01-17](#2026-01-17) - 侧边栏按需显示、摄影页面功能增强（懒加载、点击看原图）、友链申请功能、导航栏调整、GitHub Action自动更新摄影配置
- [2025-12-07](#2025-12-07) - 友链页面功能增强、Git历史清理

---


## 2026-01-17

### 侧边栏（Sidebar）按需显示
- 实现侧边栏仅在首页显示，其他页面自动隐藏的功能
- 添加了平滑的过渡动画效果（宽度、透明度、位移和间距的协同过渡）
- 统一了全局 `is-home` 类名逻辑，修复了导航栏和 Banner 的高度切换不一致问题

### 摄影页面功能增强
- **图片懒加载**：为所有图片添加了 `loading="lazy"`，显著提升页面初始加载速度
- **异步解码**：添加了 `decoding="async"`，减少图片渲染对主线程的阻塞
- **查看原图**：支持点击图片在新标签页打开原图，并添加了 `cursor-zoom-in` 交互提示
- **交互优化**：增强了图片悬停时的缩放效果（1.1倍），提供更清晰的视觉反馈
- **瀑布流优化**：重构了瀑布流布局的计算逻辑，确保在懒加载模式下依然能正确计算图片跨度

### 摄影页面基础功能
- 在导航栏添加"摄影"链接，位置在友链左侧
- 创建摄影页面，使用响应式CSS Grid瀑布流布局
- 支持不同比例图片（2:3、3:2等），自动调整布局
- 简化图片更新方式：只需编辑`public/photography.txt`文件，每行一个URL
- 添加图片加载过渡效果：
  - 骨架屏占位符，加载时显示动态闪烁效果
  - 淡入动画，图片加载完成后平滑显示
  - 交错动画，多张图片依次显示
- 调整布局样式：取消图片圆角，减小图片间隙
- 采用构建时静态生成方案，解决Swup页面切换时图片不加载的问题

### 导航栏调整
- 将"关于"按钮移动到GitHub按钮左侧
- 新的导航栏顺序：首页、归档、摄影、友链、关于、GitHub

### 友链申请功能
- 在友链页面下方添加友链申请区域
- 提供固定的申请格式，包含：网站名称、网站地址、网站头像、网站描述
- 添加便捷的邮件链接，预设主题和正文格式
- 邮件地址：weiekko@gamil.com
- 添加注意事项：确保网站内容健康、先添加友链再申请、1-3个工作日内处理
- 使用与友链卡片一致的样式，响应式设计

### GitHub Action自动更新摄影配置
- 创建`.github/workflows/update-photography.yml`工作流
- 定时任务：每天UTC时间2:00（北京时间10:00）自动运行
- 功能：获取路过图床相册`https://imgchr.com/album/vkBKs`的直链
- 检查更新：对比当前`public/photography.txt`与图床相册内容
- 自动更新：如果有变动，自动提交并推送到仓库
- 手动触发：支持通过GitHub Actions页面手动触发更新
- 备份机制：更新前自动备份旧文件
- 技术实现：使用curl获取页面内容，grep提取图片链接，sed处理格式

### 技术实现
- 使用Astro的文件系统API在构建时读取图片列表
- 保留所有视觉效果和交互体验
- 代码结构清晰，易于维护

---

## 2025-12-07

### 友链页面功能增强
- 为友链页面添加头像、昵称和简介功能
- 实现响应式卡片布局（1列/2列/3列自适应）
- 更新导航配置，添加友链链接

### Git历史清理
- 删除两个不必要的Git提交
- 更新 `.gitignore` 文件，添加 `.trae/` 目录

### 技术优化
- 修复Svelte hydration错误
- 优化项目结构和代码质量

---
