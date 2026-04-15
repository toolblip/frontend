# Phase 2: Laravel API Backend

## Stack
- **Framework:** Laravel 11
- **Database:** PostgreSQL (Railway)
- **Auth:** Laravel Sanctum (token-based API auth)
- **Hosting:** Railway
- **Frontend:** Next.js 16 (existing)

## Goals
- User registration + login + logout via API
- Protect API routes with Sanctum authentication
- Basic tools API (read-only for now, write after auth is confirmed)
- CORS configured for `toolblip.com`

## Schema (Keep Lean)

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | varchar(255) | required |
| email | varchar(255) | unique, required |
| password | varchar(255) | hashed |
| created_at | timestamp | |
| updated_at | timestamp | |

No extra columns. No roles, no profiles yet.

### `tools` (existing or new API table)
For now, the frontend reads from the static data file (`src/data/tools.ts`). The API will serve this same data structure over time. **Do not duplicate data unnecessarily.**

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns token |
| POST | `/api/auth/logout` | Yes | Revoke current token |
| GET | `/api/auth/user` | Yes | Get authenticated user |

### Tools
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tools` | No | List all tools |
| GET | `/api/tools/{slug}` | No | Get single tool |

## CORS
- Allow: `https://toolblip.com`, `https://www.toolblip.com`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: `Accept`, `Content-Type`, `Authorization`

## Frontend Integration
- API base URL: `https://api.toolblip.com` (or Railway URL)
- Token stored in `localStorage` under `toolblip_token`
- Auth header: `Authorization: Bearer <token>`
- Login/signup pages point to `/api/auth/*`

## Environment Variables (Railway)

```
APP_URL=https://api.toolblip.com
APP_ENV=production
APP_KEY=<generated>
DB_CONNECTION=pgsql
DB_HOST=<railway postgres host>
DB_PORT=5432
DB_DATABASE=toolblip
DB_USERNAME=<railway username>
DB_PASSWORD=<railway password>
FRONTEND_URL=https://toolblip.com
```

## Steps

- [ ] Create Laravel 11 project locally
- [ ] Add Sanctum, configure
- [ ] Create migrations (users table — base Laravel, no extras)
- [ ] Create auth controllers (Register, Login, Logout, User)
- [ ] Create tools API controller (read-only)
- [ ] Configure CORS
- [ ] Set up Railway project + PostgreSQL
- [ ] Deploy to Railway
- [ ] Point frontend to API
- [ ] Test full auth flow (register → login → access protected route)
