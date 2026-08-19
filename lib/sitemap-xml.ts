export type SitemapUrlEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Renders one <urlset> sitemap as a Response, shared by sitemap-core.xml,
 * sitemap-tools.xml, and sitemap-blog.xml. Split into three (rather than
 * one combined app/sitemap.ts) so Search Console reports indexed/discovered
 * counts per sitemap — the clearest signal for whether the tool corpus or
 * the blog is recovering after the GSC index-recovery cleanup.
 */
export function sitemapXmlResponse(entries: SitemapUrlEntry[]): Response {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map(
        (e) =>
          `<url><loc>${escapeXml(e.url)}</loc>` +
          `<lastmod>${e.lastModified.toISOString()}</lastmod>` +
          `<changefreq>${e.changeFrequency}</changefreq>` +
          `<priority>${e.priority}</priority></url>`
      )
      .join('\n') +
    `\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
