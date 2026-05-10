import type { MetadataRoute } from 'next';
import { tools } from '@/src/data/tools';

const siteUrl = 'https://toolblip.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/tools',
    '/directory',
    '/about',
    '/login',
    '/signup',
    '/blog',
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: now,
    })),
  ];
}
