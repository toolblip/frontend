# Toolblip SEO Pipeline Report — 2026-07-05

**Run:** 2026-07-05T17:00:00Z (11PM Dhaka)
**Pipeline:** seo-pipeline.sh (from isolated `main` worktree at `~/Work/toolblip-clean`)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | No new URLs to submit |
| Site Status | Previous state — no changes |

## Queue State

- `pending[]`: **empty** — all original seed topics exhausted
- `in_progress[]`: empty
- `done[]`: 29 entries

## Pre-flight Checks

| Check | Status |
|-------|--------|
| Claude Code `auth status` | `loggedIn: false` |
| Claude Code non-interactive probe | `401 — Not logged in. Please run /login` |
| `gh auth status` | ✅ Logged in as `HarunRRayhan` |
| Working branch | `main` (via isolated worktree) |
| Pipeline exit code | 0 |

## GSC Data

- No new blog post data to report
- Permission level: `siteOwner` on `sc-domain:toolblip.com`
- No impressions/clicks data for recent posts — still too early for title rewrites

## Site Health

- Canonical repo: `feat/free-trial-two-cta` branch (not `main`)
- Pipeline ran via `main` worktree at `~/Work/toolblip-clean` — passed branch check
- No stale content (>180 day threshold) — earliest post is ~55 days old

## Decisions / Blockers

- **Seed exhaustion:** All 29 original seed topics published. No new `pending[]` topics. Needs Harun to approve a new topic direction or seed refresh.
- **Claude Code auth still broken** (confirmed again): `claude auth status` returns `loggedIn: false`, non-interactive probe returns `401`. This is a recurring blocker. Does not block this run (no content to generate anyway), but will need fixing before any new content generation can resume.

## Next Run

- Next scheduled: 2026-07-06T17:00:00Z (11PM Dhaka)
- Will repeat archive-only pattern unless new topics are seeded or Claude Code auth is restored
