---
title: "Character Counts for Social Posts: Check the Composer"
description: >-
  Understand X weighted counts and check other platforms in their current composer.
slug: social-media-character-limits
date: 2026-04-14T00:00:00.000Z
category: Reference
tags:
  - Social Media
  - Twitter
  - LinkedIn
  - Marketing
  - Character Counter
author: Toolblip Team
readingTime: 4 min
featuredImage: 'https://toolblip.com/api/og?title=The%20Complete%20Character%20Limit%20Reference%20for%20Every%20Platform&category=Reference&date=2026-04-14'
---

# Character Counts for Social Posts: Check the Composer

Each platform counts text differently, and limits vary by post type and account. Use the platform’s composer as the final check. The [Character Counter](/tools/character-counter) reports raw totals, counts without spaces or newlines, letters, and digits; it does not calculate remaining platform allowance.

## X ordinary posts

X allows 280 weighted characters for ordinary posts. Each URL counts as 23 characters regardless of its literal length, and emoji sequences count as two under [X’s counting rules](https://docs.x.com/fundamentals/counting-characters). [X Help](https://help.x.com/en/using-x/types-of-posts) describes Premium long posts separately, up to 25,000 characters. Draft in the X composer to check the applicable account and post type.

A JavaScript string’s `.length` counts UTF-16 code units. That is useful for debugging, but it is not X’s weighted post count. Toolblip’s counter does not implement X’s URL or emoji weights.

## Other social surfaces

| Surface | What to check before publishing |
|---------|---------------------------------|
| LinkedIn post | The current composer for the account and post type |
| Instagram caption | The current caption field and preview |
| Threads post | The current composer and link handling |
| TikTok caption | The native composer, or the API documentation if posting through an API |
| YouTube title or description | The field you are editing in YouTube Studio |
| Pinterest, Discord, Reddit | The specific post or message field |

Do not treat a number for one API as the native app’s universal limit. For example, TikTok’s [Content Posting API](https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post) documents a 2,200 UTF-16-unit maximum for its video `title` field. That applies to that API field, not every TikTok caption surface.

## Count drafts without a preset

1. Draft the post in [Toolblip’s Character Counter](/tools/character-counter) to see raw totals.
2. Paste it into the platform’s composer to check that surface’s limit and preview.
3. Trim or move content if the composer warns you. Repeat after adding links or emoji.

For SEO meta descriptions, inspect the actual search snippet rather than treating a character number as a guaranteed display cutoff. Toolblip’s counter has no meta-description preset.

## If you build a character-limited form

If you're a developer building UGC forms that accept social media content: always show the character counter with the relevant limit. Users routinely exceed limits and it's frustrating to lose content when submitting.
