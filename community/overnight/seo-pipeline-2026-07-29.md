# SEO Pipeline Archive — 2026-07-29

## Run Summary

**Run Time:** 10:02:35 — 10:07:32 Dhaka (UTC+6)
**Mode:** Conservative (1 topic per run, but pipeline picked 3 due to queue state)
**Status:** Partial — 1 article generated, 2 topics skipped due to timeout

## Topics Processed

### Topic 1: Turn JSON arrays into Markdown tables for technical docs
- **Status:** ✅ Generated, humanized, committed, pushed
- **URL:** https://toolblip.com/blog/2026-07-29-convert-json-to-markdown-table
- **Keyword:** convert json to markdown table
- **File:** src/content/blog/2026-07-29-convert-json-to-markdown-table.md
- **Commit:** 0ac452a8
- **GSC Submission:** Pending (pipeline timed out during STEP 5)

### Topic 2: Test JSONPath queries against API response data with JSON Path Tester
- **Status:** ⏭️ Skipped — already completed in previous run (2026-07-28)
- **URL:** https://toolblip.com/blog/2026-07-28-test-jsonpath-expressions-online
- **Note:** This topic was processed in an earlier run today

### Topic 3: Turn JSON arrays into Markdown tables for technical docs
- **Status:** ⏭️ Skipped — duplicate of Topic 1
- **Note:** Pipeline picked the same topic twice due to queue state

## Queue State

- **Pending:** 24 topics
- **In Progress:** 3 topics
- **Done:** 79 topics

## GSC Submission Status

- **Topic 1:** Pending — pipeline timed out during GSC submission step
- **Previous runs:** 2 articles submitted successfully (2026-07-28)

## Errors & Blockers

1. **Pipeline timeout:** Script timed out after 300 seconds while processing 3 topics. Only Topic 1 completed fully.
2. **Duplicate topic selection:** Pipeline selected the same topic twice in one run (topics 1 and 3 were identical).
3. **GSC submission incomplete:** Topic 1 GSC submission not completed due to timeout.
4. **Live site 500 error:** Blog posts from 2026-07-28 and 2026-07-29 return HTTP 500 on toolblip.com. Pre-existing issue — posts from 2026-07-27 and earlier return 200. Likely caused by the "generate all 167 placeholder tool components" commit (4e11b353). This is a deployment/build issue, not an SEO pipeline issue.

## Self-Improvement Notes

- 7-day performance for recent articles: 0 clicks, 0 impressions, CTR 0.0%, pos 999
- Strategy updated with learnings from this run

## Next Run

- **Recommended:** Process 1 topic at a time to avoid timeout
- **Queue priority:** Focus on high-intent topics with clear search demand
- **GSC submission:** Complete pending submission for Topic 1

## Archive Created

**Date:** 2026-07-29
**Pipeline Version:** seo-pipeline.sh
**Agent:** Hermes (cron job)
