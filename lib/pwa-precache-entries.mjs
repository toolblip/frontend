/** Precache URL list for Serwist (plain ESM for next.config.mjs). */
export const PWA_SHELL_URLS = ['/', '/tools', '/tools/images', '/~offline'];

/** Top five tools only - keep the SW install small. Must stay in sync with lib/pwa-precache-tools.ts. */
export const PWA_PRECACHE_TOOL_PATHS = [
  '/tools/json-formatter',
  '/tools/base64-encoder-decoder',
  '/tools/jwt-decoder',
  '/tools/regex-tester',
  '/tools/uuid-generator',
];
