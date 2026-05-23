---
title: "URL encode and decode strings for API testing"
description: >-
  URL encode and decode strings for API testing without guessing what broke your request. Learn when to encode query parameters, how to decode payloads safely, and how to check the result before sharing it.
slug: 2026-05-21-url-encode-decode-strings-api-testing
date: "2026-05-21T00:00:00.000Z"
category: Developer Tools
tags:
  - url-encode
  - api-testing
  - percent-encoding
  - browser-tools
  - developer-tools
author: Toolblip Team
readingTime: 6 min
featuredImage: https://api.radtx.com/gradient/0f172a-7c3aed/1200/630
---

URL encoding looks boring until a test request fails for a reason that has nothing to do with your API. A space turns into `+` in one place and `%20` in another. An ampersand inside a value becomes a second query parameter. A callback URL works in the browser, then breaks when you paste it into a webhook dashboard.

When you URL encode and decode strings for API testing, the goal is not to make the URL prettier. The goal is to make the boundary between names, values, and reserved characters explicit enough that your test request means what you think it means.

## What URL encoding changes

URL encoding, also called percent encoding, replaces characters that have special meaning in a URL with byte-safe sequences. A space can become `%20`. A slash can become `%2F`. An ampersand can become `%26` when it belongs inside a value instead of between two query parameters.

This matters most in query strings and redirect URLs. In this request, the `redirect` value contains its own query string:

```text
https://example.test/login?redirect=https://app.example.test/welcome?plan=pro&source=email
```

That URL is ambiguous. The server may read `source=email` as a parameter for `/login`, not as part of the nested redirect URL. Encoding the nested value fixes the boundary:

```text
https://example.test/login?redirect=https%3A%2F%2Fapp.example.test%2Fwelcome%3Fplan%3Dpro%26source%3Demail
```

Now the outer request has one parameter named `redirect`, and its value is the full nested URL.

## Encode values, not whole URLs by default

A common mistake is encoding the entire URL when only one value needs encoding. If you encode everything, you get a string that is safe as a value but no longer usable as the actual request URL:

```text
https%3A%2F%2Fapi.example.test%2Fsearch%3Fq%3Dred%20shoes
```

That is fine if you are passing the whole URL as a parameter. It is wrong if you are trying to call the API directly.

For JavaScript tests, encode individual values with `encodeURIComponent()`:

```js
const query = "status:open owner:api team";
const url = `https://api.example.test/search?q=${encodeURIComponent(query)}`;

console.log(url);
// https://api.example.test/search?q=status%3Aopen%20owner%3Aapi%20team
```

Use `encodeURI()` only when you want to preserve URL structure characters like `:`, `/`, `?`, and `&`. For API test values, `encodeURIComponent()` is usually the safer choice.

Toolblip's [URL Encode/Decode tool](https://toolblip.com/tools/url-encode) is useful for quick checks because it runs in the browser. Paste a value, encode it, decode it back, and compare the result before you put it into Postman, a curl command, or a webhook config.

## Curl can encode form and query values too

If you are testing from a terminal, let curl encode values when possible. For form bodies, `--data-urlencode` avoids a lot of hand-built strings:

```bash
curl -G 'https://api.example.test/search'   --data-urlencode 'q=status:open owner:api team'   --data-urlencode 'callback=https://app.example.test/done?source=cli&ok=true'
```

The `-G` flag tells curl to put the encoded data into the query string instead of the request body. That makes the final request easier to reason about and keeps reserved characters from leaking into the wrong layer.

For debugging, add `--verbose` or copy the generated URL into a browser-safe decoder. Do not paste production secrets into random tools just to decode a request. Use harmless sample values when you are checking behavior.

## Decode strings before blaming the API

Decoding is just as useful as encoding. If an API log shows this:

```text
q=status%3Aopen%20owner%3Aapi%20team
```

decode it before deciding the client sent a bad search query. The readable value is:

```text
status:open owner:api team
```

That small check can save time when you are debugging OAuth state values, signed callback URLs, search filters, S3 object keys, or webhook payloads. You want to know whether the client sent the wrong value, the server decoded it incorrectly, or a proxy rewrote the request on the way in.

For related browser-side checks, Toolblip's [JSON Formatter](https://toolblip.com/tools/json-formatter) helps when the encoded value contains a JSON blob. Decode the string first, then format the JSON so you can see whether the payload survived the trip.

## Watch for double encoding

Double encoding happens when a value gets encoded twice. `%2F` becomes `%252F` because the percent sign itself was encoded as `%25`. You will usually see this when one layer encodes a value and another layer assumes it is still raw text.

A quick test is to decode once and look at the output. If it still contains lots of percent sequences that look meaningful, decode a second time with caution. If the second decode suddenly turns `%2F` into `/`, you probably found a double-encoding bug.

Do not blindly decode user input multiple times in production code. That can create security bugs. For API testing, though, decoding one layer at a time is a good way to find where the extra encode step happened.

## A practical API testing checklist

Before sending a tricky request, check four things:

- Encode parameter values separately instead of encoding the whole URL.
- Decode logs and copied URLs before comparing them by eye.
- Watch for `%25` when you suspect double encoding.
- Use local or browser-side tools for sensitive strings, not a server-side paste box.

URL encoding is not glamorous, but it is one of those small details that can make an API test look broken when the real problem is the test request. Get the string boundary right first. Then debug the API.
