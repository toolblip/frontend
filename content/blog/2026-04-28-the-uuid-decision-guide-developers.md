---
title: "The UUID Decision Guide: Which Version Should You Actually Use?"
description: "Stop guessing which UUID version to pick. This guide covers v1, v4, v5, and v7 — with real trade-offs, code examples, and a decision framework for every use case."
date: '2026-04-28'
category: Developer Tools
tags:
  - uuid
  - database
  - javascript
  - api-design
  - distributed-systems
  - postgresql
author: Toolblip Team
readingTime: 8 min
descriptionSEO: "UUID v1 vs v4 vs v5 vs v7 explained for developers. When to use each version, real code examples in JavaScript and Python, and a decision framework that actually helps."
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

Every developer hits the same wall eventually. You need a unique identifier for something — a user, an order, a session, a record — and someone on your team asks "should we use UUID v4 or... what's the other one?" And then you're reading RFC 4122 at 11pm.

This guide skips the theory you don't need and gives you a decision framework you can actually use. By the end, you'll know exactly which UUID version to reach for in any situation — and why.

## What a UUID Actually Is

A UUID is a 128-bit identifier written as 32 hex digits separated by hyphens:

```
f47ac10b-58cc-4372-a567-0e02e2d5f6b1
```

That's 2¹²⁸ possible values. To give you a sense of scale: if you generated a billion UUIDs per second, it would take longer than the age of the universe to generate a collision. Statistically, you don't need to worry about uniqueness — the math handles that.

What you *do* need to worry about is **which version** you're generating. Each version has a different generation algorithm, different properties, and different trade-offs.

---

## UUID v1 — Time + Node

UUID v1 is the original. It encodes three things:

- **A 60-bit timestamp** (in 100-nanosecond intervals since October 1582)
- **A 14-bit clock sequence** (to handle clock drift)
- **A 48-bit node identifier** (usually the MAC address of your machine)

```javascript
// v1 structure (not actual code — this is how it's built)
// [timestamp_low: 32 bits][timestamp_mid: 16 bits][timestamp_hi: 12 bits][clock_seq: 14 bits][node: 48 bits]
```

**The defining property:** v1 UUIDs are time-ordered. A UUID generated after another one will sort *after* it in most implementations. This also means they reveal when and where they were created.

```javascript
// If you need v1 in JavaScript (requires a library)
import { v1 } from 'uuid';
const id = v1();
// "7f501b00-9dad-11ef-8e4d-0242ac120002"
```

**When to use v1:**
- Legacy systems already using v1 where changing would require a migration
- Internal audit logs where knowing which machine generated a UUID genuinely matters
- Distributed databases (Cassandra, ScyllaDB) that benefit from time-ordered keys

**When to avoid v1:**
- Any externally-facing system — you're leaking your machine's MAC address
- New projects — v7 gives you the same time-ordering without the privacy cost

---

## UUID v4 — Random (The Default)

UUID v4 is what you get from `crypto.randomUUID()`, `uuid.uuid4()`, and `gen_random_uuid()` in PostgreSQL. 122 of the 128 bits are random. Six bits are fixed to mark the version and variant.

```javascript
// Every modern browser and Node.js
const id = crypto.randomUUID();
console.log(id); // "f47ac10b-58cc-4372-a567-0e02e2d5f6b1"
```

```python
import uuid
id = uuid.uuid4()
print(id)  # UUID('f47ac10b-58cc-4372-a567-0e02e2d5f6b1')
```

```sql
-- PostgreSQL
SELECT gen_random_uuid();
-- MySQL
SELECT UUID();
```

**The defining property:** pure randomness. No information about time, machine, or anything else.

**When to use v4:**
- As the default choice for most new systems
- When you don't need to infer anything from the ID itself
- When IDs will be exposed externally (no privacy leakage)
- Any situation where you just need a guaranteed-unique identifier

**When to avoid v4:**
- Database primary keys on rotating storage at high write volumes — random UUIDs cause index fragmentation
- When you need deterministic output from the same input (use v5)
- When time-ordering matters for sorting or audit (use v7)

### One gotcha with v4: RNG quality

Most modern environments use a cryptographically secure RNG, but older or poorly configured systems sometimes don't. In JavaScript, always use `crypto.randomUUID()` rather than rolling your own:

```javascript
// ✅ Good — uses Web Crypto API
const id = crypto.randomUUID();

// ⚠️ Bad — might use Math.random() depending on the library
const id = require('uuid').v4();
```

---

## UUID v5 — Namespace + Name (Deterministic)

UUID v5 generates the same UUID from the same namespace and name, every time. It's built by hashing a namespace UUID and your input string with SHA-1.

```javascript
import { v5 } from 'uuid';

// Define a namespace (use a well-known one or your own)
const NAMESPACE_URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

// Same namespace + same name = same UUID, every time
const userUUID = v5(NAMESPACE_URL, 'user-ray');
const orderUUID = v5(NAMESPACE_URL, 'order-12345');
```

```python
import uuid

NAMESPACE_URL = uuid.UUID('6ba7b811-9dad-11d1-80b4-00c04fd430c8')
user_uuid = uuid.uuid5(NAMESPACE_URL, 'user-ray')
```

**The defining property:** deterministic. Run it once or a million times — the output is identical.

**When to use v5:**
- Generating stable IDs for external resources (webhooks, OAuth subjects, content-addressable storage)
- Creating consistent IDs across distributed systems without a central coordinator
- When the same logical entity should always get the same ID regardless of which service generates it

**When to avoid v5:**
- As a primary key for frequently updated records (the ID doesn't change when the data does)
- When you need any kind of time-ordering (v5 IDs have no time component)

Well-known namespaces from RFC 4122:

| Namespace | UUID |
|-----------|------|
| DNS | `6ba7b810-9dad-11d1-80b4-00c04fd430c8` |
| URL | `6ba7b811-9dad-11d1-80b4-00c04fd430c8` |
| Object identifier (OID) | `6ba7b812-9dad-11d1-80b4-00c04fd430c8` |
| X.500 DN | `6ba7b814-9dad-11d1-80b4-00c04fd430c8` |

---

## UUID v7 — Time-Ordered + Private (The Modern Choice)

UUID v7 is the newest version and the one you should default to for new projects. It encodes a Unix timestamp as the first component, with the rest filled with random bits.

```
0191b14c-9e3b-7a2c-d567-0e02e2d5f6b1
 └─ Unix timestamp ─┘└ version└ random
```

```javascript
// JavaScript — requires the `uuid` library (v11+)
import { v7 } from 'uuid';
const id = v7();

// Python — Python 3.12+
import uuid
id = uuid.uuid7()

// PostgreSQL 17+
SELECT gen_random_uuid(v7);
```

```javascript
// Verify a UUID v7 in JavaScript
const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const id = v7();
console.log(UUID_V7_REGEX.test(id)); // true
```

**The defining property:** time-ordered *and* privacy-safe. It sorts by generation time like v1, but uses random bits instead of a MAC address like v4.

**When to use v7:**
- New database primary keys where you want insert locality without sacrificing privacy
- Distributed systems where multiple nodes generate IDs independently
- Audit logs and event streams where sort order matters
- Any new project where you don't have a specific reason to pick something else

**When to avoid v7:**
- Environments without library support (JavaScript requires a library; older Python versions need `uuid` module)
- When you need deterministic output from the same input (use v5)
- Clock skew across distributed nodes is a concern (though v7 handles this better than v1)

---

## The Decision Framework

Here's how to pick the right version in practice:

### "I'm building a new system and just need unique IDs"

→ **UUID v4.** It's the default for a reason. `crypto.randomUUID()` in JavaScript, `uuid.uuid4()` in Python, `gen_random_uuid()` in PostgreSQL. Done.

### "I'm designing a database schema and care about write performance"

→ **UUID v7.** Time-ordered UUIDs like v7 have sequential insert patterns — new rows go at the end of the B-tree index instead of randomly scattered. This matters at scale. PostgreSQL 17+, CockroachDB, and MongoDB support v7 natively.

### "I need the same ID for the same input every time"

→ **UUID v5.** Deterministic UUIDs are generated by hashing a namespace + name. Same inputs always produce the same output across any system, any language.

### "I'm working with legacy infrastructure that already uses v1"

→ **UUID v1.** No need to migrate if it's working. Just understand the privacy implications of MAC address exposure.

### "I'm building a webhook system or need stable IDs for external resources"

→ **UUID v5.** Generate a v5 UUID for each external resource using a namespace you control. The same resource always gets the same ID regardless of which service processes it.

---

## Quick Comparison Table

| Version | Sort order | Privacy-safe | Deterministic | Best for |
|---------|------------|--------------|---------------|----------|
| v1 | ✅ Time-ordered | ❌ MAC exposed | ❌ | Legacy systems, audit logs |
| v4 | ❌ Random | ✅ No leaks | ❌ | Default for new work |
| v5 | ❌ Random | ✅ No leaks | ✅ | Stable external IDs |
| v7 | ✅ Time-ordered | ✅ No leaks | ❌ | New DB schemas, event streams |

---

## Common Mistakes Developers Make with UUIDs

### Confusing v4 with v1

v4 and v1 both have "random-looking" strings, but v1 encodes your machine's MAC address. If you're using v1 and don't realize it, you're leaking internal infrastructure information in every ID you expose.

### Using v4 as a database primary key at scale without understanding the trade-off

v4 as a primary key works fine up to a few million rows. Past that, index fragmentation on rotating storage becomes measurable. If you're building something that will grow large, consider v7 from day one — migrations are painful.

### Using v5 for mutable entities

v5 IDs are deterministic but not tied to the entity's state. If you generate a v5 UUID for "user Ray" and then update Ray's email, the UUID stays the same — which is correct behavior. But if you're generating a UUID as a *version* identifier for a changing entity, v5 won't help you track versions.

### Not validating UUID format in APIs

```javascript
// Validate UUID format in JavaScript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str) {
  return UUID_REGEX.test(str);
}

isValidUUID('f47ac10b-58cc-4372-a567-0e02e2d5f6b1'); // true
isValidUUID('not-a-uuid'); // false
```

---

## Generate UUIDs Instantly in Your Browser

Stop installing libraries just to generate a few test UUIDs. Toolblip's UUID Generator runs entirely in your browser — no data sent to any server — and supports all four versions:

**→ [UUID Generator — v1, v4, v5, v7](/tools/uuid-generator)**

Select your version, set a batch size, and copy. You can also:

- Generate UUIDs in bulk (up to 10,000 at once)
- See the hex breakdown of each UUID to understand its structure
- Validate UUIDs you paste in

All generation uses the Web Crypto API for the random bits. No tracking, no accounts, no upload.

---

## The Bottom Line

- **v4** is your safe default. Use it unless you have a reason not to.
- **v7** is the future-proof choice for database keys. It solves v4's index fragmentation problem while keeping v4's privacy properties.
- **v5** is for when you need deterministic, stable IDs from unpredictable inputs.
- **v1** is for legacy systems — not new projects.

Pick the right one for the job. Your future self debugging a bloated PostgreSQL index will thank you.

---

## Related Tools

- **[UUID Generator](/tools/uuid-generator)** — Generate v1, v4, v5, and v7 UUIDs in your browser
- **[JSON Formatter](/tools/json-formatter)** — Validate and pretty-print API responses
- **[Regex Tester](/tools/regex-tester)** — Test patterns against sample text with real-time match highlighting
- **[Hash Generator](/tools/hash-generator)** — SHA-1, SHA-256, MD5 — useful when working with v5 namespaces

---

*No data leaves your browser. All UUID generation on Toolblip uses the Web Crypto API.*
