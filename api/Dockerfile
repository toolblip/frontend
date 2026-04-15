FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-dom php8.3-redis php8.3-bcmath \
    supervisor nginx && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock* ./

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application
COPY . .

# Setup storage
RUN mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache && \
    chmod -R a+rw storage

# Pre-cache Laravel
RUN composer dump-autoload --optimize && php artisan config:cache && php artisan route:cache

# Nginx config
RUN echo "server { listen 8080; root /app/public; index index.php; location / { try_files \$uri \$uri/ /index.php?\$query_string; } location ~ \\.php$ { fastcgi_pass 127.0.0.1:9000; fastcgi_index index.php; fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name; include fastcgi_params; } }" > /etc/nginx/sites-available/default

# Supervisord config
RUN echo "[supervisord]
nodaemon=true
[program:php-fpm]
command=php-fpm8.3 -F
autostart=true
autorestart=true
[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true" > /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord"]
