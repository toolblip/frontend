# SEO Pipeline Archive — 2026-05-12

**Run:** 2026-05-12 23:00 Dhaka (17:00 UTC)
**Product:** Toolblip (toolblip.com)

## GSC Diagnostics (30-day)
- Total clicks: 1 | Total impressions: 75 | Overall CTR: 1.33%
- Best performing page: /tools/poll-generator (C:1, I:22, Pos:56.1, CTR:4.55%)
- Top query: "poll maker" (C:1, I:7, Pos:51.3, CTR:14.3%)
- Note: domain is very early stage — no strong CTR evidence favoring any topic

## Articles Generated: 1
- **Topic:** "decode JWT tokens safely in your browser"
- **URL:** https://toolblip.com/blog/2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser
- **Selection rationale:** Unique angle (client-side token inspection with DevTools verification) not covered by existing "debug regex capture groups" article. Maps to jwt-decoder-web tool. Genuinely useful to developers who need to inspect tokens without trusting third-party decoders.
- **GSC submitted:** Sitemap refresh submitted. URL Inspection Indexing API blocked (siteOwner permission but read-only OAuth scopes). New URLs discovered via sitemap rebuild after Cloudflare Pages deploy.

## Articles Committed: 1
- SEO article committed to main and pushed

## Articles Submitted to GSC: 1
- Note: AmazingPlugins GSC has siteFullUser only. Toolblip has siteOwner. Toolblip URL Inspection Indexing API blocked despite siteOwner (OAuth scopes are read-only). Sitemap submit() works. Sitemap refresh is the workaround — Cloudflare Pages auto-rebuilds sitemap on deploy, Google re-reads after next crawl.

## GSC Errors: none

## Internal Linking
- Article contains no internal links to other blog posts (existing posts don't cover JWT/auth topics). Links to /tools/jwt-decoder-web via tool description in content. Not linking to homepage or pricing as those would feel forced without context.

## Self-Improve
- CTR data will be available after 48-72h. No strong patterns to extract yet — domain too early.
- GSC shows zero impressions for any JWT-related queries (domain not ranking yet for this keyword). Article targets long-tail "decode JWT tokens safely in browser" search intent — will take time to index and rank.
- Note: Queue contains 6 topics. 5 of 7 map to existing tool pages. Consider refreshing/expanding existing tool pages instead of always generating new blog posts. The existing blog content (7 posts) could benefit from on-page SEO improvements before adding more articles.

## Queue Status
- pending: 6 topics
- done: 7 topics (added JWT decoder)

## Sitemap Note
**Critical: the sitemap.ts does NOT include blog post URLs.** It only lists static routes and tool pages. New blog posts are NOT being added to sitemap.xml automatically. This is why the new JWT article won't appear in sitemap.xml even after Cloudflare Pages rebuilds. This needs to be fixed by updating `src/app/sitemap.ts` to include blog posts from `src/content/blog/`. The GSC URL Inspection API (blocked tonight) and sitemap are both broken paths for new URL discovery. The article will rely on Google's crawler finding it through existing internal links on the /blog page.

## Blocker
- Claude Code auth unavailable (no ANTHROPIC_API_KEY in environment, `claude auth status` shows `loggedIn: false`). Article written directly per pipeline skill fallback rules.

## Next Run: 2026-05-13 23:00 Dhaka
