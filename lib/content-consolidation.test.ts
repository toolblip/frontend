import { describe, expect, it, vi } from 'vitest';
import { tools, getCanonicalToolSlug, getToolBySlug, getToolRouteSlugs } from '@/data/tools';
import { getToolPathBySlug } from '@/lib/tool-path';
import { GET } from '@/app/sitemap-tools.xml/route';
import { consolidatedAliases } from '@/e2e/content-aliases';
import { getToolContent } from '@/data/tool-content';
import { getFaqs } from '@/lib/faq';
import { buildToolMetadata } from '@/app/tools/tool-page-meta';

// Avoid loading browser tool implementations when exercising server routing.
vi.mock('@/app/tools/ToolDetailView', () => ({ default: () => null }));
import ToolDetailPage, { generateMetadata, generateStaticParams } from '@/app/tools/[slug]/page';

describe('confirmed same-intent aliases', () => {
  it.each(Object.entries(consolidatedAliases))('%s resolves directly to %s', async (alias, canonical) => {
    expect(getCanonicalToolSlug(alias)).toBe(canonical);
    expect(getToolBySlug(alias)?.slug).toBe(canonical);
    expect(getToolPathBySlug(alias)).toBe(`/tools/${canonical}`);
    expect(tools.some(tool => tool.slug === alias)).toBe(false);
    expect(tools.filter(tool => tool.slug === canonical)).toHaveLength(1);
    expect(await generateStaticParams()).toContainEqual({ slug: alias });
    await expect(ToolDetailPage({ params: Promise.resolve({ slug: alias }) }))
      .rejects.toMatchObject({ digest: `NEXT_REDIRECT;replace;/tools/${canonical};308;` });
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: canonical }) });
    expect(metadata.alternates?.canonical).toBe(`https://toolblip.com/tools/${canonical}`);
    expect(metadata.robots).toEqual({ index: true, follow: true });
    const xml = await (await GET()).text();
    expect(xml).not.toContain(`<loc>https://toolblip.com/tools/${alias}</loc>`);
    expect(xml).toContain(`<loc>https://toolblip.com/tools/${canonical}</loc>`);
  });

  it('provides one permanent HTTP redirect per selected alias without redirecting destinations', async () => {
    const { default: config } = await import('../next.config.mjs');
    const redirects = await config.redirects!();
    for (const [alias, canonical] of Object.entries(consolidatedAliases)) {
      expect(redirects.filter((entry: { source: string }) => entry.source === `/tools/${alias}`))
        .toEqual([{ source: `/tools/${alias}`, destination: `/tools/${canonical}`, permanent: true }]);
      expect(redirects.some((entry: { source: string }) => entry.source === `/tools/${canonical}`)).toBe(false);
    }
    for (const entry of redirects) {
      expect(Object.keys(consolidatedAliases).map(slug => `/tools/${slug}`)).not.toContain(entry.destination);
    }
  });

  it('has no conflicting or cyclic configured redirects, including legacy chains', async () => {
    const { default: config } = await import('../next.config.mjs');
    const redirects = await config.redirects!();
    const destinations = new Map<string, string>();
    for (const redirect of redirects) {
      if (destinations.has(redirect.source)) {
        expect(destinations.get(redirect.source)).toBe(redirect.destination);
      }
      destinations.set(redirect.source, redirect.destination);
    }
    for (const source of destinations.keys()) {
      const seen = new Set<string>();
      let target = source;
      while (destinations.has(target)) {
        expect(seen.has(target), `redirect cycle from ${source}`).toBe(false);
        seen.add(target);
        target = destinations.get(target)!;
      }
    }
  });

  it.each([
    ['jwt-decoder-v2', 'jwt-decoder'],
    ['reading-time-express', 'reading-time-calculator'],
    ['regex-match-tool', 'regex-tester'],
    ['random-string', 'password-generator'],
  ])('routes older alias %s straight to %s', async (alias, canonical) => {
    await expect(ToolDetailPage({ params: Promise.resolve({ slug: alias }) }))
      .rejects.toMatchObject({ digest: `NEXT_REDIRECT;replace;/tools/${canonical};308;` });
  });

  it('keeps legacy resolution idempotent and free of cycles', () => {
    for (const slug of getToolRouteSlugs()) {
      const canonical = getCanonicalToolSlug(slug);
      expect(getCanonicalToolSlug(canonical), slug).toBe(canonical);
    }
    expect(getToolPathBySlug('jwt-decoder-v2')).toBe('/tools/jwt-decoder');
    expect(getToolPathBySlug('reading-time-express')).toBe('/tools/reading-time-calculator');
    expect(getToolPathBySlug('image-border-adder')).toBe('/tools/images/border');
  });

  it('scopes workflow builder claims to drafts and keeps its indexable route', () => {
    const tool = getToolBySlug('automation-wizard')!;
    expect(tool.name).toMatch(/workflow outline/i);
    const content = [tool.description, getToolContent(tool.slug)?.description,
      ...getFaqs(tool).map(faq => faq.a)].join(' ');
    expect(content).not.toMatch(/connect apps and automate|whichever your automation runner expects|feeding that definition into/i);
    expect(content).toMatch(/not.*(?:verified|validated).*compatib/i);
    expect(buildToolMetadata(tool).robots).toEqual({ index: true, follow: true });
  });
});
