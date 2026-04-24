---
title: Why Is My Cron Job Not Running? 10 Common Cron Expression Mistakes
description: Cron jobs failing silently? Most cron expression errors come from a handful of predictable mistakes. Learn to spot and fix them fast.
date: 2026-04-24
category: Developer Tools
---

If you've ever stared at a cron expression like `*/5 * * * *` and wondered why your job runs every minute instead of every five, you're not alone. Cron syntax is famously terse, and even small typos can turn a well-intentioned schedule into a non-running ghost job.

This guide walks through the 10 mistakes developers hit most often, with concrete examples and fixes. Bookmark it — you'll be back.

## What Is a Cron Expression?

A cron expression is a 5-field string that defines a schedule:

```
┌──────────── minute (0–59)
│ ┌────────── hour (0–23)
│ │ ┌──────── day of month (1–31)
│ │ │ ┌────── month (1–12)
│ │ │ │ ┌──── day of week (0–6, Sun–Sat)
│ │ │ │ │
* * * * *
```

Each field can hold a specific value, a range, a list, or a step (`*` means "every"). Getting any one field wrong breaks the whole schedule.

---

## The 10 Most Common Cron Mistakes

### 1. Mixing Up `*` and `0` in the Minute Field

This is the #1 source of confusion.

- `* * * * *` — runs **every minute**
- `0 * * * *` — runs **every hour, at minute 0** (once per hour)

If you want your job to run once an hour and you wrote `* * * * *`, you'll be debugging a job that fires 60 times per hour before you realize the mistake.

**Fix:** Use a [cron expression tester](/tools/cron-expression-tester) to validate your schedule before deploying.

### 2. Using `5/10` Instead of `*/5` for Step Values

Step values in cron use `/`, but the syntax trips people up.

- `*/5 * * * *` — every 5 minutes (`0, 5, 10, 15...`)
- `5/10 * * * *` — starting at minute 5, every 10 minutes (`5, 15, 25, 35...`)

These look similar but behave very differently. `5/10` starts at 5 and then adds 10 each time. `*/5` starts at 0 and adds 5 each time.

### 3. Forgetting That Day-of-Month and Day-of-Week Are OR'd Together

This one bites people hard.

In standard cron, if you set both the day-of-month **and** the day-of-week to non-wildcard values, the job runs if **either** field matches. So:

```
0 9 15 * *  →  Runs at 9 AM on the 15th of every month  AND  runs at 9 AM on every Monday
```

Not "9 AM on the 15th if it's a Monday." Most people expect AND, but cron gives you OR.

**Fix:** If you need a specific day, stick to one field. Use day-of-week for weekday jobs, day-of-month for calendar-date jobs — not both.

### 4. Using `8` for Sunday in the Day-of-Week Field

The day-of-week field uses `0` for Sunday, not `7`.

- `0` = Sunday
- `1` = Monday
- `6` = Saturday
- `7` = **also Sunday** (somecron versions accept this, but POSIX standard is 0–6)

If you wrote `0 9 * * 7` expecting Sunday, it might work on some systems and silently fail on others. Best practice: always use `0` for Sunday.

### 5. Missing the Range When Using Lists

Ranges and lists are not the same thing.

- `1,2,3 * * * *` — runs at minutes 1, 2, and 3 (list)
- `1-3 * * * *` — runs at minutes 1, 2, and 3 (range, same result)
- `1-3,5 * * * *` — runs at minutes 1, 2, 3, and 5 (mixing is valid)

The mistake: writing `1-3-5` thinking it means "1 through 5." That's invalid syntax. Use `1-5` for a range.

### 6. Hardcoding the Wrong Timezone

Cron runs in the system timezone by default. If your server is in UTC but you're in EST, writing `0 14 * * *` means 2 PM UTC, not 2 PM EST.

Symptoms: the job runs, but at seemingly random times relative to your local clock.

**Fix:** Explicitly set the `CRON_TZ` or `TZ` environment variable in your cron table:

```
CRON_TZ=America/New_York
0 14 * * * /usr/local/bin/backup.sh
```

### 7. Cron Jobs Without a Trailing Newline

If your crontab entry is the last line in the file and doesn't end with a newline, it gets silently ignored on some cron implementations.

Always add a blank line at the end of your crontab:

```bash
crontab -e
# ... your entries ...
0 2 * * * /usr/local/bin/cleanup.sh

```

### 8. Assuming `30 2 1 * *` Means "2:30 AM on the First"

Let's parse: minute=30, hour=2, day-of-month=1, month=*, day-of-week=*. This runs at **2:30 AM on the 1st of every month** — that's correct.

But `30 2 * * 1` (with day-of-week = 1) means **2:30 AM every Monday**. Same time, different logic. The field position matters enormously.

Always validate before assuming.

### 9. Using Ranges That Exceed the Field's Valid Range

Month field: 1–12. Day-of-week field: 0–6. Hour field: 0–23. Minute field: 0–59.

Writing `0 24 * * *` silently falls back to invalid — some cron daemons reject it, others round down to the next valid hour or skip entirely.

Same with `0 * 32 * *` — there's no day 32, so the expression is ignored.

### 10. Not Checking If Cron Even Ran (stdout/stderr Got Lost)

Your cron job might have run perfectly but the output went nowhere. By default, cron sends mail to the crontab owner. If that's not configured, you see nothing.

Signs of this: the job clearly should have fired, but there's no trace of it.

**Fix:** Redirect output to a log file explicitly:

```
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

Or use a systemd timer instead of cron for better logging on modern Linux systems.

---

## Quick Reference: Cron Syntax Cheat Sheet

| Expression | Meaning |
|---|---|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour (at minute 0) |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * 1-5` | 9 AM every weekday |
| `0 0 1 * *` | Midnight on the 1st of each month |
| `0 0 * * 0` | Midnight every Sunday |
| `*/15 */2 * * *` | Every 15 minutes, every 2 hours |

---

## How to Test Your Cron Expression

The easiest way to verify a cron expression without waiting around is to use a [cron expression tester](/tools/cron-expression-tester). You punch in your expression, see the next 10 scheduled run times, and catch mistakes before they become production incidents.

Pair it with a [Unix timestamp converter](/tools/unix-timestamp-converter) when debugging across systems with different time settings.

---

## Common Cron Expression Patterns for Reference

**Every 5 minutes:**
```
*/5 * * * *
```

**Every 15 minutes:**
```
*/15 * * * *
```

**Every hour:**
```
0 * * * *
```

**Every day at 3 AM:**
```
0 3 * * *
```

**Every Monday at 9 AM:**
```
0 9 * * 1
```

**Every weekday at 8 AM:**
```
0 8 * * 1-5
```

**At 9 AM on the 1st of every month:**
```
0 9 1 * *
```

**Every 30 seconds (cron limitation):** Cron can't do sub-minute natively. You'll need two entries:
```
* * * * * /scripts/job.sh
* * * * * sleep 30 && /scripts/job.sh
```

---

## Conclusion

Cron expression mistakes are almost always the same few categories: field confusion (`*` vs `0`), wrong timezone, OR vs AND between date fields, and invisible failures from missing output handling.

Know these 10 traps, validate your expressions with a [cron tester](/tools/cron-expression-tester) before deploying, and you won't be Googling "why is my cron job not running" at 2 AM again.
