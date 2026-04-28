---
title: 'Unix Timestamp Converter: From Epoch to Human-Readable Dates'
description: >-
  Convert Unix timestamps to readable dates and back instantly. Learn what the
  Unix epoch is, how timestamps work across timezones, and why every developer
  should understand them.
publishDate: '2026-04-17'
slug: unix-timestamp-converter
readingTime: 5 min
author: Harun R Rayhan
tags:
  - unix-timestamp
  - datetime
  - developer-tools
  - javascript
  - python
category: Developer Tools
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

Every server, every database, every logging system eventually touches a Unix timestamp. Yet developers constantly misread them, misconvert them, and lose hours debugging timezone bugs caused by timestamp confusion.

This guide gives you a complete mental model for Unix timestamps so you stop guessing.

## What Is the Unix Epoch?

The Unix epoch is `00:00:00 UTC on January 1, 1970`. A Unix timestamp is the **number of seconds elapsed since that moment** (or milliseconds, in JavaScript).

```
0         → 1970-01-01 00:00:00 UTC
1         → 1970-01-01 00:00:00:01 UTC
1000      → 1970-01-01 00:16:40 UTC
1704067200 → 2024-01-01 00:00:00 UTC
```

The current Unix timestamp (as I'm writing this) is around **1744502400**. By the time you read this, it will be different - timestamps are always moving forward.

## Seconds vs Milliseconds: The Classic Developer Bug

This is the single most common timestamp mistake.

| System | Unit | Example |
|--------|------|---------|
| Unix (POSIX) | Seconds | `1704067200` |
| JavaScript | Milliseconds | `1704067200000` |
| Python (`time.time()`) | Seconds (float) | `1704067200.485` |
| Python (`datetime.now().timestamp()`) | Seconds (float) | `1704067200.485` |
| Java (`System.currentTimeMillis()`) | Milliseconds | `1704067200000` |
| Go (`time.Now().Unix()`) | Seconds | `1704067200` |
| Go (`time.Now().UnixMilli()`) | Milliseconds | `1704067200000` |

**The rule:** When a timestamp is 13 digits long, it's in milliseconds. When it's 10 digits, it's in seconds.

```javascript
// JavaScript - timestamps are ALWAYS milliseconds
const now = Date.now();           // 1744502400000 (13 digits)
const seconds = Math.floor(now / 1000); // 1744502400 (10 digits)

// If you see a 10-digit timestamp in JavaScript context, multiply by 1000
const apiTimestamp = 1704067200;  // From some API
const date = new Date(apiTimestamp * 1000); // Correct
```

## Converting in Common Languages

### JavaScript

```javascript
// Unix timestamp (seconds) to Date
const unix = 1704067200;
const date = new Date(unix * 1000);

// Date to Unix timestamp
const now = Math.floor(Date.now() / 1000); // seconds
const ms = Date.now();                      // milliseconds

// Format it
date.toISOString();       // "2024-01-01T00:00:00.000Z"
date.toLocaleString();    // "1/1/2024, 12:00:00 AM" (local timezone)
```

### Python

```python
import datetime

# Unix timestamp (seconds) to datetime
unix = 1704067200
dt = datetime.datetime.fromtimestamp(unix, tz=datetime.timezone.utc)

# datetime to Unix timestamp
now = datetime.datetime.now(tz=datetime.timezone.utc)
unix_now = int(now.timestamp())

# Format
dt.isoformat()          # '2024-01-01T00:00:00+00:00'
dt.strftime('%Y-%m-%d %H:%M:%S')  # '2024-01-01 00:00:00'
```

### Go

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    unix := int64(1704067200)
    
    // Seconds to time.Time
    t := time.Unix(unix, 0)
    fmt.Println(t.Format(time.RFC3339))
    
    // Time to Unix
    now := time.Now()
    fmt.Println(now.Unix())
}
```

## The Timezone Trap

The Unix epoch is **always in UTC**. The number `1704067200` means exactly one moment in time, everywhere on Earth.

The confusion comes when converting to local time:

```javascript
const timestamp = 1704067200; // 2024-01-01 00:00:00 UTC

// Same timestamp, different "local" readings:
new Date(timestamp * 1000).toLocaleString('en-US') // "12/31/2023, 7:00:00 PM" (US EST, UTC-5)
new Date(timestamp * 1000).toLocaleString('en-GB') // "01/01/2024, 00:00:00" (UK, UTC+0)
new Date(timestamp * 1000).toLocaleString('ja-JP') // "2024/01/01 9:00:00" (Japan, UTC+9)
```

The timestamp itself doesn't change. Only the **human-readable representation** changes based on the timezone you ask for.

**Always store and transmit timestamps in UTC.** Only convert to local time for display purposes.

## Common Timestamp Formats

| Format | Example | Notes |
|--------|---------|-------|
| Unix seconds | `1704067200` | 10 digits, standard Unix |
| Unix milliseconds | `1704067200000` | 13 digits, JavaScript default |
| ISO 8601 | `2024-01-01T00:00:00Z` | ISO standard, includes timezone |
| ISO 8601 local | `2024-01-01T00:00:00+05:30` | With offset from UTC |
| RFC 3339 | `2024-01-01T00:00:00Z` | Same as ISO 8601 subset |
| RFC 2822 | `Mon, 01 Jan 2024 00:00:00 +0000` | Email and HTTP header standard |

## Why Timestamps Beat Date Strings

Storing dates as strings is one of the most common mistakes in database design:

```sql
-- Don't do this
INSERT INTO logs (event_date) VALUES ('2024-01-01');

-- Do this instead
INSERT INTO logs (event_date) VALUES (1704067200);
INSERT INTO logs (event_date) VALUES (1704067200000);
```

**Why timestamps are better:**

1. **No parsing required** - numbers are faster to read and compare than strings
2. **No ambiguity** - `"2024-01-01"` could be January 1st (US) or January 1st (UK)
3. **Timezone independent** - the same number works everywhere
4. **Easy arithmetic** - `end_time - start_time` gives you duration in seconds

## When Milliseconds Matter

For most business logic, seconds are fine. But for performance measurement and real-time systems, milliseconds (or even microseconds) matter:

```javascript
// Measuring code execution time
const start = performance.now();
doExpensiveWork();
const duration = performance.now() - start;
console.log(`Took ${duration.toFixed(2)}ms`);

// Cookies use milliseconds for expiry
document.cookie = `token=abc; expires=${new Date(Date.now() + 86400000).toUTCString()}`;
//                          ↑ 86400000ms = 24 hours
```

## Leaps, Epochs, and Edge Cases

**Leap seconds:** Unix timestamps don't count leap seconds. UTC has had 27 leap seconds added since 1972, but Unix time assumes every day is exactly 86400 seconds. This means Unix time and UTC diverge by the number of leap seconds that have occurred.

**Year 2038 problem:** 32-bit signed integers overflow at `2147483647` (January 19, 2038 at 03:14:07 UTC). Most modern systems use 64-bit integers now, so this is largely a historical curiosity - but legacy 32-bit systems still exist.

**Negative timestamps:** Unix time supports dates before 1970 using negative numbers. `date -d '1969-12-31' +%s` gives `-86400`.

## Try It Now

The [Unix Timestamp Converter on Toolblip](/tools/unix-timestamp-converter) converts between human-readable dates and Unix timestamps instantly, with full timezone support. No server calls - everything runs in your browser.

---

Timestamps are one of those fundamental concepts that, once internalized, make debugging time-related issues almost trivial. The next time you see a 10-digit number in a log file, you'll know exactly what it means.
