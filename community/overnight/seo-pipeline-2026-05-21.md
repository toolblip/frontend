# Toolblip SEO pipeline archive - 2026-05-21

Run time: 2026-05-21 23:00 Dhaka
Mode: conservative one-topic cron run from isolated main worktree

## Summary

Articles Generated: 1
Articles Committed: 0 pending build/verification at archive write time
Articles Submitted to GSC: 0/1 pending sitemap refresh at archive write time
GSC Errors: none from preflight sitemap check; new URL expected to be unknown immediately after publish

## Topic processed

- Topic: URL encode and decode strings for API testing
- URL: https://toolblip.com/blog/2026-05-21-url-encode-decode-strings-api-testing
- Source: pseo-queue.json first pending item
- Keyword: URL encode and decode strings for API testing
- Decision: strong enough for one manual fallback article because it maps directly to an existing Toolblip tool and a real API testing problem. No second post considered.

## What happened

- Ran scripts/seo-pipeline.sh with one topic from an isolated main worktree.
- Claude Code was unavailable in the cron environment: `Not logged in · Please run /login`.
- Pipeline exited 0 but logged `WARNING: Claude did not produce a file`.
- Manual fallback produced one developer-first article. No batch generation, no spun variants, no stale date-only refresh.

## Conservative SEO guardrails

- Published at most one article.
- Used one narrow search intent.
- Added only contextual internal links to the URL encode tool and JSON formatter.
- Did not rewrite old titles/meta because there was no fresh GSC evidence requiring it.

## Blocker

Claude Code auth is unavailable in this cron context. `claude -p 'hello' --model sonnet --max-turns 1` returned `Not logged in · Please run /login`.
