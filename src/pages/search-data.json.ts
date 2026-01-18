import { getCollection } from 'astro:content';

export async function GET() {
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
    
    return new Response(JSON.stringify(searchData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating search data:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate search data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
