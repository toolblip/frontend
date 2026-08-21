import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

// Short links are created at runtime (via /api/shorten) and need to survive
// deploys and restarts. The repo's own data/ directory lives on the
// container's ephemeral filesystem and gets wiped on every deploy, so in
// production this must point at a mounted persistent volume instead -
// SHORT_LINKS_DATA_DIR is set to that mount path on Railway. Falls back to
// the repo directory for local dev, where there's no volume and losing data
// across restarts doesn't matter.
const DATA_DIR = process.env.SHORT_LINKS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "short-links.json");
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export interface ShortLinkEntry {
  url: string;
  code: string;
  created: string;
  clicks: number;
  click_history: { date: string; count: number; referrer?: string }[];
  referrers: Record<string, number>;
}

export interface ShortLinksData {
  links: Record<string, ShortLinkEntry>;
}

export function loadShortLinks(): ShortLinksData {
  if (!existsSync(DATA_FILE)) return { links: {} };
  try {
    const raw = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    // Migrate old format: Record<string, string> -> { links: Record<string, ShortLinkEntry> }
    if (raw.links) {
      return raw as ShortLinksData;
    }
    // Old format is a flat map of code -> url
    const links: Record<string, ShortLinkEntry> = {};
    for (const [code, url] of Object.entries(raw)) {
      if (typeof url === "string") {
        links[code] = {
          url,
          code,
          created: new Date().toISOString(),
          clicks: 0,
          click_history: [],
          referrers: {},
        };
      }
    }
    return { links };
  } catch {
    return { links: {} };
  }
}

export function saveShortLinks(data: ShortLinksData) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function generateShortCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += BASE62[Math.floor(Math.random() * BASE62.length)];
  }
  return code;
}

export function trackClick(
  data: ShortLinksData,
  code: string,
  referrer?: string
): void {
  const entry = data.links[code];
  if (!entry) return;

  entry.clicks += 1;

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entry.click_history.find((h) => h.date === today);
  if (todayEntry) {
    todayEntry.count += 1;
  } else {
    entry.click_history.push({ date: today, count: 1 });
  }

  if (referrer) {
    // Normalize referrer: extract domain
    try {
      const domain = new URL(referrer).hostname;
      entry.referrers[domain] = (entry.referrers[domain] || 0) + 1;
    } catch {
      // Not a valid URL, store raw
      entry.referrers[referrer] = (entry.referrers[referrer] || 0) + 1;
    }
  }
}
