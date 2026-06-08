// Client-side recent-tool history for the MVP dashboard.
//
// Tool pages record the tools a visitor opens in localStorage; the dashboard
// reads them to show a "Recent tools" panel below favorites. This keeps history
// usable without a backend reader endpoint (view tracking still posts to Laravel
// for analytics separately).

export type RecentTool = {
  slug: string;
  name: string;
  icon: string;
  visitedAt: string;
};

export const RECENT_TOOLS_STORAGE_KEY = 'toolblip_recent_tools';
export const RECENT_TOOLS_MAX = 8;

export function getRecentTools(): RecentTool[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RecentTool =>
        Boolean(entry) && typeof entry.slug === 'string' && typeof entry.name === 'string',
    );
  } catch {
    return [];
  }
}

export function recordRecentTool(tool: { slug: string; name: string; icon?: string }): RecentTool[] {
  if (typeof window === 'undefined') return [];
  if (!tool.slug || !tool.name) return getRecentTools();

  const entry: RecentTool = {
    slug: tool.slug,
    name: tool.name,
    icon: tool.icon || '🧰',
    visitedAt: new Date().toISOString(),
  };
  // Newest first, de-duplicated by slug, capped.
  const next = [entry, ...getRecentTools().filter((item) => item.slug !== tool.slug)].slice(
    0,
    RECENT_TOOLS_MAX,
  );

  try {
    window.localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / serialization errors — history is best-effort.
  }

  return next;
}
