---
title: "The Definitive Guide to Time-Ordered Database IDs: UUID v7 vs ULID vs SparkID"
description: "Tired of random UUIDs that kill your database performance? Compare UUID v7, ULID, and SparkID — three time-ordered ID formats that sort cleanly and scale to billions."
date: '2026-04-23'
category: Developer Tools
tags:
  - databases
  - uuid
  - ulid
  - backend
  - postgresql
  - api-design
  - distributed-systems
author: Toolblip Team
readingTime: 8 min
descriptionSEO: "Compare UUID v7 vs ULID vs SparkID for time-ordered database IDs. Learn format, performance, and when to use each. With JavaScript and PostgreSQL examples."
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

If you've ever wondered why your database queries on UUID primary keys feel sluggish, here's the uncomfortable truth: **standard UUID v4 is terrible for indexing**.

Random 128-bit IDs scatter inserts across your B-tree index like confetti. As your table grows, your index bloats, your cache hit rate drops, and your queries slow down. That's not a PostgreSQL problem — it's a UUID problem.

The solution? Time-ordered IDs. They preserve the uniqueness guarantees you need while keeping inserts clustered and indexes compact.

Three formats have emerged as the leading contenders: **UUID v7**, **ULID**, and **SparkID**. Here's how they stack up.

## Why Time-Ordered IDs Matter

Before diving into the formats, let's address *why* ordering matters.

A B-tree index stores values in sorted order. When you insert a random UUID v4, the database has to find a random leaf node, split it if needed, rebalance the tree — and repeat millions of times. With time-ordered IDs, new inserts cluster near recently added pages, which are already in memory. The difference is measurable: 20-40% faster writes on large tables, significantly better cache utilization.

The tradeoff is privacy: because IDs encode timestamp information, they're guessable. If your IDs are public (like in a URL), time-ordered formats leak when records were created. For internal IDs, this is rarely a concern.

## UUID v7: The IETF Standard

UUID v7 is the new kid on the block, standardized in [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html) in 2024. It combines a 48-bit Unix timestamp with random bits to create a 122-bit identifier that's lexicographically sortable and collision-resistant.

**Format:**
```
018f1e8d-5a7f-8b3c-9d2f-1e4a6b8c0d1e
   ^^^^^^ timestamp
                 ^^^^^^ random
```

**Key characteristics:**
- 48-bit timestamp (millisecond precision, valid until ~2109)
- 74 bits of random data
- Lexicographically sortable
- Standard UUID format — works with existing UUID columns
- No external dependency

**Generate with Toolblip:**
→ [/tools/uuid-generator](/tools/uuid-generator) — select UUID v7

**JavaScript implementation:**

```javascript
// Generate UUID v7 in pure JavaScript
function generateUUIDv7() {
  const now = Date.now();
  const timestampHex = now.toString(16).padStart(12, '0');
  const randomHex = Array.from({ length: 16 }, 
    () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
  ).join('').slice(0, 20);
  
  return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-${'7' + timestampHex.slice(12, 15)}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 20)}`;
}
```

**PostgreSQL example:**

```sql
-- Create table with UUID v7 default
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- PostgreSQL 13+
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- For UUID v7, use the pg_uuidv7 extension (PostgreSQL 15+)
-- or generate in application code
```

UUID v7's biggest advantage is **adoption momentum**. It's an IETF standard, already supported in PostgreSQL 15+ (`gen_random_uuid()` generates v7), and coming to more databases. If you're starting a new project and want the safest long-term bet, this is it.

## ULID: Universally Unique Lexicographically Sortable Identifier

ULID was created by the same folks behind the `ulid` npm package, with a slightly different binary layout. It encodes 48 bits of timestamp + 80 bits of randomness into a 26-character Crockford Base32 string.

**Format:**
```
01ARZ3NDEKTSV4RRFFQ69G5FAV
 ^^^^^^^^ timestamp
          ^^^^^^^^^^^^^^ randomness
```

**Key characteristics:**
- 48-bit timestamp (millisecond precision)
- 80 bits of randomness — slightly more entropy than UUID v7
- Lexicographically sortable
- More compact than UUID (26 chars vs 36)
- Crockford Base32 encoding (URL-safe, no special chars)
- **Not binary-compatible with UUID columns**

**Generate with Toolblip:**
→ [/tools/ulid-generator](/tools/ulid-generator) *(coming soon — bookmark this page)*

**JavaScript implementation:**

```javascript
import { ulid } from 'ulid';

// Generate a ULID
const id = ulid(); // "01ARZ3NDEKTSV4RRFFQ69G5FAV"

// Get timestamp from ULID
const timestamp = ulid.decodeTime(id); // Unix timestamp in milliseconds
```

**PostgreSQL note:** ULID requires a `TEXT` column, not `UUID`. You'll lose native UUID operator support (`=`, `<>`, `uuid_generate_v5()`, etc.), but gain a more compact string representation.

ULID's edge case is **sub-millisecond ordering**: two ULIDs generated in the same millisecond sort by the random component, which is random. This means two records created simultaneously could have their sort order determined by chance — rarely a problem, but worth knowing.

## SparkID: The New Rust-Based Contender

SparkID (stylized as *sparkid*) launched in early 2025 as a Rust-native alternative optimized for sortability and brevity. It produces a 21-character ID that's smaller than both UUID (36 chars) and ULID (26 chars).

**Format:**
```
_78imSr00k3s2j8mwz00k7p9k
 ^ timestamp (base62, ~13 chars)
   randomness (base62, ~8 chars)
```

**Key characteristics:**
- ~89 bits of entropy
- 21 characters — most compact of the three
- Base62 encoding (A-Za-z0-9)
- Sortable by timestamp, random suffix breaks ties
- Newer, less battle-tested
- Rust library required for generation

**JavaScript implementation:**

```javascript
// Using the sparks-id npm package
import { generate } from 'sparks-id';

const id = generate(); // "_78imSr00k3s2j8mwz00k7p9k"
```

PostgreSQL storage is `TEXT`. Benchmark-wise, SparkID generation is [significantly faster](https://www.reddit.com/r/rust/comments/1svnwd8/sparkid_21character_sortable_unique_ids/) than UUID v7 in Rust, though the difference is negligible in JavaScript.

## Head-to-Head Comparison

| Feature | UUID v7 | ULID | SparkID |
|---------|---------|------|---------|
| **Format** | 36 chars, hex/hyphen | 26 chars, Base32 | 21 chars, Base62 |
| **Timestamp bits** | 48-bit | 48-bit | ~50-bit |
| **Random bits** | 74-bit | 80-bit | ~40-bit |
| **Sortable** | ✅ | ✅ | ✅ |
| **Standard** | IETF RFC 9562 | Community spec | Community spec |
| **JS library size** | ~2KB | ~1KB | ~5KB |
| **Binary UUID compatible** | ✅ | ❌ | ❌ |
| **Millisecond precision** | ✅ | ✅ | ✅ |
| **Year 2109+ valid** | ✅ | ✅ | ❌ (overflows ~2105) |

## Which Should You Use?

**Use UUID v7 if:**
- You want maximum compatibility with existing UUID columns
- You need IETF standard backing (audit requirements, enterprise)
- You're starting a new project today and want the safest choice
- You already use PostgreSQL 15+ with `gen_random_uuid()`

**Use ULID if:**
- You want compact IDs for URLs (26 chars vs 36)
- You're in a JavaScript-first environment
- You want slightly more randomness (80 bits vs 74)
- You don't need UUID column compatibility

**Use SparkID if:**
- You prioritize character count above all else (21 chars is *tiny*)
- You're building in Rust or can add a Rust binary
- You don't care about bleeding-edge maturity
- You want IDs that sort well in lexicographic comparisons

## Migration Strategy

Switching ID formats on an existing system isn't trivial. Here's a pragmatic approach:

1. **Add new column** — don't drop the old ID column yet
2. **Dual-write** — start generating both old and new format IDs
3. **Backfill** — populate new IDs for existing rows in batches
4. **Migrate reads** — update application code to read from new column
5. **Migrate writes** — update write paths to use new format
6. **Drop old column** — after confirming no references remain

```sql
-- Step 1-3: Add new column and backfill
ALTER TABLE orders ADD COLUMN id_v7 UUID;
UPDATE orders SET id_v7 = gen_random_uuid() 
  WHERE id_v7 IS NULL;
```

For a live production system, migration can take weeks or months. That's okay — the dual-write phase is safe as long as you don't drop the old column until you're certain.

## The Bottom Line

UUID v7 won the standards race. It's backed by the IETF, supported natively in PostgreSQL 15+, and has broad driver support. Unless you have a specific reason to pick ULID or SparkID, **UUID v7 is the default choice for new projects**.

That said, all three beat UUID v4 for database performance. If you're still using random UUIDs and wondering why your indexed queries feel slow — now you know. The fix is a migration away.

→ Generate UUIDs (all versions) at [/tools/uuid-generator](/tools/uuid-generator)
→ Try our [JSON Formatter](/tools/json-formatter) to debug API responses
→ Learn about [cron expressions](/blog/cron-expression-guide) for scheduled database maintenance
