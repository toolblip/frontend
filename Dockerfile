# syntax=docker/dockerfile:1
# Railway-optimized: Next.js standalone on port 3000
FROM node:22-alpine

WORKDIR /app

# Install all deps for build
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Strip dev deps
RUN npm install --omit=dev

EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

CMD ["node", ".next/standalone/server.js"]
