# SEO Pipeline Run 2026-05-13

Date: 2026-05-13
Run time: 17:00 UTC (23:00 Dhaka)

## GSC Diagnostics (30-day)

- Total clicks: 1
- Total impressions: 106
- Top query: "poll maker" (C:1, I:7, pos:51.3)
- 77 query rows total
- Domain at very early stage, no statistically significant data

## Topic Selected

**"test regular expressions online with sample text"** (pseo-queue pending #1)

Selected because:
- Distinct angle from existing "Debug Regex Capture Groups" article (testing vs debugging)
- Maps to regex-tester tool on toolblip.com
- No GSC data to override judgment (1 click across 30 days is noise)
- Conservative: 1 article per night

## Article Generated

**File:** `src/content/blog/2026-05-13-how-to-test-regular-expressions-online-with-sample-text.md`
**Slug:** `2026-05-13-how-to-test-regular-expressions-online-with-sample-text`
**URL:** `https://toolblip.com/blog/2026-05-13-how-to-test-regular-expressions-online-with-sample-text`
**Word count:** ~720 words

Sections:
- Why use an online regex tester
- What to look for (live highlighting, dialect support, real-time feedback, no server upload)
- Testing step by step
- Common mistakes (dot-not-matching-newlines, greedy quantifiers, missing anchors, dialect issues)
- When to use the command line instead
- Toolblip CTA with regex-tester link

Humanized: removed bold headers, em-dash constructions, "baseline" filler, AI-signature phrases.

## GSC Submission

**Status:** BLOCKED
- GSC has siteOwner role on sc-domain:toolblip.com but OAuth scopes are read-only
- `sitemaps().submit()` returns 403 Insufficient Permission
- `urlInspection().index()` returns 403 (tried 2026-05-12)
- Cloudflare Pages auto-rebuild is the only available path for new URL discovery
- New URLs are discovered when Google's crawler re-reads sitemap.xml after the next deploy

## Queue Updates

- pseo-queue.json: "test regular expressions" moved from pending to done
- gsc-queue.json: regex article URL added to pending (awaiting Cloudflare Pages rebuild + recrawl)

## Pipeline Blockers

1. **GSC write operations blocked** - siteOwner permission with read-only OAuth scopes; both sitemap.submit() and urlInspection().index() return 403; no available workaround except waiting for Cloudflare Pages auto-rebuild
2. **Claude Code unavailable** - ANTHROPIC_API_KEY not set; `claude auth status` shows not logged in; articles written directly per pipeline fallback rules

## Next Run

2026-05-14 17:00 UTC (23:00 Dhaka)

Pending topics:
1. generate cron expressions without mistakes
2. convert base64 text and files locally in the browser
3. compare text diffs online for code reviews
4. generate secure passwords in the browser
5. hash text with SHA-256 online without sending data

Stale content refresh: check articles older than 180 days (>2025-11-14) in next run.
