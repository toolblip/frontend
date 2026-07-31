# SEO Pipeline Run — 2026-07-31

## Summary

- **Articles Generated:** 1
- **Articles Committed:** 1
- **Articles Submitted to GSC:** 1/1
- **GSC Errors:** none
- **Mode:** Conservative (1 topic, Google-safe)
- **Window:** Forced daytime rerun (`FORCE_SEO_PIPELINE=1`); outside normal 17:00–23:59 UTC overnight window

## Preflight

- Claude Code: logged in (claude.ai, Max, harun.b13@gmail.com)
- GitHub CLI: logged in (HarunRRayhan)
- Branch: main
- Queue before: pending 23 / in_progress 0 / done 83

## Topic decisions

1. **Skipped (tool + blog overlap):** `Generate secure random tokens and API keys with Random String Generator`
   - Live tool: https://toolblip.com/tools/random-string-generator
   - Existing post: `/blog/random-string-generation-javascript` (2026-04-17)
   - Moved to done without publishing a near-duplicate

2. **Published:** `Convert RGBA colors with transparency to HEX for CSS`
   - Keyword: `rgba to hex with alpha`
   - URL: https://toolblip.com/blog/2026-07-31-rgba-to-hex-with-alpha
   - GSC submitted: yes (2026-07-31T04:07:48Z)
   - Tool link: https://toolblip.com/tools/rgba-to-hex

## Queue State After

- Pending: 21
- In progress: 0
- Done: 85

## Deploy / live verification

- Article pushed to `origin/main` (commit for content + finalization)
- Railway frontend last auto-deploy was older than this push; manual `railway up` used for frontend
- Live URL target: https://toolblip.com/blog/2026-07-31-rgba-to-hex-with-alpha
- Sitemap: https://toolblip.com/sitemap.xml

## Blockers

- None for generation/auth
- Note: first attempt timed out under a short outer shell limit; rerun with long timeout succeeded

## Next Run

Tonight 11PM Dhaka (17:00 UTC) — process at most 1 strong pending topic
