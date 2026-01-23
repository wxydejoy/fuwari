# 图片处理解决方案

## 问题

1. **构建时访问外部图片慢且可能失败**：在构建时获取外部图片尺寸会导致构建缓慢，且在 CI 环境中可能无法访问
2. **文章内图片优化问题**：Markdown 中的外部图片在构建时也会尝试优化，可能导致构建失败

## 解决方案

### 1. 摄影页面 - 完全客户端渲染

**方案**：不在构建时获取图片尺寸，改为在浏览器中动态获取。

**优点**：
- ✅ 构建速度快，不依赖外部网络
- ✅ 不阻塞构建流程
- ✅ 图片尺寸在客户端动态计算，更准确
- ✅ 支持懒加载，性能更好

**实现**：
- 使用普通 `<img>` 标签
- 通过 JavaScript 在图片加载后动态设置 `aspect-ratio`
- 使用 CSS Grid 布局，自动适应图片尺寸

### 2. 文章内图片 - Rehype 插件处理

**方案**：创建 Rehype 插件，确保 Markdown 中的外部图片使用普通 `<img>` 标签。

**实现**：
- `src/plugins/rehype-external-images.mjs` - 自动检测外部图片 URL
- 为外部图片添加 `loading="lazy"` 和 `decoding="async"` 属性
- 避免 Astro 的 Image 组件尝试优化外部图片

### 3. 文章封面图 - ImageWrapper 组件

**现状**：`ImageWrapper` 组件已经正确处理：
- 本地图片：使用 Astro 的 `<Image>` 组件（优化）
- 外部图片：使用普通 `<img>` 标签（不优化）

## 技术细节

### 摄影页面

```astro
<!-- 构建时只读取 URL 列表，不获取尺寸 -->
{imageUrls.map((url, index) => (
  <div class="photography-card" style="aspect-ratio: 4 / 3;">
    <img 
      src={url} 
      loading="lazy"
      onload="this.parentElement.style.aspectRatio = this.naturalWidth + ' / ' + this.naturalHeight"
    />
  </div>
))}
```

**客户端脚本**：
- 监听图片 `load` 事件
- 使用 `naturalWidth` 和 `naturalHeight` 获取真实尺寸
- 动态设置容器的 `aspect-ratio` CSS 属性
- 设置 PhotoSwipe 数据属性

### Markdown 图片处理

Rehype 插件会在构建时处理 Markdown AST：
- 检测所有 `<img>` 标签
- 如果是外部 URL，确保使用普通 img 标签
- 添加性能优化属性

## 优势对比

### 旧方案（构建时获取尺寸）
- ❌ 构建慢（需要访问每个图片）
- ❌ CI 环境可能无法访问
- ❌ 网络问题会导致构建失败
- ❌ 需要维护缓存文件

### 新方案（客户端动态获取）
- ✅ 构建快速（只读取 URL 列表）
- ✅ 不依赖外部网络
- ✅ 构建稳定可靠
- ✅ 图片尺寸更准确（浏览器获取）
- ✅ 支持懒加载
- ✅ 无需维护缓存

## 使用说明

### 摄影页面

1. 编辑 `public/photography.txt`，每行一个图片 URL
2. 构建时自动读取 URL 列表
3. 浏览器加载图片后自动调整布局

### 文章内图片

Markdown 中的外部图片会自动处理：
```markdown
![描述](https://example.com/image.jpg)
```

会被渲染为：
```html
<img 
  src="https://example.com/image.jpg" 
  alt="描述"
  loading="lazy"
  decoding="async"
  data-external="true"
/>
```

## 性能优化

1. **懒加载**：所有图片使用 `loading="lazy"`
2. **异步解码**：使用 `decoding="async"`
3. **CSS Grid**：使用现代布局，性能更好
4. **客户端计算**：不阻塞构建，用户体验更好

## 注意事项

1. **首次加载**：图片加载前会显示默认宽高比（4:3）
2. **网络问题**：如果图片无法加载，会显示占位符
3. **SEO**：外部图片不会在构建时优化，但不会影响 SEO
4. **缓存**：浏览器会自动缓存图片，提升性能

## 迁移指南

如果之前使用了图片缓存：
1. 可以删除 `public/photography-cache.json`（不再需要）
2. 可以删除 `scripts/generate-image-cache.js`（可选）
3. 摄影页面会自动适应新的方案

## 故障排除

### 图片不显示
- 检查 URL 是否正确
- 检查网络连接
- 查看浏览器控制台错误

### 布局不正确
- 确保 JavaScript 已加载
- 检查图片是否成功加载
- 查看浏览器开发者工具

### 构建失败
- 检查 `photography.txt` 文件格式
- 确保 URL 验证通过
- 查看构建日志
