# Toolblip SEO pipeline archive - 2026-06-17

Run time: 2026-06-17 17:02 UTC / 2026-06-17 23:02 Dhaka
Mode: conservative, Google-safe, one-topic cap (manual fallback)
Worktree: /Users/ray/Work/toolblip-clean on main at 634826a1

## Summary

Articles Generated: 1
Articles Committed: 1
Articles Submitted to GSC: 1/1
GSC Errors: none
Next Run: 2026-06-18 23:00 Dhaka

## What ran

- Pre-flight: Claude Code auth = NOT logged in. Used manual fallback path.
- GitHub CLI: authenticated (logged in as HarunRRayhan)
- google-auth: OK
- Toolblip main worktree: clean, on main at latest origin/main

- Selected topic: "bcrypt hash generator online for secure password hashing in Node.js"
  Rationale: clearest developer search intent among 7 pending topics, security-focused,
  non-duplicative with existing tools (Toolblip has /tools/hash-generator), strong
  "how to" intent, can include practical code samples

- Wrote article manually (Claude Code unavailable):
  slug: 2026-06-17-bcrypt-hash-generator-online-for-password-hashing
  Covers: bcrypt algorithm explanation, cost factor comparison, common Node.js pitfalls,
  online generator workflow, verification commands
  950 words, developer-first voice, natural keyword usage

- Humanized: removed signposting ("The workflow looks like this:"), varied "rule of three"
  framing, trimmed generic summary, linked to correct /tools/hash-generator tool page

- Built: `npm ci` + `npm run build` → blog route in SSG output ✓
- Committed and pushed to main (634826a1)
- Deployed via Railway `serviceInstanceDeployV2` → SUCCESS
- Live URL verified: https://toolblip.com/blog/2026-06-17-bcrypt-hash-generator-online-for-password-hashing → 200
- Live HTML clean: no artifacts, no [object Object], title correct
- Sitemap verified: contains new URL
- GSC submitted: status "submitted" (URL unknown to Google — expected for new content)

## SEO decisions

- One article published from 7 pending topics. The bcrypt topic had the strongest
  developer search intent and is non-duplicative with existing Toolblip content.
- The remaining 6 topics stay in pending queue for future nights.
- No stale-content refresh ran (none due based on last run).
- No title/meta rewrites applied (no GSC evidence for any existing post yet).

## Blockers

Claude Code is still not logged in on this machine. The pipeline script would
have failed at Steps 1 (keyword research) and 2 (generation) because it relies
on `claude -p` internally. Manual fallback path used instead.

To fix Claude Code auth for future automated runs:
`claude auth login --console`
This opens a browser login. Since this machine has Claude Max subscription,
the login completes the OAuth flow and subsequent cron runs can use
`claude -p` non-interactively.
