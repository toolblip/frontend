# Toolblip SEO pipeline archive - 2026-06-17

Run time: 2026-06-17 04:17 UTC / 2026-06-17 10:17 Dhaka
Mode: conservative, Google-safe, one-topic cap
Worktree: /Users/ray/Work/toolblip-clean on main at origin/main

## Summary

Articles Generated: 0
Articles Committed: 0
Articles Submitted to GSC: 0/0
GSC Errors: none
Next Run: 2026-06-17 23:00 Dhaka

## What ran

- Started with production main queue/state from `pseo-queue.json`.
- Checked Claude Code auth in normalized system HOME: `loggedIn: true`.
- Checked one-shot Claude generation probe: returned `ok`.
- Checked GSC health with `python3 scripts/seo-content-generator.py`.
- Checked live sitemap at `https://toolblip.com/sitemap.xml`.
- Ran the pipeline end-to-end with conservative one-topic pacing:
  - `FORCE_SEO_PIPELINE=1 ... /Users/ray/Work/toolblip-clean/scripts/seo-pipeline.sh 1`

## Queue and seed state

- Production queue pending: 0
- Production queue in_progress: 0
- Production queue done: 23
- Seed topics: 20
- Seed topics already represented in queue/done: 20
- Missing seed topics: 0

Pipeline exit line:

```text
No topics in queue. Add topics to pseo-queue.json to run.
```

## GSC and sitemap diagnostics

GSC default check returned status ok:

- Sitemap: `https://toolblip.com/sitemap.xml`
- GSC sitemap warnings: 0
- GSC sitemap errors: 0
- Homepage URL inspection verdict: PASS
- Coverage state: Submitted and indexed

Live sitemap check:

- HTTP status: 200
- URLs in live sitemap: 1666
- Blog URLs in live sitemap: 96

## SEO decisions

No new article was published. This was intentional: production main has no pending topics and all seed topics are already represented. Publishing a new post would have required inventing or promoting a topic without queue/GSC evidence, which would violate the conservative pacing rule.

No stale-title, meta, or broad date-only refresh was made. There was no GSC evidence pointing to a specific page that needed a safe rewrite tonight.

## Blockers

None for tonight's no-publish run.
