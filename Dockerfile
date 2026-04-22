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
# nginx on 8080, proxies to Next.js on 3000
RUN printf 'server { listen 8080; server_name _; root /app/public; location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; } location /_next/static { proxy_pass http://127.0.0.1:3000; } }' > /etc/nginx/conf.d/default.conf
# Override Railway's PORT=8080 with PORT=3000, also fix HOSTNAME
RUN printf '#!/bin/bash\nexport PORT=3000\nexport HOSTNAME=0.0.0.0\necho "Starting with PORT=$PORT HOSTNAME=$HOSTNAME"\nnode server.js\n' > /start.sh && chmod +x /start.sh
RUN printf '[supervisord]\nnodaemon=true\nlogfile=/var/log/supervisord.log\n[program:node]\ncommand=/start.sh\ndirectory=/app\nexpoct_startretries=5\nautostart=true\nautorestart=true\nstdout_logfile=/var/log/node-stdout.log\nstderr_logfile=/var/log/node-stderr.log\n[program:nginx]\ncommand=nginx -g "daemon off;"\nautostart=true\nautorestart=true\n' > /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8080
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
