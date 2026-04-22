# syntax=docker/dockerfile:1
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev && npm cache clean --force
COPY . .
RUN npm run build -- --webpack

FROM node:22-slim
WORKDIR /app
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN printf 'server { listen 8080; server_name _; root /app/public; location / { proxy_pass http://localhost:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; } location /_next/static { proxy_pass http://localhost:3000; } }' > /etc/nginx/conf.d/default.conf
RUN printf '[supervisord]\nnodaemon=true\nlogfile=/var/log/supervisord.log\n[program:node]\ncommand=bash -c "HOSTNAME=0.0.0.0 node server.js"\ndirectory=/app\nexpoct_startretries=5\nautostart=true\nautorestart=true\nstdout_logfile=/var/log/node-stdout.log\nstderr_logfile=/var/log/node-stderr.log\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\n' > /etc/supervisor/conf.d/supervisord.conf
# Override Railway's HOSTNAME with 0.0.0.0 - this must be set AFTER the FROM image sets it
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 8080
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
