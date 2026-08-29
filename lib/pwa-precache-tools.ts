import { getToolPathBySlug } from '@/lib/tool-path';

/**
 * High-traffic / featured tool slugs precached into the service worker at
 * build time so they work offline before the user has visited them.
 * Keep this list ~50 — larger installs hurt mobile storage budgets.
 */
export const PWA_PRECACHE_TOOL_SLUGS = [
  'json-formatter',
  'json-validator',
  'json-csv-converter',
  'json-yaml-converter',
  'json-xml-converter',
  'csv-tsv-converter',
  'json-toml-converter',
  'xml-formatter',
  'base64-encoder-decoder',
  'url-encode',
  'jwt-decoder',
  'regex-tester',
  'regex-explainer',
  'uuid-generator',
  'sha256-hash-generator',
  'hash-from-text',
  'password-generator',
  'word-counter',
  'character-counter',
  'case-converter',
  'lorem-ipsum-generator',
  'code-diff',
  'markdown-to-html',
  'html-to-markdown',
  'qr-code-generator',
  'unix-timestamp-converter',
  'timestamp-converter',
  'cron-generator',
  'color-palette-generator',
  'contrast-checker',
  'meta-tag-generator',
  'robots-txt-generator',
  'open-graph-generator',
  'image-cropper',
  'image-resizer',
  'image-compressor',
  'image-to-base64',
  'image-background-remover',
  'image-aspect-ratio-calculator',
  'favicon-generator',
  'banner-generator',
  'sql-formatter',
  'css-minifier',
  'js-minifier',
  'html-encoder',
  'remove-duplicate-lines',
  'slug-generator',
  'url-slug-generator',
  'random-number-generator',
  'bcrypt-hash-generator',
  'md5-hash-generator',
] as const;

export function getPwaPrecacheToolPaths(): string[] {
  return PWA_PRECACHE_TOOL_SLUGS.map((slug) => getToolPathBySlug(slug));
}
