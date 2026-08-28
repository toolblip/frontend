import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createSerwistRoute } from '@serwist/turbopack';
import { PWA_PRECACHE_TOOL_PATHS, PWA_SHELL_URLS } from '../../../lib/pwa-precache-entries.mjs';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ||
  randomUUID();

const additionalPrecacheEntries = [...PWA_SHELL_URLS, ...PWA_PRECACHE_TOOL_PATHS].map(
  (url) => ({ url, revision }),
);

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries,
    swSrc: 'app/sw.ts',
    useNativeEsbuild: true,
  });
