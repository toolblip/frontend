import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { getBlogPosts } from '@/lib/blog';

// Tool pages don't carry a per-tool last-modified date, so this is a fixed
// snapshot date rather than `new Date()` recomputed on every build, which
// previously made all ~800 tool URLs report a fake "just changed" timestamp
// on every deploy regardless of whether the page's content actually changed.
const TOOL_PAGES_LAST_MODIFIED = new Date('2026-08-04T00:00:00.000Z');

// Same problem applied to these static marketing pages: `new Date()` was
// recomputed on every build, so bump this only when a page's content
// actually changes.
const STATIC_PAGES_LAST_MODIFIED = new Date('2026-08-12T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolblip.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/seo`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/api-docs`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/frontend-health`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.slug !== 'serp-simulator')
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: TOOL_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...toolPages];
}