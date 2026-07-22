# SEO Pipeline Run — 2026-07-22

**Run time:** 2026-07-22 10:02 UTC (16:02 Dhaka)
**Pipeline:** seo-pipeline.sh
**Mode:** Conservative (queue-driven)

## Summary

| Metric | Value |
|--------|-------|
| Articles Generated | 3 |
| Articles Committed | 3 |
| Articles Submitted to GSC | 3 |
| GSC Errors | none |
| Queue State | 3 pending, 0 in_progress, 73 done |
| Next Run | 2026-07-23 17:00 UTC (23:00 Dhaka) |

## Articles Generated

### 1. Generate Open Graph Meta Tags for Social Sharing
- **URL:** https://toolblip.com/blog/2026-07-22-generate-open-graph-meta-tags-for-social-sharing
- **Keyword:** generate Open Graph meta tags for social sharing
- **Word count:** 1,269
- **GSC submitted:** yes
- **Commit:** 13f529f0

### 2. Test SSL Certificate Expiration for Website Security
- **URL:** https://toolblip.com/blog/2026-07-22-test-ssl-certificate-expiration-for-website-security
- **Keyword:** test SSL certificate expiration for website security
- **Word count:** 1,272
- **GSC submitted:** yes
- **Commit:** 0cb7de73

### 3. Convert Unix Line Endings to Windows for File Compatibility
- **URL:** https://toolblip.com/blog/2026-07-22-convert-unix-line-endings-to-windows-for-file-compatibility
- **Keyword:** convert Unix line endings to Windows for file compatibility
- **Word count:** 1,384
- **GSC submitted:** yes
- **Commit:** a058cd2b

## Deployment Status

All 3 new URLs return HTTP 500. This is a **pre-existing issue** — not caused by tonight's run:
- Posts published before July 12 (e.g. July 8, June 19) return HTTP 200
- Posts published July 12 onwards all return HTTP 500
- The Cloudflare Pages deployment appears broken since ~July 10
- The homepage and tools pages work fine (200/307)

**Action needed:** Check Cloudflare Pages deployment logs or rebuild the site to restore blog post routing.

## Notes

- Pipeline picked 3 topics (default batch size). All completed successfully.
- Pipeline timed out after 600s during GSC check on topic 3, but all 3 articles were already committed, pushed, and GSC-submitted before the timeout.
- Queue state manually corrected: topic 3 moved from in_progress to done.
- No AI tells detected in generated articles (no em dashes, no chatbot phrases).
- Strategy file updated with self-improvement data.
