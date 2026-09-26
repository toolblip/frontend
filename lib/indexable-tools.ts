import { hasFaqOverride } from '@/lib/faq';

/**
 * Whether a tool page should be submitted for indexing (sitemap + robots).
 *
 * Tools without a hand-written FAQ override still render template FAQs for
 * readers. This is the current submission gate, not a full quality review:
 * FAQ presence alone does not establish unique functionality or accurate copy,
 * and a crawled-not-indexed report does not prove Google's reason for exclusion.
 */
export function isToolIndexable(slug: string): boolean {
  return hasFaqOverride(slug);
}
