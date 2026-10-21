import { getToolPathBySlug } from '@/lib/tool-path';

/**
 * High-traffic / featured tool slugs precached into the service worker at
 * build time so they work offline before the user has visited them.
 * Keep this list tiny (top five) - larger installs hurt mobile storage budgets.
 */
export const PWA_PRECACHE_TOOL_SLUGS = [
  'json-formatter',
  'base64-encoder-decoder',
  'jwt-decoder',
  'regex-tester',
  'uuid-generator',
] as const;

export function getPwaPrecacheToolPaths(): string[] {
  return PWA_PRECACHE_TOOL_SLUGS.map((slug) => getToolPathBySlug(slug));
}
