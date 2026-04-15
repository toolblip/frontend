import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { tools } from '@/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/tools`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/directory`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/login`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/signup`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'daily' },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  // Blog posts
  const blogDir = path.join(process.cwd(), 'blog');
  const blogPosts: MetadataRoute.Sitemap = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data } = matter(raw);
      if (data.slug) {
        blogPosts.push({
          url: `${baseUrl}/blog/${data.slug}`,
          priority: 0.6,
          changeFrequency: 'monthly' as const,
          lastModified: data.date ? new Date(data.date) : undefined,
        });
      }
    }
  }

  return [...staticPages, ...toolPages, ...blogPosts];
}
