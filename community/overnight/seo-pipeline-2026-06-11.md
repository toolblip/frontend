# Toolblip SEO pipeline archive - 2026-06-11

Run time: 2026-06-11 23:06 Dhaka
Mode: conservative Google-safe nightly run

## Summary

Articles Generated: 0
Articles Committed: 0
Articles Submitted to GSC: 0/0
GSC Errors: diagnostics timed out in the local GSC helper; live sitemap probe returned HTTP 200 and 1,596 URLs
Next Run: 2026-06-12 23:00 Dhaka

## What ran

- Used the clean main worktree at `/Users/ray/Work/toolblip-clean` because the canonical checkout is on `fix/pricing-badge-dark-mode` with unrelated work in progress.
- Reset the clean worktree to `origin/main` at `1ecefe3b`.
- Ran `/Users/ray/Work/toolblip/scripts/seo-pipeline.sh` equivalent from the clean worktree through the symlinked cron-safe HOME.
- Enforced one-topic conservative pacing.
- Ran live sitemap probe after GSC helper timeout.

## Result

The production `main` queue has no pending topics:

- `pseo-queue.json`: pending 0, in_progress 0, done 23
- `gsc-queue.json`: pending 0, submitted 18, failed 0

The pipeline exited cleanly with:

```text
No topics in queue. Add topics to pseo-queue.json to run.
```

No content was generated or published. This is intentional: the canonical feature checkout has 8 pending topics, but the clean production `main` queue has none. I did not promote feature-branch queue topics into the production SEO queue automatically.

## Diagnostics

- Claude auth in Toolblip project HOME reports logged in as `harun.b13@gmail.com` with Claude Max.
- A direct `claude -p` probe returned `401 Invalid authentication credentials`; this did not block tonight because no topic was selected for generation.
- GitHub auth and `git push --dry-run` from the canonical checkout succeeded.
- GSC helper calls for sitemap refresh and coverage check timed out locally.
- Live sitemap check succeeded: `https://toolblip.com/sitemap.xml` returned HTTP 200 and contains blog URLs.

## Decisions needed

- Should the 8 pending topics currently present on the canonical feature checkout be promoted to `main`'s production SEO queue, or should production remain paused until topics are added on `main` deliberately?
- Should the Claude CLI 401 on `claude -p` be fixed now, even though `claude auth status` reports logged in, so future content runs do not hit a generation blocker?
