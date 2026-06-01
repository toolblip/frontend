# Toolblip SEO Pipeline Archive - 2026-06-01

Run time: 2026-06-01 23:03-23:12 Dhaka
Mode: conservative, Google-safe pacing

## Summary

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1
GSC Errors: none found during pipeline checks
Next Run: 2026-06-02 23:00 Dhaka

## Topic shipped

- Topic: escape and unescape HTML entities for frontend debugging
- Selected keyword: unescape html entities online
- URL: https://toolblip.com/blog/2026-06-01-unescape-html-entities-online
- Rationale: supports an existing developer tool with a narrow operator/debugging intent. Published one article only; no second topic attempted.

## Conservative pacing notes

- Ran from an isolated `main` worktree because the canonical checkout is on a feature branch with user work.
- Limited the pipeline to 1 topic.
- Reviewed generated content and removed humanizer/Claude meta artifacts before final commit.
- Quoted the frontmatter date to avoid Next metadata rendering `[object Object]`.
- Added a direct natural internal link to the canonical HTML entity encoder/decoder tool.
- No stale-content refresh was performed because there was no specific GSC evidence requiring a title/meta refresh.

## Verification

- `npm ci` completed successfully in the isolated worktree.
- `npm run build` passed on Next.js 16.2.4.
- Local article checks passed for AI meta artifacts, em dashes, and `[object Object]`-risk date formatting.
- GSC sitemap submission completed through the pipeline at 2026-06-01T17:07:29Z.

## Decisions needed

None.
