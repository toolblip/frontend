// Server/edge-safe ad resolver. Reads git-backed campaign + creative JSON via
// static imports (no fs, no browser APIs) so it works in server, edge, and
// client bundles alike.
import campaignsData from "@/data/ads/campaigns.json";
import proUpgrade from "@/data/ads/creatives/pro-upgrade.json";
import blogLibrary from "@/data/ads/creatives/blog-library.json";

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
  startDate: string | null;
  endDate: string | null;
}

// Registry of available creatives keyed by id. Add new creatives here.
const CREATIVES: Record<string, Creative> = {
  "pro-upgrade": proUpgrade,
  "blog-library": blogLibrary,
};

export type PageType = "directory" | "tool" | "blog";

export interface ResolveAdInput {
  pageType: string;
  slug?: string;
  category?: string;
}

function isActive(campaign: Campaign, today: string): boolean {
  if (campaign.startDate && campaign.startDate > today) return false;
  if (campaign.endDate && campaign.endDate < today) return false;
  return true;
}

/**
 * Pick the best-matching creative for a page. Filters campaigns by pageType and
 * active date range, sorts by ascending priority (1 = highest), and returns the
 * first campaign whose creative exists. Returns null when nothing matches.
 */
export function resolveAd({ pageType }: ResolveAdInput): Creative | null {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const campaigns = (campaignsData.campaigns as Campaign[])
    .filter((c) => c.pageTypes.includes(pageType))
    .filter((c) => isActive(c, today))
    .sort((a, b) => a.priority - b.priority);

  for (const campaign of campaigns) {
    const creative = CREATIVES[campaign.creative];
    if (creative) return creative;
  }

  return null;
}
