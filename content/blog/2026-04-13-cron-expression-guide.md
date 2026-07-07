---
title: 'Cron Expressions Explained: A Practical Field Guide'
description: >-
  Cron expressions look like line noise until you learn to read them. Once you
  do, you'll spot mistakes before they cause missed jobs, wrong deployments, or
  3am pages.
slug: cron-expressions-explained
date: 2026-04-13T00:00:00.000Z
category: Guide
tags:
  - Cron
  - Scheduling
  - DevOps
  - Laravel
  - cron jobs
author: Toolblip Team
readingTime: 7 min
featuredImage: 'https://toolblip.com/api/og?title=Cron%20Expressions%20Explained%3A%20A%20Practical%20Field%20Guide&category=Guide&date=2026-04-13'
---

# Cron Expressions Explained: A Practical Field Guide

`* * * * *`

You've seen this five-character string in config files, Laravel's scheduler, GitHub Actions, CloudWatch, and every cron job you've ever set up. If you've ever stared at it and parsed it by trial and error, this guide is for you.

By the end you'll read any cron expression instantly, write them precisely, and spot the three most common mistakes.

## The Anatomy of a Cron Expression

A cron expression has five fields, representing (in order):

```
┌───────────── minute      (0–59)
│ ┌──────────── hour        (0–23)
│ │ ┌────────── day of month (1–31)
│ │ │ ┌──────── month        (1–12)
│ │ │ │ ┌────── day of week  (0–6, Sunday = 0)
│ │ │ │ │
* * * * *
```

Each field accepts:
- A specific value: `5`
- A range: `1-5`
- A list: `1,3,5`
- A step: `*/5`
- A range with step: `1-10/2`

## Real Examples

### `0 * * * *` - Every hour, on the hour

```
minute = 0       (at minute 0)
hour   = *       (every hour)
day    = *       (every day)
month  = *       (every month)
week   = *       (every day of week)
```
At 1:00, 2:00, 3:00 - every hour exactly.

### `0 9 * * 1-5` - Weekdays at 9am

```
minute = 0
hour   = 9       (9am)
day    = *       (any day of month)
month  = *       (any month)
week   = 1-5     (Monday through Friday)
```
Every weekday at 9:00 AM. No weekends.

### `*/15 * * * *` - Every 15 minutes

```
minute = */15    (every 15 minutes: 0, 15, 30, 45)
hour   = *
day    = *
month  = *
week   = *
```
Every quarter hour, all day, every day.

### `0 0 1 * *` - First of every month at midnight

```
minute = 0
hour   = 0       (midnight)
day    = 1       (1st of the month)
month  = *
week   = *
```
Midnight on the first day of each month.

### `30 4 * * *` - Daily at 4:30am

```
minute = 30
hour   = 4
```
4:30 AM every day. A common time for overnight batch jobs.

## The Three Most Common Mistakes

### Mistake 1: Confusing Day of Month and Day of Week

This catches everyone. In standard cron:
- Day of month (field 3): `1` = 1st of the month
- Day of week (field 5): `1` = Monday

If you write `0 9 1 * 1` thinking "Monday the 1st", you get 9am on the 1st of every month AND 9am on every Monday. These are OR'd, not AND'd.

To run only on Monday the 1st, you need two expressions or a more specific tool.

### Mistake 2: Using `*` When You Mean `0`

`0 * * * *` runs every minute of every hour (60 times per hour). `0 0 * * *` runs once per day. These are very different.

Check your expression before deploying.

### Mistake 3: Forgetting That Months Start at 1

The month field uses 1–12 (January = 1), not 0–11 like JavaScript's `Date` month index. Writing `0 0 0 0 *` for January doesn't work - it means "day 0" which is invalid.

## Step Values

Steps are underused and powerful:

| Expression | Meaning |
|-----------|---------|
| `*/5 * * * *` | Every 5 minutes |
| `0 */2 * * *` | Every 2 hours |
| `0 9-17 * * 1-5` | Every hour 9am–5pm, weekdays |
| `0 0 1,15 * *` | Midnight on 1st and 15th of month |

## Timezone Gotchas

Cron runs in the system timezone by default. If your server is in UTC but your users are in New York, a `0 9 * * *` cron fires at 9am UTC = 4am EST (winter) or 3am EDT (summer).

Solutions:
- Set the timezone explicitly: `CRON_TZ=America/New_York 0 9 * * *`
- Store everything in UTC internally
- Document the timezone in your deployment notes

## Laravel-Specific Notes

Laravel's scheduler (`php artisan schedule:work`) uses a slightly different syntax in `app/Console/Kernel.php`:

```php
$schedule->command('reports:generate')->dailyAt('09:00');
$schedule->command('cache:prune')->weeklyOn(1, '03:00');
$schedule->job(new ProcessUploads)->everyFifteenMinutes();
$schedule->call(fn () => DoSomething::run())->cron('0 4 * * *');
```

Laravel also has timezone support:

```php
$schedule->command('reports:generate')
    ->timezone('America/New_York')
    ->dailyAt('09:00');
```

## How to Verify Your Cron Expression

**[Validate and parse any cron expression →](/tools/cron-parser)**

Enter a cron expression and see the next 5 scheduled run times in plain English. Catches timezone issues, off-by-one errors, and expressions that don't mean what you think they mean.

## Quick Reference Table

| You want... | Expression |
|-------------|-----------|
| Every minute | `* * * * *` |
| Every 5 minutes | `*/5 * * * *` |
| Every 15 minutes | `*/15 * * * *` |
| Every 30 minutes | `*/30 * * * *` |
| Every hour | `0 * * * *` |
| Every day midnight | `0 0 * * *` |
| Every day 9am | `0 9 * * *` |
| Weekdays 9am | `0 9 * * 1-5` |
| Every Monday 3am | `0 3 * * 1` |
| 1st of month midnight | `0 0 1 * *` |
| Every Sunday at midnight | `0 0 * * 0` |
| Every 6 hours | `0 */6 * * *` |
