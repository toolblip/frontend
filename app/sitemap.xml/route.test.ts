import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as index } from './route';
import { GET as core } from '../sitemap-core.xml/route';
import { GET as tools } from '../sitemap-tools.xml/route';
import { GET as blog } from '../sitemap-blog.xml/route';
import * as blogData from '@/lib/blog';
import { tools as catalog } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getToolPath } from '@/lib/tool-path';

afterEach(() => vi.restoreAllMocks());

describe('sitemap routes', () => {
  it('lists the same three children without invented modification dates', async () => {
    const response = await index();
    const xml = await response.text();
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.match(/<loc>.*?<\/loc>/g)).toEqual([
      '<loc>https://toolblip.com/sitemap-core.xml</loc>',
      '<loc>https://toolblip.com/sitemap-tools.xml</loc>',
      '<loc>https://toolblip.com/sitemap-blog.xml</loc>',
    ]);
    expect(xml).not.toContain('<lastmod>');
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('retains the core URLs without unreliable dates', async () => {
    const xml = await (await core()).text();
    expect(Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), ([, url]) => url)).toEqual([
      'https://toolblip.com',
      'https://toolblip.com/directory',
      'https://toolblip.com/tools',
      'https://toolblip.com/tools/images',
      'https://toolblip.com/all-tools',
      'https://toolblip.com/blog',
      'https://toolblip.com/pricing',
      'https://toolblip.com/sponsors',
      'https://toolblip.com/sponsors/archive',
      'https://toolblip.com/about',
      'https://toolblip.com/seo',
      'https://toolblip.com/api-docs',
    ]);
    expect(xml).not.toContain('<lastmod>');
  });

  it('lists the indexable tool catalog without unreliable dates', async () => {
    const xml = await (await tools()).text();
    const expectedUrls = catalog
      .filter((tool) => isToolIndexable(tool.slug))
      .map((tool) => `https://toolblip.com${getToolPath(tool)}`);
    expect(Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), ([, url]) => url)).toEqual(expectedUrls);
    expect(xml).not.toContain('<lastmod>');
  });

  it('retains the blog URLs and their valid source dates', async () => {
    const xml = await (await blog()).text();
    const posts = blogData.getBlogPosts();
    expect(xml.match(/<url>/g) ?? []).toHaveLength(posts.length);
    for (const post of posts) {
      const date = new Date(post.date);
      const lastmod = post.date && Number.isFinite(date.getTime())
        ? `<lastmod>${date.toISOString()}</lastmod>`
        : '';
      expect(xml).toContain(
        `<loc>https://toolblip.com/blog/${post.slug}</loc>` +
        lastmod + '<changefreq>',
      );
    }
  });

  it('does not invent dates for blog posts with missing or invalid dates', async () => {
    const post = blogData.getBlogPosts()[0];
    vi.spyOn(blogData, 'getBlogPosts').mockReturnValue([
      { ...post, slug: 'undated', date: '' },
      { ...post, slug: 'invalid-date', date: 'not-a-date' },
      { ...post, slug: 'dated', date: '2026-09-21' },
    ]);
    const xml = await (await blog()).text();
    expect(xml.match(/<url>/g)).toHaveLength(3);
    expect(xml).toContain('<loc>https://toolblip.com/blog/undated</loc><changefreq>');
    expect(xml).toContain('<loc>https://toolblip.com/blog/invalid-date</loc><changefreq>');
    expect(xml.match(/<lastmod>.*?<\/lastmod>/g)).toEqual([
      '<lastmod>2026-09-21T00:00:00.000Z</lastmod>',
    ]);
  });
});
