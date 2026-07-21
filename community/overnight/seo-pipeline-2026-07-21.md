# Toolblip SEO Pipeline — 2026-07-21

## Run Summary

- **Pipeline:** Toolblip SEO nightly (conservative, 1-topic mode)
- **Run time:** 2026-07-21 04:13 UTC (2026-07-21 10:13 Dhaka)
- **Scheduled:** Manual trigger (cron-like invocation via Hermes)
- **Exit code:** 0 (script completed normally)

## Articles Generated: 1

### Article 1: "Generate a Sitemap.xml for Better Search Indexing"

- **URL:** https://toolblip.com/blog/2026-07-21-generate-a-sitemap-xml-for-better-search-indexing
- **File:** `src/content/blog/2026-07-21-generate-a-sitemap-xml-for-better-search-indexing.md`
- **Topic from queue:** "generate a sitemap.xml for better search indexing"
- **Target keyword:** "generate a sitemap.xml for better search indexing" (topic name used as fallback keyword)
- **Content:** 182 lines, ~900 words — guide covering sitemap format, validation, robots.txt interaction, GSC submission, build-time generation at scale
- **Links to tools:** XML Sitemap Generator, robots.txt checker, sitemap XML validator, XML formatter

## Steps Completed

| Step | Status | Notes |
|------|--------|-------|
| 1. Keyword research | ✅ | topic name used as keyword |
| 2. Content generation | ✅ | Claude Code via claude.sh, opus model |
| 3. Humanize | ✅ | claude.sh via sonnet, strip AI tells |
| 4. Commit & push | ✅ | `de471a97 seo: add generate a sitemap.xml for better search indexing article 2026-07-21` |
| 5. GSC submission | ✅ | submitted via GSC API |
| 6. GSC check & fix | ✅ | no issues detected |
| 7. Internal linking | ✅ | links added |
| 8. Self-improvement | ✅ | strategy updated (0 clicks/impressions — expected for fresh post) |
| 9. Sitemap refresh | ✅ | sitemap refreshed |
| 10. Stale content | ✅ | none found (>180 days) |

## Post-Pipeline Fixes

- **Date format patched:** `date: 2026-07-21T00:00:00.000Z` → `date: "2026-07-21T00:00:00.000Z"` (quoted to prevent gray-matter Date object parsing and `[object Object]` in OG metadata)

## Auth Status

- **Claude Code:** ✅ logged in (Max subscription, email: harun.b13@gmail.com)
- **GitHub CLI:** ✅ logged in (account: HarunRRayhan, token scopes: gist, read:org, repo, workflow)

## Queue State

- **Remaining pending:** 6 topics
  1. generate Open Graph meta tags for social sharing
  2. test SSL certificate expiration for website security
  3. convert Unix line endings to Windows for file compatibility
  4. generate a Content Security Policy header for web security
  5. convert Roman numerals to numbers and back
  6. generate a changelog from git commit messages
- **In Progress:** 0
- **Done:** 69 (including this run)

## Environment

- **Branch:** main (clean worktree)
- **Time window:** 04:13 UTC — within overnight window (< 06:00 UTC)
- **Lock:** cleared on exit

## Archive

This file: `community/overnight/seo-pipeline-2026-07-21.md`
