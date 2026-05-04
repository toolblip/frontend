---
title: 'HTTP Methods Explained: GET vs POST vs PUT vs PATCH vs DELETE'
description: 'HTTP methods are the foundation of how browsers, APIs, and servers communicate. A clear breakdown of what each method does, when to use it, and what happens when you pick the wrong one.'
date: 2026-04-23
category: Developer Tools
---

Every HTTP request starts with a method. `GET`, `POST`, `PUT`, `PATCH`, `DELETE` — you've seen them in API docs, browser DevTools, and curl commands. But knowing which one to use, and *why*, makes the difference between an API that's intuitive and one that constantly trips up developers.

This is a practical breakdown of every HTTP method that matters in daily development work.

## Why the Method Matters

The HTTP method tells the server what kind of action you want to perform. Get a resource, create a record, update it, or delete it. Get the semantics right and your API is self-documenting. Get them wrong and you'll spend hours debugging idempotency issues, unexpected cache behavior, or security vulnerabilities.

Beyond semantics, HTTP methods affect:

- **Caching** — `GET` responses are cacheable by default. `POST` responses are not.
- **Body handling** — `GET` requests shouldn't have bodies. `POST`, `PUT`, and `PATCH` can.
- **Idempotency** — `GET`, `PUT`, and `DELETE` are idempotent (calling them once has the same effect as calling ten times). `POST` and `PATCH` are not.
- **Security** — Some proxies and firewalls restrict certain methods based on their semantics.

Let's go through each one.

## GET — Retrieve a Resource

`GET` requests retrieve data. They should be read-only, have no side effects, and never modify server state.

```
GET /api/users HTTP/1.1
Host: example.com
```

**What happens:**
- The server looks up the resource(s) at the requested path
- Returns the data in the response body
- Sets appropriate caching headers (`Cache-Control`, `ETag`)

**Key characteristics:**
- Cacheable by default
- Should have no side effects (no "likes" or "views" counted on a GET)
- No request body (though query params carry data)
- Idempotent

**Common mistakes:**
Using `GET` for actions that modify data (a growing "view count" is a gray area; a purchase confirmation is not). Some CDNs and proxies will aggressively cache `GET` responses, so any state change via `GET` can cause real problems.

```javascript
// Wrong: this GET request modifies data
fetch('/api/users/123/increment-view-count', { method: 'GET' })

// Right: use POST or PATCH for actions that modify
fetch('/api/users/123/views', { method: 'POST', body: JSON.stringify({ delta: 1 }) })
```

## POST — Create a Resource (or Trigger an Action)

`POST` sends data to the server to create a new resource, submit a form, or trigger an action. It's the most flexible HTTP method.

```
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Alice Nakamura",
  "email": "alice@example.com"
}
```

**What happens:**
- The server processes the request body
- Typically creates a new resource
- Returns the created resource (or a reference to it) with a `201 Created` status

**Key characteristics:**
- Not cacheable by default
- Not idempotent — sending the same `POST` twice typically creates two resources
- Can have any response code (commonly `201 Created`, `202 Accepted`, or `400 Bad Request`)

**Common mistakes:**
Using `POST` for updates (use `PUT` or `PATCH`), or not returning the correct status code (`201` for creation, not `200`). Another frequent issue: `POST` responses aren't cached, so if you're building something that needs caching, you may be on the wrong method.

## PUT — Replace a Resource Entirely

`PUT` replaces a resource at a specific URL with the provided data. If the resource doesn't exist, it may create it (depending on server implementation).

```
PUT /api/users/123 HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Alice Nakamura",
  "email": "alice.new@example.com",
  "role": "admin"
}
```

**What happens:**
- The server replaces the entire resource at `/api/users/123` with the request body
- Any fields not included in the request body are typically cleared or reset to defaults

**Key characteristics:**
- Idempotent — sending the same `PUT` request multiple times produces the same result
- Replaces the full resource (contrast with `PATCH`)
- The URL identifies the specific resource being replaced

**Common mistakes:**
Using `PUT` when you only want to update one field, then accidentally wiping other fields. If you're sending a `PUT` request, you need to include the complete resource representation. For partial updates, use `PATCH`.

```javascript
// PUT without all fields — may wipe data
fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ email: 'alice.new@example.com' })
  // "name" and "role" are now gone on the server
})

// Right: include the full resource
fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'Alice Nakamura', email: 'alice.new@example.com', role: 'admin' })
})
```

## PATCH — Update a Resource Partially

`PATCH` updates only the specified fields of a resource, leaving others untouched.

```
PATCH /api/users/123 HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "email": "alice.new@example.com"
}
```

**What happens:**
- The server applies the provided changes to the resource
- Only the fields in the request body are modified

**Key characteristics:**
- Not idempotent (though in practice many implementations make it safe to retry)
- Only the provided fields are changed
- Requires the server to understand a patch format (often JSON Merge Patch `application/merge-patch+json` or JSON Patch `application/json-patch+json`)

**Common mistakes:**
Confusing `PATCH` with `PUT`. `PUT` replaces; `PATCH` modifies. Also, some developers send a full resource with `PATCH` and wonder why the server treats it like a `PUT`.

```javascript
// PATCH only updates the email field
fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ email: 'alice.new@example.com' })
})
// Server keeps "name" and "role" unchanged
```

## DELETE — Remove a Resource

`DELETE` removes the resource at the specified URL.

```
DELETE /api/users/123 HTTP/1.1
Host: example.com
```

**What happens:**
- The server removes the resource
- Returns `204 No Content` on success (empty body)
- Returns `404 Not Found` if the resource didn't exist

**Key characteristics:**
- Idempotent — deleting the same resource twice returns the same response (`404` or `204`)
- Typically no request body (though some APIs accept one)
- The URL fully identifies what's being deleted

**Common mistakes:**
Confusing `DELETE` with a soft delete (marking a record as "archived"). If you're not actually removing the resource from storage, use `PATCH` to update a `deleted_at` or `status` field, not `DELETE`. True `DELETE` is permanent in most implementations.

```javascript
// Permanent delete
fetch('/api/users/123', { method: 'DELETE' })

// Soft delete — update a status field instead
fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'deleted', deleted_at: new Date().toISOString() })
})
```

## HEAD and OPTIONS — Utility Methods

Two more methods come up regularly:

**HEAD** — Same as `GET` but returns only headers, no body. Useful for checking if a resource exists, getting file size before downloading, or validating cache headers without transferring data.

```
HEAD /api/users HTTP/1.1
Host: example.com
```

**OPTIONS** — Returns which HTTP methods the server supports for a given URL. Browsers send `OPTIONS` requests as CORS preflights before making cross-origin requests.

```
OPTIONS /api/users HTTP/1.1
Host: example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

HTTP/1.1 204 No Content
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Max-Age: 86400
```

## Quick Reference Table

| Method | Purpose | Body | Idempotent | Cacheable |
|--------|---------|------|------------|-----------|
| `GET` | Retrieve resource | No | Yes | Yes |
| `POST` | Create / trigger action | Yes | No | No |
| `PUT` | Replace entire resource | Yes | Yes | No |
| `PATCH` | Update partial resource | Yes | No* | No |
| `DELETE` | Remove resource | Optional | Yes | No |
| `HEAD` | Get headers only | No | Yes | Yes |
| `OPTIONS` | Check supported methods | No | Yes | No |

*In practice, PATCH is often safe to retry even though the spec says it's not idempotent.

## Common Mistakes by Endpoint Pattern

### /api/users (no ID)
- `GET` — List all users
- `POST` — Create a new user
- `OPTIONS` — Return supported methods

### /api/users/:id (with ID)
- `GET` — Get one user
- `PUT` — Replace one user (full update)
- `PATCH` — Update one user (partial update)
- `DELETE` — Remove one user

### Wrong method on the right endpoint
- Using `POST` to update a user — Consider `PATCH` or `PUT`
- Using `GET` to create a user — The server may accept it but it's semantically wrong and often gets cached
- Using `DELETE` to soft-delete — Use `PATCH` instead

## Using Toolblip to Inspect HTTP Methods

When debugging API calls, you need to see not just the response body but the full HTTP conversation — status codes, headers, and timing. Toolblip's [HTTP Headers Viewer](/tools/http-headers-viewer) lets you inspect any URL's response headers to verify the correct status code (`201 Created`, `204 No Content`, `404 Not Found`) and check for caching headers.

For building and testing HTTP requests, Toolblip's [JSON Formatter](/tools/json-formatter) helps you validate the JSON body before sending it. Malformed JSON in a `POST` or `PUT` body is one of the most common API bugs.

## Related Guides

- [HTTP Headers: What Every Developer Should Inspect (And Why)](/blog/2026-04-30-http-headers-guide) — A companion guide to this post — learn to read the full HTTP response conversation
- [JSON Formatter Guide](/blog/2026-04-17-json-formatter-guide) — Validate your request bodies before sending them to an API
- [UUID v4 Generator Online](/blog/2026-04-17-uuid-v4-generator-online) — Generate unique IDs for resources you'll create with `POST`

---

HTTP methods are a contract between client and server. Get the semantics right and your API is predictable, cacheable, and hard to misuse. Pick the wrong method and you'll spend time debugging caching bugs, accidental data loss, or security issues that could have been avoided with one line of code.
