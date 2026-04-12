---
title: "The Complete Guide to HTTP Status Codes in 2026"
description: "Every HTTP status code explained. From 100 to 511 — what each code means, when to use it, and what the client should do next."
slug: "http-status-codes-guide"
date: "2026-04-17"
category: "Developer Tools"
tags: ["http", "api", "web-development", "rest", "debugging"]
author: "Toolblip Team"
readingTime: "8 min"
descriptionSEO: "Complete HTTP status code reference guide. 1xx to 5xx explained with examples. Learn what every HTTP code means and when to use it in your API."
---

Every developer hits an unexpected `403` or `429` at some point and wastes time guessing what happened. HTTP status codes are a shared language between servers and clients — learning them properly saves hours of debugging and makes your APIs better.

## How Status Codes Work

HTTP responses have a three-digit status code. The first digit tells you the category:

| Range | Meaning |
|-------|---------|
| 1xx | **Informational** — request received, continuing |
| 2xx | **Success** — request successfully received and accepted |
| 3xx | **Redirection** — further action needed |
| 4xx | **Client Error** — request has bad syntax or is unauthorized |
| 5xx | **Server Error** — server failed to fulfill a valid request |

## 1xx — Informational

These indicate the request was received and understood, but the client should wait for the final response. Rarely seen in practice.

### 100 Continue
The client should continue sending the request body. Used in "expect 100-continue" handshake before large uploads.

### 101 Switching Protocols
Server is switching protocols (e.g., HTTP → WebSocket via Upgrade header). You'll see this in WebSocket connections.

---

## 2xx — Success

### 200 OK
The request succeeded. The meaning of "success" depends on the HTTP method:

- `GET`: resource fetched and sent back
- `POST`: resource created (or action completed)
- `PUT`/`PATCH`: resource updated

### 201 Created
A new resource was created. Always include a `Location` header pointing to the new resource.

```json
// POST /users
// Response: 201 Created
// Location: /users/usr_abc123
{
  "id": "usr_abc123",
  "name": "Harun Ray",
  "email": "harun@toolblip.com"
}
```

### 202 Accepted
Request accepted for processing but not completed yet. Useful for async operations — the client checks back later.

### 204 No Content
Success, but no body returned. Use after `DELETE` or successful update where you don't need to return data.

```http
DELETE /users/usr_abc123 HTTP/1.1
HTTP/1.1 204 No Content
```

### 206 Partial Content
Server returning part of a resource (not the full thing). Used for resumable downloads and audio/video streaming with Range headers.

---

## 3xx — Redirection

### 301 Moved Permanently
The resource has a new permanent URL. All future requests should use the new URL. Browsers cache this.

### 302 Found (Temporary Redirect)
The resource is temporarily at a different URL. Clients should keep using the original URL for future requests.

**The problem with 302:** Many clients change the POST to GET on redirect (violating HTTP spec). For temporary redirects that preserve the method, use **307** instead.

### 307 Temporary Redirect
Same as 302 but guarantees the method won't change. Use when redirecting `POST`/`PUT` requests temporarily.

### 308 Permanent Redirect
Same as 301 but guarantees the method won't change. Use instead of 301 when redirecting API endpoints.

### 304 Not Modified
"The resource hasn't changed since your last request." Used with conditional requests via `If-None-Match` or `If-Modified-Since` headers. The browser uses its cached copy. No body returned.

---

## 4xx — Client Errors

The server is saying: *you* made the mistake.

### 400 Bad Request
The request has invalid syntax or the parameters are wrong. Include an `error` object explaining what.

```json
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required.",
    "details": { "field": "email" }
  }
}
```

### 401 Unauthorized
You need to authenticate (provide credentials). The response should include a `WWW-Authenticate` header.

### 403 Forbidden
You are authenticated but don't have permission. Unlike 401, authentication doesn't help — the server is explicitly refusing you.

### 404 Not Found
The resource doesn't exist. Note: some APIs return 404 for both "resource doesn't exist" and "you don't have access" (to avoid information leakage). Without knowing which, a 404 and 403 look identical from the outside.

### 405 Method Not Allowed
The HTTP method isn't supported for this endpoint. Include an `Allow` header listing valid methods.

```http
HTTP/1.1 405 Method Not Allowed
Allow: GET, POST, DELETE
```

### 409 Conflict
The request conflicts with the current state — e.g., creating a duplicate user, uploading a file that already exists, or a version conflict.

### 410 Gone
The resource existed but has been permanently deleted. Unlike 404, the server is explicitly saying "this is gone forever."

### 415 Unsupported Media Type
The request body format isn't supported. Sending JSON to an endpoint that only accepts `multipart/form-data` returns this.

### 422 Unprocessable Entity
The request format is correct but the content is semantically wrong — valid JSON but invalid field values, for example.

### 429 Too Many Requests
Rate limited. Include a `Retry-After` header telling the client when to try again.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
```

---

## 5xx — Server Errors

The server broke, not the client. These should be rare and taken seriously.

### 500 Internal Server Error
Something unexpected happened on the server. The generic "something broke" response. Always log these.

### 502 Bad Gateway
A server acting as a gateway or proxy received an invalid response from the upstream server. Common when a backend service is down.

### 503 Service Unavailable
The server is temporarily overloaded or under maintenance. Include a `Retry-After` header if possible.

### 504 Gateway Timeout
A server acting as gateway didn't get a timely response from the upstream server.

---

## Common Misuses

**Never return 200 for errors.** A `catch (e)` that logs and returns `res.json({ error: '...' })` with a 200 status is aAPI anti-pattern. It makes it impossible for clients to know if the request succeeded.

**Don't use 404 for access control.** If a user doesn't have permission, use 403. Using 404 hides whether the resource exists at all.

**Don't use 500 for expected errors.** If a user tries to transfer more money than they have, that's a 400 (business rule violation), not a 500 (unexpected error).

**Don't use 301 for API version migrations.** Use 308 to preserve the HTTP method, or 307 if it's truly temporary.

## Security Note

Error responses should be consistent. Returning different status codes or messages for "user not found" vs "wrong password" in a login endpoint tells attackers which email addresses are registered. Return the same 401 for both, and log details server-side.

## Quick Reference Table

| Code | When to use |
|------|-------------|
| 200 | General success |
| 201 | Resource created |
| 204 | Success, no body |
| 301/302 | Redirect (permanent/temporary) |
| 304 | Cache hit, use cached |
| 400 | Bad request syntax |
| 401 | Not authenticated |
| 403 | Authenticated, no permission |
| 404 | Resource not found |
| 409 | Conflict with current state |
| 422 | Valid syntax, invalid content |
| 429 | Rate limited |
| 500 | Unexpected server error |
| 502/503/504 | Gateway/backend issues |

All Toolblip API endpoints follow this standard. See the [API documentation](/api-docs) for the full specification.
