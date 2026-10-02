# syntax=docker/dockerfile:1
# Railway: builds with npm ci + npm run build
FROM node:22-alpine

WORKDIR /app

# Install all deps for build (including devDeps for TypeScript, webpack, etc.)
COPY package*.json ./
RUN npm ci

# Copy source and build. Next inlines NEXT_PUBLIC_* during `npm run build`.
# Docker only receives the Railway service variable when it is declared as ARG.
COPY . .
ARG NEXT_PUBLIC_BING_VERIFICATION_CODE
ENV NEXT_PUBLIC_BING_VERIFICATION_CODE=$NEXT_PUBLIC_BING_VERIFICATION_CODE
RUN npm run build

# Strip dev deps for smaller runtime image
RUN npm install --omit=dev

EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

CMD ["node_modules/.bin/next", "start"]
