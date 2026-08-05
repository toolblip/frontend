# SEO Pipeline Archive — 2026-08-05

**Run Time:** 04:05 UTC (10:05 Dhaka)
**Mode:** Conservative (FORCE_SEO_PIPELINE=1, outside overnight window)
**Pipeline:** Toolblip nightly SEO

## Summary

- **Articles Generated:** 1 (committed from previous incomplete run)
- **Articles Committed:** 1
  - `src/content/blog/2026-08-04-resize-image-for-social-media-dimensions.md`
  - Topic: "Resize images to exact social media and Open Graph dimensions"
  - Status: Committed and pushed to main
- **Articles Submitted to GSC:** 0 (enqueued, pending deployment fix)
- **GSC Errors:** None (could not submit — deployment returning 500)
- **Queue Status:** 1 topic moved to done, 16 remaining pending

## Deployment Issue

**BLOCKER:** All blog posts from 2026-08-04 return HTTP 500 (Internal Server Error).
- Posts from before Aug 4 work fine (200)
- The new post is in the blog manifest and builds successfully locally
- The deployment is on Railway (not Cloudflare Pages)
- The Railway API token in .env works but I couldn't query the Railway GraphQL API (403 Forbidden)
- This appears to be a systemic Railway deployment issue, not specific to the new post

**Root cause unknown:** Could be a Railway build failure, a runtime error in the blog rendering component, or a stale deployment. Needs manual investigation via Railway dashboard.

## Actions Taken

1. Environment normalized (USER/LOGNAME/HOME)
2. Claude Code auth verified (Max subscription, loggedIn: true)
3. GitHub auth verified (HarunRRayhan)
4. Committed existing untracked blog post (resize-image)
5. Moved topic from pending to done in pseo-queue.json
6. Added URL to GSC queue (gsc-queue.json)
7. Pushed all changes to main
8. Verified local build succeeds
9. Discovered systemic 500 error on all Aug 4 blog posts

## Next Run

- Next cron: 17:00 UTC (23:00 Dhaka) — normal overnight window
- **Action needed:** Investigate Railway deployment failure for Aug 4 posts
- 16 topics remaining in queue
