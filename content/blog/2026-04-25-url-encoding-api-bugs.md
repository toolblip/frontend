---
title: Why Your URL Encoding Is Breaking Your API (And How to Fix It)
description: Double-encoding, percent-sign bugs, and the silent API killers. Learn how URL encoding actually works and stop debugging mystery 400s.
date: 2026-04-25
category: Developer Tools
---

If you've ever stared at a 400 Bad Request error and had no idea why — you're not alone. URL encoding bugs are one of the most frustrating, least-understood issues in web development. They don't throw loud errors. They silently corrupt your data.

This guide breaks down the real-world encoding mistakes that break APIs, with examples you can run in your browser right now using the [Toolblip URL Encoder/Decoder](/tools/url-encode).

## What Is URL Encoding, Really?

URLs are designed to transmit raw bytes. But the characters in a URL have special meaning: `?` marks the query string start, `&` separates parameters, `/` divides path segments, and `#` denotes a fragment. Any character that conflicts with those roles needs to be **percent-encoded** — converted to a `%` followed by two hexadecimal digits representing the byte value.

For example, a space (ASCII 32) becomes `%20`. An ampersand (`&`) becomes `%26`. A question mark (`?`) becomes `%3F`.

The full set of characters that don't need encoding — the **unreserved set** — is:

```
A-Z a-z 0-9 - _ . ~
```

Everything else should be encoded if it appears in a URL component where it has special meaning.

## The Two Rules Most Developers Get Wrong

### Rule 1: Encode *Before* Inserting Into a URL

This sounds obvious. But the mistake is doing it twice — or not at all.

Here's a typical flow:

```javascript
// You want to search for "bread & butter"
const query = "bread & butter";
const url = `https://api.example.com/search?q=${query}`;
```

What actually gets sent:

```
GET /search?q=bread & butter HTTP/1.1
```

The `&` splits the query parameter. Your backend sees `q=bread` and a second parameter called ` butter` with no value. The API might return 400, or worse — it might silently ignore the extra parameter and return wrong results.

The fix:

```javascript
const encoded = encodeURIComponent(query);
// "bread%20%26%20butter"
const url = `https://api.example.com/search?q=${encoded}`;
```

Now `&` becomes `%26`, and the space becomes `%20`. The URL is clean.

### Rule 2: Don't Encode an Already-Encoded URL

This is the bug that causes **double-encoding**, and it trips up almost every developer at least once.

The problem happens when you encode data, then the value gets encoded again somewhere downstream:

```javascript
const rawValue = "hello%20world";
const encoded = encodeURIComponent(rawValue);
// "hello%2520world"  ← % becomes %25, double-encoded!
```

Now your server receives `hello%2520world` instead of `hello%20world`. The `%20` you worked hard to encode got encoded *again* into `%2520`. Decode once, and you get `hello%20world` — still encoded. Decode twice, and finally: `hello world`.

Double-encoding is insidious because the URL *looks* valid. It passes syntax checks. The bug only shows up as corrupted data in your database or wrong search results.

## The Three Most Common URL Encoding Bugs

### Bug 1: Double-Encoding in Nested Systems

```javascript
// Your code
const slug = encodeURIComponent("hello world"); // "hello%20world"

// Your logging middleware encodes again
logger.log(`Request: ${url}`); // or any template interpolation

// Your monitoring tool encodes again
// → "hello%2520world" in logs
```

Result: you look at your logs and see `hello%2520world`. You think something is wrong. Nothing is wrong — it's just double-encoded in the display. But if your monitoring scrapes that log and tries to query it, things break.

**Fix:** Track exactly where encoding happens in your stack. Encode at the boundary (when constructing the URL), and nowhere else.

### Bug 2: Encoding the Wrong URL Component

`encodeURIComponent()` and `encodeURI()` are not interchangeable:

```javascript
// Use encodeURIComponent() for individual query parameter values
const value = encodeURIComponent("a=b&c=d"); // "a%3Db%26c%3Dd"

// Use encodeURI() for full URLs you want to preserve structure
const url = encodeURI("https://example.com/path?a=b&c=d");
// "https://example.com/path?a=b&c=d"  — separators preserved
```

If you use `encodeURI()` on a query value, you get the wrong result. If you use `encodeURIComponent()` on a full URL, you destroy the structure:

```javascript
encodeURIComponent("https://example.com");
// "https%3A%2F%2Fexample.com" ← completely broken
```

**Rule:** `encodeURIComponent()` for component *values*. `encodeURI()` for full URLs you don't want re-encoded.

### Bug 3: Forgetting to Decode on the Way In

This one is subtler. Your frontend encodes data correctly. But then a proxy, a load balancer, or a middleware layer does something unexpected:

```javascript
// Backend receives: ?q=bread%26butter
// But the framework auto-decodes, and then you do:
const searchQuery = decodeURIComponent(req.query.q);
// "bread&butter"

// Then you do:
// const dbQuery = `SELECT * FROM posts WHERE title LIKE '%${searchQuery}%'`
// → SQL injection risk if you didn't escape properly
```

Actually, in most modern frameworks the auto-decode is fine — but the danger is when you mix raw and decoded values, or when you store the encoded string but display the decoded one inconsistently.

## How to Debug URL Encoding Issues

### Step 1: Identify What You're Looking At

Is your string percent-encoded, or is it raw?

```
bread%20world   →  decoded: "bread world"
bread%2520world  →  double-encoded: "bread%20world" (needs one more decode)
bread world      →  raw: "bread world"
```

### Step 2: Decode and Re-Encode

The fastest way to find the problem is to decode fully, then encode once:

```javascript
// Fully decode
const decoded = decodeURIComponent(encodedString);
// If it's double-encoded, decode again:
const fullyDecoded = decodeURIComponent(decoded);

// Now encode once for the correct context
const reEncoded = encodeURIComponent(fullyDecoded);
```

You can do this instantly in your browser with the [Toolblip URL Encoder/Decoder](/tools/url-encode) — paste any string, see both encoded and decoded output, and cycle through multiple decode passes.

### Step 3: Check the Raw HTTP Request

Use your browser's Network tab or a tool like curl:

```bash
curl -v "https://api.example.com/search?q=bread%20butter"
```

Look at exactly what's being sent. Is `%20` in the URL, or is it a literal space? The difference tells you where the encoding problem originates.

## The Base64 URL-Safe Variant

Standard Base64 uses `+`, `/`, and `=` — characters that conflict with URL encoding. When you're putting Base64 in a URL parameter, you need the **URL-safe variant**:

```
Standard Base64:  Y+Bz8A==  ← contains +, /, =
URL-safe Base64:  Y-Bz8A    ← uses - and _ instead, drops =
```

If you're putting tokens, signed data, or encoded payloads in URLs, URL-safe Base64 isn't optional — standard Base64 will break your URLs.

The [Toolblip Base64 encoder](/tools/base64) supports URL-safe mode. Paste any string, check "URL-safe output," and get a variant that won't corrupt your URLs.

## Real-World Example: The Google Search Bug

This actually happened. An engineering team was building a search-as-you-type feature. The frontend correctly encoded the query and sent it to their API. Their API logged the raw incoming request. A monitoring tool scraped those logs and built dashboards showing "top searches."

The monitoring tool URL-decoded the log entries. One of their top searches: `javascript%20tutorial`. Decoded: `javascript tutorial`. Fine.

But a search for `C%2B%2B` (C++) was stored in logs as `C%2B%2B`. The monitor decoded it once: `C++`. Fine. Then it encoded it again to store in a different system: `C%2B%2B`.

Then a different system read that as double-encoded: `C%252B%252B` → `C%2B%2B` → `C++`.

The loop continued. Eventually, one system decoded three times and got: `C ` (just the letter C). C++ searches were silently being attributed to searches for just "C". Nobody caught it for months.

**The lesson:** The problem wasn't any single encoding operation. It was the *inconsistent handling* of encoding across systems that were supposed to share data.

## Quick Reference

| Problem | Cause | Fix |
|---|---|---|
| `400 Bad Request` on search queries | Unencoded `&` or `?` in query values | `encodeURIComponent()` on values |
| Data shows `%2520` in logs | Double-encoding | Decode once, re-encode once |
| `+` signs becoming spaces | Form-encoded data interpreted as spaces | URL-encode `+` as `%2B` |
| Base64 in URLs breaking | Standard Base64 uses URL-unsafe chars | Use URL-safe Base64 (`-_`) |
| 404 on paths with special chars | `/` encoded inside path segment | Don't encode slashes in path; only in values |

## Try It Now

No signup. No server round-trips. Everything runs in your browser.

- [URL Encoder/Decoder](/tools/url-encode) — encode, decode, and debug percent-encoded strings
- [Base64 Encode/Decode](/tools/base64) — with URL-safe mode for API tokens and URL payloads

## Bottom Line

URL encoding bugs are invisible until they aren't. A `+` sign in a search query becomes a space. A `%` in a discount code becomes `%25`. A properly-encoded URL passes every syntax check but carries corrupted data.

The fix is knowing exactly where encoding happens in your stack — and making sure it happens exactly once, at the right layer. Once you have that, these bugs become trivial to debug.

Start with the [Toolblip URL Encoder/Decoder](/tools/url-encode). Paste your broken URL. Decode it fully. You'll see exactly what's happening.
