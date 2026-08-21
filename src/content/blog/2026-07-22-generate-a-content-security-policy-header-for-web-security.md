---
featuredImage: 'https://toolblip.com/api/og?title=Generate%20a%20Content%20Security%20Policy%20Header%20for%20Web%20Security&category=Developer%20Tools&date=2026-07-22'
title: "Generate a Content Security Policy Header for Web Security"
description: >-
  Learn to generate a Content Security Policy header for web security, test it
  in report-only mode, and fix blocked script errors. Free browser tool.
slug: 2026-07-22-generate-a-content-security-policy-header-for-web-security
date: 2026-07-22T00:00:00.000Z
category: Developer Tools
tags:
  - toolblip
  - content security policy header
  - csp report-only mode for testing
  - developer tools
---

# Generate a Content Security Policy Header for Web Security

A security scan flagged your site for a missing CSP, or a pentest report listed cross-site scripting as an open risk. Either way you now need to generate a Content Security Policy header for web security, and you need it to lock down script injection without blanking out half your pages on deploy.

A CSP is a browser-enforced allowlist. You declare which origins may serve scripts, styles, images, and frames, and the browser refuses everything else. Get it right and an injected `<script>` from an attacker simply never executes. Get it wrong in production and your own analytics, fonts, and embeds stop loading too.

## What Is a Content Security Policy Header

A Content Security Policy is an HTTP response header your server sends alongside the page. The browser reads it before executing anything and enforces it for the life of that document.

Here is a workable starting policy:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Each directive controls one resource type. `script-src` governs JavaScript, `style-src` governs CSS, `connect-src` governs fetch and XHR destinations, and `default-src` catches anything you did not name explicitly.

Three directives do outsized work, and teams skip them most often.

`frame-ancestors 'none'` blocks clickjacking by refusing to let other sites iframe yours. It supersedes `X-Frame-Options` in modern browsers.

`base-uri 'self'` stops an injected `<base>` tag from silently redirecting every relative URL on the page to an attacker's host.

`form-action 'self'` prevents an injected form from posting your users' credentials somewhere else.

Leave those three out and a CSP that looks thorough still leaves real attack paths open.

## Generate a Content Security Policy Header for Web Security in the Browser

Hand-writing directives means enumerating every third-party origin your site touches, and one forgotten CDN means a broken page. A generator gets you a complete, syntactically valid header faster.

Open the [Security Headers Generator](https://toolblip.com/tools/security-headers-generator), pick the sources your site actually loads from, and copy the resulting header. It also emits HSTS, `X-Frame-Options`, and the other headers scanners check for, so one pass covers the whole set.

Before you paste anything into production config, inventory your real dependencies. Open DevTools, load a representative page, and read the Network tab. Every distinct domain in that request list needs a home in some directive, or the browser will block it.

Pay attention to the requests that only fire on interaction. A payment iframe, a support widget, or a map that loads on scroll will not appear in the Network tab until you trigger it, and those are exactly the origins that break in production after a clean-looking test.

## CSP vs CORS Explained

People conflate the two constantly, and the confusion produces policies that block the wrong things.

The browser enforces CSP on the page doing the loading. It answers "may this document load a resource from that origin," and it protects your users from injected content on your site.

The browser enforces CORS based on what the server being called allows. It answers "may that origin read my response," and it protects your API from unauthorized pages reading it.

The CSP vs CORS difference matters when a fetch fails. If the console says the request violated a CSP directive, fix `connect-src` in your own header. If it says the response lacked `Access-Control-Allow-Origin`, the fix lives on the API server, not in your policy. Adding an origin to `connect-src` will never resolve a CORS error, and loosening CORS will never satisfy a CSP block.

Confirm which one you are looking at with the [HTTP Status Checker](https://toolblip.com/tools/http-status-checker), which shows both the CSP you are sending and the CORS headers the remote endpoint returns.

## Use CSP Report-Only Mode for Testing

Shipping a policy straight to enforcement is how teams take down their own checkout page. The spec includes a mode built precisely to avoid that.

Send the policy under a different header name and the browser reports violations without blocking anything:

```
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' https://cdn.example.com; report-uri /csp-report
```

The browser logs every violation to the console and POSTs it to your `report-uri` endpoint as JSON, while the resource still loads normally. Nothing breaks, and you collect a real inventory of what your policy would have blocked.

Both headers can ship at once. Enforce a loose policy you trust while report-only tests a stricter candidate against live traffic.

Knowing how to test a CSP header without breaking your site comes down to patience with this stage. Run report-only for at least a full traffic cycle, ideally a week, so weekly cron jobs, marketing scripts, and rarely-visited pages all get a chance to report. Then fix the violations and promote the policy to enforcing.

Watch the reports for noise from browser extensions. Extension-injected scripts generate violations you cannot fix and should not chase.

## Fix CSP Header Blocked Inline Script Errors

The single most common failure reads like this in the console:

```
Refused to execute inline script because it violates the following
Content Security Policy directive: "script-src 'self'".
Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce
('nonce-...') is required to enable inline execution.
```

The message names three escape hatches, and only two are safe.

Adding `'unsafe-inline'` fixes the error and defeats the point, since it re-permits exactly the injected inline script a CSP exists to stop. Treat it as a last resort for `style-src` only.

A nonce is the better fix for dynamic pages. Generate a fresh random value per request, put it in the header and on the tag, and only matching scripts run:

```
Content-Security-Policy: script-src 'self' 'nonce-r4nd0mBase64Value'
```

```html
<script nonce="r4nd0mBase64Value">
  window.__APP_CONFIG__ = { env: "production" };
</script>
```

The nonce must be unpredictable, and you must regenerate it on every response. Reuse one across requests and an attacker who reads it once can inject freely from then on. Produce values with the [Secure Random Generator](https://toolblip.com/tools/secure-random-generator) when you need a quick one for testing, and wire your server to a CSPRNG for real traffic.

A hash suits static inline blocks that never change. Take the SHA-256 of the exact script contents, base64 it, and list it:

```
Content-Security-Policy: script-src 'self' 'sha256-qznLcsROx4GACP2dm0UCKCzCG+HiZ1guq6ZZDob/Tng='
```

Compute the digest with the [SHA-256 Hash Generator](https://toolblip.com/tools/sha256-hash-generator). Hash the script body exactly as it appears between the tags, with no leading or trailing whitespace differences, because a single changed byte invalidates the hash and the block stops running.

## Add a CSP Header to Nginx or Apache Config

Where you set the header depends on your stack, but the server-level approach applies it everywhere at once.

Nginx, inside a `server` or `location` block:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.example.com; frame-ancestors 'none'; base-uri 'self'" always;
```

The `always` flag matters. Without it, Nginx skips the header on error responses, leaving your 404 and 500 pages unprotected.

Apache, in `httpd.conf` or a `.htaccess` file with `mod_headers` enabled:

```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.example.com; frame-ancestors 'none'; base-uri 'self'"
```

One caveat when you add a CSP header to Nginx or Apache config: `add_header` directives in Nginx do not merge across nesting levels. A `location` block with its own `add_header` discards every header set in the parent `server` block, which silently drops your policy on exactly the routes you customized.

A meta tag fallback exists for static hosts with no header control, though it cannot express `frame-ancestors` or `report-uri`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
```

Prefer the real header whenever your host allows it.

## Verify the Policy Actually Ships

Writing the config is not the same as serving it. Confirm the header reaches the browser before you close the ticket.

```bash
curl -sI https://example.com | grep -i content-security-policy
```

An empty result means a proxy, CDN, or framework layer stripped it, or the config never reloaded. Some CDNs drop unknown headers on cached responses, so check a cache hit and a cache miss separately.

Then load the site with DevTools open and watch the Console tab. A clean load with no violation messages, plus a visible header in the Network tab response, means the policy is both present and satisfied.

## Ship a Policy You Can Trust

Generate a Content Security Policy header for web security in report-only mode first, collect real violations for a full week, replace every `'unsafe-inline'` with a nonce or hash, then promote it to enforcing. Include `frame-ancestors`, `base-uri`, and `form-action`, and verify with curl that the header survives your CDN.

Start with the free [Security Headers Generator](https://toolblip.com/tools/security-headers-generator) to build a complete, valid policy in your browser, then confirm what your server actually sends with the [HTTP Status Checker](https://toolblip.com/tools/http-status-checker). No account, no signup, and no guessing about which directive blocked your script.

