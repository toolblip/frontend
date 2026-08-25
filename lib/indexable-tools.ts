import { hasFaqOverride } from '@/lib/faq';

/**
 * Whether a tool page should be submitted for indexing (sitemap + robots).
 *
 * Tools without a hand-written FAQ override still render template FAQs for
 * readers, but Google treated hundreds of near-identical tool URLs as
 * low-value doorway pages ("Crawled - currently not indexed"). Until each tool
 * has differentiated copy (FAQ override is the current quality gate), keep
 * thin variants out of the crawl budget.
 */
export function isToolIndexable(slug: string): boolean {
  return hasFaqOverride(slug);
}
