---
title: "Understanding Cron Expressions: A Practical Guide with a Visual Parser"
description: >-
  Cron expressions are cryptic until you understand the logic. Learn what each field means, see real examples, and use a visual parser to build expressions without guessing.
slug: cron-expressions-guide
date: 2026-04-21T00:00:00.000Z
category: Developer Tools
tags:
  - cron
  - scheduling
  - devops
  - ci-cd
  - tutorial
author: Toolblip Team
readingTime: 5 min
featuredImage: ''
---

# Understanding Cron Expressions: A Practical Guide with a Visual Parser

🕐

Every developer hits this wall eventually: you need to schedule a job, you Google "cron expression," stare at `*/15 * * * *`, and Google harder until you find an example that looks close enough.

Stop guessing. Cron expressions are simpler than they look. Once you see the pattern, you'll never need to copy-paste from Stack Overflow again.

---

## The Anatomy of a Cron Expression

A cron expression has five fields, separated by spaces:

```
┌──────────── minute  (0–59)
│ ┌────────── hour    (0–23)
│ │ ┌──────── day     (1–31)
│ │ │ ┌────── month   (1–12)
│ │ │ │ ┌──── weekday (0–7, both 0 and 7 are Sunday)
│ │ │ │ │
* * * * *
```

That's it. Five positions, each controlling a unit of time. Read left to right, matching your schedule from fine to coarse.

---

## Special Characters and What They Do

| Character | Meaning | Example |
|-----------|---------|---------|
| `*` | Every value | `* * * * *` — every minute of every hour |
| `/` | Step/interval | `*/15 * * * *` — every 15 minutes |
| `-` | Range | `9-17 * * * *` — every minute during business hours |
| `,` | Specific values | `0 9,18 * * *` — at 9 AM and 6 PM |
| `L` | Last (day of month/week) | `0 0 L * *` — last day of the month |
| `W` | Nearest weekday | `0 9 15W * *` — 9 AM on nearest weekday to the 15th |

For most dev tasks, you'll only need `*`, `/`, `-`, and `,`.

---

## Real-World Examples

### Every weekday at 9 AM
```
0 9 * * 1-5
```
Minute `0`, hour `9`, every day, every month, Monday through Friday (`1-5`).

### Every 15 minutes
```
*/15 * * * *
```
Every 15 minutes, all day, every day.

### Midnight on the first of every month
```
0 0 1 * *
```
Midnight on day 1 of every month.

### Every 6 hours
```
0 */6 * * *
```
At minute 0 of every 6th hour: midnight, 6 AM, noon, 6 PM.

### Weekdays at 9 AM, noon, and 6 PM
```
0 9,12,18 * * 1-5
```
Three runs a day, Monday through Friday only.

### Every Sunday at 3 AM
```
0 3 * * 0
```
Or `0 3 * * 7` — both work. Sunday is both 0 and 7 in cron.

---

## The Hard Part: Verifying Before You Deploy

Here's where most tutorials stop and you start hoping for the best.

When you write a cron expression, it's very easy to get it subtly wrong. Is `0 0 * * 6` every Saturday at midnight, or Sunday? (Saturday — but you'd be surprised how many people flip this.) Is `*/5 9-17 * * 1-5` every 5 minutes from 9 to 5 on weekdays, or does it skip the 5 PM slot?

The safest way to verify: actually see when the expression will next fire.

Toolblip's cron tools show you exactly that:

- **[Cron Parser](/tools/cron-parser)** — paste any expression and see the next 5 run times immediately. Paste `0 9 * * 1-5` and you'll see Mon-Fri at 9:00 AM listed out. If that matches what you expected, you're good.
- **[Cron Generator](/tools/cron-generator)** — if you know what you want in words ("every weekday at 9 AM") but not in expression syntax, the generator builds the expression for you and verifies it in one step.

---

## Common Mistakes and How to Avoid Them

**Mixing up `*` and `0`**
`0 * * * *` fires at the top of every hour. `* * * * *` fires every single minute. One zero makes a huge difference.

**Forgetting weekday numbering starts at 0 (Sunday)**
In cron, Sunday is `0`. In JavaScript's `Date.getDay()`, Sunday is also `0`. But in most human-readable contexts, Monday is day 1. Double-check before you write `1-5`.

**Using `L` without testing**
The `L` modifier ("last") works differently for day-of-month vs. day-of-week. Test with a live parser before scheduling anything critical.

---

## Quick Reference Table

| Expression | Meaning |
|------------|---------|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour (top of the hour) |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * *` | Every day at 9 AM |
| `0 9 * * 1-5` | Weekdays at 9 AM |
| `0 0 1 * *` | First day of every month at midnight |
| `0 0 * * 0` | Every Sunday at midnight |

---

## Try It Right Now

Don't trust an expression until you've seen it run. Head to the **[Cron Parser](/tools/cron-parser)** and paste any expression to verify it. Or use the **[Cron Generator](/tools/cron-generator)** to build one from plain English.

You'll never schedule a job the same way twice.

---

*Cron expressions are a skill. Like everything else in development: break it, fix it, understand it, then it becomes obvious.*
