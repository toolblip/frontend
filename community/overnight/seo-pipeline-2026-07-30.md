# SEO Pipeline Run — 2026-07-30

## Summary

- **Articles Generated:** 2
- **Articles Committed:** 2
- **Articles Submitted to GSC:** 2/2
- **GSC Errors:** none
- **Pipeline Duration:** ~9 minutes (timed out on topic 3 keyword research)
- **Mode:** Conservative (2 topics processed, 1 left due to timeout)

## Articles Published

1. **Generate a JSON Schema automatically from sample API data**
   - URL: https://toolblip.com/blog/2026-07-30-generate-json-schema-from-data
   - Keyword: generate json schema from data
   - GSC submitted: yes
   - Live status: 500 (pre-existing Railway deployment issue)

2. **Generate secure Argon2 password hashes for modern authentication**
   - URL: https://toolblip.com/blog/2026-07-30-generate-argon2-password-hash
   - Keyword: generate argon2 password hash
   - GSC submitted: yes
   - Live status: 500 (pre-existing Railway deployment issue)

## Queue State

- Pending: 23
- In progress: 0
- Done: 83
- Topic 3 (Generate secure random tokens and API keys) pushed back to pending due to timeout

## Blockers

- **Railway deployment 500 error:** Recent blog posts (2026-07-28+) return HTTP 500. Older posts (2026-07-24) return 200. This is a pre-existing issue, not caused by tonight's run. Likely a Next.js build or Railway deployment configuration problem. Needs investigation.
- **Pipeline timeout:** Topic 3 timed out during keyword research at 600s. Topic pushed back to pending for next run.

## Auth Status

- Claude Code: logged in (claude.ai, Max subscription)
- GitHub CLI: logged in (HarunRRayhan)
- GSC: submitted successfully via service account

## Next Run

Tomorrow at 11PM Dhaka (17:00 UTC)
