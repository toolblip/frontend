/** Pure parsing/generation for the seo-network routes. No network-derived scores. */
export const INPUT_LIMIT = 200_000;
export function boundedInput(value: string) {
  if (value.length > INPUT_LIMIT) throw new Error('Input exceeds 200,000 characters.');
  if (!value.trim()) throw new Error('Enter input first.');
}
export function httpUrl(value: string): URL {
  if (!/^https?:\/\//i.test(value.trim()) || /[\r\n\u0000-\u001f]/.test(value)) throw new Error('Enter an absolute HTTP or HTTPS URL.');
  const url = new URL(value.trim());
  if (!url.hostname || url.username || url.password) throw new Error('URLs with credentials are not supported.');
  return url;
}
export function htmlEscape(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export type RobotsGroup = { agents: string[]; rules: { allow: boolean; path: string; line: number }[] };
export function parseRobots(text: string) {
  boundedInput(text);
  const groups: RobotsGroup[] = [], errors: string[] = [], warnings: string[] = [], sitemaps: string[] = [];
  let group: RobotsGroup | undefined;
  let hasDirectives = false;
  text.replace(/^\uFEFF/, '').split(/\r?\n/).forEach((raw, index) => {
    const line = raw.split('#')[0].trim();
    if (!line) return;
    const colon = line.indexOf(':');
    if (colon < 0) { errors.push(`Line ${index + 1}: expected directive: value.`); return; }
    const key = line.slice(0, colon).trim().toLowerCase(), value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (!/^(\*|[a-z_-]+)$/i.test(value)) errors.push(`Line ${index + 1}: invalid User-agent product token.`);
      if (!group || hasDirectives) { group = { agents: [], rules: [] }; groups.push(group); hasDirectives = false; }
      group.agents.push(value);
    } else if (key === 'allow' || key === 'disallow') {
      hasDirectives = true;
      if (!group) errors.push(`Line ${index + 1}: rule requires a preceding User-agent.`);
      else if (value && !value.startsWith('/')) errors.push(`Line ${index + 1}: path must start with / or be empty.`);
      else group.rules.push({ allow: key === 'allow', path: value, line: index + 1 });
    } else if (key === 'sitemap') {
      try { httpUrl(value); sitemaps.push(value); } catch { errors.push(`Line ${index + 1}: invalid Sitemap URL.`); }
    } else {
      warnings.push(`Line ${index + 1}: ${key === 'crawl-delay' ? 'Crawl-delay' : key} is not an RFC 9309 access rule; crawler support varies.`);
    }
  });
  return { groups, errors, warnings, sitemaps };
}
// Normalize UTF-8 and percent-encoded unreserved bytes before RFC 9309 matching.
function robotsOctets(value: string) {
  return Array.from(value).map(c => c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c).join('').replace(/%[0-9a-f]{2}/gi, value => {
    const c = String.fromCharCode(parseInt(value.slice(1), 16));
    return /[a-z0-9._~-]/i.test(c) ? c : value.toUpperCase();
  });
}
export function robotsDecision(parsed: ReturnType<typeof parseRobots>, agent: string, path: string) {
  if (!/^[a-z_-]+$/i.test(agent) || !path.startsWith('/')) throw new Error('Use a crawler product token and a path starting with /.');
  if (path.split(/[?#]/)[0] === '/robots.txt') return { allowed: true, line: null, matched: null };
  const exact = parsed.groups.filter(g => g.agents.some(a => a.toLowerCase() === agent.toLowerCase()));
  const groups = exact.length ? exact : parsed.groups.filter(g => g.agents.includes('*'));
  let winner: RobotsGroup['rules'][number] | undefined, length = -1;
  for (const rule of groups.flatMap(g => g.rules)) {
    if (!rule.path) continue; // Empty Allow/Disallow matches nothing.
    const normalized = robotsOctets(rule.path);
    const anchored = normalized.endsWith('$');
    const pattern = (anchored ? normalized.slice(0, -1) : normalized).split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    const specificity = normalized.replace(/[*$]/g, '').replace(/%[0-9A-F]{2}/g, '_').length;
    if (new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(robotsOctets(path.split('#')[0])) && (specificity > length || (specificity === length && rule.allow))) {
      winner = rule; length = specificity;
    }
  }
  return { allowed: winner?.allow ?? true, line: winner?.line ?? null, matched: winner?.path ?? null };
}
export function tokens(text: string) { return text.toLocaleLowerCase('en').match(/[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu) ?? []; }
export function keywordStats(text: string, keyword: string, size = 1, excludeStopwords = false) {
  boundedInput(text);
  if (![1, 2, 3].includes(size)) throw new Error('Choose a phrase size from 1 to 3.');
  const words = tokens(text), counts = new Map<string, number>();
  const stop = new Set('a an and are as at be by for from in is it of on or that the this to was with'.split(' '));
  const windows = Math.max(0, words.length - size + 1);
  for (let i = 0; i < windows; i++) {
    const phrase = words.slice(i, i + size);
    if (excludeStopwords && phrase.every(w => stop.has(w))) continue;
    const key = phrase.join(' '); counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const query = tokens(keyword), opportunities = Math.max(0, words.length - query.length + 1);
  let count = 0;
  if (query.length) for (let i = 0; i < opportunities; i++) if (query.every((w, j) => words[i + j] === w)) count++;
  return { total: words.length, windows, keyword: { count, density: opportunities && query.length ? Math.round(count / opportunities * 10000) / 100 : 0 }, rows: [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([phrase, count]) => ({ phrase, count, density: Math.round(count / windows * 10000) / 100 })) };
}
export type CanonicalOptions = { https?: boolean; www?: boolean; slash?: boolean; query?: boolean; hash?: boolean };
export function canonicalUrl(raw: string, options: CanonicalOptions) {
  const url = httpUrl(raw);
  if (options.https) url.protocol = 'https:';
  if (options.www) url.hostname = url.hostname.replace(/^www\./i, '');
  if (options.slash) url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  if (options.query) url.search = '';
  if (options.hash) url.hash = '';
  return url.href;
}
export function duplicateUrls(input: string, options: CanonicalOptions = {}) {
  boundedInput(input);
  const groups = new Map<string, string[]>(), invalid: string[] = [];
  for (const line of input.split(/\r?\n/).map(x => x.trim()).filter(Boolean)) {
    try {
      const key = canonicalUrl(line, options);
      groups.set(key, [...(groups.get(key) ?? []), line]);
    } catch { invalid.push(line); }
  }
  return { unique: [...groups.keys()], groups: [...groups].filter(([, rows]) => rows.length > 1).map(([url, originals]) => ({ url, originals })), invalid };
}
export function hreflangOutput(input: string, format: string) {
  boundedInput(input);
  const seen = new Set<string>();
  const entries = input.trim().split(/\r?\n/).filter(x => x.trim()).map(line => {
    const match = line.trim().match(/^(\S+)\s+(\S+)$/);
    if (!match) throw new Error('Use one language-code URL pair per line.');
    const [, lang, raw] = match;
    if (!/^(?:[a-z]{2,3}(?:-[A-Za-z]{4})?(?:-[A-Za-z]{2})?|x-default)$/.test(lang)) throw new Error('Use a language code such as en, en-US, zh-Hant or x-default.');
    if (seen.has(lang.toLowerCase())) throw new Error(`Duplicate language: ${lang}`);
    seen.add(lang.toLowerCase()); httpUrl(raw);
    return { hreflang: lang, href: raw };
  });
  if (format === 'json') return JSON.stringify(entries, null, 2);
  const links = (prefix = '') => entries.map(e => `<${prefix}link rel="alternate" hreflang="${htmlEscape(e.hreflang)}" href="${htmlEscape(e.href)}" />`).join('\n');
  if (format === 'sitemap') return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.filter(e => e.hreflang !== 'x-default').map(e => `<url>\n<loc>${htmlEscape(e.href)}</loc>\n${links('xhtml:')}\n</url>`).join('\n')}\n</urlset>`;
  return links();
}
export function formatMac(bytes: Uint8Array, separator: string) {
  if (bytes.length !== 6 || ![':', '-', ''].includes(separator)) throw new Error('Invalid MAC format.');
  const copy = bytes.slice(); copy[0] = (copy[0] | 2) & 254;
  return [...copy].map(n => n.toString(16).padStart(2, '0').toUpperCase()).join(separator);
}
export function domainAge(data: { events?: { eventAction: string; eventDate: string }[]; nameservers?: { ldhName?: string }[]; status?: string[] }, now = new Date()) {
  const date = (action: string) => {
    const raw = data.events?.find(e => e.eventAction === action)?.eventDate;
    if (!raw) return null;
    const parsed = new Date(raw);
    if (!Number.isFinite(parsed.getTime())) throw new Error(`Invalid ${action} date from registry.`);
    return parsed.toISOString();
  };
  const registered = date('registration'), expires = date('expiration');
  if (registered && new Date(registered) > now) throw new Error('Registry returned a future registration date.');
  return { registered, expires, lastChanged: date('last changed'), ageDays: registered ? Math.floor((now.getTime() - new Date(registered).getTime()) / 86400000) : null, nameservers: (data.nameservers ?? []).map(n => n.ldhName).filter(Boolean), status: data.status ?? [] };
}
