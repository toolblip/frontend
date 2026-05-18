# Toolblip SEO Pipeline - 2026-05-18

Articles Generated: 1
Articles Committed: pending local verification
Articles Submitted to GSC: pending sitemap submit
GSC Errors: none checked yet

## Run summary
- Ran `/tmp/toolblip-seo-main/scripts/seo-pipeline.sh 1` from an isolated `main` worktree because the canonical checkout was on `feat/analytics-bing-setup` with local changes.
- Conservative pacing enforced: one topic only, no broad stale-content date refresh, no second article.
- Picked topic: `generate secure passwords in the browser`.
- Pipeline blocker: Claude Code is not authenticated in the cron environment. Probe returned `Not logged in · Please run /login`, and the script logged `WARNING: Claude did not produce a file`.
- Manual fallback used because the topic is specific, non-duplicative, and maps directly to an existing Toolblip tool.

## Published candidate
- URL: https://toolblip.com/blog/2026-05-18-generate-secure-passwords-in-the-browser
- File: `src/content/blog/2026-05-18-generate-secure-passwords-in-the-browser.md`
- Internal links: Password Generator, Base64 Encoder/Decoder, Text Diff Checker.

## Google-safe decisions
- Did not publish a second post.
- Did not do title/meta micro-edits without GSC evidence.
- Skipped broad stale refresh to avoid unnatural update velocity.

## Blocker
Claude Code auth is unavailable to cron. Fix by making `claude -p 'hello' --model sonnet --max-turns 1` work in the cron environment, likely via explicit `ANTHROPIC_API_KEY` or Claude login.

Next Run: 2026-05-19 23:00 Dhaka
