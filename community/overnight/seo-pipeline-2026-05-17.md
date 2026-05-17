# Toolblip SEO Pipeline Archive - 2026-05-17

Run time: 2026-05-17 23:00 Dhaka
Mode: conservative Google-safe pacing, 1 post maximum

## Summary

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1 via sitemap refresh queue
GSC Errors: none found in sitemap health check

## Diagnostics

- Canonical checkout was on `feat/analytics-bing-setup` with local changes, so the run used an isolated main worktree at `/tmp/toolblip-seo-main`.
- GSC sitemap health returned no warnings or errors for `https://toolblip.com/sitemap.xml`.
- Queue before manual fallback had 4 pending topics and 1 pending GSC URL.
- The pipeline selected: `compare text diffs online for code reviews`.

## Claude Code blocker and fallback

Claude Code auth is unavailable in the cron environment:

- `claude auth status`: `loggedIn: false`, `authMethod: none`
- `claude -p 'hello' --model sonnet --max-turns 1`: `Not logged in · Please run /login`

The pipeline completed, but Claude did not generate a file. Following the pipeline rule, I wrote the article manually instead of aborting.

## Published article

- Topic: compare text diffs online for code reviews
- URL: https://toolblip.com/blog/2026-05-17-compare-text-diffs-online-code-reviews
- File: `src/content/blog/2026-05-17-compare-text-diffs-online-code-reviews.md`
- Internal link added from: `src/content/blog/2026-05-09-best-free-online-developer-tools.md`

## Quality checks

- One article only, no batch publishing.
- 887 words.
- Target keyword used naturally, not stuffed.
- No em dashes.
- Build passed with `npm run build`.
- Content links to relevant Toolblip tools: Text Diff Checker, Code Diff, JSON Diff, and tools directory.

## Decisions needed

- Claude Code needs auth in the cron environment if Harun wants the scripted Opus generation path to work again. Manual fallback works, but it is slower and should stay conservative.
