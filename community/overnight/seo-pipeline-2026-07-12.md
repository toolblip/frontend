# Toolblip SEO Pipeline — 2026-07-12

## Run Summary

- **Date:** 2026-07-12 (Sunday)
- **UTC Window:** 17:00–17:15 UTC (23:00–23:15 Dhaka)
- **Claude Auth:** FAILED — `claude auth status` returns `loggedIn: false`, `./claude.sh -p "say ok"` returns "Not logged in"
- **Canonical Branch:** `feat/free-trial-two-cta` (feature branch — not `main`)
- **Clean Main Worktree:** `/Users/ray/Work/toolblip-clean` (on `main`)

## Pipeline Result

**Articles Generated: 0**
**Articles Committed: 0**
**Articles Submitted to GSC: 0**

### Blocker: Claude Code auth unavailable

Both `claude auth status` and `./claude.sh -p "say ok"` confirmed Claude is not logged in. No `ANTHROPIC_API_KEY` set in environment. Generation cannot proceed until Claude auth is restored (requires interactive `/login` in a UI session).

### Fallback Action: Batch queue audit (tool-overlap sweep)

Since Claude auth is down and the pipeline cannot generate content, the conservative fallback was followed: batch audit all pending topics against live tool pages on `toolblip.com`.

**33 topics skipped** (covered by existing live tool pages):

| Topic | Matching Tool URL |
|---|---|
| convert Markdown to HTML online in the browser | /tools/markdown-editor |
| check HTTP response headers online for API debugging | /tools/http-headers-checker |
| test webhook payloads with a request bin tool | /tools/webhook-tester |
| convert Markdown tables to HTML table format | /tools/markdown-editor |
| encode and decode HTML special characters for React templates | /tools/html-encoder-decoder |
| generate random IPv4 and IPv6 addresses for network testing | /tools/random-ip-address |
| convert timestamps between timezones online for scheduling | /tools/unix-timestamp-converter-v2 |
| generate URL slugs from titles for clean permalinks | /tools/url-slug-generator |
| check if a string is valid Base64 encoding | /tools/base64-encoder-decoder |
| convert CSS px to rem for responsive typography | /tools/css-units-converter |
| generate a color palette from a single hex code | /tools/color-palette-extractor |
| check color contrast ratio for WCAG accessibility | /tools/color-contrast-checker |
| convert SVG to PNG online without losing quality | /tools/svg-to-png |
| compress PNG and JPG images for web performance | /tools/image-optimizer |
| validate JSON Schema against sample API data | /tools/json-schema-validator |
| generate placeholder JSON API responses for mock data | /tools/placeholder-image-generator |
| check DNS records for a domain online | /tools/dns-lookup-tool |
| validate email address format online for form validation | /tools/email-validator |
| generate strong API keys vs memorable passwords | /tools/password-generator |
| check word and character count for social media limits | /tools/word-counter |
| convert text to Title Case, camelCase, or kebab-case | /tools/case-converter |
| generate fake user data for testing applications | /tools/fake-data-generator |
| validate credit card numbers with Luhn algorithm | /tools/credit-card-validator |
| convert binary to hexadecimal and decimal online | /tools/base-converter |
| generate ASCII art banners from text for terminal headers | /tools/ascii-art-generator |
| check if a network port is open on a remote server | /tools/port-checker |
| convert CRON schedule syntax to plain English | /tools/cron-expression-generator |
| generate UUID v4 vs UUID v7 identifiers for databases | /tools/uuid-generator |
| validate JWT token signatures online in the browser | /tools/jwt-decoder-v5 |
| generate a robots.txt file for SEO | /tools/robots-txt-generator |
| generate a favicon from an image online | /tools/favicon-generator |
| convert YAML to JSON online for config files | /tools/yaml-to-json |
| convert Markdown to plain text for clean output | /tools/html-to-plain-text |

**8 topics remaining pending** (no clear tool overlap — good candidates for future content generation):

- generate Open Graph meta tags for social sharing
- generate a sitemap.xml for better search indexing
- generate a .gitignore file for any project type
- test SSL certificate expiration for website security
- convert Unix line endings to Windows for file compatibility
- generate a Content Security Policy header for web security
- convert Roman numerals to numbers and back
- generate a changelog from git commit messages

## Site Health

- **Homepage:** 200 OK
- **Blog index:** 308 (redirect) — normal
- **Sitemap:** 200 OK (1564 tool pages, 103 blog posts)
- **GSC:** Not checked (Claude auth is the blocker, GSC has separate auth)

## ?? Decisions Needed

1. **Claude Code auth recovery** — Claude Code needs to be logged in interactively (`/login` in a UI session). The daemon at `toolblip-haruns-m4-air` shows "Not logged in". Once auth is restored, the remaining 8 pending topics are ready for generation.

2. **Queue replenishment** — After this sweep, only 8 topics remain. Previous queue of 40 topics has been substantially resolved (33 skipped as tool overlap, many previously published). Consider seeding new developer-tool blog topics that map to specific developer problems not directly covered by existing tool pages.

3. **Queue exhaustion state** — The remaining 8 pending topics are good candidates for Claude-generated content once auth is restored. They represent genuine content gaps where no dedicated tool page exists.

## Next Run

2026-07-13 17:00 UTC (23:00 Dhaka) — will attempt pipeline again. If Claude auth is still unavailable, will run diagnostics-only mode with sitemap/GSC health check.
