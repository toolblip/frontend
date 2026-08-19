import { tools } from '@/data/tools';
import { sitemapXmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

// Tool pages don't carry a per-tool last-modified date, so this is a fixed
// snapshot rather than `new Date()` recomputed on every build, which
// previously made every tool URL report a fake "just changed" timestamp on
// every deploy regardless of whether the page's content actually changed.
// Bump when the tool catalog changes meaningfully (this cleanup pass:
// broken/duplicate slugs removed and legacy suffixes renamed).
const TOOL_PAGES_LAST_MODIFIED = new Date('2026-08-19T00:00:00.000Z');

// NOTE: this still lists the full tool catalog. The GSC recovery plan's
// next step is narrowing this to a verified "tier A" subset (unique
// rendered UI, passes a functional smoke test, real per-tool copy) and
// noindexing the rest rather than deleting it — see
// reports/you-need-to-go-purrfect-castle.md in the workspace repo. This
// pass only removed pages confirmed broken/duplicate (see next.config.mjs
// redirects) and split this sitemap out on its own so indexed-vs-discovered
// counts for the tool corpus can be tracked separately from the blog.
// Slugs that exist as a real entry in data/tools.ts but are also a source
// key in app/tools/[slug]/page.tsx's REDIRECTS map, so every request to
// them permanently redirects away before the page ever renders — dead,
// unreachable data that would otherwise falsely reappear in this sitemap.
// ('serp-simulator' -> 'google-serp-simulator'. 'lorem-ipsum' used to be
// here too, but that REDIRECTS entry was stale — it predated this pass
// renaming a different tool, 'lorem-ipsum-api', onto the 'lorem-ipsum'
// slug, and has since been removed from REDIRECTS so the renamed tool is
// reachable under its own canonical URL.)
const SHADOWED_BY_REDIRECT = new Set(['serp-simulator']);

export async function GET(): Promise<Response> {
  const baseUrl = 'https://toolblip.com';

  const entries: SitemapUrlEntry[] = tools
    .filter((tool) => !SHADOWED_BY_REDIRECT.has(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: TOOL_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return sitemapXmlResponse(entries);
}
