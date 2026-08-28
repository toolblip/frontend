import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createSerwistRoute } from '@serwist/turbopack';
import { NextResponse } from 'next/server';
import { PWA_PRECACHE_TOOL_PATHS, PWA_SHELL_URLS } from '../../../lib/pwa-precache-entries.mjs';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ||
  randomUUID();

const additionalPrecacheEntries = [...PWA_SHELL_URLS, ...PWA_PRECACHE_TOOL_PATHS].map(
  (url) => ({ url, revision }),
);

const serwistRoute = createSerwistRoute({
  additionalPrecacheEntries,
  swSrc: 'app/sw.ts',
  // Alpine (Railway) can use native esbuild; wasm is the fallback if native fails.
  useNativeEsbuild: true,
});

// createSerwistRoute defaults to force-static + year-long s-maxage, which
// leaves Cloudflare/Next serving a stale SW after deploys (sponsor favicon
// NetworkOnly rules never reached clients). next.config headers alone do not
// override that — set no-store on the response and force a dynamic render.
export const dynamic = 'force-dynamic';
export const dynamicParams = serwistRoute.dynamicParams;
export const generateStaticParams = serwistRoute.generateStaticParams;

const NO_STORE = 'no-cache, no-store, must-revalidate, max-age=0';

export const GET = async (
  request: Request,
  context: { params: Promise<{ path: string }> },
) => {
  const res = await serwistRoute.GET(request, context);
  const headers = new Headers(res.headers);
  headers.set('Cache-Control', NO_STORE);
  headers.set('CDN-Cache-Control', 'no-store');
  headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
};
