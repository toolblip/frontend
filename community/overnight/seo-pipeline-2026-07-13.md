# Toolblip SEO Pipeline Archive — 2026-07-13

**Pipeline Status:** Run completed — archive only, no content generated

## Run Metadata

| Field | Value |
|---|---|
| Pipeline script | `scripts/seo-pipeline.sh` (worktree at origin/main, branch `seo-run-0713`) |
| Mode | Conservative (1 topic) |
| Claude Code auth | ❌ Not logged in (persistent — same blocker as 2026-07-12) |
| GitHub auth | ✅ Logged in as `HarunRRayhan` |
| GSC API | ✅ Working (system Python 3.9, google-auth installed) |

## What happened

1. **Pipeline invoked** via `bash scripts/seo-pipeline.sh 1` with FORCE_SEO_PIPELINE=1
2. **Branch check** passed using isolated worktree branch `seo-run-0713`
3. **Topic picked:** "convert Unix line endings to Windows for file compatibility"
4. **Keyword research** completed successfully via GSC (50 keywords extracted, long-tail selected)
5. **Content generation** failed — Claude Code is not logged in. `run-claude.py` -> `./claude.sh -p` returned "Not logged in · Please run /login"
6. **Topic returned to pending** queue gracefully
7. **Sitemap refreshed** via GSC API (`GET https://toolblip.com/sitemap.xml` — status: ok)
8. **Stale content check** — none found (>180 days)

## Blockers

### Claude Code auth (persistent — day 2)

- `claude auth status` → `loggedIn: false`
- `./claude.sh -p "say ok"` → "Not logged in · Please run /login"
- `ANTHROPIC_API_KEY` env var is set but empty (length 0)
- `~/.claude/.credentials.json` exists, daemon tmux session `toolblip-haruns-m4-air` running but unauthenticated

**Needs interactive `/login` in a UI session** to restore.

### GSC Python fix applied (worktree only)

Root cause discovered: the pipeline script sets `PATH="$HOME/.local/bin:/opt/homebrew/bin:$PATH"` which resolves `python3` to Homebrew's Python 3.14 (no google-auth) instead of macOS system Python 3.9 (has google-auth). Fixed in worktree copy by using `/usr/bin/python3` for all `seo-content-generator.py` calls. This fix should be applied to the canonical `scripts/seo-pipeline.sh` permanently.

## Queue Status (worktree copy — `origin/main` state)

- **Pending:** 4 topics (after pushing back the attempted topic)
- **In Progress:** 4 orphaned topics from previous failed runs (need cleanup)
- **Done:** 68 topics (including ~33 skipped_existing_tool_page from 2026-07-12 audit)
- **Remaining publishable topics:** 4 (CSP header, Roman numerals, changelog, line endings)

## Next Run

2026-07-14 17:00 UTC (23:00 Dhaka) — will attempt again. If Claude auth remains down, runs GSC diagnostics only.
