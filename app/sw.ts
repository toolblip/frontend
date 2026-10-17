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
  '/verify-email',
  '/auth',
  '/setup-passkey',
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
].map((entry) => {
  // Leave every cross-origin request to the browser. The worker's own fetch()
  // is bound by its connect-src CSP, which blocked Turnstile, gtag, sponsor
  // favicons and badge images.
  const { matcher } = entry;
  if (typeof matcher === 'function') {
    return { ...entry, matcher: (options) => options.sameOrigin && matcher(options) };
  }
  // defaultCache ends with a /.*/ catch-all, which also matches cross-origin URLs.
  if (matcher instanceof RegExp) {
    return { ...entry, matcher: ({ url, sameOrigin }) => sameOrigin && matcher.test(url.href) };
  }
  return entry;
});

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
