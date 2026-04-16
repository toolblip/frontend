import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';

// Tool slugs for sitemap — kept in sync with src/data/tools.ts
const TOOL_SLUGS = [
  'word-counter','character-counter','remove-duplicate-lines','case-converter',
  'lorem-ipsum-generator','regex-tester','json-formatter','base64',
  'url-encode','image-cropper','image-format-converter','uuid-generator',
  'markdown-to-html','yaml-to-json','cron-parser','hash-generator',
  'screen-resolution-tester','url-slug-generator','percentage-calculator',
  'css-border-radius-generator','css-gradient-generator','jwt-decoder',
  'cron-generator','http-headers-viewer','port-scanner',
  'meta-tag-generator','serp-preview','color-picker','contrast-checker',
  'unit-converter','number-base-converter','text-sorter','readability-score',
  'grammar-checker','favicon-generator','image-resizer',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/tools`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/directory`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/login`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/signup`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: 'daily' },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  // Blog posts from root blog/ directory
  const blogDir = path.join(process.cwd(), 'blog');
  const blogPosts: MetadataRoute.Sitemap = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data } = matter(raw);
      if (data.slug) {
        blogPosts.push({
          url: `${BASE_URL}/blog/${data.slug}`,
          priority: 0.6,
          changeFrequency: 'monthly' as const,
          lastModified: (data.date || data.publishDate) ? new Date((data.date || data.publishDate) as string) : undefined,
        });
      }
    }
  }

  return [...staticPages, ...toolPages, ...blogPosts];
}
