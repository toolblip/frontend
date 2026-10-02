import type { MetadataRoute } from 'next';
import { aiMcpItems } from '@/data/ai-mcp-menu';
import { tools } from '@/src/data/tools';

const siteUrl = 'https://toolblip.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/directory',
    '/about',
    '/login',
    '/signup',
    '/blog',
    '/seo',
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
    })),
    ...tools
      .filter((tool) => tool.slug !== 'serp-simulator')
      .map((tool) => ({
        url: `${siteUrl}/tools/${tool.slug}`,
        lastModified: now,
      })),
    ...aiMcpItems().map((entry) => ({
      url: `${siteUrl}/ai-mcp-bots/${entry.slug}`,
      lastModified: now,
    })),
  ];
}
