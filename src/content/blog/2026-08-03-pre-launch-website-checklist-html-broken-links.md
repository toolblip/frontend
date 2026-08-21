---
title: "Pre-Launch Website Checklist: HTML, Broken Links, Security Headers"
description: >-
  A practical pre launch website checklist: validate HTML, crawl for broken
  links, and verify security headers before go-live. Free browser tools included.
slug: 2026-08-03-pre-launch-website-checklist-html-broken-links
date: "2026-08-03T00:00:00.000Z"
category: Developer Tools
tags:
  - pre-launch-checklist
  - html-validator
  - broken-links
  - security-headers
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 8 min
featuredImage: https://api.radtx.com/gradient/0f766e-134e4a/1200/630
---

A pre launch website checklist should catch three boring failures before real traffic does: invalid HTML that breaks layout in one browser, dead links that waste crawl budget, and missing security headers that leave the response wide open. You do not need a full QA team for this. You need a fixed 20-minute pass you run on staging every time.

Skip it and launch day looks familiar. Marketing hits publish. Support gets screenshots of a 404 on the pricing CTA. Lighthouse flags a mixed-content warning you never saw locally. None of that is exotic. It is unfinished pre-flight.

## Validate HTML before you ship

Browsers forgive a lot. Crawlers and email clients forgive less. Invalid markup is how you get a nav that only collapses in Safari, a form label that never associates with its input, or duplicate `id` values that make analytics events attach to the wrong node.

Run the staging URL (or a saved HTML export) through an [HTML validator](/tools/html-validator). Fix errors first, then warnings that touch accessibility or SEO:

- Unclosed tags inside the header or footer
- Heading levels that skip from `h1` to `h3`
- Images missing `alt` on content photos
- Buttons implemented as bare `div` elements with click handlers
- Multiple `h1` tags on a marketing page

A typical failure looks small in the report and large in production:

```html
<!-- Broken: label does not point at the control -->
<label>Work email</label>
<input type="email" name="email" />

<!-- Fixed -->
<label for="email">Work email</label>
<input id="email" type="email" name="email" />
```

Re-validate after each fix. One clean report is cheaper than a hot-fix deploy an hour after launch.

## Crawl for broken links and redirects

HTML can be perfect while half your CTAs still 404. Manual click-through misses footer links, old blog cross-links, and the PDF you moved last week.

Use a [broken link checker](/tools/broken-link-checker) against the staging origin. Treat these as launch blockers:

- Any `404` or `410` on primary nav, pricing, signup, or docs
- Internal links that bounce through a chain of 301s before landing
- Mixed `http://` assets on an `https://` page
- Soft 404s that return 200 with a "page not found" body

Redirects are fine when they are intentional. They are not fine when `/blog/old-slug` hops three times to the canonical post and loses UTM parameters along the way. Collapse chains to a single hop before go-live.

Export the report. File tickets for every broken internal URL. External 404s can wait unless they sit on the homepage or a paid landing page.

## Check security headers that browsers actually enforce

Valid pages with working links can still ship with a weak response header set. Open the live (or staging) response in an [HTTP Status Checker](/tools/http-status-checker) and confirm the basics are present:

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

What each one buys you in plain terms:

- **HSTS** stops browsers from retrying plain HTTP after the first secure visit
- **nosniff** blocks MIME confusion on scripts and stylesheets
- **Frame denial** cuts trivial clickjacking
- **Referrer-Policy** keeps internal paths out of third-party logs
- **CSP** limits where scripts, frames, and connections can go

If CSP is still a blank spot, generate a starter policy and tighten it in report-only mode first. The walkthrough in [Generate a Content Security Policy header](/blog/2026-07-22-generate-a-content-security-policy-header-for-web-security) covers that path without locking yourself out of your own app.

Staging should mirror production headers. A local `next dev` response is not evidence that Cloudflare or your reverse proxy will emit the same set.

## A 20-minute pre-launch pass

Run this in order on the release candidate URL:

1. **Minutes 0-5:** Validate HTML on the homepage, pricing, signup, and the page you just changed. Zero errors before you continue.
2. **Minutes 5-12:** Crawl the site for broken links. Fix every internal 404 on money paths. Note external failures.
3. **Minutes 12-17:** Inspect response headers on the apex domain and `www` if you serve both. Confirm HTTPS redirects and HSTS.
4. **Minutes 17-20:** Spot-check the release notes page, OG preview, and one authenticated flow if you have one. Then freeze content.

Do not reorder this. Clean markup makes the link crawl trustworthy. Working links make header checks meaningful on the URLs users actually hit.

## Free tools for each step

You can run the whole pre launch website checklist in the browser:

1. [HTML Validator](/tools/html-validator) for markup errors and accessibility footguns
2. [Broken Link Checker](/tools/broken-link-checker) for dead internal and external URLs
3. [HTTP Status Checker](/tools/http-status-checker) for HSTS, CSP, and frame protections

Keep the three tabs open during every staging promote. When all three reports are clean, you have done the boring half of launch QA. The exciting half (load tests, feature flags, rollback plan) can start from a site that already loads, links, and answers securely.
