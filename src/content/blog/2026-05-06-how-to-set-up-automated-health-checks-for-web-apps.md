---
title: "How to Set Up Automated Health Checks for Web Apps"
description: >-
  Learn how to set up automated health checks for web apps with practical examples, tools, and scripts to keep your application running reliably 24/7.
slug: 2026-05-06-how-to-set-up-automated-health-checks-for-web-apps
date: 2026-05-06T00:00:00.000Z
category: Developer Tools
tags:
  - how-to-set-up-automated-health
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 8 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# How to Set Up Automated Health Checks for Web Apps

![Automated Health Checks for Web Apps](https://api.radtx.com/gradient/6b7280-374151/1200/630)

If your web app goes down at 2am, you want to know about it before your users do. Knowing how to set up automated health checks for web apps is one of the most practical skills you can have as a developer or DevOps engineer. This guide walks you through everything: what health checks are, how to write them, how to automate them, and how to alert the right people when something breaks.

## What Are Automated Health Checks and Why They Matter

A health check is a lightweight request or script that verifies your application is running correctly. It might ping a URL, query a database, check a queue depth, or verify that a background worker is alive.

Automated health checks run on a schedule without human intervention. They are the difference between finding out your checkout flow is broken from a tweet, versus getting an alert the moment the first error occurs.

Without them, you are flying blind. With them, you get visibility into uptime, response times, and downstream dependencies before small problems become outages.

## How to Set Up Automated Health Checks for Web Apps: The Basic Pattern

The standard pattern has three parts: a health endpoint on your server, a monitor that polls it, and an alert channel that fires when something is wrong.

Start by exposing a `/health` or `/healthz` endpoint in your application. This endpoint should return a 200 status code when everything is fine and a non-200 code when something is degraded or broken.

Here is a minimal Node.js example using Express:

```javascript
const express = require('express');
const app = express();

app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      message: err.message,
    });
  }
});
```

This endpoint does more than check if the server is listening. It actually verifies that the database connection is live, which is the most common silent failure in web apps.

## Choosing the Right Tools to Automate Health Checks for Web Apps

There are several categories of tools you can use. The right one depends on your stack, budget, and how much control you want.

**Hosted monitoring services** are the fastest to set up. Services like Better Uptime, Checkly, and UptimeRobot let you configure HTTP monitors in minutes. You give them a URL, a check interval, and an alert destination, and they handle the rest. Most have a free tier that covers basic uptime monitoring.

**Self-hosted options** give you full control. Prometheus with Blackbox Exporter is the most common open-source stack. It is more work to configure but gives you deep metrics and integrates with Grafana for dashboards.

**Cron-based scripts** are the simplest option for smaller projects. A shell script running on a cron schedule can cover a lot of ground without any external dependencies.

Here is a basic bash health check script you can drop into a cron job:

```bash
#!/bin/bash

URL="https://yourapp.com/health"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
TIMEOUT=10

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL")

if [ "$HTTP_STATUS" != "200" ]; then
  curl -s -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"Health check FAILED for $URL - HTTP $HTTP_STATUS\"}" \
    "$SLACK_WEBHOOK"
fi
```

Add this to cron with `crontab -e` and a line like `*/5 * * * * /path/to/healthcheck.sh` to run every five minutes.

## How to Set Up Automated Health Checks for Web Apps With Multiple Dependencies

Most real apps depend on more than just a web server. They connect to databases, caches, third-party APIs, and message queues. A good health check verifies each of those.

The pattern is to check each dependency individually and report its status in the response body. This helps you quickly identify which component is failing rather than just knowing that something is wrong.

```javascript
app.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    externalApi: false,
  };

  try {
    await db.query('SELECT 1');
    checks.database = true;
  } catch (e) {}

  try {
    await redisClient.ping();
    checks.redis = true;
  } catch (e) {}

  try {
    const resp = await fetch('https://api.stripe.com/v1/healthcheck', {
      signal: AbortSignal.timeout(3000),
    });
    checks.externalApi = resp.ok;
  } catch (e) {}

  const allHealthy = Object.values(checks).every(Boolean);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

The response JSON makes it easy to debug at a glance. If you need to inspect or validate the JSON structure of your health responses, the [Toolblip JSON Formatter](https://toolblip.com/tools/json-formatter) is handy for quickly parsing and pretty-printing nested health check payloads.

## How to Set Up Automated Health Checks for Web Apps Using GitHub Actions

If you use GitHub Actions for CI/CD, you can run scheduled health checks directly in your existing workflow infrastructure without any additional services.

Create a file at `.github/workflows/health-check.yml`:

```yaml
name: Health Check

on:
  schedule:
    - cron: '*/10 * * * *'   # every 10 minutes
  workflow_dispatch:

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - name: Check app health
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://yourapp.com/health)
          if [ "$STATUS" != "200" ]; then
            echo "Health check failed with status $STATUS"
            exit 1
          fi
          echo "Health check passed"

      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: '{"text":"Production health check failed"}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

This approach is free for public repos and costs nothing extra if you are already on GitHub Actions. The downside is that GitHub Actions cron jobs can sometimes be delayed by a few minutes during high platform load.

## Setting Up Alert Routing for Automated Health Checks

A health check that fires but nobody sees is almost as bad as no health check at all. You need to route alerts somewhere people actually look.

The most common destinations are Slack channels, PagerDuty, and email. For critical production systems, use an on-call tool like PagerDuty or OpsGenie that can escalate if the first alert goes unacknowledged. Slack alone is fine for non-critical services where a few minutes of lag is acceptable.

Keep alert messages short and actionable. Include the endpoint that failed, the HTTP status code returned, and a direct link to your monitoring dashboard or runbook. An alert that says "Something is wrong" is much less useful than one that says "POST /api/checkout returned 503 for the last 3 minutes."

If you are encoding alert data for webhooks or storing health check results in base64 format, the [Toolblip Base64 Encoder/Decoder](https://toolblip.com/tools/base64) can help you quickly encode and decode payloads without writing a script. Similarly, if you are building alert routing logic that uses regex to match error patterns from logs, the [Toolblip Regex Tester](https://toolblip.com/tools/regex-tester) lets you validate your patterns interactively before committing them to code.

## Best Practices for How to Set Up Automated Health Checks for Web Apps

A few practices separate useful health checks from ones that create noise or miss real failures.

**Keep health checks fast.** They should respond in under one second. If your database query takes five seconds, that is a signal of a deeper problem, but a slow health check endpoint will itself trigger false alerts.

**Avoid caching health check responses.** If you have a CDN or reverse proxy in front of your app, make sure your health endpoint bypasses it. A cached 200 from five minutes ago is not a real health check.

**Test your alerts.** Simulate a failure by returning a 503 from your health endpoint and verify that the alert reaches the right channel. Untested alert paths fail exactly when you need them most.

**Use separate endpoints for liveness and readiness.** Kubernetes formalizes this distinction: a liveness probe restarts a container that is stuck, while a readiness probe removes it from load balancing when it cannot serve traffic. Even outside Kubernetes, this separation is useful.

**Set appropriate check intervals.** Every five minutes is a reasonable default for most apps. If your SLA requires 99.9% uptime, you need to detect downtime within minutes, not hours. More frequent checks mean faster detection but also more noise if your app has occasional slow responses.

## Conclusion

Knowing how to set up automated health checks for web apps is not optional for any application that people rely on. The core pattern is simple: expose a health endpoint, poll it on a schedule, and alert when it fails. From there, you can layer in dependency checks, multiple alert channels, and more sophisticated monitoring as your app grows.

Start with the basics today. Add a `/health` endpoint to your app, point a free monitoring service at it, and set up a Slack alert. That alone will save you from finding out about outages the wrong way.

---

Want to validate or inspect the JSON responses from your health check endpoints? Use the [Toolblip JSON Formatter](https://toolblip.com/tools/json-formatter) to quickly parse, format, and debug health check payloads right in your browser, no setup required.
