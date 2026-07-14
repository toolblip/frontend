// Server/edge-safe ad resolver. Reads git-backed campaign + creative JSON via
// static imports (no fs, no browser APIs) so it works in server, edge, and
// client bundles alike.
import campaignsData from "@/data/ads/campaigns.json";
import placementsData from "@/data/ads/placements.json";
import proUpgrade from "@/data/ads/creatives/pro-upgrade.json";
import blogLibrary from "@/data/ads/creatives/blog-library.json";
import rankwellSeo from "@/data/ads/creatives/rankwell-seo.json";
import pixelforgeImage from "@/data/ads/creatives/pixelforge-image.json";

export interface Creative {
  id: string;
  title: string;
  tagline: string;
  url: string;
  cta: string;
  brandColor: string;
  logo?: string;
}

interface Campaign {
  id: string;
  creative: string;
  type: string;
  priority: number;
  pageTypes: string[];
  // Optional targeting. When omitted, a campaign is eligible for every
  // placement of its pageTypes (except opt-in-only placements — see
  // `data/ads/placements.json`) and every slug/category.
  placements?: string[];
  slugs?: string[];
  categories?: string[];
  startDate: string | null;
  endDate: string | null;
}

// Registry of available creatives keyed by id. Add new creatives here.
const CREATIVES: Record<string, Creative> = {
  "pro-upgrade": proUpgrade,
  "blog-library": blogLibrary,
  "rankwell-seo": rankwellSeo,
  "pixelforge-image": pixelforgeImage,
};

// Placements marked `optIn` (e.g. the desktop sidebar) only ever show a
// campaign that explicitly lists them — house/generic campaigns never fill
// them by default.
const OPT_IN_PLACEMENTS = new Set(
  (placementsData.placements as { id: string; optIn?: boolean }[])
    .filter((p) => p.optIn)
    .map((p) => p.id)
);

export type PageType = "directory" | "tool" | "blog";

export interface ResolveAdInput {
  pageType: string;
  placement?: string;
  slug?: string;
  category?: string;
}

function isActive(campaign: Campaign, today: string): boolean {
  if (campaign.startDate && campaign.startDate > today) return false;
  if (campaign.endDate && campaign.endDate < today) return false;
  return true;
}

function matchesPlacement(campaign: Campaign, placement?: string): boolean {
  if (!placement) return true;
  if (campaign.placements) return campaign.placements.includes(placement);
  return !OPT_IN_PLACEMENTS.has(placement);
}

// A campaign's `slugs`/`categories` are independent filters: any field that
// is defined must match, any field left undefined imposes no restriction.
function matchesTargeting(campaign: Campaign, slug?: string, category?: string): boolean {
  if (campaign.slugs?.length && !(slug && campaign.slugs.includes(slug))) return false;
  if (campaign.categories?.length && !(category && campaign.categories.includes(category))) return false;
  return true;
}

// Campaigns with more specific targeting outrank generic ones — a slug+category
// match beats a slug-only or category-only match, which beats an untargeted
// house campaign.
function specificity(campaign: Campaign): number {
  let score = 0;
  if (campaign.slugs?.length) score += 2;
  if (campaign.categories?.length) score += 1;
  return score;
}

/**
 * Pick the best-matching creative for a page. Filters campaigns by pageType,
 * placement, active date range, and slug/category targeting, then sorts by
 * targeting specificity (most specific first) and ascending priority
 * (1 = highest) as a tiebreaker. Returns the first campaign whose creative
 * exists, or null when nothing matches.
 */
export function resolveAd({ pageType, placement, slug, category }: ResolveAdInput): Creative | null {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const campaigns = (campaignsData.campaigns as Campaign[])
    .filter((c) => c.pageTypes.includes(pageType))
    .filter((c) => isActive(c, today))
    .filter((c) => matchesPlacement(c, placement))
    .filter((c) => matchesTargeting(c, slug, category))
    .sort((a, b) => specificity(b) - specificity(a) || a.priority - b.priority);

  for (const campaign of campaigns) {
    const creative = CREATIVES[campaign.creative];
    if (creative) return creative;
  }

  return null;
}
