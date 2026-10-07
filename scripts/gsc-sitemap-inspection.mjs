#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getAccessToken, requestJson, parseInspection } from './gsc-recovery.mjs';

const SITEMAPS = Object.freeze({
  tools: 'https://toolblip.com/sitemap-tools.xml',
  blog: 'https://toolblip.com/sitemap-blog.xml',
  core: 'https://toolblip.com/sitemap-core.xml',
});
const CORE_URLS = new Set(['https://toolblip.com', ...['directory', 'tools', 'tools/images', 'all-tools', 'blog', 'pricing', 'sponsors', 'sponsors/archive', 'about', 'products', 'seo', 'api-docs'].map(path => `https://toolblip.com/${path}`)]);
const URL_PATHS = {
  tools: /^\/tools\/(?:images\/)?[a-z0-9]+(?:-[a-z0-9]+)*$/,
  blog: /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
};
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SITE = 'sc-domain:toolblip.com';
const MAX_BYTES = 1024 * 1024;
const MAX_ERRORS = 20;
const MAX_IN_FLIGHT = 4;
const START_INTERVAL_MS = 200;
const STORED_FIELDS = ['verdict', 'coverageState', 'indexingState', 'robotsTxtState', 'pageFetchState', 'lastCrawlTime', 'userCanonical', 'googleCanonical'];
const safeError = error => /^(HTTP_\d{3}|REQUEST_FAILED|REQUEST_TIMEOUT|INVALID_JSON_RESPONSE|INVALID_INSPECTION_RESPONSE|INVALID_TOKEN_RESPONSE|AUTH_SIGNING_FAILED|Missing GSC_SERVICE_ACCOUNT|Invalid GSC_SERVICE_ACCOUNT|INVALID_SITEMAP|SITEMAP_TOO_LARGE|INVALID_SITE_URL|ONLY_URL_NOT_LISTED)$/.test(error?.message ?? '') ? error.message : 'OPERATION_FAILED';
const fail = code => { throw new Error(code); };
const delay = ms => new Promise(done => setTimeout(done, ms));

function sitemapUrl(cohort) {
  if (!Object.hasOwn(SITEMAPS, cohort)) fail('INVALID_SITEMAP');
  return SITEMAPS[cohort];
}

export function parseSitemap(xml, cohort = 'tools') {
  sitemapUrl(cohort);
  if (typeof xml !== 'string' || !xml || Buffer.byteLength(xml) > MAX_BYTES || /<!|<\?|<!--|-->|<!\[CDATA\[/.test(xml.replace(/^\s*<\?xml version="1\.0" encoding="UTF-8"\?>/, ''))) fail('INVALID_SITEMAP');
  if (/&(?!(?:amp|quot|apos|lt|gt);)/.test(xml)) fail('INVALID_SITEMAP');
  const clean = xml.replace(/^\s*<\?xml version="1\.0" encoding="UTF-8"\?>/, '').trim();
  const root = /^<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\s*([\s\S]*?)\s*<\/urlset>$/.exec(clean);
  if (!root) fail('INVALID_SITEMAP');
  const urls = [];
  const entry = /<url>\s*<loc>([^<>]*)<\/loc>\s*(?:<lastmod>[^<>]*<\/lastmod>\s*)?(?:<changefreq>[^<>]*<\/changefreq>\s*)?(?:<priority>[^<>]*<\/priority>\s*)?<\/url>\s*/gy;
  let offset = 0;
  while (offset < root[1].length) {
    entry.lastIndex = offset;
    const match = entry.exec(root[1]);
    if (!match) fail('INVALID_SITEMAP');
    const value = match[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (/&|[\s<>"']/.test(value)) fail('INVALID_SITEMAP');
    let url;
    try { url = new URL(value); } catch { fail('INVALID_SITEMAP'); }
    if (url.protocol !== 'https:' || url.hostname !== 'toolblip.com' || url.port || url.username || url.password || url.search || url.hash ||
        (url.href !== value && !(cohort === 'core' && value === 'https://toolblip.com')) ||
        (cohort === 'core' ? !CORE_URLS.has(value) : !URL_PATHS[cohort].test(url.pathname))) fail('INVALID_SITEMAP');
    urls.push(value);
    if (urls.length > 500) fail('INVALID_SITEMAP');
    offset = entry.lastIndex;
  }
  if (!urls.length || new Set(urls).size !== urls.length ||
      (cohort === 'core' && (urls.length !== CORE_URLS.size || urls.some(url => !CORE_URLS.has(url))))) fail('INVALID_SITEMAP');
  return urls;
}

async function fetchSitemap({ cohort = 'tools', transport = fetch, timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await transport(sitemapUrl(cohort), { method: 'GET', redirect: 'error', signal: controller.signal, headers: { accept: 'application/xml, text/xml' } });
    if (!response.ok) { await response.body?.cancel(); fail(`HTTP_${response.status}`); }
    if (Number(response.headers?.get('content-length')) > MAX_BYTES) fail('SITEMAP_TOO_LARGE');
    const chunks = [];
    let size = 0;
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); fail('SITEMAP_TOO_LARGE'); }
      chunks.push(value);
    }
    return parseSitemap(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)), cohort);
  } catch (error) {
    if (controller.signal.aborted) fail('REQUEST_TIMEOUT');
    if (['HTTP_', 'SITEMAP_TOO_LARGE', 'INVALID_SITEMAP'].some(code => error?.message?.startsWith(code))) throw error;
    fail('REQUEST_FAILED');
  } finally { clearTimeout(timer); }
}

function siteUrl(value) {
  if (value === SITE) return value;
  if (value === 'https://toolblip.com/') return value;
  fail('INVALID_SITE_URL');
}

export function groupResults(results) {
  const counts = { verdict: {}, coverageState: {}, inspected: 0, errors: 0, skipped: 0 };
  for (const { inspection } of results) {
    if (inspection.data) {
      counts.inspected++;
      for (const field of ['verdict', 'coverageState']) {
        const key = inspection.data[field] ?? 'unknown';
        counts[field][key] = (counts[field][key] ?? 0) + 1;
      }
    } else if (inspection.error) counts.errors++;
    else counts.skipped++;
  }
  return counts;
}

export function selectOnly(urls, only) {
  if (typeof only !== 'string' || !urls.includes(only)) fail('ONLY_URL_NOT_LISTED');
  return [only];
}

export async function collect({ sitemap = 'tools', only, env = process.env, now = new Date(), transport = fetch, sleep = delay, getToken = getAccessToken, onProgress = () => {} } = {}) {
  const selectedUrl = sitemapUrl(sitemap);
  const report = { schemaVersion: 1, generatedAt: now.toISOString(), status: 'complete', sitemap: { cohort: sitemap, url: selectedUrl, count: 0, error: null },
    siteUrl: SITE, inspectionMeaning: "Google's stored index view; not a live test or indexing request.", results: [] };
  let urls;
  try {
    urls = await fetchSitemap({ cohort: sitemap, transport });
    if (only) {
      urls = selectOnly(urls, only);
      report.sitemap.only = only;
    }
    report.sitemap.count = urls.length;
  }
  catch (error) { report.sitemap.error = safeError(error); report.status = 'partial-failure'; report.counts = groupResults(report.results); onProgress({ completed: 0, total: 0, inspected: 0, errors: 0, skipped: 0 }); return report; }
  try { report.siteUrl = siteUrl(env.GSC_SITEWIDE_URL || SITE); }
  catch (error) { report.stopReason = safeError(error); }
  let token;
  if (!report.stopReason) {
    try { token = await getToken(env.GSC_SERVICE_ACCOUNT, { now, transport, sleep }); }
    catch (error) { report.stopReason = safeError(error); }
  }
  let errors = 0;
  let completed = 0;
  let inspected = 0;
  const results = Array(urls.length);
  const inFlight = new Set();
  let startQueue = Promise.resolve();
  let hasStarted = false;
  const paceStart = () => {
    const turn = startQueue.then(async () => {
      if (hasStarted) await sleep(START_INTERVAL_MS);
      hasStarted = true;
    });
    startQueue = turn;
    return turn;
  };
  const inspect = async (index, url) => {
    try {
      const request = { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ inspectionUrl: url, siteUrl: report.siteUrl, languageCode: 'en-US' }) };
      let body;
      for (let attempt = 0; attempt < 2; attempt++) {
        await paceStart();
        if (report.stopReason) return;
        try {
          body = await requestJson(INSPECT_URL, request, { transport, sleep, retry429: false });
          break;
        } catch (error) {
          if (attempt || !['REQUEST_FAILED', 'REQUEST_TIMEOUT'].includes(safeError(error)) || report.stopReason) throw error;
          await sleep(1000);
        }
      }
      const parsed = parseInspection(body);
      results[index] = { url, inspection: { data: Object.fromEntries(['view', ...STORED_FIELDS].map(field => [field, parsed[field]])), error: null } };
      inspected++;
    } catch (error) {
      const code = safeError(error);
      results[index] = { url, inspection: { data: null, error: code } };
      errors++;
      if (!report.stopReason && (['HTTP_401', 'HTTP_403', 'HTTP_429'].includes(code) || errors >= MAX_ERRORS)) report.stopReason = errors >= MAX_ERRORS && !['HTTP_401', 'HTTP_403', 'HTTP_429'].includes(code) ? 'ERROR_LIMIT' : code;
    } finally {
      completed++;
      if (completed % 25 === 0) onProgress({ completed, total: urls.length, inspected, errors, skipped: 0 });
    }
  };
  for (const [index, url] of urls.entries()) {
    if (report.stopReason) break;
    if (inFlight.size >= MAX_IN_FLIGHT) await Promise.race(inFlight);
    if (report.stopReason) break;
    const task = inspect(index, url);
    inFlight.add(task);
    task.then(() => inFlight.delete(task));
  }
  await Promise.all(inFlight);
  report.results = urls.map((url, index) => results[index] ?? { url, inspection: { data: null, error: null, skipped: 'stopped' } });
  report.counts = groupResults(report.results);
  onProgress({ completed: urls.length, total: urls.length, inspected: report.counts.inspected, errors: report.counts.errors, skipped: report.counts.skipped });
  if (report.counts.errors || report.counts.skipped) report.status = 'partial-failure';
  return report;
}

export function markdown(report) {
  const cell = value => String(value ?? '—').replace(/[\r\n|]/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = ['# GSC sitemap URL Inspection', '', `Status: **${report.status}** | Generated: ${report.generatedAt}`,
    `Sitemap: ${report.sitemap.url} (${report.sitemap.count} validated ${report.sitemap.cohort === 'tools' || !report.sitemap.cohort ? 'tool' : report.sitemap.cohort} URLs${report.sitemap.only ? `; one listed URL: ${report.sitemap.only}` : ''})`, report.inspectionMeaning,
    'Search Console data can lag a recrawl. A stored verdict is not a guarantee of future indexing.', '',
    `Inspected: ${report.counts.inspected} | Errors: ${report.counts.errors} | Skipped: ${report.counts.skipped}`, '',
    '## Stored verdict counts', '', ...Object.entries(report.counts.verdict).map(([key, count]) => `- ${cell(key)}: ${count}`), '',
    '## Coverage state counts', '', ...Object.entries(report.counts.coverageState).map(([key, count]) => `- ${cell(key)}: ${count}`), ''];
  if (report.sitemap.error) lines.push(`Sitemap error: ${cell(report.sitemap.error)}`, '');
  if (report.stopReason) lines.push(`Stopped: ${cell(report.stopReason)}`, '');
  lines.push('## Per-URL stored view', '', '| URL | Verdict | Coverage | Indexing | Robots | Fetch | Last crawl | User canonical | Google canonical | Error / skipped |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const row of report.results) {
    const data = row.inspection.data;
    lines.push(`| ${[row.url, ...STORED_FIELDS.map(field => data?.[field]), row.inspection.error ?? row.inspection.skipped].map(cell).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export async function main(args = process.argv.slice(2), options = {}) {
  let output;
  let sitemap = 'tools';
  let only;
  try {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--output' && args[i + 1] && !args[i + 1].startsWith('--')) output = args[++i];
      else if (args[i] === '--sitemap' && args[i + 1] && Object.hasOwn(SITEMAPS, args[i + 1])) sitemap = args[++i];
      else if (args[i] === '--only' && args[i + 1] && !args[i + 1].startsWith('--')) only = args[++i];
      else fail('INVALID_SITEMAP');
    }
    output ??= `test-results/gsc-sitemap-inspection${sitemap === 'tools' ? '' : `-${sitemap}`}`;
    const report = await collect({ ...options, sitemap, only, onProgress: counts => {
      console.log(`GSC sitemap inspection progress: ${counts.completed}/${counts.total} completed, ${counts.inspected} inspected, ${counts.errors} errors, ${counts.skipped} skipped.`);
      options.onProgress?.(counts);
    } });
    await mkdir(resolve(output), { recursive: true });
    await writeFile(join(resolve(output), 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(join(resolve(output), 'report.md'), markdown(report));
    console.log(`GSC sitemap inspection: ${report.status}. JSON and Markdown reports written.`);
    return report.status === 'complete' ? 0 : 1;
  } catch (error) {
    console.error(`GSC sitemap inspection: ${safeError(error)}`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = await main();
