# Toolblip SEO Pipeline Archive — 2026-08-12

**Run:** nightly conservative cron (manual trigger, 10:05 Dhaka / 04:05 UTC)
**Articles Generated: 0**
**Blockers:** Claude Code auth revoked (401), claude.sh `-p` path broken

## What was attempted

- Ran `scripts/seo-pipeline.sh 1` end-to-end from `/Users/ray/Work/toolblip` (canonical checkout, branch `main`).
- Script picked 1 topic: "Compress images for faster page loads without losing quality" → `in_progress`.
- STEP 1 keyword research: `claude_is_logged_in` probe failed → fell back to raw topic string as keyword.
- STEP 2 generation: `WARNING: Claude did not produce a file` (run-claude.py → `./claude.sh -p` fails).
- Topic returned to `pending[]` (no orphaned `in_progress`), sitemap refresh ran, stale-content check found nothing (cutoff 180d). Script exited 0.

## Blocker details

1. **Claude Code auth revoked.** `claude auth status` under global HOME reports `loggedIn: false`. The project-isolated home (`~/Work/toolblip/.claude-home`, the single source of truth per Toolblip AGENTS.md) reports `loggedIn: true` but the decisive one-shot probe fails:
   - `HOME=/Users/ray/Work/toolblip/.claude-home claude --print -p "hello" --model sonnet --max-turns 1` → `Failed to authenticate. API Error: 401 OAuth access token has been revoked.`
   - `claude --print -p "say ok"` (global HOME) → `Failed to authenticate: OAuth session expired and could not be refreshed`
   - tmux pane `toolblip-cc` shows "Remote Control disconnected — OAuth token unavailable — run /login".
   - **Fix needed (human):** run `/login` interactively (or restore a valid OAuth token) in the normal session. Browser automation cannot do Google/Claude OAuth.

2. **`claude.sh` no longer supports `-p`.** The working copy of `/Users/ray/Work/toolblip/claude.sh` was replaced (uncommitted user change) with an attach-only launcher that just does `exec tmux attach-session`. It contains no `-p`/stdin handling, so `./claude.sh -p "..."` → `open terminal failed: not a terminal` in cron. The pipeline's `run-claude.py`, `claude_is_logged_in()`, humanize, and meta-rewrite paths all rely on `./claude.sh -p`. The committed HEAD version is the daemon wrapper; the working copy differs. **Decision needed:** restore the daemon `-p` wrapper or update the pipeline to a cron-safe invocation.

## Batch topic audit (archive-only fallback)

Audited all 16 pending topics against the live sitemap (797 tool slugs, all matched tool URLs verified HTTP 200).

**Skipped to `done[]` as `skipped_existing_tool_page` (7) — single-intent topics already covered by a live tool page:**
- Compress images for faster page loads → https://toolblip.com/tools/image-compressor
- Crop images to any aspect ratio → https://toolblip.com/tools/crop
- Convert images to Base64 data URLs → https://toolblip.com/tools/image-to-base64
- View and strip EXIF metadata → https://toolblip.com/tools/exif-remover
- Flesch-Kincaid readability score → https://toolblip.com/tools/flesch-kincaid-calculator
- Catch grammar and spelling errors → https://toolblip.com/tools/grammar-checker
- Turn plain text into handwritten notes → https://toolblip.com/tools/text-to-handwriting

**Kept `pending[]` (9) — multi-step developer workflows with distinct intent not answered by a single tool page:**
- From CSV to production database (CSV→JSON→schema→TS types)
- Debug a broken API integration (JWT decode + header inspect + JSON diff)
- Set up a secure signup form (password gen + strength + Argon2 hash)
- Build an Open Graph image pipeline (resize + convert + preview)
- Migrate legacy YAML config to validated JSON (convert + validate + format)
- Prep a design handoff (color palette + contrast + CSS variables)
- Turn legacy XML API into modern JSON (XML→JSON + diff + TS types)
- Rotate a leaked credential safely (token gen + hash + JWT expiry check)
- Optimize a blog post before publishing (readability + keyword density + word count)

## Queue state after run

- `pending`: 9 (workflow topics, awaiting Claude auth restoration)
- `in_progress`: 0
- `done`: 97 (7 added this run as skipped_existing_tool_page)

## Site / sitemap health

- `https://toolblip.com/sitemap.xml` → HTTP 200, 927 URLs (pre-run fetch; pipeline sitemap refresh ran successfully).
- No stale content (>180 days) found.

## Decisions needed

1. Restore Claude Code auth (`/login` interactively) so the nightly pipeline can generate again.
2. Decide the fate of `claude.sh`: restore the daemon `-p` wrapper (committed HEAD) or update pipeline helpers to a cron-safe claude invocation.
3. Confirm the 9 remaining workflow topics are wanted as blog articles once auth is back (recommended: yes — they are the high-intent developer workflow category; 1 per night).