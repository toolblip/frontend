# SEO Pipeline Archive — 2026-07-28

## Run Summary
- **Run time:** 10:03–10:12 UTC (16:03–16:12 Dhaka)
- **Mode:** Conservative (script picked 3 topics, completed 2 before timeout)
- **Topics picked:** 3
- **Articles generated:** 2
- **Articles committed:** 2
- **Articles pushed:** 2

## Articles Generated
1. **Compare two JSON files online with JSON Diff**
   - Keyword: "compare two json files online"
   - URL: https://toolblip.com/blog/compare-two-json-files-online
   - File: src/content/blog/2026-07-28-compare-two-json-files-online.md
   - Commit: 874d7399
   - GSC: submitted

2. **Test JSONPath queries against API response data**
   - Keyword: "test jsonpath expressions online"
   - URL: https://toolblip.com/blog/test-jsonpath-expressions-online
   - File: src/content/blog/2026-07-28-test-jsonpath-expressions-online.md
   - Commit: c0b9baa1
   - GSC: submitted

## Topic Not Completed
- **Turn JSON arrays into Markdown tables for technical docs** — stuck in keyword research when pipeline timed out (600s). Moved back to pending queue.

## Queue State
- Pending: 27
- In progress: 0
- Done: 79

## Issues
- **Slug fix required:** Pipeline generated slugs with date prefix (`2026-07-28-compare-two-json-files-online`). Fixed to clean slugs (`compare-two-json-files-online`). Commit: 8040955f.
- **500 errors on new URLs:** Both new blog posts return 500. This is NOT specific to new articles — some older posts (e.g., `debug-regex-capture-groups-multiple-matches`, `cron-expression-generator-online`) also return 500. Pre-existing Cloudflare Pages deployment issue.
- **Sitemap not updated:** New URLs not yet in sitemap.xml. Will appear after next Cloudflare Pages redeploy.

## Auth Status
- Claude Code: authenticated (harun.b13@gmail.com)
- GitHub: authenticated (HarunRRayhan)
- Git branch: main

## Next Run
- Tomorrow at 17:00 UTC (23:00 Dhaka)
- Queue has 27 pending topics
