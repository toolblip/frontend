# Toolblip

Free browser-based developer tools. 100% client-side, nothing leaves your browser.

## Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Backend:** Laravel 11 + Sanctum (separate repo: [toolblip-api](https://github.com/toolblip/toolblip-api))
- **Hosting:** Vercel (frontend) + Railway (API)
- **DNS/CDN:** Cloudflare

## Getting Started

### Prerequisites

- Node.js 22+
- `NEXT_PUBLIC_API_URL` pointing to the API backend

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```

Output goes to `.next/`. Deploy to Vercel:

```bash
npm i -g vercel
vercel --prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Laravel API base URL | `https://api.toolblip.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend base URL | `https://toolblip.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (optional) | — |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog (markdown files in /blog)
│   ├── tools/
│   │   ├── page.tsx       # Tools listing
│   │   └── [slug]/        # Individual tool pages
│   ├── login/
│   ├── signup/
│   └── directory/
├── components/tools/       # React client components (one per tool)
└── lib/
    ├── api.ts             # API client
    ├── auth.ts            # Auth helpers
    └── usage.ts           # Client-side usage tracking
```

## API

The Laravel API lives in [toolblip/toolblip-api](https://github.com/toolblip/toolblip-api).

API documentation: [api.toolblip.com](https://api.toolblip.com/docs)

## Deployment

### Vercel (Frontend)

Connect the GitHub repo to Vercel. Environment variables are configured in the Vercel dashboard.

### Cloudflare DNS

```
toolblip.com  → CNAME → cname.vercel.com  (proxied)
www           → CNAME → cname.vercel.com  (proxied)
```

SSL mode: **Full (strict)**

## Blog

Blog posts live in `/blog/*.md`. Frontmatter:

```yaml
---
title: Post Title
description: SEO description
slug: url-slug
date: 2026-04-12
category: Guide
tags: [Tag1, Tag2]
author: Author Name
readingTime: 5 min
---
```

## License

MIT

<!-- Railway API domain update: 2026-04-17T19:16:21Z -->
