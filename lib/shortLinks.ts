import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "fs";
import path from "path";

// Short links are created at runtime (via /api/shorten) and need to survive
// deploys and restarts. The repo's own data/ directory lives on the
// container's ephemeral filesystem and gets wiped on every deploy, so in
// production this must point at a mounted persistent volume instead -
// SHORT_LINKS_DATA_DIR is set to that mount path on Railway. Falls back to
// the repo directory for local dev, where there's no volume and losing data
// across restarts doesn't matter.
const REPO_SEED_FILE = path.join(process.cwd(), "data", "short-links.json");
const DATA_DIR = process.env.SHORT_LINKS_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "short-links.json");
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

if (process.env.NODE_ENV === "production" && !process.env.SHORT_LINKS_DATA_DIR) {
  // Falling through to the repo path in production means every short link
  // created since the last deploy silently vanishes on the next one - the
  // exact bug this file exists to fix. Loud on purpose.
  console.warn(
    "[shortLinks] SHORT_LINKS_DATA_DIR is not set in production - short links will NOT survive the next deploy."
  );
}

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

function readDataFile(file: string): ShortLinksData | null {
  if (!existsSync(file)) return null;
  try {
    const raw = JSON.parse(readFileSync(file, "utf-8"));
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
    return null;
  }
}

export function loadShortLinks(): ShortLinksData {
  const data = readDataFile(DATA_FILE);
  if (data) return data;

  // DATA_FILE doesn't exist yet - typically a freshly-attached volume that's
  // never been written to. Seed it from the codes committed in the repo
  // (e.g. links generated before this file existed, or ones worth keeping
  // reachable regardless of volume state) so they aren't silently
  // unreachable until someone happens to hit /api/shorten again.
  const seed = DATA_FILE !== REPO_SEED_FILE ? readDataFile(REPO_SEED_FILE) : null;
  const data2 = seed ?? { links: {} };
  if (seed) saveShortLinks(data2);
  return data2;
}

export function saveShortLinks(data: ShortLinksData) {
  mkdirSync(DATA_DIR, { recursive: true });
  // Write-then-rename instead of writing DATA_FILE directly: a rename is
  // atomic, so a crash or an overlapping request mid-write can never leave
  // short-links.json half-written (which would corrupt the JSON and make
  // every short code 404 until the next successful write).
  const tmpFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmpFile, JSON.stringify(data, null, 2));
  renameSync(tmpFile, DATA_FILE);
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
