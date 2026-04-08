# Toolblip

Free, client-side web developer tools at [toolblip.com](https://toolblip.com). Every tool runs entirely in the browser — no backend, no uploads, no account required.

## What it is

Toolblip is a collection of utility tools aimed at developers and technical users. All processing happens client-side using JavaScript and the browser's native APIs. Nothing leaves the user's device.

Current tools:

- Word Counter
- Character Counter
- JSON Formatter (format, validate, minify)
- Base64 Encode / Decode
- Case Converter (camelCase, snake_case, UPPERCASE, etc.)
- URL Encode / Decode
- Image Cropper
- UUID Generator (v4, uses `crypto.randomUUID`)
- Remove Duplicate Lines
- Markdown to HTML (live split-pane preview)

## Current stage

Pre-launch. The static site is live at toolblip.com and deployed via Cloudflare Pages. There is no backend; all tool logic runs in the browser. A Laravel API backend is planned for a future phase (auth, saved history, user settings).

## Project structure

```
/
├── public/                  # Static assets
├── src/
│   ├── components/          # Shared Astro components (e.g. ToolCard)
│   ├── layouts/             # BaseLayout, ToolLayout
│   ├── pages/
│   │   ├── index.astro      # Homepage with tool grid
│   │   ├── tools/           # One directory per tool (slug/index.astro)
│   │   ├── privacy.astro
│   │   └── terms.astro
│   └── styles/
│       └── global.css
├── functions/               # Cloudflare Pages Functions (_middleware.ts)
├── astro.config.mjs
├── wrangler.toml
└── package.json
```

Astro is configured for `output: 'static'`. Each tool lives at `/tools/<slug>/`. The `functions/` directory is a Cloudflare Pages Function layer (currently middleware only) that is separate from the Astro build.

## Local development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # builds to ./dist
npm run preview   # preview the dist build locally
```

Requires Node >= 22.12.0.

## Deploy

Deployed to Cloudflare Pages. The `wrangler.toml` sets `pages_build_output_dir = "./dist"`. Pushes to the main branch trigger an automatic build and deploy via the Cloudflare Pages Git integration. No manual deploy step is needed.

## Near-term roadmap

- Additional tools (diff viewer, regex tester, color picker, etc.)
- SEO and meta improvements per-tool
- Laravel 11 API backend (Supabase Postgres)
- Google + email authentication
- Saved tool history per user
- User settings and preferences
