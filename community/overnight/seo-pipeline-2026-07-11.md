# Toolblip SEO Pipeline Report — 2026-07-11

**Run:** 2026-07-11T17:00:00Z (11PM Dhaka)
**Pipeline:** seo-pipeline.sh (from isolated `main` worktree at `~/Work/toolblip-clean`)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | Refreshed successfully — 0 errors, 0 warnings |
| Site Status | Healthy — toolblip.com returns 200 |

## Queue State

- `pending[]`: **40 topics** available
- `in_progress[]`: 2 topics (from canonical repo — worktree unaffected)
- `done[]`: 31+ entries

## Pre-flight Checks

| Check | Status |
|-------|--------|
| Claude Code `auth status` | `loggedIn: false` — **Not logged in** |
| Claude Code non-interactive probe | `Not logged in · Please run /login` |
| `gh auth status` | ✅ Logged in as `HarunRRayhan` |
| Working branch (canonical) | `feat/free-trial-two-cta` |
| Pipeline ran from `main` worktree | ✅ `~/Work/toolblip-clean` on `main` |
| Pipeline result | Stuck at STEP 1 keyword research — `./claude.sh -p` hangs waiting for auth |

## Pipeline Execution Detail

The pipeline was invoked with `FORCE_SEO_PIPELINE=1` and argument `1` (conservative 1-topic mode) from the isolated `main` worktree at `~/Work/toolblip-clean`. It successfully:
- ✅ Bypassed window check (forced)
- ✅ Passed `check_git_branch()` (worktree is on `main`)
- ✅ Acquired lock
- ✅ Picked 1 topic from queue
- ❌ Hung at STEP 1 keyword research — `research_keywords_for_topic()` calls `claude_is_logged_in()` which invokes `./claude.sh -p "say ok"`. The daemon session exists but auth is expired, so this call blocks indefinitely.

## Stale Content Check

- **Cutoff:** 2026-01-12 (180 days ago)
- **Result:** No stale content found — all blog posts are newer than cutoff

## GSC Data

| Metric | Value |
|--------|-------|
| Permission level | `siteOwner` on `sc-domain:toolblip.com` |
| Sitemap | `https://toolblip.com/sitemap.xml` — 0 errors, 0 warnings |
| 7-day impressions | 1 (keyword difficulty tool) |
| 7-day clicks | 0 |
| Average position | 48.0 |

## Blockers

1. **Claude Code auth still broken** (night 2 of same blocker): `claude auth status` returns `loggedIn: false`, non-interactive probe returns "Not logged in". The daemon tmux session (`toolblip-haruns-m4-air`) exists but credentials have expired. All Claude-dependent pipeline steps (keyword research, content generation, humanization, title rewrites) cannot execute.

2. **Canonical repo on feature branch** (`feat/free-trial-two-cta`): Workaround exists via `~/Work/toolblip-clean` worktree on `main`, but auth blocker makes content generation moot regardless of branch.

## Site Health

- `https://toolblip.com/` — HTTP 200 ✅
- `https://toolblip.com/sitemap.xml` — HTTP 200 ✅ (1,674 URLs)

## Next Run

- Next scheduled: 2026-07-12T17:00:00Z (11PM Dhaka)
- Will repeat archive-only pattern unless Claude Code auth is restored

**Fix required:** Run `/login` interactively in a terminal session to restore Claude Code authentication, then restart the daemon with `./claude.sh rd` in the toolblip repo.
