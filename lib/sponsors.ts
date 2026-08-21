export interface SponsorSlot {
  id: number;
  rank: number;
  domain: string;
  url: string;
  name: string;
  tagline: string | null;
  clicks: number;
  balance_cents: number;
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

/** Fire-and-forget click ping — never blocks or delays the outbound navigation. */
export function pingSponsorClick(id: number): void {
  try {
    navigator.sendBeacon?.(apiPath(`/api/sponsors/click/${id}`));
  } catch {
    // best-effort only
  }
}
