# syntax=docker/dockerfile:1
FROM node:22-slim

WORKDIR /app

# Install git and ca-certificates for HTTPS
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source (next.config.mjs, app/, components/, etc.)
COPY . .

# Build with webpack (Turbopack has bugs in Next.js 16)
RUN npm run build -- --webpack

# Start standalone server
ENV HOST=0.0.0.0
CMD ["node", ".next/standalone/server.js"]
# Force rebuild Wed Apr 22 16:49:48 +06 2026
