# SEO Pipeline — 2026-06-18

**Date:** 2026-06-18
**Run Type:** Archive-only (no content generated)

## Articles Generated: 0

### Blocker: Claude Code non-interactive auth expired
- `claude auth status` reports `loggedIn: true` with `subscriptionType: max`
- Non-interactive probe (`claude -p`) returns `401 Invalid authentication credentials`
- Root cause: OAuth token in `.claude-home/.claude/.credentials.json` expired at `1780966893551` (~June 9, 2026)
- The running tmux daemon session (`toolblip-haruns-m4-air`) is authenticated via system HOME (macOS Keychain) and continues to work for interactive use, but the pipeline's `run-claude.py` uses `claude -p` non-interactive mode which requires a valid token file
- Same blocker as nights 2026-06-15, 2026-06-16, 2026-06-17 — recurring issue

### Queue State (production `main`)
- **Pending:** 6 topics
- **In progress:** 0
- **Done:** 13 completed articles

### Topic Audit
Pending topics audited against live tool pages:

| Topic | Tool Overlap | Action |
|---|---|---|
| online word count checker for blog posts | `/tools/word-counter` exists | Skip (tool overlap) |
| generate CSS gradient backgrounds | `/tools/css-gradient-generator` exists | Skip (tool overlap) |
| CSS box shadow generator for card/panel UI | No dedicated CSS box-shadow tool | Viable topic but blocked by auth |
| convert image formats online | `/tools/image-format-converter` exists | Skip (tool overlap) |
| MIME type lookup | `/tools/mime-types-reference` exists | Skip (tool overlap) |
| convert camelCase to snake_case | `/tools/case-converter` exists | Skip (tool overlap) |

Only 1 of 6 pending topics ("CSS box shadow generator") does not overlap an existing tool page. However, Claude auth is blocked.

### Site Health
- Sitemap: 200 (1,668 URLs)
- Blog index: 200
- Recent articles all return 200
- GSC permission: `siteOwner` on `sc-domain:toolblip.com`
- GSC 7-day data: very early stage (2 impressions total) — expected for new domain
- Sitemap submitted: 1,666 URLs in GSC

### Action Taken
- Diagnostics complete (GSC, sitemap, live URLs)
- Archive written

### Decisions Needed
1. **Claude Code auth:** Non-interactive token has been expired since ~June 9. Every night since has used manual fallback or archive-only. `claude auth login --console` (running in the existing tmux daemon session) can generate a fresh token. Harun should run this or authorize an automated refresh.
2. **Pending topics cleanup:** 5 of 6 pending topics overlap with existing tool pages and should be moved to `done[]` with `status: skipped_existing_tool_page`. The CSS box shadow topic is the only non-overlapping opportunity.
