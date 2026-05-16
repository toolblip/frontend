# Toolblip SEO Pipeline Archive - 2026-05-16

Run time: 2026-05-16 23:00 Dhaka

## Summary

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1
GSC Errors: none requiring a fix

## Conservative pacing decision

Only one post was published tonight. The pipeline was constrained to one topic to avoid mass publishing or near-duplicate content. The selected topic was the first queued privacy-oriented opportunity: `convert base64 text and files locally in the browser`.

No second article was generated. The remaining queue items should wait for future nights unless GSC data shows a stronger reason to move faster.

## Article published

- Title: Base64 Decode Online Without Uploading Your Data
- URL: https://toolblip.com/blog/2026-05-16-base64-decode-online-without-uploading
- Commit: 39eeea8d80ce46ff458c3e47f2bfd05cddd15f4d
- GSC queue commit: 44bb015254179feaa53132f2b6d1e79f6fafea51

## What was checked

- GSC/sitemap health: sitemap submission returned ok
- Existing content: no stale content older than 180 days was found by the pipeline
- Duplicate risk: Base64 topic was distinct from the existing JSON privacy post and cron post
- Build: `npm run build` passed locally in the isolated main worktree
- Deployment: Railway deployment `668118ff-2e31-46c7-b4de-828a200989d6` reached SUCCESS
- Live URL: returned HTTP 200
- Sitemap: live sitemap contains the new article URL
- Canonical/live HTML: new article title and canonical URL are present

## Blockers and workarounds

1. The active local checkout at `/Users/ray/Work/toolblip` was on `feat/analytics-bing-setup`, so the pipeline refused to run there. To avoid disturbing that branch, the run used an isolated clean main worktree at `/tmp/toolblip-seo-main`.
2. Claude Code was not authenticated in the cron environment: `claude -p 'hello'` returned `Not logged in · Please run /login`. The automated content generation step therefore produced no file.
3. Because Claude was unavailable, the article was written manually using the conservative SEO rules and humanizer pass criteria: natural developer-first prose, no keyword stuffing, no duplicate/spun variant, and practical verification steps.

## GSC status

- URL submission/inspection returned `submitted`
- Coverage state at submission time: `URL is unknown to Google`
- Post-deploy diagnose reported `fix_needed: false`
- Sitemap refresh returned `status: ok`

## Next run

Next scheduled run: 2026-05-17 23:00 Dhaka

## Decisions needed

- Claude Code auth is currently the main operational blocker for the automated generator. Please either log Claude Code in for cron (`claude auth login --console`) or provide an `ANTHROPIC_API_KEY` to the cron environment if you want the pipeline to generate posts without manual fallback.
- The local Toolblip checkout is not on `main`. If the nightly job is expected to run from `/Users/ray/Work/toolblip`, the working copy needs to be on `main` or the cron should run from a dedicated clean main checkout.
