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
  placeholder?: boolean;
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

export interface SponsorsArchivePeriod {
  period: string;
  closed_at: string | null;
  slots: SponsorSlot[];
}

export interface SponsorsArchiveResponse {
  data: SponsorsArchivePeriod[];
}

const CACHE_KEY = "tb_sponsors_top_v3";
const CACHE_TTL_MS = 60_000;

/**
 * Prefixes an absolute app path with NEXT_PUBLIC_BASE_PATH when set. Only
 * the local Tailscale-preview tooling sets this (path-mounting a worktree's
 * dev server at /{slug}/toolblip) — Next.js rewrites next/link/next/router
 * automatically under a basePath, but not plain fetch() calls
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
  const res = await fetch(apiPath("/api/sponsors/top"), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load sponsors");
  return res.json();
}

export async function fetchSponsorsLeaderboard(page = 1): Promise<SponsorsLeaderboardResponse> {
  const res = await fetch(apiPath(`/api/sponsors/leaderboard?page=${page}`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load the sponsors leaderboard");
  return res.json();
}

export async function fetchSponsorsArchive(): Promise<SponsorsArchiveResponse> {
  const res = await fetch(apiPath("/api/sponsors/archive"), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load the sponsors archive");
  return res.json();
}

export function formatBid(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}

/** "@handle" for an x.com identity, the raw domain otherwise — always the
 * one real, verifiable identifier, never a free-text display name. */
export function displayIdentity(domain: string): string {
  return domain.startsWith("x.com/") ? "@" + domain.slice("x.com/".length) : domain;
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

export type SponsorClickTarget = Pick<SponsorSlot, 'id' | 'domain' | 'placeholder'>;
export type SponsorClickResult = { clicks: number | null };

/** One request per click, kept alive during navigation. A null result never
 * changes the displayed count; paid 204s acknowledge one persisted click. */
export async function pingSponsorClick(target: number | SponsorClickTarget): Promise<SponsorClickResult | null> {
  const placeholder = typeof target !== 'number' && target.placeholder ? target : null;
  const id = typeof target === 'number' ? target : target.id;
  if (!placeholder && (!Number.isSafeInteger(id) || id <= 0)) return null;

  try {
    const res = await fetch(apiPath(placeholder ? '/api/sponsors/placeholder-click' : `/api/sponsors/click/${id}`), {
      method: 'POST',
      keepalive: true,
      headers: placeholder
        ? { Accept: 'application/json', 'Content-Type': 'application/json' }
        : { Accept: 'application/json' },
      ...(placeholder ? { body: JSON.stringify({ domain: placeholder.domain }) } : {}),
    });
    if (!res.ok) return null;
    let clicks: number | null = null;
    if (placeholder || res.status !== 204) {
      const data = await res.json();
      if (!Number.isSafeInteger(data?.clicks) || data.clicks < 0) return null;
      clicks = data.clicks;
    }
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch {
      // Storage can be unavailable; the server remains the source of truth.
    }
    return { clicks };
  } catch {
    // Tracking must not interrupt navigation or produce an unhandled rejection.
    return null;
  }
}

/** Placeholder IDs are positional, so match their stable domain instead.
 * Functional state updates preserve overlapping paid clicks; max prevents
 * out-of-order placeholder responses from moving the aggregate backwards. */
export function applySponsorClick(slots: SponsorSlot[], target: SponsorClickTarget, result: SponsorClickResult | null): SponsorSlot[] {
  if (!result) return slots;
  return slots.map(slot => {
    const matches = target.placeholder
      ? slot.placeholder && slot.domain === target.domain
      : !slot.placeholder && slot.id === target.id;
    if (!matches) return slot;
    return { ...slot, clicks: result.clicks === null ? slot.clicks + 1 : Math.max(slot.clicks, result.clicks) };
  });
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
