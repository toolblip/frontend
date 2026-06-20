# Toolblip SEO Pipeline — 2026-06-20

**Run Time:** 2026-06-20 17:00 UTC (23:00 Dhaka)

## Status

- Claude Code auth: `loggedIn: true` (project-isolated HOME), but `claude -p` returns `401 Invalid authentication credentials` — known token expiry, same root cause as previous nights (expired June 9). Non-interactive generation is unavailable.
- GitHub auth: ✅ Healthy (`gh auth status` OK, `git push --dry-run` passes from clean main worktree)
- GSC auth: ✅ Healthy (`siteOwner` on `sc-domain:toolblip.com`)

## Queue State

- **pending[]**: Empty (all exhausted)
- **in_progress[]**: Empty
- **done[]**: All 7 pending topics from the canonical checkout were already processed by previous nights' runs (published or skipped-as-tool-overlap) on `origin/main`. No new topics to process.

## Articles Generated: 0

Queue is fully exhausted on production `main`. All 7 developer-tool topics have been either published as blog posts or skipped (conservative tool-overlap override). No strong new topic gaps were available that would meet the quality bar without Claude Code generation.

## GSC Diagnostics

| Metric | Value |
|--------|-------|
| Sitemap HTTP status | 200 |
| Sitemap URLs | 1669 |
| GSC sitemap errors | 0 |
| GSC sitemap submitted | 1669 |
| 7-day impressions | 3 |
| 7-day clicks | 0 |
| 7-day top CTR | 0% |

No GSC errors or warnings requiring action.

## Decisions Needed

1. **Queue replenishment.** The Toolblip blog SEO queue on `main` is fully exhausted. Should new developer-tool blog topics be added to `pseo-queue.json`? Options:
   - Replenish from keyword research (high-impression, low-CTR tool pages identified via GSC)
   - Pull from the canonical feature checkout's queue file if it has different content
   - Focus energy on fixing Claude Code auth so non-interactive generation works again
2. **Claude Code token.** The `claude -p` token has been expired since June 9. `claude auth login --console` is needed to refresh the non-interactive credential. Without this, all content generation requires manual fallback writing.

## Next Run

2026-06-21 17:00 UTC (23:00 Dhaka)
