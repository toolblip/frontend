/** Daily usage limit for guest (unauthenticated) users */
export const GUEST_DAILY_LIMIT = 10;

/** Daily usage limit for free account users */
export const FREE_DAILY_LIMIT = 50;

const COOKIE_NAME = 'tb_usage';
const HISTORY_COOKIE = 'tb_usage_history';
const MAX_HISTORY_ENTRIES = 40;

interface ToolUsage {
  count: number;
  date: string; // YYYY-MM-DD UTC
}

export interface ToolUsageHistoryEvent {
  slug: string;
  count: number;
  date: string; // YYYY-MM-DD UTC
  at: string; // ISO timestamp
}

export interface ToolUsageSnapshot {
  slug: string;
  count: number;
}

type UsageStore = Record<string, ToolUsage>;

type UsageHistoryStore = ToolUsageHistoryEvent[];

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function readStore(): UsageStore {
  if (typeof document === 'undefined') return {};
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
  } catch {
    return {};
  }
}

function writeStore(store: UsageStore): void {
  if (typeof document === 'undefined') return;
  // Expires in 2 days so stale data is pruned naturally
  const expires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(store))}; expires=${expires}; path=/; SameSite=Lax`;
}

function readHistoryStore(): UsageHistoryStore {
  if (typeof document === 'undefined') return [];
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${HISTORY_COOKIE}=`));
  if (!match) return [];

  try {
    const parsed = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is ToolUsageHistoryEvent =>
          typeof item?.slug === 'string' &&
          typeof item?.count === 'number' &&
          typeof item?.date === 'string' &&
          typeof item?.at === 'string'
      );
    }
  } catch {
    return [];
  }

  return [];
}

function writeHistoryStore(history: UsageHistoryStore): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${HISTORY_COOKIE}=${encodeURIComponent(JSON.stringify(history))}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Read the current usage count for a tool slug.
 * Resets to 0 when the UTC date changes.
 */
export function readUsage(slug: string): number {
  const store = readStore();
  const entry = store[slug];
  if (!entry || entry.date !== todayUTC()) return 0;
  return entry.count;
}

/**
 * Read usage counts for all tools for the current day.
 */
export function readTodayUsageBreakdown(): ToolUsageSnapshot[] {
  const store = readStore();
  const today = todayUTC();

  return Object.entries(store)
    .map(([slug, entry]) => ({
      slug,
      count: entry.date === today ? entry.count : 0,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Read recent usage events (most recent first).
 */
export function readUsageHistory(limit: number = 10): ToolUsageHistoryEvent[] {
  const history = readHistoryStore();
  return [...history]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, Math.max(0, limit));
}

/**
 * Increment the usage count for a tool slug and persist it.
 * Returns the new count.
 */
export function incrementUsage(slug: string): number {
  const store = readStore();
  const today = todayUTC();
  const existing = store[slug];
  const count = existing && existing.date === today ? existing.count + 1 : 1;
  store[slug] = { count, date: today };
  writeStore(store);
  return count;
}

/**
 * Track a local usage event for usage analytics and enforce daily limits.
 * Returns the new per-tool usage count.
 */
export function recordUsageEvent(slug: string): number {
  const newCount = incrementUsage(slug);

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const history = readHistoryStore();
  const next = [
    {
      slug,
      count: newCount,
      date: today,
      at: now,
    },
    ...history,
  ].slice(0, MAX_HISTORY_ENTRIES);

  writeHistoryStore(next);
  return newCount;
}

/**
 * Check whether the guest has reached their daily limit for a tool.
 * The check resets at UTC midnight (date comparison on each call).
 */
export function isAtLimit(slug: string, limitPerDay: number): boolean {
  return readUsage(slug) >= limitPerDay;
}
