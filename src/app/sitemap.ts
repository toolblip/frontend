import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/tools`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/directory`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'daily' },
    { url: `${baseUrl}/api-docs`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/login`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/signup`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${baseUrl}/terms`, priority: 0.4, changeFrequency: 'yearly' },
    { url: `${baseUrl}/donate`, priority: 0.4, changeFrequency: 'monthly' },
    { url: `${baseUrl}/advertise`, priority: 0.4, changeFrequency: 'monthly' },
  ];

  const tools = [
    'word-counter', 'character-counter', 'json-formatter', 'base64',
    'case-converter', 'url-encode', 'image-cropper', 'uuid-generator',
    'remove-duplicate-lines', 'markdown-to-html', 'cron-parser',
    'css-gradient-generator', 'css-border-radius-generator', 'hash-generator',
    'percentage-calculator', 'screen-resolution-tester', 'url-slug-generator',
    'yaml-to-json', 'image-format-converter',
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
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
