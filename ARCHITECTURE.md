# Toolblip Architecture

## Stack Overview

```
Cloudflare (CDN/DNS)
     ↓
Vercel (Next.js frontend)  →  https://toolblip.com
     ↓ API
Railway (Laravel backend)  →  https://api.toolblip.com
     ↓
PostgreSQL + Redis
```

- **Cloudflare** — DNS management, CDN, SSL termination, proxy layer
- **Vercel** — Next.js frontend hosting, edge deployment, auto-scaling
- **Railway** — Laravel API hosting at api.toolblip.com (verified 2026-04-16)
- **PostgreSQL** — primary relational database (users, tools, mcp_servers)
- **Redis** — caching, rate limiting, session storage

---

## Directory Structure

### Frontend (Next.js — Vercel)

```
toolblip/                      # Next.js app (at repo root after migration)
├── src/
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── tools/             # Individual tool pages
│   │   ├── directory/         # MCP server + tool directory
│   │   ├── auth/              # Login, register pages
│   │   └── api/               # API routes (optional, for static generation)
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── tools/             # Tool-specific components
│   │   └── directory/         # Directory-specific components
│   └── lib/
│       ├── api.ts             # API client helper
│       └── utils.ts
├── public/
├── next.config.js
└── .env.local
```

### Backend (Laravel — Railway)

```
toolblip-api/                  # Laravel API (separate repo)
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ToolController.php
│   │   │   └── McpServerController.php
│   │   └── Middleware/
│   │       └── CorsMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Tool.php
│   │   ├── McpServer.php
│   │   └── ApiKey.php
│   └── Services/
│       └── SearchService.php
├── config/
├── database/
│   └── migrations/
├── routes/
│   └── api.php
├── docker-compose.yml
├── Dockerfile
└── .env
```

---

## API Design

### Tool Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | List all tools (paginated, filterable by category) |
| GET | `/api/tools/{slug}` | Get single tool by slug |

### MCP Server Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/servers` | List all MCP servers (paginated, filterable) |
| GET | `/api/mcp/servers/{slug}` | Get single MCP server by slug |
| POST | `/api/mcp/servers/submit` | Submit a new MCP server (public, rate-limited) |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns Sanctum token |
| POST | `/api/auth/logout` | Revoke current token |
| GET | `/api/auth/me` | Get authenticated user |

### API Key Endpoints (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/keys` | List user's API keys |
| POST | `/api/keys` | Create new API key |
| DELETE | `/api/keys/{id}` | Revoke an API key |

---

## Database Schema

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | Auto-increment |
| name | varchar(255) | |
| email | varchar(255) | Unique |
| password | varchar(255) | Hashed |
| is_pro | boolean | Default false |
| created_at | timestamp | |
| updated_at | timestamp | |

### `tools`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | Auto-increment |
| slug | varchar(255) | Unique |
| name | varchar(255) | |
| description | text | |
| category | varchar(100) | e.g., "encoder", "formatter" |
| is_pro | boolean | Default false |
| icon | varchar(255) | URL or emoji |
| created_at | timestamp | |
| updated_at | timestamp | |

### `mcp_servers`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | Auto-increment |
| slug | varchar(255) | Unique |
| name | varchar(255) | |
| description | text | |
| category | varchar(100) | e.g., "data", "code", "browser" |
| url | varchar(500) | Link to repo/docs |
| created_at | timestamp | |
| updated_at | timestamp | |

### `api_keys`

| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | Auto-increment |
| user_id | bigint (FK) | References users |
| key | varchar(64) | Hashed, shown once at creation |
| name | varchar(255) | User-provided label |
| created_at | timestamp | |

---

## Environment Variables

### Vercel Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.toolblip.com
NEXT_PUBLIC_APP_URL=https://toolblip.com
```

### Railway Backend (.env)

```env
APP_NAME=Toolblip API
APP_ENV=production
APP_URL=https://toolblip.com
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=<railway-provided>
DB_PORT=5432
DB_DATABASE=toolblip
DB_USERNAME=<railway-provided>
DB_PASSWORD=<railway-provided>

REDIS_HOST=<railway-provided>
REDIS_PORT=6379
REDIS_PASSWORD=<railway-provided>

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

SANCTUM_STATE_DURATION=2592000

CORS_ALLOWED_ORIGINS=https://toolblip.com,https://www.toolblip.com

LOG_CHANNEL=stderr
LOG_LEVEL=error
```

---

## Deployment

### Vercel Frontend

1. Connect GitHub repo (`toolblip`)
2. Framework preset: **Next.js** (auto-detected from `package.json`)
3. Root directory: `/` (repo root)
4. Build command: `npm run build` → `next build`
5. Environment variables: add `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
6. Custom domain: `toolblip.com` (added in Vercel dashboard → domains)
7. **Cloudflare proxy**: DNS `A` record pointing to Vercel IP (proxied)

### Railway Backend

1. Connect GitHub repo (`toolblip-api`)
2. Service type: **Docker** (Dockerfile in repo root)
3. Add PostgreSQL plugin from Railway marketplace
4. Add Redis plugin from Railway marketplace
5. Set environment variables from `.env` (paste full config above)
6. Custom domain: `api.toolblip.com` via Railway dashboard → networking
7. **Cloudflare DNS**: CNAME `api.toolblip.com` → Railway app URL (proxied)

### Cloudflare DNS (shared config)

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| A | toolblip.com | Vercel IP (76.76.21.21) | ✅ proxied |
| A | www | Vercel IP (76.76.21.21) | ✅ proxied |
| CNAME | api | `<railway-app>.up.railway.app` | ✅ proxied |

### Deployment Order

1. **Backend first** — get Railway API live at `api.toolblip.com`
2. **Frontend second** — deploy Next.js to Vercel, verify it calls the API
3. **Domain last** — add custom domains via Cloudflare + Vercel/Railway dashboards

---

## Security Notes

- API uses Laravel Sanctum for token auth (SPA mode)
- CORS restricted to `toolblip.com` origins only
- API keys stored hashed (SHA-256), shown once at creation
- Rate limiting: 60 req/min for unauthenticated, 300 req/min for authenticated
- Railway runs in a private network; PostgreSQL + Redis not publicly exposed
