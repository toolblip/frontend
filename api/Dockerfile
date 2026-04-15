FROM ubuntu:24.04

# Install system deps
RUN apt-get update && apt-get install -y \
    php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-dom php8.3-redis php8.3-bcmath php8.3-soap \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock* ./

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application
COPY . .

# Install node deps and build
RUN apt-get update && apt-get install -y nodejs npm && \
    npm install && npm run build && \
    rm -rf /var/lib/apt/lists/* /tmp/*

# Setup storage
RUN mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache && \
    chmod -R a+rw storage

# Pre-cache Laravel
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Use static server for simplest deployment
EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
