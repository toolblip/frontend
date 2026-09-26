// Keep the shared policy restrictive. Tool exceptions below replace just the
// directive required by the implemented browser capability.
export const baseCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' blob: https://toolblip-api-production.up.railway.app https://api.toolblip.com https://*.railway.app https://publish.twitter.com https://publish.x.com https://unavatar.io",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');
export const basePermissions = 'camera=(), microphone=(), geolocation=(), interest-cohort=()';

/** @param {string} directive @param {string} value */
function toolCsp(directive, value) {
  const parts = baseCsp.split('; ');
  const index = parts.findIndex(part => part.startsWith(`${directive} `));
  if (index === -1) parts.push(`${directive} ${value}`);
  else parts[index] = `${directive} ${value}`;
  return parts.join('; ');
}
const baseConnect = baseCsp.split('; ').find(part => part.startsWith('connect-src ')).slice('connect-src '.length);
/** @param {string[]} paths @param {string} value */
const cspHeaders = (paths, value) => paths.map(source => ({
  source,
  headers: [{ key: 'Content-Security-Policy', value }],
}));

export const browserPolicyHeaders = [
  ...cspHeaders(['/tools/english-dictionary'],
    toolCsp('connect-src', `${baseConnect} https://freedictionaryapi.com`)),
  // User-selected public endpoints remain subject to browser CORS/mixed-content
  // rules. These exceptions apply only to their interactive testing tools.
  ...cspHeaders(['/tools/graphql-playground'], toolCsp('connect-src', `${baseConnect} https:`)),
  ...cspHeaders(['/tools/websocket-tester'], toolCsp('connect-src', `${baseConnect} wss:`)),
  // Local conversion decodes generated object URLs, not remote media sources.
  ...cspHeaders([
    '/tools/aac-to-wav', '/tools/m4a-to-wav', '/tools/mkv-to-mp3',
    '/tools/mp4-to-mp3', '/tools/mp4-to-wav', '/tools/extract-audio',
    '/tools/cutter', '/tools/add-subtitles',
  ], toolCsp('media-src', "'self' blob:")),
  // Next applies matching header rules in order; the last value for a key
  // wins. Keep these AFTER the base rule and use exact canonical paths.
  // Alias routes redirect to these documents and retain the base policy.
  ...cspHeaders([
    '/tools/dns-lookup', '/tools/dns-lookup-tool', '/tools/ping-test',
  ], toolCsp('connect-src', `${baseConnect} https://dns.google`)),
  // Public URL readers need arbitrary HTTPS destinations (normal CORS
  // still applies). RDAP follows rdap.org to registries across TLDs, so
  // a fixed registry allowlist would break legitimate domain lookups.
  ...cspHeaders([
    '/tools/domain-age-checker',
    '/tools/broken-link-checker',
    '/tools/http-headers-inspector', '/tools/http-status-checker',
    '/tools/url-redirect-checker',
    '/tools/accessibility-checker', '/tools/heading-tag-analyzer',
    '/tools/meta-description-checker', '/tools/page-title-checker',
    '/tools/seo-title-analyzer', '/tools/seo-meta-tag-analyzer',
    '/tools/og-tag-debugger',
    '/tools/robots-txt-checker',
    '/tools/sitemap-analyzer',
  ], toolCsp('connect-src', `${baseConnect} https:`)),
  // The current downloader uses /api/favicon. Retain direct provider
  // compatibility on this tool only, including Google's redirect.
  ...cspHeaders([
    '/tools/batch-favicon-downloader',
  ], toolCsp('connect-src', `${baseConnect} https://www.google.com https://t2.gstatic.com`)),
  // These components use sandbox="" srcDoc frames, not remote embeds.
  // Their sandbox and document CSP continue to constrain preview content.
  ...cspHeaders([
    '/tools/html-live-preview', '/tools/markdown-to-html',
    '/tools/markdown-to-pdf', '/tools/notebook-to-html',
  ], toolCsp('frame-src', "'self'")),
  {
    source: '/tools/speech-to-text',
    headers: [{
      key: 'Permissions-Policy',
      value: basePermissions.replace('microphone=()', 'microphone=(self)'),
    }],
  },
];

/** The same ordered mapping drives response headers and document navigation.
 * @param {string} path
 * @param {string} [basePath]
 */
export function getBrowserPolicy(path, basePath = '') {
  let pathname = path.split(/[?#]/, 1)[0];
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    pathname = pathname.slice(basePath.length) || '/';
  }
  pathname = pathname.replace(/\/$/, '') || '/';
  let csp = baseCsp;
  let permissions = basePermissions;
  for (const rule of browserPolicyHeaders) {
    if (rule.source !== pathname) continue;
    for (const header of rule.headers) {
      if (header.key === 'Content-Security-Policy') csp = header.value;
      if (header.key === 'Permissions-Policy') permissions = header.value;
    }
  }
  return { csp, permissions };
}

/** Compare complete policies, including Permissions-Policy, not a relaxed flag.
 * @param {string} path
 * @param {string} [basePath]
 */
export function browserPolicyKey(path, basePath = '') {
  return JSON.stringify(getBrowserPolicy(path, basePath));
}
