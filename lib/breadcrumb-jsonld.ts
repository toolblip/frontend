import type { Tool } from '@/data/tools';
import { SITE_ORIGIN } from '@/lib/ai-crawlers';
import { getCategoryPath, getToolAbsoluteUrl } from '@/lib/tool-path';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Mirrors the visible nav in app/tools/ToolDetailView.tsx: Home / Tools / category / tool.
export function buildToolBreadcrumbJsonLd(tool: Pick<Tool, 'name' | 'slug' | 'category'>) {
  return buildBreadcrumbJsonLd([
    { name: 'Home', url: SITE_ORIGIN },
    { name: 'Tools', url: `${SITE_ORIGIN}/tools` },
    { name: tool.category, url: `${SITE_ORIGIN}${getCategoryPath(tool.category)}` },
    { name: tool.name, url: getToolAbsoluteUrl(tool) },
  ]);
}

// Mirrors the visible nav in app/blog/[slug]/page.tsx: Home / Blog / post.
export function buildBlogBreadcrumbJsonLd(post: { slug: string; title: string }) {
  return buildBreadcrumbJsonLd([
    { name: 'Home', url: SITE_ORIGIN },
    { name: 'Blog', url: `${SITE_ORIGIN}/blog` },
    { name: post.title, url: `${SITE_ORIGIN}/blog/${post.slug}` },
  ]);
}
