# SEO Pipeline Archive — 2026-07-27

## Run Summary
- **Pipeline:** Toolblip SEO nightly (conservative mode)
- **Started:** 2026-07-27 10:03 UTC
- **Completed:** 2026-07-27 10:13 UTC
- **Topics Picked:** 1
- **Articles Generated:** 1
- **Articles Committed:** 1
- **Articles Submitted to GSC:** 1/1

## Article Details
- **Topic:** Convert JSON API responses to TypeScript interfaces with JSON to TypeScript
- **Keyword:** convert json to typescript interface
- **File:** src/content/blog/2026-07-27-convert-json-to-typescript-interface.md
- **URL:** https://toolblip.com/blog/2026-07-27-convert-json-to-typescript-interface
- **Word Count:** ~1,500 words
- **GSC Submission:** Success (sitemap.submit)

## Pipeline Steps Completed
1. ✅ Keyword research — selected "convert json to typescript interface"
2. ✅ Content generation — Claude Code generated article via run-claude.py
3. ✅ Humanization — passed through humanizer skill
4. ✅ Commit & push — committed to main, pushed to origin
5. ✅ GSC submission — submitted via sitemap.submit()
6. ✅ GSC check & fix — no errors found
7. ✅ Internal linking — links added to existing posts
8. ✅ Self-improvement — strategy file updated
9. ✅ Sitemap refresh — sitemap refreshed
10. ✅ Stale content check — no stale content found

## Post-Pipeline Fix
- Fixed truncated tag "Convert-JSON-API-responses-to-" → "json-to-typescript"
- Committed fix: a95b1755

## Live URL Status
- **Main site (https://toolblip.com/):** 200 ✅
- **New article:** 500 ❌
- **Existing blog posts:** 500 ❌ (pre-existing issue)

## Issue: Blog Pages 500 Error
All blog posts return HTTP 500, including existing posts from April 2026. This is NOT caused by the new article — it's a pre-existing build/deployment issue with Cloudflare Pages. The main site works fine.

**Root cause:** Likely a Cloudflare Pages build failure or deployment configuration issue. The blog manifest generates correctly (114 posts), so the issue is in the Next.js build or Cloudflare Pages configuration.

**Action needed:** Investigate Cloudflare Pages deployment logs or Railway build logs to identify why blog pages fail to render.

## Queue State
- **Pending:** 29 (was 30, processed 1)
- **In Progress:** 0
- **Done:** 77 (was 76, added 1)

## GSC Queue Status
- **Pending:** 5 URLs awaiting submission
- **Submitted:** 28 URLs
- **Failed:** 0

## Next Run
- Queue healthy with 29 pending topics
- Blog 500 error needs investigation before next content push
