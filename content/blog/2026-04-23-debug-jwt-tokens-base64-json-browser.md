---
title: "Debug JWT Tokens Without a Library: Base64 + JSON View in Your Browser"
description: "A compact signed JWT has three base64url segments; encrypted JWTs differ. Learn how to decode and inspect JWT claims in your browser - no npm install, no external API calls, no library required."
date: '2026-04-23'
category: Developer Tools
tags:
  - jwt
  - base64
  - json
  - debugging
  - authentication
  - web-development
  - api-development
  - privacy
  - developer-tools
  - security
author: Toolblip Team
readingTime: 9 min
featuredImage: 'https://toolblip.com/api/og?title=Debug%20JWT%20Tokens%20Without%20a%20Library%3A%20Base64%20%2B%20JSON%20View%20in%20Your%20Browser&category=Developer%20Tools&date=2026-04-23'
---

If you've ever stared at a JWT like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` and wondered what the hell it actually says - you're not alone.

JWTs are everywhere in modern web development. They power API authentication, OAuth tokens, session management, and more. But debugging them shouldn't require installing a library, spinning up a debugger, or sending your tokens to an unverified service.

This guide shows you exactly how to decode and inspect a compact signed JWT in your browser - using the JWT Decoder or a short browser-console snippet.

## What a JWT Actually Looks Like

A compact signed JWT (JWS) has three base64url segments joined by dots. A compact encrypted JWT (JWE) has five:

```
header.payload.signature
```

Each part is URL-safe Base64 (`base64url`), not standard Base64.

**The header** - decode it and you get something like:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**The payload** - decode it and you get the claims:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

**The signature** - this is cryptographic data over the header and payload. Verification requires the appropriate key and algorithm. Decoding does not perform that check.

The important point: **the header and payload are just encoded, not encrypted**. Anyone can read them. A valid signature can prove integrity after verification; the encoded payload itself is readable.

## The Manual Decode Process

Here's how to decode a JWT by hand using Toolblip's browser-based tools.

### Step 1: Copy the Token

Copy the complete three-part token for the [JWT Decoder](/tools/jwt-decoder). If you're decoding it manually instead, split on `.` and take the middle section, which is the payload.

For the example token above, the payload is:
```
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

### Step 2: Decode Base64 URL

Paste the complete signed token into the [JWT Decoder](/tools/jwt-decoder). It decodes the header and payload without verifying the signature. The text [Base64 Decoder](/tools/base64-encoder-decoder) expects standard Base64 and does not automatically handle `-` or `_` in base64url.

You'll get the raw JSON string:
```json
{"sub":"1234567890","name":"John Doe","iat":1516239022}
```

### Step 3: Format the JSON

Copy the decoded string and paste it into the [Toolblip JSON Formatter](/tools/json-formatter). Instantly you get:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

Now you can actually read it.

### Step 4: Interpret the Claims

Here's what those fields mean:

| Claim | Meaning |
|---|---|
| `sub` | Subject - the user ID or entity this token represents |
| `name` | Human-readable name associated with the token |
| `iat` | Issued At - Unix timestamp when the token was created |
| `exp` | Optional expiration - Unix timestamp after which a token with this claim must be rejected |

This sample has no `exp` claim. If your token has one, compare it with the current Unix timestamp using the [Toolblip Unix Timestamp Converter](/tools/unix-timestamp-converter). A timestamp in the past means that token has expired; decoding alone does not verify its signature.

## Common JWT Debugging Scenarios

### Scenario 1: Token Expired

You send a request with an `Authorization: Bearer <token>` header and get a `401 Unauthorized` back. Decode the token. Check `exp`. Is it in the past?

```bash
# Current timestamp
date +%s
# 1745452800 (example)

# If exp < current, token is expired
```

If it's expired, you need to get a fresh token from your auth endpoint. No amount of debugging will make an expired token valid.

### Scenario 2: Wrong Subject ID

You're testing a user deletion flow. The API says it deleted user `12345`, but the webhook fired for user `12346`. Decode the JWT's payload and check `sub`.

If `sub` is wrong in the JWT, the issue is in your auth server - the token was issued with the wrong user ID.

### Scenario 3: Alg Mismatch Vulnerability

This one matters for security. If a JWT header shows `"alg": "none"` or an algorithm you didn't configure your server to accept (like `"alg": "HS256"` when you expected `"RS256"`), that's a potential vulnerability.

Decode the header of any suspicious token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```
Decode → `{"alg":"HS256","typ":"JWT"}`

If you see `"alg": "none"` or `"alg": "HS256"` in a token that should use RSA signatures, flag it. See [OWASP’s JWT testing guidance](https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/06-Session_Management/10-JSON_Web_Tokens/) for the verification risks.

### Scenario 4: Verifying a Token Locally

If you have the secret key for an HS256 token, verify its signature with a trusted JWT library configured for HS256. Toolblip's [JWT Decoder](/tools/jwt-decoder) shows the header and payload, but it does not verify signatures. A plain SHA-256 hash is not an HMAC-SHA256 signature.

## Why Not Use a Library?

You might be thinking: "Why not just use `jwt.decode()` from the `jsonwebtoken` npm package?"

You should use libraries in your application code. They're the right tool for production - they handle edge cases, validate signatures properly, and handle clock skew.

But when you're debugging in the moment:

- Installing a package just to inspect one token is slow
- A third-party decoder may submit token data; check its request behavior before using a real credential
- You might be on a machine without Node.js, or without the right environment set up
- Copy-pasting a token into a local browser tool is faster than writing a script

The browser approach is the developer's equivalent of using `curl` instead of Postman for a quick API check. It's not replacing your tools - it's the right tool for the one-off moment.

## URL-Safe Base64: The Gotcha

Standard Base64 uses `+`, `/`, and `=` characters. JWT uses URL-safe Base64, which replaces:

- `+` → `-`
- `/` → `_`
- Trailing `=` padding is often stripped

This matters because if you paste a JWT payload into a standard Base64 decoder, it might fail or produce garbage output.

Use the [JWT Decoder](/tools/jwt-decoder) for a complete signed token. If decoding manually, replace `-` with `+` and `_` with `/`, add padding as needed, then decode bytes as UTF-8.

### Quick Manual Fix

If a JWT payload won't decode in a standard Base64 decoder, add back the padding:

```javascript
// JWT payload without padding
const payload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'

// Add padding to make it valid standard Base64
const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
// "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ=="
```

Then decode as standard Base64. You'll get the same result as URL-safe Base64 decoding.

## Real-World Example: Debugging an Auth Flow

Here's a real debugging scenario from API development:

**The problem:** Your frontend is sending a JWT in the `Authorization` header, but the backend keeps returning 403 Forbidden.

**The decode workflow:**

1. Copy the JWT from localStorage/sessionStorage (or your network tab)
2. Paste the complete token into [Toolblip JWT Decoder](/tools/jwt-decoder)
3. Read the decoded header and payload; the decoder does not verify the signature
4. Check that the claims you expected are present
5. If you need to compare JSON documents, copy the payload into [JSON Formatter](/tools/json-formatter)
6. Inspect `sub`, `iat`, optional `exp`, and any custom claims

**What you might find:**

- `exp` is in the past → token is expired, your auth server needs to refresh it
- `sub` doesn't match the user ID you expect → auth server issued token for wrong user
- `iat` is very old → token was issued hours ago and your refresh logic isn't running
- A custom claim like `role` is missing → your auth server didn't include it when signing

This is the full debugging loop without writing a line of code.

## Security Notes

A few important things to keep in mind when debugging JWTs:

**Never decode tokens from untrusted sources in tools you don't control.** If you paste a JWT into an unverified website, inspect whether it sends the value in an outgoing request. Treat production credentials under your organization’s policy.

The decode and format actions run in your browser. Inspect outgoing request contents when handling a sensitive token.

**Don't put production tokens in logs.** If you're debugging a production issue and copy a JWT into a bug report, Slack message, or email - you've just shared your users' auth tokens externally. Always redact JWTs in bug reports.

**Base64 ≠ encryption.** The header and payload of a JWT are encoded, not encrypted. Anyone with the token can read the claims. Never put sensitive data like passwords or PII in the JWT payload unless you understand that anyone who sees the token can read it.

## Related Tools

- **[JWT Decoder](/tools/jwt-decoder)** - Decode signed compact token headers and payloads without signature verification
- **[Base64 Encoder/Decoder](/tools/base64-encoder-decoder)** - Standard Base64 text conversion
- **[JSON Formatter](/tools/json-formatter)** - Pretty-print, minify, and validate JSON
- **[Unix Timestamp Converter](/tools/unix-timestamp-converter)** - Convert Unix timestamps to human-readable dates and vice versa
- **[Regex Tester](/tools/regex-tester)** - Test patterns against strings for validation and parsing
- **[Hash Generator](/tools/md5-hash-generator)** - Compute plain MD5, SHA-1, SHA-256, SHA-384, and SHA-512 digests from text

## Further Reading

- [JWT.io](https://jwt.io/) - Official JWT debugger with library integration
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - The JWT specification
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [Auth0: JWT Structure Explained](https://auth0.com/blog/inside-jwt-tokens/)

---

*No token ever leaves your browser. Toolblip's decoder and formatter both run 100% client-side - decode, inspect, and understand your JWTs privately.*
