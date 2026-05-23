---
title: "Time-Ordered IDs Explained: UUID v7 vs SparkID vs ULID for Database Design"
description: "Compare UUID v7, SparkID, and ULID  -  three time-ordered ID formats that fix the performance problems of random UUIDs in databases. Learn which one to use and why."
date: 2026-05-02
category: Developer Tools
---

If you've ever inserted millions of rows into a database and watched your index performance tank, you already know the problem with random UUIDs. They're great for distributed uniqueness but terrible for insert locality  -  your database is constantly splitting B-tree pages because incoming rows have IDs scattered across the keyspace.

The solution: **time-ordered identifiers**. They look random but sort by creation time, which keeps your database index hot, predictable, and fast.

Three formats compete for this space: **UUID v7**, **SparkID**, and **ULID**. Here's how they stack up.

## What Makes an ID Time-Ordered?

Time-ordered IDs embed a timestamp in the first bytes. This means:

- Newer IDs sort after older IDs in a standard lexicographic sort
- Database inserts hit the "right side" of the B-tree, reducing page splits
- You can extract the creation time without a database lookup
- You still get globally unique IDs  -  no central coordinator needed

The trade-off is that IDs reveal approximate creation time. If that's a concern for your use case, random UUIDs (v4) might still be the better choice.

## UUID v7: The New Standard

**UUID v7** (RFC 9562, published 2024) is the first UUID version designed specifically for time-ordering. It encodes a 48-bit Unix timestamp in the most significant 48 bits, followed by version bits and random data.

```
018f1e4e-7a92-7d3c-9f41-8a3b5c7d9e2f
↑ timestamp bits                ↑ random bits
```

### Key properties

- **48-bit timestamp**  -  precision to the millisecond, covers years 1970–10889
- **74 bits of randomness**  -  more than enough for collision resistance
- **Standard format**  -  36 characters with hyphens, widely supported
- **Lexicographically sortable**  -  works natively with `ORDER BY id`

### The catch

Hyphens make IDs hard to select with a double-click (`018f1e4e-7a92-7d3c-9f41-8a3b5c7d9e2f` breaks mid-segment). When sharing IDs in Slack, Discord, or code reviews, you'll spend time deleting hyphens.

Also, 36 characters is verbose for URLs and table primary keys.

### Generate UUID v7 in your browser

[Toolblip's UUID v7 Generator](/tools/uuid-generator) lets you create RFC-compliant v7 UUIDs instantly  -  no signup, no uploads, no ads.

## SparkID: Compact and Sortable

**SparkID** is a Rust-built format from the Spark.io team, designed as a direct replacement for UUIDs in their production systems. It's 21 characters with no hyphens, and sorts lexicographically.

```
0x018F1E4E7A927D3C9F41
```

### Key properties

- **21 characters**  -  significantly shorter than UUIDs (36 chars) or ULIDs (26 chars)
- **No hyphens**  -  double-click selection works cleanly
- **63-bit payload**  -  48 bits timestamp + 15 bits random
- **URL-safe**  -  works as a path segment without encoding
- **Cryptographically ordered**  -  timestamp in the high bits guarantees sort order

### The catch

It's not an IETF standard  -  just an internal format from Spark that they've open-sourced. Browser-native support is nonexistent. You'll need a library to generate or parse them.

The 15-bit random component is also smaller than UUID v7's 74 bits. For extremely high-volume systems (billions of IDs per day), collision probability becomes non-trivial.

### When SparkID shines

If you're building internal tooling, microservices with human-readable IDs, or anything where compactness and URL safety matter, SparkID is worth considering. Toolblip's [UUID Generator](/tools/uuid-generator) includes SparkID generation.

## ULID: The 26-Character Alternative

**ULID** (Universally Unique Lexicographically Sortable Identifier) predates UUID v7 and inspired much of its design. It encodes 48 bits of timestamp + 80 bits of randomness into a Crockford Base32 string.

```
01ARZ3NDEKTSV4RRFFQ69G5FAV
```

### Key properties

- **26 characters**  -  shorter than UUIDs, longer than SparkID
- **Crockford Base32**  -  uses a human-readable alphabet (no `I`, `L`, `O`, `U` to avoid confusion)
- **Lexicographically sortable**  -  timestamp-first encoding
- **Multiple language libraries**  -  excellent ecosystem support

### The catch

The 80-bit random component is large, but ULIDs aren't cryptographic  -  they're pseudorandom. The timestamp precision is millisecond like UUID v7.

The alphabet looks like a CAPTCHA to some developers, and it doesn't sort numerically (only lexicographically).

## Side-by-Side Comparison

| Property | UUID v7 | SparkID | ULID |
|---|---|---|---|
| **Format** | `xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx` | `0x[40 hex chars]` | `[26 Crockford Base32 chars]` |
| **Length** | 36 chars | 21 chars | 26 chars |
| **Hyphens** | Yes | No | No |
| **Timestamp bits** | 48 | 48 | 48 |
| **Random bits** | 74 | 15 | 80 |
| **Standard** | RFC 9562 | Community | Community |
| **Browser-native** | No | No | No |
| **Sortable** | Yes | Yes | Yes |

## Which Should You Use?

### Use UUID v7 when:

- You need maximum compatibility and future-proofing
- You're building public APIs or cross-platform systems
- You want a standard with library support across every language
- The 36-character format is acceptable

```javascript
// Generating UUID v7 in Node.js (no external lib needed since Node 22)
import { randomUUID } from 'crypto';

function uuidv7() {
  const timestamp = Date.now();
  const hex = timestamp.toString(16).padStart(12, '0');
  const random = randomUUID().replace(/-/g, '').slice(0, 16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7${random.slice(0, 3)}-${random.slice(3, 7)}-${random.slice(7)}`;
}
```

### Use SparkID when:

- Compactness matters (URLs, mobile UIs, compact storage)
- You're inside a single organization or system
- You can manage your own library dependency
- You need the cleanest human-readable format

### Use ULID when:

- You need a proven, widely-adopted format
- Crockford Base32 readability is a plus for your team
- You need libraries in obscure languages (ULID has the broadest ecosystem)
- You want something UUID-like but with better sortability

### Use random UUID v4 when:

- IDs must reveal nothing about creation time (security through obscurity is sometimes valid)
- You already have a working system and migration cost is high
- You're building read-heavy systems where insert locality doesn't matter much

## The Practical Take

UUID v7 won the format war by becoming an actual standard. If you're starting fresh and don't have a strong reason to pick SparkID or ULID, **use UUID v7**. It's sortable, it's standard, and every language has a library for it.

That said, if you need something compact and your team is comfortable with non-standard formats, SparkID's 21-character string is genuinely pleasant to work with.

Toolblip's [UUID Generator](/tools/uuid-generator) generates UUID v4 and v7 on the spot  -  no install, no upload, no waiting. Bookmark it for your next database design sprint.
