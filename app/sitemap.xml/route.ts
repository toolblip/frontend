/**
 * Legacy sitemap URL — many external references and old scripts still point
 * at /sitemap.xml. Return a sitemap index that lists the three live child
 * sitemaps instead of 404ing.
 */
export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';
  // Omit lastmod until reliable child sitemap modification dates are available.

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `<sitemap><loc>${baseUrl}/sitemap-core.xml</loc></sitemap>\n` +
    `<sitemap><loc>${baseUrl}/sitemap-tools.xml</loc></sitemap>\n` +
    `<sitemap><loc>${baseUrl}/sitemap-blog.xml</loc></sitemap>\n` +
    `</sitemapindex>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
