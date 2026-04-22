# syntax=docker/dockerfile:1
FROM node:22-slim

WORKDIR /app

# Install git
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

# Clone fresh repo
RUN git clone --depth=1 https://github.com/toolblip/frontend.git .

# Install and build
RUN npm ci && npm run build

# Debug: verify PORT and list server files
RUN echo "PORT=${PORT}" && ls -la .next/standalone/ && ls -la .next/standalone/server.js

# Start with debug output
CMD echo "Starting server.js with PORT=$PORT" && node .next/standalone/server.js