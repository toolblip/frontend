# syntax=docker/dockerfile:1
# Railway-optimized — Alpine + nginx reverse proxy on port 8080
# Railway routes external traffic to port 8080, proxies to Node.js on 3000

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

# Stage 3: Railway runtime — Alpine with nginx
FROM node:22-alpine AS runner
RUN apk add --no-cache nginx supervisor

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# nginx: Railway routes to 8080, proxy to Node on 3000
RUN echo 'server { listen 8080; server_name _; root /app/public; location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; } location /_next/static { proxy_pass http://127.0.0.1:3000; } }' \
  > /etc/nginx/http.d/default.conf

# Start script — override Railway's HOSTNAME (container_id) and PORT env vars
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'exec env HOSTNAME=0.0.0.0 PORT=3000 node server.js' >> /start.sh && \
    chmod +x /start.sh

# Supervisord config — write each line separately to avoid escaping issues
RUN mkdir -p /etc/supervisor/conf.d && \
    echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:node]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=/start.sh' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'directory=/app' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'expect_startretries=5' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
