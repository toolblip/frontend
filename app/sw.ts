/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/turbopack/worker';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const authAndAccountPaths = [
  '/api/',
  '/dashboard',
  '/account',
  '/admin',
  '/login',
  '/signup',
  '/pricing',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

function isAuthOrAccountPath(pathname: string): boolean {
  return authAndAccountPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix),
  );
}

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ request, url, sameOrigin }) =>
      sameOrigin && (request.method !== 'GET' || isAuthOrAccountPath(url.pathname)),
    handler: new NetworkOnly(),
  },
  // Sponsor favicons (google s2 / gstatic / unavatar) and other third-party
  // images must not go through Serwist's cross-origin NetworkFirst — redirects
  // and opaque responses intermittently fail and SponsorAvatar falls back to
  // the letter tile.
  {
    matcher: ({ request, sameOrigin }) =>
      !sameOrigin &&
      (request.destination === 'image' ||
        request.destination === 'font' ||
        /\.(?:png|jpe?g|gif|webp|svg|ico)(?:$|\?)/i.test(request.url) ||
        /(?:google\.com\/s2\/favicons|gstatic\.com\/favicon|unavatar\.io)/i.test(request.url)),
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ url, sameOrigin }) =>
      sameOrigin &&
      (url.pathname.startsWith('/models/') ||
        url.pathname.startsWith('/pdf-worker/') ||
        url.pathname.includes('wasm') ||
        url.pathname.endsWith('.wasm')),
    handler: new CacheFirst({
      cacheName: 'heavy-runtimes',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 24,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
      ],
    }),
  },
  {
    matcher: ({ request, url, sameOrigin }) =>
      sameOrigin &&
      request.mode === 'navigate' &&
      (url.pathname.startsWith('/tools/') ||
        url.pathname === '/tools' ||
        url.pathname === '/' ||
        url.pathname.startsWith('/blog')),
    handler: new NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 80,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
