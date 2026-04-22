# syntax=docker/dockerfile:1

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --webpack

# Stage 3: Runtime — minimal Node.js Alpine
FROM node:22-alpine AS runner
WORKDIR /app

# Copy only what's needed for standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Override Railway's HOSTNAME (set to container ID = non-routable) and PORT
# Railway sets these as shell env vars, not Dockerfile ENV
RUN printf '#!/bin/sh\n'\
'exec env HOSTNAME=0.0.0.0 PORT=3000 node server.js\n' > /start.sh && chmod +x /start.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["/start.sh"]
