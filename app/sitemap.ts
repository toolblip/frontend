import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';

const BASE_URL = 'https://toolblip.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog posts
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const blogPages: MetadataRoute.Sitemap = [];
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
        const { data } = matter(raw);
        const slug = (data.slug as string) || file.replace('.md', '');
        const date = data.date || data.publishDate;
        blogPages.push({
          url: `${BASE_URL}/blog/${slug}`,
          lastModified: date ? new Date(date) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });
      } catch {
        // skip malformed posts
      }
    }
  }

  return [...staticPages, ...toolPages, ...blogPages];
}
