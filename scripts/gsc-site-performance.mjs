#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { dateWindow, getAccessToken, requestJson } from './gsc-recovery.mjs';

const DEFAULT_SITE = 'sc-domain:toolblip.com';
const ROW_LIMIT = 25000;
const TYPE_ORDER = ['home', 'tool', 'blog', 'directory', 'other'];
const DISCLAIMER = 'Search Analytics page rows are sorted by clicks and capped at 25,000. They are not a complete indexing inventory; omitted rows do not prove no indexing.';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const invalid = () => { throw new Error('INVALID_ANALYTICS_RESPONSE'); };
const safeError = error => {
  const message = error?.message;
  return ['Missing GSC_SERVICE_ACCOUNT', 'Invalid GSC_SERVICE_ACCOUNT', 'INVALID_TOKEN_RESPONSE',
    'AUTH_SIGNING_FAILED', 'INVALID_JSON_RESPONSE', 'REQUEST_TIMEOUT', 'REQUEST_FAILED',
    'INVALID_ANALYTICS_RESPONSE', 'Invalid GSC_SITE_URL'].includes(message) || /^HTTP_(?:[1-5]\d\d|INVALID)$/.test(message)
    ? message : 'OPERATION_FAILED';
};

export function siteDateWindow(now = new Date()) {
  const prior = dateWindow(now);
  const startDate = new Date(Date.parse(`${prior.endDate}T00:00:00Z`) - 27 * 86400000).toISOString().slice(0, 10);
  return { startDate, endDate: prior.endDate, timeZone: prior.timeZone, type: prior.type, dataState: prior.dataState };
}

function siteProperty(value) {
  if (value === DEFAULT_SITE || value === 'https://toolblip.com/') return value;
  throw new Error('Invalid GSC_SITE_URL');
}

function pageType(url) {
  const path = new URL(url).pathname;
  if (path === '/') return 'home';
  if (path.startsWith('/tools/')) return 'tool';
  if (path.startsWith('/blog/')) return 'blog';
  if (path === '/directory' || path === '/all-tools') return 'directory';
  return 'other';
}

export function parsePageRows(body) {
  if (!object(body) || 'error' in body ||
      Object.keys(body).some(key => !['rows', 'responseAggregationType', 'metadata'].includes(key)) ||
      (body.responseAggregationType !== undefined && body.responseAggregationType !== 'byPage') ||
      (body.metadata !== undefined && !object(body.metadata)) ||
      ('rows' in body && !Array.isArray(body.rows))) invalid();
  const source = body.rows ?? [];
  if (source.length > ROW_LIMIT) invalid();
  const seen = new Set();
  return source.map(row => {
    if (!object(row) || !Array.isArray(row.keys) || row.keys.length !== 1 || typeof row.keys[0] !== 'string') invalid();
    const url = row.keys[0];
    let parsed;
    try { parsed = new URL(url); } catch { invalid(); }
    if (parsed.origin !== 'https://toolblip.com' || parsed.href !== url || parsed.username || parsed.password || parsed.hash || seen.has(url)) invalid();
    seen.add(url);
    if (!Number.isSafeInteger(row.clicks) || row.clicks < 0 || !Number.isSafeInteger(row.impressions) || row.impressions < 0 ||
        row.clicks > row.impressions || typeof row.ctr !== 'number' || !Number.isFinite(row.ctr) || row.ctr < 0 || row.ctr > 1 ||
        typeof row.position !== 'number' || !Number.isFinite(row.position) || row.position < 0) invalid();
    return { url, type: pageType(url), clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position };
  });
}

function metrics(pages) {
  const clicks = pages.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = pages.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = pages.reduce((sum, row) => sum + row.position * row.impressions, 0);
  if (!Number.isSafeInteger(clicks) || !Number.isSafeInteger(impressions) || !Number.isFinite(weightedPosition)) invalid();
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? weightedPosition / impressions : 0 };
}

export async function collectSitePerformance({ now = new Date(), env = process.env, ...options } = {}) {
  const report = {
    schemaVersion: 1, generatedAt: now.toISOString(), status: 'failed',
    siteUrl: null, dateWindow: siteDateWindow(now),
    query: { dimensions: ['page'], aggregationType: 'byPage', rowLimit: ROW_LIMIT },
    interpretation: DISCLAIMER, observedPages: null, rowLimitReached: false,
    totals: null, byType: [], pages: [],
  };
  try {
    report.siteUrl = siteProperty(env.GSC_SITE_URL || DEFAULT_SITE);
    const token = await getAccessToken(env.GSC_SERVICE_ACCOUNT, { now, ...options });
    const body = await requestJson(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(report.siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate: report.dateWindow.startDate, endDate: report.dateWindow.endDate,
        dimensions: ['page'], type: 'web', dataState: 'final', aggregationType: 'byPage', rowLimit: ROW_LIMIT }),
    }, options);
    report.pages = parsePageRows(body);
    report.observedPages = report.pages.length;
    report.rowLimitReached = report.observedPages === ROW_LIMIT;
    report.totals = metrics(report.pages);
    report.byType = TYPE_ORDER.flatMap(type => {
      const pages = report.pages.filter(row => row.type === type);
      return pages.length ? [{ type, pages: pages.length, ...metrics(pages) }] : [];
    });
    report.status = 'complete';
  } catch (error) {
    report.status = 'failed';
    report.error = safeError(error);
    report.observedPages = null;
    report.rowLimitReached = false;
    report.totals = null;
    report.byType = [];
    report.pages = [];
  }
  return report;
}

export function markdown(report) {
  const cell = value => String(value ?? '').replace(/[\r\n|]/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = [
    '# GSC sitewide performance', '',
    `Status: **${report.status}** | Generated: ${report.generatedAt}`,
    `Window: ${report.dateWindow.startDate} through ${report.dateWindow.endDate}, inclusive PT; web, final.`,
    `Observed pages: ${report.status === 'complete' ? report.observedPages : 'unavailable'}${report.rowLimitReached ? ' (row limit reached)' : ''}.`, '',
    report.interpretation, '',
  ];
  if (report.error) lines.push(`Collection error: ${cell(report.error)}`, '');
  if (report.status !== 'complete') return `${lines.join('\n')}\n`;
  if (!report.observedPages) lines.push('No page rows returned.', '');
  lines.push('| Page type | Observed pages | Clicks | Impressions | CTR | Avg. position |',
    '| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const group of report.byType) lines.push(`| ${[group.type, group.pages, group.clicks, group.impressions, group.ctr, group.position].map(cell).join(' | ')} |`);
  lines.push(`| **Total observed** | ${[report.observedPages, report.totals.clicks, report.totals.impressions, report.totals.ctr, report.totals.position].map(cell).join(' | ')} |`);
  if (report.pages.length) {
    lines.push('', '## Top observed pages', '',
      'The JSON artifact contains every returned page row. This table shows the first 50 rows in click order.', '',
      '| Page | Type | Clicks | Impressions | CTR | Avg. position |',
      '| --- | --- | ---: | ---: | ---: | ---: |');
    for (const row of report.pages.slice(0, 50)) lines.push(`| ${[row.url, row.type, row.clicks, row.impressions, row.ctr, row.position].map(cell).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export async function main(args = process.argv.slice(2), options = {}) {
  let output = 'test-results/gsc-site-performance';
  try {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--output' && args[i + 1] && !args[i + 1].startsWith('--')) output = args[++i];
      else throw new Error('INVALID_ARGUMENTS');
    }
    const report = await collectSitePerformance(options);
    await mkdir(resolve(output), { recursive: true });
    await writeFile(join(resolve(output), 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(join(resolve(output), 'report.md'), markdown(report));
    console.log(`GSC sitewide performance: ${report.status}. JSON and Markdown reports written.`);
    if (report.error) console.error(`GSC sitewide performance: ${report.error}`);
    return report.status === 'complete' ? 0 : 1;
  } catch (error) {
    console.error(`GSC sitewide performance: ${safeError(error)}`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = await main();
