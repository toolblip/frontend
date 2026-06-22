# Toolblip SEO Pipeline Report — 2026-06-21

**Run:** 2026-06-21T17:00:00Z (11PM Dhaka)
**Pipeline:** seo-pipeline.sh (archive-only — Claude Code auth unavailable)
**Author:** Hermes Agent (scheduled cron)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 0 |
| Articles Committed | 0 |
| Articles Submitted to GSC | 0 |
| Sitemap Status | healthy (200, 1669 URLs, 0 errors) |
| Site Status | 200 OK |

## Queue State (production main)

- `pending[]`: empty — queue exhausted
- `in_progress[]`: empty
- `done[]`: last post 2026-06-19 (CSS box shadow generator)

## Diagnostics

**Claude Code auth:** `loggedIn: false` — CLI not authenticated. Non-interactive probe (`claude -p`) returned "Not logged in". Manual fallback attempted but no strong topic available for a standalone article without supporting tool page.

**Batch audit of leftover topics on feature-branch queue:** All 7 pending topics from the canonical checkout (`fix/dashboard-plan-404` branch) have already been processed on `main` in prior runs (either published as blog posts or skipped with `skipped_existing_tool_page` status). The production queue is fully exhausted.

**GSC diagnostics (sc-domain:toolblip.com):**
- Permission: `siteOwner`
- Sitemap: `sitemap.xml` — last submitted 2026-06-19, 0 errors
- 7-day search analytics: negligible data (3 queries, 0 clicks, ~1 impression each) — expected for a new/low-traffic domain

**Live site checks:**
- Site root: 200 ✅
- Sitemap: 200 (1669 URLs) ✅
- Last published post: 200 ✅

## Decisions Needed

1. **Queue replenishment:** Production `main` queue is exhausted (all 9 original topics processed). Should new topics be seeded into `pseo-queue.json`? Options:
   - Add more tool-type blog post topics
   - Switch to a different content strategy (tutorials, comparisons, how-to guides)
   - Consider SEO content for Crontinel (the `ct` profile pipeline) instead of more toolblip blog posts
2. **Claude Code auth:** `claude -p` is not logged in. If the pipeline needs automated content generation in future nights, Claude Code auth needs to be restored on this machine.

## Next Run

2026-06-22T17:00:00Z (11PM Dhaka)
