import { getBlogPosts } from '@/lib/blog';
import { sitemapXmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

// Split out on its own so Search Console reports the blog's indexed count
// separately from the tool corpus. The 121 blog posts measure far better
// on content-quality checks than the tool pages do (see the GSC recovery
// plan), so this is the sitemap to watch for the earliest sign of recovery.
export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';

  const entries: SitemapUrlEntry[] = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date('2026-08-19T00:00:00.000Z'),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return sitemapXmlResponse(entries);
}
