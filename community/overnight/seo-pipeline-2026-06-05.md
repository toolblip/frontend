# Toolblip SEO Pipeline Archive - 2026-06-05

Run time: 2026-06-05 23:03-23:18 Dhaka
Mode: conservative Google-safe nightly run

## Summary

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1
GSC Errors: none; fresh URL inspection returned "URL is unknown to Google", which is expected immediately after publish
Stale Refreshes: 0; broad date-only stale refresh skipped because there was no page-specific GSC evidence

## Diagnostics and pacing

- Started from GSC/sitemap diagnostics and the queue state.
- Limited the script to one topic.
- Chosen topic: sort and deduplicate lists online for developers
- Selected keyword: remove duplicate lines online
- Published only one post. No second post was attempted.
- The run avoided mass publishing, duplicate variants, keyword stuffing, and broad stale micro-edits.

## Published URL

- https://toolblip.com/blog/2026-06-05-remove-duplicate-lines-online

## Fixes made during finalization

- Removed Humanizer/Claude meta text from the article body.
- Removed a trailing topic echo from the article body.
- Quoted ISO frontmatter date was verified correct.
- Replaced the truncated generated tag with natural tags.
- Added a direct contextual internal link to https://toolblip.com/tools/remove-duplicate-lines.
- Cleaned duplicated headings in src/content/seo-strategy.md.
- Skipped the pipeline's broad stale-content date refresh in the temporary worktree because no page-specific GSC evidence justified mass micro-edits.

## Verification

- npm run build: passed
- Railway deploy: SUCCESS, deployment 2d251eca-bf8b-4c70-a7e3-5fa04fa26bc7
- Live URL: HTTP 200
- Live title: Remove duplicate lines online for cleaner dev lists
- Live canonical URL: https://toolblip.com/blog/2026-06-05-remove-duplicate-lines-online
- Live sitemap: contains the new URL
- Live H1 count: 1
- Live metadata: article:published_time is 2026-06-05T00:00:00.000Z, no [object Object]
- Source/live artifact scan: no Claude/Humanizer meta text, no em dashes, no duplicate Markdown H1
- GSC sitemap refresh: passed during the pipeline
- GSC URL submission: submitted
- GSC diagnosis after live deploy: URL is unknown to Google, fix_needed false

## Next run

2026-06-06 23:00 Dhaka
