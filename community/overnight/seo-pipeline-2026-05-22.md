# Toolblip SEO Pipeline Archive - 2026-05-22

Run time: 2026-05-22 23:00 Dhaka
Mode: conservative Google-safe nightly run

## Preflight
- Canonical checkout was dirty and on `feat/analytics-bing-setup`, so the run used an isolated main worktree.
- Claude Code probe failed: `Not logged in · Please run /login`. The script ran end-to-end with one topic and logged `WARNING: Claude did not produce a file`.
- GSC health check succeeded. Sitemap had 0 warnings and 0 errors. Homepage inspection returned `Submitted and indexed`.

## Queue and diagnostics
- Script-selected topic: `convert base64 text and files locally in the browser`.
- Conservative override: skipped Base64 because a matching article already exists at `/blog/2026-05-16-base64-decode-online-without-uploading`. Publishing another Base64 article tonight would be near-duplicate content.
- Manual fallback topic selected from queue: `convert Unix timestamps to readable dates online`. This is distinct from existing posts and maps to the live Unix timestamp converter tool.

## Articles Generated
1. `convert Unix timestamps to readable dates online`
   - URL: https://toolblip.com/blog/2026-05-22-convert-unix-timestamps-readable-dates-online
   - File: `src/content/blog/2026-05-22-convert-unix-timestamps-readable-dates-online.md`
   - Notes: 824 words, no em dashes, quoted ISO frontmatter date, developer-first debugging angle.

Articles Generated: 1
Articles Committed: pending
Articles Submitted to GSC: pending
GSC Errors: none in preflight
Next Run: 2026-05-23 23:00 Dhaka

## Blocker
Claude Code is still unavailable in the cron environment. Manual fallback was used to avoid a silent no-content run.
