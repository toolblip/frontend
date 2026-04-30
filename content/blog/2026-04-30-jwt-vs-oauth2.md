---
title: 'JWT vs OAuth 2.0: What They Actually Are and How They Differ'
description: >-
  JWT and OAuth 2.0 are often mentioned together — but they solve different problems.
  One is a token format, the other is an authorization framework. Here is the
  clear breakdown developers actually need.
publishDate: '2026-04-30'
slug: jwt-vs-oauth2
readingTime: 8 min
author: Harun R Rayhan
tags:
  - jwt
  - oauth
  - authentication
  - security
  - api
category: Authentication
featuredImage: 'https://api.radtx.com/gradient/8b5cf6-f59e0b/1200/630'
---

If you have ever confused JWT and OAuth 2.0, you are in good company. The two come up together so often in tutorials, Stack Overflow answers, and auth library documentation that it is easy to treat them as interchangeable. They are not.

JWT is a **token format**. OAuth 2.0 is an **authorization framework**. Knowing the difference will save you from real design mistakes in your applications.

## The Confusion Is Understandable

Walk into most discussions about API authentication and you will hear both terms used interchangeably. A tutorial about "adding JWT authentication" is often actually about "implementing OAuth 2.0 using JWT as the token format." The terminology gets muddled because the pieces fit together so neatly.

But the pieces are distinct. Understanding each one separately gives you a clear mental model for designing and debugging auth systems.

## What Is a JWT?

JWT — JSON Web Token, pronounced "jot" — is a **compact, URL-safe string** that encodes JSON data. It is defined by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) and is used to transmit claims between two parties.

A JWT looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

It has three parts separated by dots:

```
header.payload.signature
```

**The header** is base64-encoded JSON describing the algorithm (usually HS256 or RS256) and token type (JWT).

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**The payload** is the claims — base64-encoded JSON with data about the subject (user ID, roles, expiry, etc.).

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**The signature** is computed by taking the base64-encoded header and payload, combining them with a secret or private key, and running a cryptographic algorithm. It verifies that the token was not tampered with.

A JWT is **self-contained**. Whoever holds a valid JWT has all the information needed to process it — no database lookup required. That is both its strength and its risk.

You can inspect any JWT in your browser with Toolblip's [JWT Decoder](/tools/jwt-decoder) — no server, no curl, nothing leaves your machine.

## What Is OAuth 2.0?

OAuth 2.0 — defined in [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) — is an **authorization framework**. It describes how a user can grant a third-party application access to their resources on another service, without handing over their credentials.

Think of it this way: OAuth 2.0 is the system that lets you "Sign in with Google" on an external site. You authorize the site to access some of your Google data, Google issues a token, and the site uses that token to fetch your profile info — without you ever sharing your Google password with the external site.

OAuth 2.0 defines several **authorization flows** (sometimes called "grant types"). The most common ones:

### Authorization Code Flow (the standard web flow)

1. User clicks "Sign in with Google"
2. Your app redirects to Google's authorization server
3. User logs in and grants permission
4. Google redirects back with a short-lived **authorization code**
5. Your app exchanges that code for an **access token** (and often a **refresh token**)
6. Your app uses the access token to call Google's API

This flow is designed for servers that can keep a client secret. It is the most secure option for back-end applications.

### PKCE Flow (for public/clients without secrets)

Same as above, but instead of a client secret, the client generates a code verifier and sends its hash (the code challenge). This prevents authorization code interception attacks on mobile apps, SPAs, and other environments where a secret cannot be safely stored.

### Client Credentials Flow (for machine-to-machine)

When no user is involved — a cron job calling an API, a service account — OAuth 2.0 offers the Client Credentials flow. The application authenticates directly with its own credentials and receives an access token.

## Where JWT Fits Into OAuth 2.0

Here is the key point: **JWT is one possible format for the tokens used inside the OAuth 2.0 framework.**

When an OAuth 2.0 authorization server issues an access token, that token can be:

- A **JWT** — self-contained, with claims embedded directly. The resource server can verify it locally using a public key, no network call needed.
- An **opaque token** — a random string with no inherent meaning. The resource server must call the authorization server to introspect it.

Most modern OAuth 2.0 implementations (Auth0, Okta, AWS Cognito, Google) use JWTs as their access token format. But the OAuth 2.0 specification itself does not mandate any particular token format.

## JWT vs OAuth 2.0: The Key Differences

| | JWT | OAuth 2.0 |
|---|---|---|
| **What it is** | Token format (data structure) | Authorization framework (protocol) |
| **Scope** | Encodes a claim set | Describes how clients get authorized access |
| **Used alone?** | Yes — for stateless auth within an app | Yes — for delegation and third-party access |
| **In OAuth 2.0?** | Often used as the token format | Defines the whole flow |
| **Verifying identity** | Decode and verify the signature | Follow the flow and validate the token |

## When to Use What

### Use JWT when:

- You are building **stateless API authentication** — issue a signed token from your server, verify it on each request without a database call
- You need a token that **carries claims** — user ID, roles, permissions — without a lookup
- You are building an **internal microservice architecture** where multiple services share a secret to verify tokens
- You want **cross-service identity** — a token issued by your auth server is understood by all your services

A simple JWT authentication flow:

```javascript
// Server issues a token on login
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);
res.json({ token });

// Server verifies on every request
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Use OAuth 2.0 when:

- You need **third-party delegated access** — letting an app access a user's data on another service (the "Sign in with Google" case)
- You are building an **API that other developers will consume** and you need a standard way to grant and revoke access
- You need **fine-grained scopes** — user grants app access to read their email but not send email
- You need **token rotation** — short-lived access tokens + long-lived refresh tokens with a defined lifecycle

### Use both together when:

- You are implementing a modern auth system that uses OAuth 2.0 flows with JWT access tokens
- Auth0, Okta, or a similar provider issues JWTs that your API verifies
- Your SPA uses the PKCE flow to get a JWT, then sends that JWT to your API

```javascript
// After completing OAuth 2.0 PKCE flow, you get a JWT
// Now use it in your API just like any JWT auth
const decoded = jwt.verify(accessToken, auth0PublicKey);
```

## Common Mistakes Developers Make

### Treating JWTs as session storage

JWTs are **tokens**, not sessions. A session lives on the server and can be revoked immediately. A JWT, once issued, is valid until expiry — you cannot invalidate it without a blocklist or short expiry windows. If you need instant revocation (e.g., a user gets banned), either use opaque tokens with server-side validation, or keep JWT lifetimes short and pair them with a blocklist for catastrophic events.

### Using JWTs for OAuth when you do not need OAuth

If you are building a simple "user logs in, gets a token, uses it to call your API" system, you do not need the full OAuth 2.0 framework. You need JWT-based authentication. OAuth 2.0 adds complexity — authorization servers, grant types, scopes — that you may not need.

Ask yourself: do I need to let third-party apps access my users' data, or do I just need my own users to authenticate with my API? If it is the latter, JWT auth is probably enough.

### Storing JWTs in localStorage

This is a common pattern and a real XSS risk. If an attacker can inject JavaScript into your page, they can read your localStorage and steal the token. The more secure option is `httpOnly` cookies, which JavaScript cannot read. For SPAs, storing in memory (just a JavaScript variable) is the safest — the token dies when the tab closes.

### Using the wrong OAuth flow

Mobile apps and SPAs cannot safely store client secrets. If you are building a native app and someone suggests the Authorization Code flow with a secret, push back and use the PKCE flow instead. The wrong flow for your client type is how refresh token leaks happen.

## The Short Version

- **JWT** = a token format. It encodes claims in JSON, signs them, and can be verified without a database.
- **OAuth 2.0** = an authorization framework. It describes flows for getting access to resources, with or without the user's credentials.
- They are not rivals — they are used **together** in most modern auth systems.
- If you are confused, start here: **JWTs are how you encode the token; OAuth 2.0 is the system that decides who gets one and what they can do with it.**

When you need to decode and inspect a JWT, Toolblip's [JWT Decoder](/tools/jwt-decoder) handles it in-browser, showing the header, payload, and signature verification status without any server round-trip.
