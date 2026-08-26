import { sitemapXmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

// Bump only when a static page's content actually changes — see the same
// pattern in sitemap-tools.xml.
const STATIC_PAGES_LAST_MODIFIED = new Date('2026-08-26T00:00:00.000Z');

// /login, /signup, /submit-tool, /account, and /frontend-health are
// intentionally excluded: they carry robots: { index: false } directly
// on the page. /tools and /tools/images are real listing pages now.
export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';

  const entries: SitemapUrlEntry[] = [
    { url: baseUrl, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/directory`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/images`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    // Distinct from /directory (a static, category-grouped full index vs.
    // /directory's filterable browse view) with its own self-referencing
    // canonical — not a duplicate. It was linked from the homepage and
    // every tool page but never listed in any sitemap.
    { url: `${baseUrl}/all-tools`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/sponsors`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/seo`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/api-docs`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return sitemapXmlResponse(entries);
}
