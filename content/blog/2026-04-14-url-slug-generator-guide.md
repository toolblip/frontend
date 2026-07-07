---
title: 'How to Create URL Slugs: A Complete Guide for Developers'
description: >-
  URL slugs are the part of a URL that identifies a specific page. Learn the
  rules for creating clean, SEO-friendly slugs, common mistakes to avoid, and
  how to generate them automatically.
slug: how-to-create-url-slugs
date: 2026-04-14T00:00:00.000Z
category: Guide
tags:
  - SEO
  - URL
  - Web Development
  - Laravel
  - Django
author: Toolblip Team
readingTime: 5 min
featuredImage: 'https://placehold.co/1200x630/374151/FFFFFF?text=Toolblip+Blog'
---

# How to Create URL Slugs: A Complete Guide for Developers

A URL slug is the part of a URL that comes after the domain and identifies a specific page. In `toolblip.com/tools/json-formatter`, the slug is `json-formatter`. It's the part that makes the URL human-readable and SEO-friendly.

## What Makes a Good URL Slug

Good slugs are:

- **Descriptive** - `json-formatter` tells you exactly what the page is
- **Short** - fewer characters, easier to type and share
- **Lowercase** - `JSON-Formatter` and `json-formatter` are different URLs
- ** hyphen-separated** - `json-formatter` not `json_formatter` or `jsonformatter`
- **Singular nouns** - `tool` not `tools` (consistency, not a rule)

## The Standard for URL Slugs

**RFC 3986** defines URL characters as:

```
unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
reserved     = gen-delims / sub-delims
sub-delims   = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
```

In practice, use only lowercase letters, numbers, and hyphens. Everything else should be encoded or removed.

## How to Generate a URL Slug

Given any string, here's the transformation:

```javascript
function toSlug(text) {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and separators with hyphens
    .replace(/[\s_\.]+/g, '-')
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9\-]/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

toSlug('JSON Formatter & Validator');
// → 'json-formatter-validator'

toSlug('  Python 3.12 Release Notes  ');
// → 'python-312-release-notes'

toSlug('Café & Wi-Fi Guide');
// → 'café-wi-fi-guide' (with accent preserved)
```

## Common Mistakes

### 1. Using Spaces

Bad: `/tools/JSON Formatter`
Good: `/tools/json-formatter`

Spaces in URLs must be encoded as `%20`. While browsers handle this, it's ugly and shareable.

### 2. Using Underscores

Bad: `/tools/json_formatter`
Good: `/tools/json-formatter`

Search engines treat hyphens as word separators but often treat underscores as part of words. Use hyphens.

### 3. Including Special Characters

Bad: `/tools/JSON%20Formatter!`
Good: `/tools/json-formatter`

Strip anything that isn't a letter, number, or hyphen.

### 4. Making Slugs Too Long

The Google SERP truncates URLs at about 55-60 characters. Keep slugs under 50 characters.

### 5. Not Making Them Unique

If two pages have the same slug, one will 404 or redirect. Always check for duplicates before creating a slug.

## How Slugs Work in Popular Frameworks

### Laravel (Eloquent Sluggable)

```php
use Cviebrock\EloquentSluggable\Sluggable;

class Post extends Model
{
    use Sluggable;

    public function sluggable(): array
    {
        return ['slug' => 'title'];
    }
}

// Creates: "my-blog-post-title-2024"
```

### Django (django.utils.text.slugify)

```python
from django.utils.text import slugify

slug = slugify("My Blog Post Title!")
# → "my-blog-post-title"
```

### Next.js

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## SEO Considerations

### Use the Exact Match Keyword

If you're targeting "JSON formatter", your slug should contain `json-formatter`. Google gives significant weight to the URL.

### Keep Slugs Short

From Google's SEO starter guide: "A URL like `example.com/green-dress` is more useful to users than `example.com/collections/1836/products/19281`."

### HTTPS

Always use HTTPS. Google marks HTTP sites as "not secure" and gives them a ranking penalty.

## Canonical URLs

If the same content is accessible at multiple URLs (with/without trailing slash, with/without `www`), use a canonical tag to tell search engines which is the primary URL:

```html
<link rel="canonical" href="https://toolblip.com/tools/json-formatter" />
```

## Try It

Generate a URL slug instantly:

👉 **[URL Slug Generator →](/tools/url-slug-generator)**

Enter any text, copy the slug. One click.
