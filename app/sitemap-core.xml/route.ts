import { sitemapXmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

// Omit lastmod until reliable per-page modification dates are available.

// /login, /signup, /submit-tool, /account, and /frontend-health are
// intentionally excluded: they carry robots: { index: false } directly
// on the page. /tools and /tools/images are real listing pages now.
export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';

  const entries: SitemapUrlEntry[] = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/directory`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/images`, changeFrequency: 'weekly', priority: 0.8 },
    // Distinct from /directory (a static, category-grouped full index vs.
    // /directory's filterable browse view) with its own self-referencing
    // canonical — not a duplicate. It was linked from the homepage and
    // every tool page but never listed in any sitemap.
    { url: `${baseUrl}/all-tools`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/sponsors`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/sponsors/archive`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/seo`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/api-docs`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return sitemapXmlResponse(entries);
}
