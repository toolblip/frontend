import { getCanonicalToolSlug, tools } from '@/data/tools';
import {
  LEGACY_ELIGIBLE_TOOL_SLUGS,
  TOOL_INDEXING_DECISIONS,
  type ToolIndexingDecision,
} from '@/data/tool-indexing-policy';

export type ToolIndexingStatus =
  | 'legacy-eligible-needs-review'
  | 'pending'
  | 'hold'
  | 'reviewed'
  | 'alias'
  | 'not-in-catalog';

const legacyEligible = new Set(LEGACY_ELIGIBLE_TOOL_SLUGS);
const catalogSlugs = new Set(tools.map(tool => tool.slug));

function hasReviewEvidence(decision: ToolIndexingDecision): boolean {
  if (decision.status !== 'reviewed') return false;
  const { reviewedAt, evidence } = decision;
  if (typeof reviewedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)) return false;
  const date = new Date(`${reviewedAt}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === reviewedAt
    && typeof evidence === 'string'
    && evidence.trim().length > 0;
}

/** Audit the effective status; optional decisions allow evaluating proposed reviews.
 * Invalid review metadata fails closed as hold. Evidence content needs human review.
 * Catalog membership and canonical routing always take precedence over decisions.
 */
export function getToolIndexingStatus(
  slug: string,
  decisions: Readonly<Record<string, ToolIndexingDecision>> = TOOL_INDEXING_DECISIONS,
): ToolIndexingStatus {
  if (getCanonicalToolSlug(slug) !== slug) return 'alias';
  if (!catalogSlugs.has(slug)) return 'not-in-catalog';
  if (Object.prototype.hasOwnProperty.call(decisions, slug)) {
    return hasReviewEvidence(decisions[slug]) ? 'reviewed' : 'hold';
  }
  return legacyEligible.has(slug) ? 'legacy-eligible-needs-review' : 'pending';
}

/** Shared robots/sitemap gate. FAQ content never grants or removes eligibility. */
export function isToolIndexable(
  slug: string,
  decisions: Readonly<Record<string, ToolIndexingDecision>> = TOOL_INDEXING_DECISIONS,
): boolean {
  const status = getToolIndexingStatus(slug, decisions);
  return status === 'legacy-eligible-needs-review' || status === 'reviewed';
}
