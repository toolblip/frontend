/** Daily usage limit for guest (unauthenticated) users */
export const GUEST_DAILY_LIMIT = 10;

/** Daily usage limit for free account users */
export const FREE_DAILY_LIMIT = 50;

const COOKIE_NAME = 'tb_usage';

interface ToolUsage {
  count: number;
  date: string; // YYYY-MM-DD UTC
}

type UsageStore = Record<string, ToolUsage>;

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
 * Check whether the guest has reached their daily limit for a tool.
 * The check resets at UTC midnight (date comparison on each call).
 */
export function isAtLimit(slug: string, limitPerDay: number): boolean {
  return readUsage(slug) >= limitPerDay;
}
