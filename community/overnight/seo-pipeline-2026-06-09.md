# Toolblip SEO pipeline archive - 2026-06-09

Run time: 2026-06-09 23:04 Dhaka
Mode: conservative, Google-safe pacing

## Summary

Articles Generated: 0
Articles Committed: 0
Articles Submitted to GSC: 0/0
GSC Errors: none
Next Run: 2026-06-10 23:00 Dhaka

## What ran

- Preflight checked canonical checkout, clean main worktree, Claude Code auth, GitHub auth, and queue state.
- Canonical checkout is on `fix/pricing-badge-dark-mode` with existing user work, so the SEO run used `/Users/ray/Work/toolblip-clean` on `main`.
- Claude Code auth is healthy in the Toolblip project-isolated Claude home.
- GitHub auth is healthy for HTTPS pushes.
- Ran `/Users/ray/Work/toolblip/scripts/seo-pipeline.sh` equivalent from the clean main worktree with `FORCE_SEO_PIPELINE=1` and a one-topic cap.

## Conservative pacing decision

No article was published because `main` has no pending production SEO topics:

- `main` queue: pending 0, in_progress 0, done 23
- canonical feature checkout queue: pending 8, in_progress 0, done 15

Per conservative SEO rules, I did not promote topics from the feature checkout into the production `main` queue automatically. That avoids publishing from state that may belong to unfinished feature work and avoids forcing content when production state says there is no approved pending topic.

## GSC and sitemap diagnostics

- GSC sitemap status: ok
- Sitemap URL: `https://toolblip.com/sitemap.xml`
- Sitemap warnings: 0
- Sitemap errors: 0
- Submitted URLs in sitemap: 1596
- Live sitemap HTTP: 200
- Homepage URL inspection: PASS, Submitted and indexed, robots allowed, indexing allowed

## Decisions needed

- Should the 8 pending topics currently present only in `/Users/ray/Work/toolblip` on `fix/pricing-badge-dark-mode` be promoted to the production `main` SEO queue, or should they remain tied to that feature branch?

## Blockers

No auth, GSC, build, or deployment blocker. The only blocker to publishing tonight was queue-state ambiguity between the clean production `main` worktree and the feature checkout.
