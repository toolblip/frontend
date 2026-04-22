# syntax=docker/dockerfile:1
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL deps (including dev) for webpack + TypeScript to work
RUN npm ci --include=dev && npm cache clean --force
COPY . .
# Build with webpack (Turbopack has bugs in Next.js 16)
RUN npm run build -- --webpack

FROM node:22-slim
WORKDIR /app
# Production runtime: nginx reverse proxy on 8080 → Next.js on 3000
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN printf 'server { listen 8080; server_name _; root /app/public; location / { proxy_pass http://localhost:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; } location /_next/static { proxy_pass http://localhost:3000; } }' > /etc/nginx/conf.d/default.conf
RUN printf '[supervisord]\nnodaemon=true\n[program:node]\ncommand=sh -c "node server.js 2>&1 | tee /var/log/node.log"\ndirectory=/app\nexpoct_startretries=5\nautostart=true\nautorestart=true\nstdout_logfile=/var/log/node.stdout.log\nstderr_logfile=/var/log/node.stderr.log\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\n' > /etc/supervisor/conf.d/supervisord.conf
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 8080
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
