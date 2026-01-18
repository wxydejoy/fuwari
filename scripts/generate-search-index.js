import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

async function generateSearchIndex() {
  try {
    // 获取所有文章数据
    const posts = await getCollection('posts', (entry) => !entry.data.draft);
    
    // 准备搜索数据
    const searchData = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      category: post.data.category,
      published: post.data.published.toISOString(),
      url: `/posts/${post.slug}/`
    }));
    
    // 确保 dist 目录存在
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // 写入搜索数据到 JSON 文件
    const searchDataPath = path.join(distDir, 'search-data.json');
    fs.writeFileSync(searchDataPath, JSON.stringify(searchData, null, 2), 'utf-8');
    
    console.log('Search index generated successfully!');
    console.log(`Generated search data for ${searchData.length} posts`);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

generateSearchIndex();
