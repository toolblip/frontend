import { describe, expect, it } from 'vitest';
import { sitemapXmlResponse, type SitemapUrlEntry } from './sitemap-xml';

describe('sitemap XML dates', () => {
  const entry: SitemapUrlEntry = {
    url: 'https://toolblip.com/tools/example?a=1&b=2',
    changeFrequency: 'monthly',
    priority: 0.6,
  };

  it('omits lastmod when no reliable date is supplied', async () => {
    const response = sitemapXmlResponse([entry]);
    const xml = await response.text();
    expect(xml).not.toContain('<lastmod>');
    expect(xml).toContain('<loc>https://toolblip.com/tools/example?a=1&amp;b=2</loc>');
    expect(xml).toContain('<changefreq>monthly</changefreq><priority>0.6</priority>');
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('omits invalid dates without dropping the URL or failing the response', async () => {
    const xml = await sitemapXmlResponse([
      { ...entry, lastModified: new Date('not-a-date') },
    ]).text();
    expect(xml).not.toContain('<lastmod>');
    expect(xml).toContain('<url><loc>');
  });

  it('preserves valid dates, including the Unix epoch', async () => {
    const xml = await sitemapXmlResponse([
      { ...entry, lastModified: new Date('2026-09-21T12:30:00+06:00') },
      { ...entry, lastModified: new Date(0) },
    ]).text();
    expect(xml.match(/<lastmod>.*?<\/lastmod>/g)).toEqual([
      '<lastmod>2026-09-21T06:30:00.000Z</lastmod>',
      '<lastmod>1970-01-01T00:00:00.000Z</lastmod>',
    ]);
  });
});
