export interface SponsorSlot {
  id: number;
  rank: number;
  domain: string;
  url: string;
  name: string;
  tagline: string | null;
  clicks: number;
  balance_cents: number;
  last_bid_at: string | null;
}

export interface SponsorsTopResponse {
  period: string;
  period_ends_at: string;
  min_bid_cents: number;
  slots: SponsorSlot[];
}

export interface SponsorsLeaderboardResponse {
  period: string;
  period_ends_at: string;
  min_bid_cents: number;
  page: number;
  per_page: number;
  total: number;
  data: SponsorSlot[];
}

const CACHE_KEY = "tb_sponsors_top_v1";
const CACHE_TTL_MS = 60_000;

/**
 * Prefixes an absolute app path with NEXT_PUBLIC_BASE_PATH when set. Only
 * the local Tailscale-preview tooling sets this (path-mounting a worktree's
 * dev server at /{slug}/toolblip) — Next.js rewrites next/link/next/router
 * automatically under a basePath, but not plain fetch()/sendBeacon() calls
 * to a hardcoded string, so those need the prefix applied explicitly.
 * A no-op everywhere else (local dev, CI, Railway), where the var is unset.
 */
export function apiPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}

/**
 * Session-scoped cache so repeat navigations across the ~1,400 tool pages
 * don't refetch on every click — the strip renders instantly from cache and
 * revalidates in the background. Not a correctness mechanism (server is the
 * source of truth), just avoids a fetch-per-page-view.
 */
export function readSponsorsTopCache(): SponsorsTopResponse | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, fetchedAt } = JSON.parse(raw) as { data: SponsorsTopResponse; fetchedAt: number };
    if (Date.now() - fetchedAt > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSponsorsTopCache(data: SponsorsTopResponse): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch {
    // Private-mode / storage-full — fine to skip caching.
  }
}

export async function fetchSponsorsTop(): Promise<SponsorsTopResponse> {
  const res = await fetch(apiPath("/api/sponsors/top"), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Failed to load sponsors");
  return res.json();
}

export async function fetchSponsorsLeaderboard(page = 1): Promise<SponsorsLeaderboardResponse> {
  const res = await fetch(apiPath(`/api/sponsors/leaderboard?page=${page}`), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load the sponsors leaderboard");
  return res.json();
}

export function formatBid(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}

/** Raw elapsed minutes since a bid, or null if there's no timestamp — used
 * to decide whether a row still counts as "recently bid" for highlighting. */
export function minutesSince(iso: string | null, now: number = Date.now()): number | null {
  if (!iso) return null;
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(minutes)) return null;
  return Math.max(0, minutes);
}

/** "1 minute ago" / "6 hours ago" / "14 days ago", relative to now. */
export function formatTimeAgo(iso: string | null, now: number = Date.now()): string {
  const minutes = minutesSince(iso, now);
  if (minutes === null) return "";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Fire-and-forget click ping — never blocks or delays the outbound navigation. */
export function pingSponsorClick(id: number): void {
  try {
    navigator.sendBeacon?.(apiPath(`/api/sponsors/click/${id}`));
  } catch {
    // best-effort only
  }
}

/** Tags an outbound sponsor URL so the sponsor's own analytics can attribute
 * the click back to Toolblip and which surface it came from. */
export function withSponsorSource(url: string, source: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'toolblip');
    u.searchParams.set('utm_medium', 'sponsor');
    u.searchParams.set('utm_content', source);
    return u.toString();
  } catch {
    return url;
  }
}
