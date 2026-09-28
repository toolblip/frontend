#!/usr/bin/env node
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
// Freeze content as well as membership; future cohorts require a new version/baseline.
const COHORT_HASH = '4f9a0cdb1b9f41b03a262c5806d735d9e9f407658b7a34877005d6704c135b73';
const cohortHash = cohort => createHash('sha256').update(JSON.stringify(cohort)).digest('hex');
const COHORT_FILE = new URL('../data/gsc-recovery-cohort.json', import.meta.url);
const INSPECTION_FIELDS = ['verdict', 'coverageState', 'indexingState', 'robotsTxtState', 'pageFetchState', 'lastCrawlTime', 'userCanonical', 'googleCanonical'];
const METRICS = ['clicks', 'impressions', 'ctr', 'position'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
class SafeError extends Error {}
const fail = message => { throw new SafeError(message); };
// Never serialize upstream Error objects, response bodies, requests or credentials.
const safeError = error => error instanceof SafeError ? error.message : 'OPERATION_FAILED';

export function validateCohort(cohort) {
  if (!object(cohort) || cohort.version !== '2026-09-26' || cohort.origin !== 'https://toolblip.com' ||
      !Number.isFinite(Date.parse(cohort.createdAt)) || typeof cohort.rationale !== 'string' || !cohort.rationale.trim() ||
      !Array.isArray(cohort.urls) || cohort.urls.length !== 12 || new Set(cohort.urls).size !== 12) fail('Invalid cohort');
  for (const value of cohort.urls) {
    let url;
    try { url = new URL(value); } catch { fail('Invalid cohort URL'); }
    if (typeof value !== 'string' || url.origin !== cohort.origin || url.href !== value || url.username || url.password || url.search || url.hash || !url.pathname.startsWith('/tools/')) fail('Invalid cohort URL');
  }
  if (cohortHash(cohort) !== COHORT_HASH) fail('Frozen cohort content changed');
  return cohort.urls;
}

export function dateWindow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = name => parts.find(item => item.type === name).value;
  // Calendar arithmetic after resolving PT today avoids DST-length-day errors.
  const today = Date.parse(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`);
  const day = offset => new Date(today - offset * 86400000).toISOString().slice(0, 10);
  return { startDate: day(9), endDate: day(3), timeZone: 'America/Los_Angeles', dataState: 'final', type: 'web' };
}

export function parseCredential(raw) {
  if (!raw) fail('Missing GSC_SERVICE_ACCOUNT');
  try {
    let value = raw;
    for (let depth = 0; depth < 4 && typeof value === 'string'; depth++) {
      try { value = JSON.parse(value); }
      catch { value = JSON.parse(Buffer.from(value, 'base64').toString('utf8')); }
    }
    if (!object(value) || value.type !== 'service_account' || typeof value.client_email !== 'string' ||
        !/^[^\s@]+@[^\s@]+$/.test(value.client_email) || typeof value.private_key !== 'string') throw Error();
    const key = createPrivateKey(value.private_key);
    if (key.asymmetricKeyType !== 'rsa') throw Error();
    return { client_email: value.client_email, private_key: key };
  } catch { fail('Invalid GSC_SERVICE_ACCOUNT'); }
}

export async function requestJson(url, init, { transport = fetch, sleep = ms => new Promise(r => setTimeout(r, ms)), timeoutMs = 15000 } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    let timer;
    let response;
    try {
      response = await Promise.race([
        (async () => {
          const result = await transport(url, { ...init, redirect: 'error', signal: controller.signal });
          if (!result.ok) {
            // Do not parse or retain error payloads; they may echo requests.
            await result.body?.cancel();
            return { status: result.status };
          }
          let body;
          try { body = await result.json(); } catch { fail('INVALID_JSON_RESPONSE'); }
          return { status: result.status, body };
        })(),
        new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new SafeError('REQUEST_TIMEOUT')); }, timeoutMs); }),
      ]);
    } catch (error) {
      if (controller.signal.aborted) fail('REQUEST_TIMEOUT');
      if (error instanceof SafeError) throw error;
      fail('REQUEST_FAILED');
    } finally { clearTimeout(timer); }
    if (response.status >= 200 && response.status < 300) return response.body;
    if ((response.status === 429 || (response.status >= 500 && response.status <= 599)) && attempt < 2) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    fail(`HTTP_${Number.isInteger(response.status) ? response.status : 'INVALID'}`);
  }
}

export async function getAccessToken(raw, { now = new Date(), ...options } = {}) {
  const credential = parseCredential(raw);
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const iat = Math.floor(now.getTime() / 1000);
  const payload = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iss: credential.client_email, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 })}`;
  let assertion;
  try { assertion = `${payload}.${sign('RSA-SHA256', Buffer.from(payload), credential.private_key).toString('base64url')}`; }
  catch { fail('AUTH_SIGNING_FAILED'); }
  const token = await requestJson(TOKEN_URL, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }).toString(),
  }, options);
  if (!object(token) || typeof token.access_token !== 'string' || !token.access_token || /[\r\n]/.test(token.access_token) ||
      typeof token.token_type !== 'string' || token.token_type.toLowerCase() !== 'bearer' || !Number.isFinite(token.expires_in) || token.expires_in <= 0) fail('INVALID_TOKEN_RESPONSE');
  return token.access_token;
}

export function parseAnalytics(body) {
  if (!object(body) || 'error' in body || Object.keys(body).some(key => !['rows', 'responseAggregationType', 'metadata'].includes(key)) ||
      (body.responseAggregationType !== undefined && !['auto', 'byPage', 'byProperty', 'byNewsShowcasePanel'].includes(body.responseAggregationType)) ||
      (body.metadata !== undefined && !object(body.metadata)) || ('rows' in body && !Array.isArray(body.rows))) fail('INVALID_ANALYTICS_RESPONSE');
  const rows = body.rows ?? [];
  if (!rows.length) return { clicks: 0, impressions: 0, ctr: 0, position: 0, noData: true };
  const row = rows[0];
  if (rows.length !== 1 || !object(row) || METRICS.some(key => typeof row[key] !== 'number' || !Number.isFinite(row[key]) || row[key] < 0) ||
      row.ctr > 1 || row.clicks > row.impressions || (row.keys !== undefined && (!Array.isArray(row.keys) || row.keys.length))) fail('INVALID_ANALYTICS_RESPONSE');
  return { ...Object.fromEntries(METRICS.map(key => [key, row[key]])), noData: false };
}

export function parseInspection(body) {
  const result = body?.inspectionResult?.indexStatusResult;
  if (!object(body) || 'error' in body || !object(result) || typeof result.verdict !== 'string' || !result.verdict ||
      INSPECTION_FIELDS.some(key => result[key] !== undefined && typeof result[key] !== 'string') ||
      (result.lastCrawlTime && !Number.isFinite(Date.parse(result.lastCrawlTime)))) fail('INVALID_INSPECTION_RESPONSE');
  return { view: 'google-stored-index', ...Object.fromEntries(INSPECTION_FIELDS.map(key => [key, result[key] || null])) };
}

function validateSite(siteUrl, urls) {
  if (siteUrl === 'sc-domain:toolblip.com') return;
  let prefix;
  try { prefix = new URL(siteUrl); } catch { fail('Invalid GSC_SITE_URL'); }
  if (prefix.origin !== 'https://toolblip.com' || prefix.username || prefix.password || prefix.search || prefix.hash ||
      !siteUrl.endsWith('/') || !urls.every(url => url.startsWith(siteUrl))) fail('Invalid GSC_SITE_URL');
}

export async function collect({ cohort, now = new Date(), dryRun = false, env = process.env, previous, ...options }) {
  const urls = validateCohort(cohort);
  const report = {
    schemaVersion: 1, generatedAt: now.toISOString(), status: dryRun ? 'dry-run' : 'complete',
    siteUrl: dryRun ? 'sc-domain:toolblip.com' : env.GSC_SITE_URL || 'sc-domain:toolblip.com',
    cohort: { version: cohort.version, hashAlgorithm: 'sha256-json-stringify', hash: cohortHash(cohort), count: urls.length },
    dateWindow: dateWindow(now),
    inspectionMeaning: "Google's stored index view; not a live check or an indexing request.",
    results: [],
  };
  validateSite(report.siteUrl, urls);
  let token, authError;
  if (!dryRun) {
    try { token = await getAccessToken(env.GSC_SERVICE_ACCOUNT, { now, ...options }); }
    catch (error) { authError = safeError(error); report.authError = authError; }
  }
  const capture = async (url, body, parse) => {
    if (dryRun) return { data: null, error: null, skipped: 'dry-run' };
    if (authError) return { data: null, error: `AUTH: ${authError}` };
    try {
      const response = await requestJson(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) }, options);
      return { data: parse(response), error: null };
    } catch (error) { return { data: null, error: safeError(error) }; }
  };
  for (const url of urls) {
    const inspection = await capture(INSPECT_URL, { inspectionUrl: url, siteUrl: report.siteUrl, languageCode: 'en-US' }, parseInspection);
    const analytics = await capture(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(report.siteUrl)}/searchAnalytics/query`, {
      startDate: report.dateWindow.startDate, endDate: report.dateWindow.endDate, type: 'web', dataState: 'final',
      dimensionFilterGroups: [{ groupType: 'and', filters: [{ dimension: 'page', operator: 'equals', expression: url }] }],
    }, parseAnalytics);
    report.results.push({ url, inspection, analytics });
  }
  if (report.results.some(row => row.inspection.error || row.analytics.error)) report.status = 'partial-failure';
  if (previous) {
    try { report.comparison = compareReports(report, previous); }
    catch { report.comparisonError = 'INVALID_PREVIOUS_REPORT'; report.status = 'partial-failure'; }
  }
  return report;
}

function validatedWindow(window) {
  if (!object(window) || window.timeZone !== 'America/Los_Angeles' || window.type !== 'web' || window.dataState !== 'final') fail('Invalid previous report');
  for (const key of ['startDate', 'endDate']) {
    const value = window[key];
    const date = new Date(`${value}T00:00:00Z`);
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail('Invalid previous report');
  }
  if (Date.parse(window.endDate) - Date.parse(window.startDate) !== 6 * 86400000) fail('Invalid previous report');
  return { startDate: window.startDate, endDate: window.endDate, timeZone: window.timeZone, dataState: window.dataState, type: window.type };
}

export function compareReports(current, previous) {
  if (!object(previous) || previous.schemaVersion !== 1 || !['complete', 'partial-failure'].includes(previous.status) ||
      previous.cohort?.hash !== current.cohort.hash || previous.cohort?.version !== current.cohort.version || previous.siteUrl !== current.siteUrl ||
      !Number.isFinite(Date.parse(previous.generatedAt)) || Date.parse(previous.generatedAt) > Date.parse(current.generatedAt) ||
      !Array.isArray(previous.results) || previous.results.length !== current.results.length ||
      new Set(previous.results.map(row => row?.url)).size !== current.results.length ||
      !current.results.every(row => previous.results.some(old => old?.url === row.url)) ||
      !object(previous.dateWindow) || !['startDate', 'endDate'].every(key => /^\d{4}-\d{2}-\d{2}$/.test(previous.dateWindow[key])) ||
      previous.dateWindow.timeZone !== 'America/Los_Angeles' || previous.dateWindow.type !== 'web' || previous.dateWindow.dataState !== 'final') fail('Invalid previous report');
  const previousWindow = validatedWindow(previous.dateWindow);
  if (previousWindow.startDate !== dateWindow(new Date(previous.generatedAt)).startDate) fail('Invalid previous report');
  const change = (before, after, fields) => Object.fromEntries(fields.filter(key => before[key] !== after[key]).map(key => [key, { previous: before[key], current: after[key] }]));
  return current.results.map(row => {
    const old = previous.results.find(item => item.url === row.url);
    for (const entry of [old.inspection, old.analytics]) if (!object(entry) || !('data' in entry) || !('error' in entry) || (entry.error !== null && typeof entry.error !== 'string')) fail('Invalid previous report');
    const before = old.inspection.error ? null : old.inspection.data;
    const after = row.inspection.error ? null : row.inspection.data;
    if (before) parseInspection({ inspectionResult: { indexStatusResult: Object.fromEntries(INSPECTION_FIELDS.filter(key => before[key] !== null).map(key => [key, before[key]])) } });
    const rawPriorMetrics = old.analytics.error ? null : old.analytics.data;
    const priorMetrics = rawPriorMetrics ? { ...parseAnalytics({ rows: [rawPriorMetrics] }), noData: rawPriorMetrics.noData } : null;
    const nextMetrics = row.analytics.error ? null : row.analytics.data;
    if (priorMetrics && (typeof priorMetrics.noData !== 'boolean' || !object(priorMetrics))) fail('Invalid previous report');
    if (priorMetrics) parseAnalytics({ rows: [priorMetrics] });
    return {
      url: row.url,
      recrawled: before?.lastCrawlTime && after?.lastCrawlTime ? Date.parse(after.lastCrawlTime) > Date.parse(before.lastCrawlTime) : null,
      canonicalChanges: before && after ? change(before, after, ['userCanonical', 'googleCanonical']) : null,
      indexingChanges: before && after ? change(before, after, ['verdict', 'coverageState', 'indexingState', 'robotsTxtState', 'pageFetchState']) : null,
      metrics: priorMetrics && nextMetrics ? {
        previousWindow, currentWindow: current.dateWindow,
        previous: priorMetrics, current: nextMetrics,
        delta: Object.fromEntries(METRICS.map(key => [key, nextMetrics[key] - priorMetrics[key]])),
      } : null,
    };
  });
}

export function markdown(report) {
  const cell = value => String(value ?? 'unknown').replace(/[\r\n|]/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = [
    '# GSC recovery tracking', '', `Status: **${report.status}** | Generated: ${report.generatedAt}`,
    `Cohort: ${report.cohort.version} (${report.cohort.count} URLs), SHA-256: \`${report.cohort.hash}\``,
    `Analytics: ${report.dateWindow.startDate} through ${report.dateWindow.endDate}, inclusive PT; web, final.`, '',
    report.inspectionMeaning, 'No indexing guarantee. Full Search Console reports can lag. No reported data is not proof of no traffic.', '',
    '| URL | Stored verdict | Last crawl | Clicks | Impressions | CTR | Position |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const row of report.results) {
    const inspection = row.inspection.data;
    const analytics = row.analytics.data;
    const metricCells = analytics ? METRICS.map(key => `${analytics[key]}${analytics.noData ? ' (no reported data)' : ''}`) : Array(4).fill(row.analytics.error ? `ERROR: ${row.analytics.error}` : 'not collected');
    lines.push(`| ${[row.url, row.inspection.error ? `ERROR: ${row.inspection.error}` : inspection?.verdict || 'not collected', inspection?.lastCrawlTime, ...metricCells].map(cell).join(' | ')} |`);
  }
  if (report.authError) lines.push('', `Authentication: ${cell(report.authError)}`);
  if (report.comparisonError) lines.push('', `Comparison: ${report.comparisonError}`);
  if (report.comparison) {
    lines.push('', '## Comparison', '', '| URL | Recrawled | Canonical changes | Indexing changes | Click delta | Impression delta |', '| --- | --- | --- | --- | --- | --- |');
    for (const row of report.comparison) lines.push(`| ${[row.url, row.recrawled, row.canonicalChanges === null ? 'unavailable' : Object.keys(row.canonicalChanges).join(', ') || 'none', row.indexingChanges === null ? 'unavailable' : Object.keys(row.indexingChanges).join(', ') || 'none', row.metrics?.delta.clicks, row.metrics?.delta.impressions].map(cell).join(' | ')} |`);
    const dated = report.comparison.find(row => row.metrics)?.metrics;
    if (dated) lines.push('', `Previous metrics: ${dated.previousWindow.startDate}–${dated.previousWindow.endDate}; current: ${dated.currentWindow.startDate}–${dated.currentWindow.endDate} (PT). See JSON for values, CTR/position deltas and noData flags.`);
  }
  return `${lines.join('\n')}\n`;
}

export async function main(args = process.argv.slice(2), options = {}) {
  let output = 'test-results/gsc-recovery', previousPath, dryRun = false;
  try {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--dry-run') dryRun = true;
      else if (['--output', '--previous'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--')) {
        if (args[i] === '--output') output = args[++i]; else previousPath = args[++i];
      } else fail('Usage: node scripts/gsc-recovery.mjs [--dry-run] [--output DIR] [--previous REPORT.json]');
    }
    const cohort = JSON.parse(await readFile(COHORT_FILE, 'utf8'));
    let previous, previousError = false;
    if (previousPath) {
      try { previous = JSON.parse(await readFile(previousPath, 'utf8')); if (!object(previous)) previousError = true; }
      catch { previousError = true; }
    }
    const report = await collect({ ...options, cohort, dryRun, previous });
    if (previousError) { report.comparisonError = 'INVALID_PREVIOUS_REPORT'; report.status = 'partial-failure'; }
    await mkdir(resolve(output), { recursive: true });
    await writeFile(join(resolve(output), 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(join(resolve(output), 'report.md'), markdown(report));
    console.log(`GSC recovery: ${report.status}. JSON and Markdown reports written.`);
    if (report.authError) console.error(`GSC recovery: ${report.authError}`);
    return report.status === 'partial-failure' ? 1 : 0;
  } catch (error) {
    console.error(`GSC recovery: ${safeError(error)}`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = await main();
