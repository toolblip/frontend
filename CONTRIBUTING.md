# Contributing to Toolblip

Thank you for contributing! This guide covers how to add tools, write blog posts, and submit MCP servers to the Toolblip registry.

---

## Adding a New Tool

### Step 1: Create the React component

Create a new client component in `src/components/tools/`:

```tsx
// src/components/tools/MyToolClient.tsx
'use client';

import { useState } from 'react';

export default function MyToolClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function handleConvert() {
    // Your tool logic here
    setOutput(/* result */);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 text-sm font-mono h-32"
        placeholder="Enter input..."
      />
      <button
        onClick={handleConvert}
        className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Convert
      </button>
      {output && (
        <pre className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm font-mono text-green-400 overflow-x-auto">
          {output}
        </pre>
      )}
    </div>
  );
}
```

### Step 2: Register the tool in `toolsMeta`

In `src/app/tools/[slug]/page.tsx`, add your tool to the `toolsMeta` object:

```typescript
'my-tool': {
  title: 'My Tool',
  description: 'One-sentence description.',
  component: MyToolClient,
  category: 'formatter',
  emoji: '🔧',
  is_pro: false,
},
```

### Step 3: Add the tool page (optional — uses dynamic route)

If using a dedicated URL (e.g. `/tools/my-tool`), add a `generateStaticParams` entry in `src/app/tools/[slug]/page.tsx`:

```typescript
export async function generateStaticParams() {
  return [
    // ... existing slugs
    { slug: 'my-tool' },
  ];
}
```

### Step 4: Add to tool listing

In `src/app/tools/page.tsx`, add the tool to the `allTools` array to show it on the tools listing page.

---

## Writing a Blog Post

Blog posts live in `/blog/*.md` with YAML frontmatter:

```yaml
---
title: "Post Title"
description: "SEO description — under 160 characters"
slug: url-slug
date: 2026-04-13
category: Guide       # Guide | Tutorial | Announcement
tags: [Tag1, Tag2]
author: Toolblip Team
readingTime: 5 min
---

# Post Title

Your content in Markdown...
```

Guidelines:
- **category:** `Guide` for educational content, `Tutorial` for how-tos, `Announcement` for news
- **description:** Write for SEO — first sentence of the description is used in search results
- **images:** Save to `public/images/blog/` and reference as `/images/blog/filename.png`

---

## Submitting an MCP Server to the Registry

The MCP server registry lives in the database (seeded via `ToolSeeder` in the API). To submit a new server:

```bash
curl -X POST https://api.toolblip.com/api/mcp/servers/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My MCP Server",
    "description": "What it does",
    "category": "code",
    "url": "https://github.com/username/my-mcp-server"
  }'
```

Valid categories: `code`, `data`, `browser`, `filesystem`, `api`, `ai`

Rate limit: 5 submissions per hour per IP.

---

## Project Structure

```
toolblip/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── tools/
│   │   │   ├── page.tsx              # Tools listing
│   │   │   └── [slug]/page.tsx      # Dynamic tool page
│   │   ├── blog/
│   │   │   ├── page.tsx             # Blog listing
│   │   │   └── [slug]/page.tsx     # Blog post
│   │   └── api-docs/page.tsx         # API docs
│   ├── components/tools/  # React client components (one per tool)
│   └── lib/
│       ├── api.ts        # API client
│       ├── auth.ts       # Auth helpers
│       └── usage.ts      # Usage tracking
├── public/               # Static assets
└── blog/                 # Blog posts (Markdown)
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **API Client:** vanilla `fetch` via `src/lib/api.ts`
- **Markdown Blog:** `gray-matter` + `marked`
- **Backend:** Laravel API at [github.com/toolblip/toolblip-api](https://github.com/toolblip/toolblip-api)

---

## Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** `npm run lint` (ESLint + Prettier)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

---

## Getting Help

Open an issue at [github.com/toolblip/toolblip/issues](https://github.com/toolblip/toolblip/issues) or email [harun@toolblip.com](mailto:harun@toolblip.com).
