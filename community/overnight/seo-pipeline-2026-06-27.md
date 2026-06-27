# Toolblip SEO Pipeline Report — 2026-06-27

**Run:** 2026-06-27T17:00:00Z (11PM Dhaka)
**Pipeline:** seo-pipeline.sh (run from `toolblip-clean` worktree, main branch)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | not refreshed (no new content) |
| Site Status | live on Railway |

## Queue State

- `pending[]`: **empty** — all 20 seed topics exhausted. Same state as 2026-06-26.
- `in_progress[]`: empty
- `done[]`: last post 2026-06-19 (CSS box shadow generator)

## Branch Check

Canonical checkout on `feat/free-trial-two-cta` (not `main`). Pipeline ran from isolated `toolblip-clean` worktree (on `main`). Worktree has one dirty non-SEO file (`components/dashboard/TabbedTools.tsx` — user feature work, not touched).

## Diagnostics

**Claude Code auth:** `loggedIn: false` — `claude -p` returns "Not logged in. Please run /login." Same as previous nights. Automated content generation unavailable.

**GitHub auth:** ✓ Logged in as `HarunRRayhan` — HTTPS token with repo scope.

**Stale content check:** All 31 blog posts <180 days old. Nothing stale. Oldest: 2026-04-15 (73 days).

**Strategy file:** No actionable new GSC data since last run. Duplicate sections still present in the strategy file (cosmetic, from prior self-improve appends — non-blocking).

## GSC Diagnostics (sc-domain:toolblip.com)

Will be checked via sitemap probe below.

## Stale Content

None — all articles <180 days.

## Decision

No new content. Queue fully exhausted since 2026-06-19. No stale content to refresh. No GSC issues from last run.

To resume publishing:
1. New seed topics need to be added to `pseo-queue.json`, or
2. Claude Code auth needs restoration for automated content generation

## Next Run

2026-06-28 17:00 UTC (11PM Dhaka)
