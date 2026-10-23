# syntax=docker/dockerfile:1
# Railway builds this. Runtime image only carries Next's standalone output.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Next inlines NEXT_PUBLIC_* during `npm run build`. Docker only receives the
# Railway service variable when it is declared as ARG.
ARG NEXT_PUBLIC_BING_VERIFICATION_CODE
ENV NEXT_PUBLIC_BING_VERIFICATION_CODE=$NEXT_PUBLIC_BING_VERIFICATION_CODE
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# app/serwist/[path]/route.ts bundles app/sw.ts with esbuild at request time;
# standalone tracing only follows server imports, so copy what esbuild needs.
COPY --from=build /app/app/sw.ts ./app/sw.ts
COPY --from=build /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=build /app/node_modules/@esbuild ./node_modules/@esbuild
COPY --from=build /app/node_modules/serwist ./node_modules/serwist
COPY --from=build /app/node_modules/idb ./node_modules/idb
COPY --from=build /app/node_modules/@serwist/utils ./node_modules/@serwist/utils
COPY --from=build /app/node_modules/@serwist/turbopack ./node_modules/@serwist/turbopack
# Railway mounts the short-links volume here (SHORT_LINKS_DATA_DIR).
RUN mkdir -p /app/persistent-data
EXPOSE 3000
CMD ["node", "server.js"]
