# Toolblip SEO Pipeline Report — 2026-07-10

**Run:** 2026-07-10T17:00:00Z (11PM Dhaka)
**Pipeline:** seo-pipeline.sh (from isolated `main` worktree at `/tmp/toolblip-cron-seo`)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | Refreshed successfully (1,674 URLs, 0 errors) |
| Site Status | Healthy — toolblip.com returns 200, deployed blog posts return 200 |

## Queue State

- `pending[]`: **42 topics** available (queue was refilled since last run — last archive noted exhaustion)
- `in_progress[]`: 7 topics were orphaned in the worktree queue during failed pipeline attempts — worktree was cleaned up; canonical feature branch queue unaffected
- `done[]`: 29+ entries

## Pre-flight Checks

| Check | Status |
|-------|--------|
| Claude Code `auth status` | `loggedIn: false` — **Not logged in** |
| Claude Code non-interactive probe | `Not logged in · Please run /login` |
| `gh auth status` | ✅ Logged in as `HarunRRayhan` |
| Working branch (canonical) | `feat/free-trial-two-cta` |
| Pipeline ran from `main` worktree | ✅ Created then cleaned |
| Pipeline exit code | Pipeline crashed at keyword research step (`set -e` + `bash 3.2` edge case despite `.env` being present) |

## GSC Data

- Permission level: `siteOwner` on `sc-domain:toolblip.com`
- Sitemap: `https://toolblip.com/sitemap.xml` — last submitted 2026-07-08T17:18Z, 0 errors, 0 warnings, 1,674 submitted URLs
- Homepage: "Submitted and indexed" (last crawl 2026-07-01)
- 7-day performance: 1 impression (on keyword difficulty tool), 0 clicks
- Site is very new — minimal search footprint expected

## Blockers

1. **Claude Code auth still broken** (confirmed again this run): `claude auth status` returns `loggedIn: false`, non-interactive probe returns "Not logged in". All Claude-dependent pipeline steps (keyword research, content generation, humanization, title rewrites) cannot execute.

2. **Canonical repo on feature branch** (`feat/free-trial-two-cta`): Pipeline uses `check_git_branch()` which requires `main`. Worktree approach works for isolation but the auth blocker makes it moot.

3. **Pipeline crash under `set -euo pipefail`**: On bash 3.2 (macOS), the `research_keywords_for_topic()` function's first `python3` command triggers a script exit. This happens even with `.env` present. The loop's failure recovery code never gets reached for orphaned `in_progress` items.

## Site Health

- `https://toolblip.com/` — HTTP 200 ✅
- `https://toolblip.com/sitemap.xml` — HTTP 200 ✅
- Deployed blog posts (pre-July 8) — HTTP 200 ✅
- Newer post `2026-07-08-convert-json-to-csv-for-spreadsheet-analysis` — HTTP 500 ⚠️ (only staged on feature branch, not deployed to main)

## Next Run

- Next scheduled: 2026-07-11T17:00:00Z (11PM Dhaka)
- Will repeat archive-only pattern unless Claude Code auth is restored
