# syntax=docker/dockerfile:1
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
RUN npm run build -- --webpack

FROM node:22-slim
WORKDIR /app
# Install nginx and supervisord
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*
# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Nginx config: proxy to Next.js on 3000, listen on 8080
RUN printf 'server { listen 8080; server_name _; root /app/public; location / { proxy_pass http://localhost:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; } location /_next/static { proxy_pass http://localhost:3000; } }' > /etc/nginx/httpd.d/default.conf
# Supervisord config to run both nginx and Node.js
RUN printf '[supervisord]\nnodaemon=true\nlogfile=/var/log/supervisord.log\npidfile=/var/run/supervisord.pid\n[program:node]\ncommand=node server.js\ndirectory=/app\nautostart=true\nautorestart=true\nstderr_logfile=/var/log/node.err.log\nstdout_logfile=/var/log/node.out.log\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\nstderr_logfile=/var/log/nginx.err.log\nstdout_logfile=/var/log/nginx.out.log\n' > /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8080
ENV PORT=8080
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
