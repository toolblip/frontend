import { tools } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
import { sitemapXmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

// Tool pages don't carry a per-tool last-modified date, so this is a fixed
// snapshot rather than `new Date()` recomputed on every build, which
// previously made every tool URL report a fake "just changed" timestamp on
// every deploy regardless of whether the page's content actually changed.
// Bump when the tool catalog changes meaningfully (most recently: round 4
// of the family-verification pass, 34 slugs removed/redirected, 2 added).
const TOOL_PAGES_LAST_MODIFIED = new Date('2026-08-25T00:00:00.000Z');

// Tier-A gate: only tools with hand-written FAQ overrides are listed
// (isToolIndexable). Others stay live with noindex,follow until they have
// differentiated copy — see docs/gsc-recovery-plan.md. This sitemap is
// split from core/blog so GSC can track tool-corpus recovery separately.
// Slugs that exist as a real entry in data/tools.ts but are also a source
// key in app/tools/[slug]/page.tsx's REDIRECTS map, so every request to
// them permanently redirects away before the page ever renders — dead,
// unreachable data that would otherwise falsely reappear in this sitemap.
// ('lorem-ipsum' used to be here, but that REDIRECTS entry was stale — it
// predated a pass renaming a different tool, 'lorem-ipsum-api', onto the
// 'lorem-ipsum' slug, and has since been removed from REDIRECTS so the
// renamed tool is reachable under its own canonical URL. 'serp-simulator'
// used to be here too, shadowing a real, different, live tool
// (SerpPreviewClient vs GoogleSerpSimulatorClient) — the shadowing
// REDIRECTS entry has now been removed instead, so the real tool is
// reachable and belongs in this sitemap again.)
const SHADOWED_BY_REDIRECT = new Set<string>([]);

export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';

  const entries: SitemapUrlEntry[] = tools
    .filter((tool) => !SHADOWED_BY_REDIRECT.has(tool.slug) && isToolIndexable(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: TOOL_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return sitemapXmlResponse(entries);
}
