# Toolblip SEO pipeline - 2026-05-27

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1
GSC Errors: none
Next Run: 2026-05-28 23:00 Dhaka

## Run summary

- Ran `/Users/ray/Work/toolblip/scripts/seo-pipeline.sh` from an isolated `main` worktree because the canonical checkout is on `fix/pricing-badge-dark-mode` with user changes.
- Conservative pacing enforced: one topic only. Broad stale-content date refresh was skipped because there was no GSC evidence pointing to a specific underperforming page.
- Selected topic: `generate UUIDs online for test data and API fixtures`.
- Selected keyword: `uuid generator for api testing`.
- Generated and published: `https://toolblip.com/blog/2026-05-27-uuid-generator-for-api-testing`.
- Humanizer cleanup ran. A post-generation audit removed Claude edit-note text before the final fix commit.
- Internal links were kept natural. The post links to the UUID Generator, Base64 tool, Regex Tester, and JSON Formatter where useful.
- Queue state updated: topic moved from `pending` to `done`; GSC queue marked submitted.

## GSC and indexing

- URL inspection/submission helper returned `status: submitted`.
- Coverage state is `URL is unknown to Google`, which is expected immediately after publishing a new URL.
- Sitemap refresh returned `status: ok` for `https://toolblip.com/sitemap.xml`.
- Final GSC diagnose returned `fix_needed: false` and no issues.

## Quality / spam-safety notes

- Only one article shipped tonight.
- No duplicate/near-duplicate UUID article was found in the current blog set during the pipeline run.
- No title/meta micro-edits were applied to existing pages because there was not enough GSC evidence.
- No second post was attempted.

## Verification

- Local `npm run build` passed after installing dependencies in the temporary worktree.
- Railway fresh deploy triggered for commit `1e0c090b`; deployment `8466f078-d305-4bb8-b95f-089657971aea` reached `SUCCESS`.
- Live URL verified HTTP 200: `https://toolblip.com/blog/2026-05-27-uuid-generator-for-api-testing`.
- Live sitemap contains the new slug.
- Live HTML title contains `UUID Generator for API Testing: Fake IDs Fast`.
- Live `article:published_time` is `2026-05-27T00:00:00.000Z` and does not contain `[object Object]`.
- Local and live audits found no Claude edit notes, no humanizer edit notes, and no em dashes.
