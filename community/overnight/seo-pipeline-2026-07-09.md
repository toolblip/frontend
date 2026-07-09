# Toolblip SEO Pipeline Report — 2026-07-09

**Run:** 2026-07-09T17:06:00Z (23:06 Dhaka)
**Pipeline:** seo-pipeline.sh (from isolated `main` worktree at `/tmp/toolblip-seo-20260709`)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | Refreshed — no new URLs |
| Site Status | No changes — live on Railway |

## Queue State

- `pending[]`: **41 entries** — new seed topics added since last archive (was empty on July 5). First pending: "generate a robots.txt file for SEO".
- `in_progress[]`: 0 (topic returned to pending after generation failed)
- `done[]`: 35 entries

## Pre-flight Checks

| Check | Status |
|-------|--------|
| Claude Code `auth status` | `loggedIn: false` |
| Claude Code non-interactive probe | `Not logged in · Please run /login` |
| `gh auth status` | ✅ Logged in as `HarunRRayhan` |
| Git branch (worktree) | `main` ✅ |
| Pipeline step results | Keyword research ✅ → Generation ❌ (Claude auth) |
| `.env` availability | Worktree uses canonical `.env` copy for GSC auth |

## GSC Data

- Permission level: `siteOwner` on `sc-domain:toolblip.com` (verified — full read/write)
- GSC API: Working (keyword research and site list queries succeeded)
- No blog post has significant impression data yet — insufficient for title/meta rewrites

## Site Health

- Working copy: `feat/free-trial-two-cta` (not `main`)
- Pipeline ran via temporary `main` worktree at `/tmp/toolblip-seo-20260709` — passed branch check
- No stale content (>180 day threshold) — earliest post is ~54 days old
- `.env` required GSC_SERVICE_ACCOUNT — copied from canonical checkout to worktree
- No build or deploy triggered (no new content to publish)

## Decisions / Blockers

- **Claude Code auth still broken** (confirmed again): `claude auth status` returns `loggedIn: false`, `./claude.sh -p` returns "Not logged in · Please run /login". This is the same recurring blocker documented in previous nights (July 2-5). Content generation cannot proceed until auth is restored. All content pipeline steps that depend on Claude (generation, humanizer, title rewrites) are blocked.
- **New topics available:** 41 pending topics are in the queue — content generation is ready to resume as soon as Claude Code auth works.
- **No ANTHROPIC_API_KEY** found in `~/.openclaw/secrets/` or the environment. The pipeline has no alternate auth path.
- GSC API (keyword research, sitemap) works independently of Claude auth.

## Next Run

- Next scheduled: 2026-07-10T17:00:00Z (11PM Dhaka)
- Will repeat archive-only pattern unless Claude Code auth is restored
- Fix suggestion: run `claude auth login --console` or set `ANTHROPIC_API_KEY` in the cron environment
