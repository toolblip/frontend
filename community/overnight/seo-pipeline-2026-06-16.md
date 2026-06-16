# Toolblip SEO pipeline archive — 2026-06-16

Run time: 2026-06-16 23:00 Dhaka
Mode: conservative, Google-safe pacing
Worktree: `/Users/ray/Work/toolblip-clean` on `main`

## Summary

Articles Generated: 0
Articles Committed: 0
Articles Submitted to GSC: 0/0
GSC Errors: none found in helper output
Next Run: 2026-06-17 23:00 Dhaka

No content was published. The production `main` queue has no pending topics, and all seed topics are already represented in the queue history. Per conservative pacing, I did not invent a topic, promote feature-branch queue items, perform broad stale-date refreshes, or rewrite titles/meta without GSC evidence.

## What ran

- Preflight checked canonical checkout, clean main worktree, queue counts, Claude auth, GitHub auth, and push dry-run.
- Ran `/Users/ray/Work/toolblip/scripts/seo-pipeline.sh` via the clean main worktree with one-topic pacing and pinned queue/seed paths.
- First attempt with a temporary HOME failed because the script expects `$HOME/Work/toolblip`; rerun used a temporary HOME with `/tmp/toolblip-seo-home/Work/toolblip` symlinked to the clean worktree.
- Pipeline exit: `0`
- Pipeline result: `No topics in queue. Add topics to pseo-queue.json to run.`

## Queue and seed state

- `pseo-queue.json` pending: 0
- `pseo-queue.json` in_progress: 0
- `pseo-queue.json` done: 23
- `scripts/seo-topic-seeds.json` seeds: 20
- Represented seeds: 20
- Missing seed topics: 0

## GSC and sitemap diagnostics

- Live sitemap: `https://toolblip.com/sitemap.xml`
- Sitemap HTTP status: 200
- Sitemap URL count: 1666
- GSC sitemap warnings: 0
- GSC sitemap errors: 0
- Homepage URL inspection: PASS, Submitted and indexed

## Auth and publishability

- Project Claude auth status reports logged in under `/Users/ray/Work/toolblip/.claude-home`.
- One-shot Claude generation probe returned `401 Invalid authentication credentials`.
- Because no topic was selected, this did not block tonight's no-publish run. It is a future generation blocker if new topics are added.
- GitHub auth is present.
- `git push --dry-run origin HEAD:main` from clean main returned `Everything up-to-date` before this archive commit.

## Decisions needed

- Should new Toolblip SEO topics be promoted into production `main`, or should the production queue remain empty until GSC/keyword diagnostics identify a stronger gap?
- Claude auth needs attention before the next content-generating run: `claude auth status` is logged in, but `claude -p` returns `401 Invalid authentication credentials` in the project Claude home.
