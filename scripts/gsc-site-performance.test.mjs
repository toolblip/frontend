import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { siteDateWindow, parsePageRows, collectSitePerformance, markdown, main } from './gsc-site-performance.mjs';

const now = new Date('2026-09-28T06:30:00Z'); // Still September 27 in PT.
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const credential = JSON.stringify({
  type: 'service_account', client_email: 'fixture@example.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
});
const env = { GSC_SERVICE_ACCOUNT: credential };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status });
const page = (url, clicks, impressions, position) => ({ keys: [url], clicks, impressions, ctr: impressions ? clicks / impressions : 0, position });
const rows = [
  page('https://toolblip.com/tools/json-formatter', 6, 60, 3),
  page('https://toolblip.com/blog/example', 3, 30, 7),
  page('https://toolblip.com/tools/base64', 1, 10, 9),
  page('https://toolblip.com/', 0, 5, 12),
];

test('28 finalized PT days end three days before PT today across UTC and DST boundaries', () => {
  assert.deepEqual(siteDateWindow(now), {
    startDate: '2026-08-28', endDate: '2026-09-24',
    timeZone: 'America/Los_Angeles', type: 'web', dataState: 'final',
  });
  assert.deepEqual(siteDateWindow(new Date('2026-03-10T06:30:00Z')), {
    startDate: '2026-02-07', endDate: '2026-03-06',
    timeZone: 'America/Los_Angeles', type: 'web', dataState: 'final',
  });
});

test('one read-only page query uses the exact sitewide Search Analytics request', async () => {
  let calls = 0;
  const report = await collectSitePerformance({ now, env, transport: async (url, init) => {
    calls++;
    if (calls === 1) {
      assert.equal(url, 'https://oauth2.googleapis.com/token');
      return reply({ access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 });
    }
    assert.equal(url, 'https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Atoolblip.com/searchAnalytics/query');
    assert.equal(init.method, 'POST');
    assert.equal(init.redirect, 'error');
    assert.equal(init.headers.authorization, 'Bearer fixture-token');
    assert.deepEqual(JSON.parse(init.body), {
      startDate: '2026-08-28', endDate: '2026-09-24',
      dimensions: ['page'], type: 'web', dataState: 'final',
      aggregationType: 'byPage', rowLimit: 25000,
    });
    return reply({ rows, responseAggregationType: 'byPage' });
  } });
  assert.equal(calls, 2);
  assert.equal(report.status, 'complete');
  assert.equal(report.observedPages, 4);
  assert.deepEqual(report.totals, { clicks: 10, impressions: 105, ctr: 10 / 105, position: 540 / 105 });
  assert.deepEqual(report.byType.map(group => [group.type, group.pages, group.clicks, group.impressions]), [
    ['home', 1, 0, 5], ['tool', 2, 7, 70], ['blog', 1, 3, 30],
  ]);
  assert.match(markdown(report), /omitted rows do not prove no indexing/i);
  assert.match(markdown(report), /sorted by clicks/i);
});

test('valid no-row response reports zero observed pages without treating it as an indexing inventory', async () => {
  assert.deepEqual(parsePageRows({}), []);
  assert.deepEqual(parsePageRows({ rows: [] }), []);
  const report = await collectSitePerformance({ now, env, transport: async url => reply(url.includes('oauth2')
    ? { access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 } : {}) });
  assert.equal(report.status, 'complete');
  assert.equal(report.observedPages, 0);
  assert.deepEqual(report.byType, []);
  assert.match(markdown(report), /No page rows returned/);
  assert.match(markdown(report), /omitted rows do not prove no indexing/i);
});

test('domain property accepts canonical HTTP, apex, www, and subdomain URLs with original types', () => {
  assert.deepEqual(parsePageRows({ rows: [
    page('http://toolblip.com/', 1, 10, 2),
    page('https://www.toolblip.com/tools/json-formatter', 2, 20, 3),
    page('http://docs.toolblip.com/blog/guide?source=gsc', 3, 30, 4),
  ] }), [
    { url: 'http://toolblip.com/', type: 'home', clicks: 1, impressions: 10, ctr: 0.1, position: 2 },
    { url: 'https://www.toolblip.com/tools/json-formatter', type: 'tool', clicks: 2, impressions: 20, ctr: 0.1, position: 3 },
    { url: 'http://docs.toolblip.com/blog/guide?source=gsc', type: 'blog', clicks: 3, impressions: 30, ctr: 0.1, position: 4 },
  ]);
});

test('URL-prefix property accepts only canonical URLs under its HTTPS prefix', () => {
  assert.deepEqual(parsePageRows({ rows: [rows[0]] }, 'https://toolblip.com/'), [
    { url: rows[0].keys[0], type: 'tool', clicks: 6, impressions: 60, ctr: 0.1, position: 3 },
  ]);
  for (const url of ['http://toolblip.com/tools/x', 'https://www.toolblip.com/tools/x', 'https://docs.toolblip.com/tools/x']) {
    assert.throws(() => parsePageRows({ rows: [page(url, 1, 10, 2)] }, 'https://toolblip.com/'), { message: 'INVALID_ANALYTICS_RESPONSE' });
  }
});

test('collection enforces the selected URL-prefix property', async () => {
  const report = await collectSitePerformance({ now, env: { ...env, GSC_SITE_URL: 'https://toolblip.com/' },
    transport: async url => reply(url.includes('oauth2')
      ? { access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 }
      : { rows: [page('http://toolblip.com/tools/x', 1, 10, 2)] }) });
  assert.equal(report.status, 'failed');
  assert.equal(report.error, 'INVALID_ANALYTICS_RESPONSE');
});

test('malformed, duplicate, and off-domain rows are rejected without carrying upstream fields into reports', () => {
  const invalid = [
    null, { error: { message: 'upstream-private-body' } }, { rows: null },
    { rows: [page('https://evil.invalid/tools/x', 1, 10, 2)] },
    { rows: [page('https://toolblip.com.evil.invalid/x', 1, 10, 2)] },
    { rows: [page('https://eviltoolblip.com/tools/x', 1, 10, 2)] },
    { rows: [page('http://toolblip.com.evil.invalid/tools/x', 1, 10, 2)] },
    { rows: [page('https://foo..toolblip.com/tools/x', 1, 10, 2)] },
    { rows: [page('https://user:pass@toolblip.com/tools/x', 1, 10, 2)] },
    { rows: [page('https://toolblip.com/tools/x#fragment', 1, 10, 2)] },
    { rows: [page('not-a-url', 1, 10, 2)] },
    { rows: [page('https://TOOLBLIP.com/tools/x', 1, 10, 2)] },
    { rows: [page('https://toolblip.com:443/tools/x', 1, 10, 2)] },
    { rows: [{ ...rows[0], keys: [] }] },
    { rows: [{ ...rows[0], keys: [rows[0].keys[0], 'extra'] }] },
    { rows: [{ ...rows[0], clicks: '6' }] },
    { rows: [{ ...rows[0], ctr: 2 }] },
    { rows: [{ ...rows[0], clicks: 61 }] },
    { rows: [rows[0], rows[0]] },
  ];
  for (const body of invalid) assert.throws(() => parsePageRows(body), { message: 'INVALID_ANALYTICS_RESPONSE' });
  assert.deepEqual(parsePageRows({ rows: [{ ...rows[0], secret: 'upstream-private-body' }] }), [{
    url: rows[0].keys[0], type: 'tool', clicks: 6, impressions: 60, ctr: 0.1, position: 3,
  }]);
});

test('authentication, HTTP and malformed responses produce safe report errors', async () => {
  const badAuth = await collectSitePerformance({ now, env: { GSC_SERVICE_ACCOUNT: 'private-secret' }, transport: () => { throw Error('network called'); } });
  assert.equal(badAuth.status, 'failed');
  assert.equal(badAuth.error, 'Invalid GSC_SERVICE_ACCOUNT');
  assert.equal(badAuth.observedPages, null);
  assert.ok(!JSON.stringify(badAuth).includes('private-secret'));
  assert.doesNotMatch(markdown(badAuth), /No page rows returned/);

  for (const response of [reply({ message: 'upstream-private-body' }, 403), reply({ rows: [page('https://evil.invalid/x', 1, 10, 2)] })]) {
    const report = await collectSitePerformance({ now, env, transport: async url => url.includes('oauth2')
      ? reply({ access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 }) : response });
    assert.equal(report.status, 'failed');
    assert.ok(['HTTP_403', 'INVALID_ANALYTICS_RESPONSE'].includes(report.error));
    assert.ok(!JSON.stringify(report).includes('upstream-private-body'));
    assert.ok(!JSON.stringify(report).includes('evil.invalid'));
    assert.ok(!markdown(report).includes('fixture-token'));
  }
});

test('CLI writes separate JSON and Markdown reports and returns nonzero for safe failure', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gsc-site-performance-test-'));
  try {
    assert.equal(await main(['--output', dir], { now, env: {}, transport: () => { throw Error('network called'); } }), 1);
    const failed = JSON.parse(await readFile(join(dir, 'report.json'), 'utf8'));
    assert.equal(failed.error, 'Missing GSC_SERVICE_ACCOUNT');
    assert.match(await readFile(join(dir, 'report.md'), 'utf8'), /Missing GSC_SERVICE_ACCOUNT/);
    assert.equal(await main(['--output', dir], { now, env, transport: async url => reply(url.includes('oauth2')
      ? { access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 } : { rows }) }), 0);
    const passed = JSON.parse(await readFile(join(dir, 'report.json'), 'utf8'));
    assert.equal(passed.observedPages, 4);
    assert.match(await readFile(join(dir, 'report.md'), 'utf8'), /\| tool \| 2 \| 7 \| 70 \|/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
