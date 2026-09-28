import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dateWindow, validateCohort, parseCredential, getAccessToken, requestJson, parseAnalytics, parseInspection, collect, compareReports, markdown } from './gsc-recovery.mjs';

const cohort = JSON.parse(await readFile(new URL('../data/gsc-recovery-cohort.json', import.meta.url)));
const now = new Date('2026-09-26T12:00:00Z');
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const credential = { type: 'service_account', client_email: 'fixture@example.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }), token_uri: 'https://evil.invalid' };
const env = { GSC_SERVICE_ACCOUNT: JSON.stringify(credential) };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status });
const inspection = { inspectionResult: { indexStatusResult: { verdict: 'PASS', coverageState: 'Submitted and indexed', lastCrawlTime: '2026-09-20T00:00:00Z', googleCanonical: cohort.urls[0] } } };
const metrics = { rows: [{ clicks: 2, impressions: 20, ctr: 0.1, position: 4 }] };

test('fixed cohort rejects duplicate, nonabsolute, foreign and malformed URLs', () => {
  assert.equal(validateCohort(cohort).length, 12);
  for (const value of [cohort.urls[1], '/tools/foo', 'https://evil.invalid/foo', 'https://toolblip.com/tools/foo#fragment']) {
    assert.throws(() => validateCohort({ ...cohort, urls: [value, ...cohort.urls.slice(1)] }));
  }
});

test('Pacific calendar window stays seven completed days across DST and UTC boundaries', () => {
  for (const [instant, startDate, endDate] of [
    ['2026-03-10T06:30:00Z', '2026-02-28', '2026-03-06'],
    ['2026-11-03T07:30:00Z', '2026-10-24', '2026-10-30'],
    ['2026-01-01T08:30:00Z', '2025-12-23', '2025-12-29'],
  ]) assert.deepEqual(dateWindow(new Date(instant)), { startDate, endDate, timeZone: 'America/Los_Angeles', dataState: 'final', type: 'web' });
});

test('credential parsing accepts JSON/base64 and nested strings; sanitizes invalid input', () => {
  for (const input of [JSON.stringify(credential), JSON.stringify(JSON.stringify(credential)), Buffer.from(JSON.stringify(credential)).toString('base64'), Buffer.from(JSON.stringify(JSON.stringify(credential))).toString('base64')]) {
    assert.equal(parseCredential(input).client_email, credential.client_email);
  }
  assert.throws(() => parseCredential('private-secret-bad-json'), { message: 'Invalid GSC_SERVICE_ACCOUNT' });
  assert.throws(() => parseCredential(), { message: 'Missing GSC_SERVICE_ACCOUNT' });
});

test('OAuth uses a verified RS256 assertion, fixed audience/endpoint and read-only scope', async () => {
  const token = await getAccessToken(env.GSC_SERVICE_ACCOUNT, { now, transport: async (url, init) => {
    assert.equal(url, 'https://oauth2.googleapis.com/token');
    assert.equal(init.redirect, 'error');
    const jwt = new URLSearchParams(init.body).get('assertion');
    const [header, payload, signature] = jwt.split('.');
    assert.equal(JSON.parse(Buffer.from(header, 'base64url')).alg, 'RS256');
    const claims = JSON.parse(Buffer.from(payload, 'base64url'));
    assert.equal(claims.aud, url);
    assert.equal(claims.scope, 'https://www.googleapis.com/auth/webmasters.readonly');
    assert.equal(claims.exp - claims.iat, 3600);
    assert.ok(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature, 'base64url')));
    return reply({ access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 });
  } });
  assert.equal(token, 'fixture-token');
});

test('analytics distinguishes valid empty results from malformed/error responses', () => {
  for (const body of [{}, { rows: [] }, { responseAggregationType: 'byPage' }]) assert.deepEqual(parseAnalytics(body), { clicks: 0, impressions: 0, ctr: 0, position: 0, noData: true });
  assert.equal(parseAnalytics(metrics).noData, false);
  for (const body of [null, [], { error: 'secret' }, { rows: null }, { rows: [{}] }, { rows: [{ ...metrics.rows[0], clicks: '2' }] }, { rows: [{ ...metrics.rows[0], ctr: 2 }] }, { rows: [metrics.rows[0], metrics.rows[0]] }]) assert.throws(() => parseAnalytics(body));
});

test('inspection is explicitly a stored view and validates selected fields', () => {
  assert.equal(parseInspection(inspection).view, 'google-stored-index');
  assert.equal(parseInspection(inspection).indexingState, null);
  for (const body of [{}, { inspectionResult: { indexStatusResult: {} } }, { inspectionResult: { indexStatusResult: { verdict: 42 } } }]) assert.throws(() => parseInspection(body));
});

test('bounded retry handles 429/5xx, rejects 403, and never returns raw errors', async () => {
  let calls = 0;
  const delays = [];
  assert.deepEqual(await requestJson('https://example.invalid', {}, { transport: async () => reply(calls++ < 2 ? { error: 'secret' } : {}, calls <= 2 ? 429 : 200), sleep: async ms => delays.push(ms) }), {});
  assert.deepEqual(delays, [1000, 2000]);
  await assert.rejects(requestJson('https://example.invalid', {}, { transport: async () => reply({ error: 'private-key' }, 403) }), { message: 'HTTP_403' });
  calls = 0;
  await assert.rejects(requestJson('https://example.invalid', {}, { transport: async () => { calls++; return reply({}, 503); }, sleep: async () => {} }), { message: 'HTTP_503' });
  assert.equal(calls, 3);
  await assert.rejects(requestJson('https://example.invalid', {}, { transport: async () => { throw new Error('Authorization: secret'); } }), { message: 'REQUEST_FAILED' });
  await assert.rejects(requestJson('https://example.invalid', {}, { timeoutMs: 5, transport: () => new Promise(() => {}) }), { message: 'REQUEST_TIMEOUT' });
});

test('dry run has no auth or network; normal run has exact filters and separate partial errors', async () => {
  const dry = await collect({ cohort, now, dryRun: true, env: new Proxy({}, { get() { throw Error('env accessed'); } }), transport: () => { throw Error('network'); } });
  assert.equal(dry.status, 'dry-run');
  assert.equal(dry.results.length, 12);
  let inspections = 0, analytics = 0;
  const report = await collect({ cohort, now, env, transport: async (url, init) => {
    if (url.includes('oauth2')) return reply({ access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 });
    const body = JSON.parse(init.body);
    if (url.includes('urlInspection')) {
      inspections++;
      assert.equal(body.languageCode, 'en-US');
      return inspections === 1 ? reply({ error: 'request-with-private-key' }, 403) : reply(inspection);
    }
    analytics++;
    assert.ok(url.includes('sc-domain%3Atoolblip.com'));
    assert.equal(body.type, 'web');
    assert.equal(body.dataState, 'final');
    assert.equal(body.dimensions, undefined);
    assert.equal(body.rowCount, undefined);
    assert.deepEqual(body.dimensionFilterGroups, [{ groupType: 'and', filters: [{ dimension: 'page', operator: 'equals', expression: cohort.urls[analytics - 1] }] }]);
    return analytics === 2 ? reply({ rows: [{}] }) : reply({});
  } });
  assert.equal(inspections, 12);
  assert.equal(analytics, 12);
  assert.equal(report.status, 'partial-failure');
  assert.equal(report.results[0].inspection.error, 'HTTP_403');
  assert.equal(report.results[0].analytics.data.noData, true);
  assert.equal(report.results[1].analytics.data, null);
  assert.ok(!JSON.stringify(report).includes('private-key'));
  assert.match(markdown(report), /stored/i);
  assert.match(markdown(report), /ERROR/);
});

test('auth failures yield reports without raw credentials or tokens', async () => {
  const report = await collect({ cohort, now, env, transport: async () => { throw Error(env.GSC_SERVICE_ACCOUNT); } });
  assert.equal(report.status, 'partial-failure');
  assert.equal(report.results[0].analytics.data, null);
  assert.ok(!JSON.stringify(report).includes('PRIVATE KEY'));
  assert.ok(!JSON.stringify(report).includes(credential.client_email));
});

test('comparisons report newer crawl, canonical/indexing changes and dated metrics; reject mismatched cohort', async () => {
  const report = await collect({ cohort, now, env, transport: async url => reply(url.includes('oauth2') ? { access_token: 't', token_type: 'Bearer', expires_in: 3600 } : url.includes('urlInspection') ? inspection : metrics) });
  const previous = structuredClone(report);
  previous.generatedAt = '2026-09-19T12:00:00Z';
  previous.dateWindow = dateWindow(new Date(previous.generatedAt));
  previous.results[0].inspection.data.lastCrawlTime = '2026-09-01T00:00:00Z';
  previous.results[0].inspection.data.googleCanonical = 'https://toolblip.com/tools/old';
  previous.results[0].inspection.data.verdict = 'FAIL';
  previous.results[0].analytics.data.clicks = 1;
  const diff = compareReports(report, previous)[0];
  assert.equal(diff.recrawled, true);
  assert.ok(diff.canonicalChanges.googleCanonical);
  assert.ok(diff.indexingChanges.verdict);
  assert.equal(diff.metrics.delta.clicks, 1);
  assert.deepEqual(diff.metrics.previousWindow, previous.dateWindow);
  previous.results[0].analytics = { data: null, error: 'HTTP_403' };
  assert.equal(compareReports(report, previous)[0].metrics, null);
  previous.cohort.hash = 'different';
  assert.throws(() => compareReports(report, previous));
});

test('CLI writes partial JSON/Markdown and exits nonzero for missing auth and invalid previous input', async () => {
  const { main } = await import('./gsc-recovery.mjs');
  const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = await mkdtemp(join(tmpdir(), 'gsc-recovery-test-'));
  try {
    const transport = () => { throw Error('Network must not run'); };
    assert.equal(await main(['--output', dir], { env: {}, now, transport }), 1);
    const failed = JSON.parse(await readFile(join(dir, 'report.json'), 'utf8'));
    assert.equal(failed.authError, 'Missing GSC_SERVICE_ACCOUNT');
    assert.equal(failed.results.length, 12);
    assert.equal(failed.results[0].analytics.data, null);
    assert.match(await readFile(join(dir, 'report.md'), 'utf8'), /Missing GSC_SERVICE_ACCOUNT/);
    assert.equal(await main(['--dry-run', '--output', dir], { env: {}, now, transport }), 0);
    await writeFile(join(dir, 'previous.json'), 'not-json-private-secret');
    assert.equal(await main(['--dry-run', '--output', dir, '--previous', join(dir, 'previous.json')], { env: {}, now, transport }), 1);
    const invalid = await readFile(join(dir, 'report.json'), 'utf8');
    assert.match(invalid, /INVALID_PREVIOUS_REPORT/);
    assert.ok(!invalid.includes('private-secret'));
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('empty analytics rows keep Markdown table contiguous', async () => {
  const report = await collect({ cohort, now, env, transport: async url => reply(url.includes('oauth2') ? { access_token: 't', token_type: 'Bearer', expires_in: 3600 } : url.includes('urlInspection') ? inspection : {}) });
  const lines = markdown(report).split('\n');
  const header = lines.findIndex(line => line.startsWith('| URL |'));
  assert.ok(lines.slice(header + 2, header + 14).every(line => line.startsWith('| https://toolblip.com/')));
  assert.match(markdown(report), /no reported data/i);
});

test('comparison rejects invalid windows and strips unrecognized prior response fields', async () => {
  const current = await collect({ cohort, now, env, transport: async url => reply(url.includes('oauth2') ? { access_token: 't', token_type: 'Bearer', expires_in: 3600 } : url.includes('urlInspection') ? inspection : metrics) });
  for (const patch of [{ startDate: '2026-99-99' }, { endDate: '2026-09-01' }, { timeZone: 'UTC' }]) {
    const previous = structuredClone(current);
    Object.assign(previous.dateWindow, patch);
    assert.throws(() => compareReports(current, previous));
  }
  const previous = structuredClone(current);
  previous.results[0].analytics.data.request = 'private-secret';
  previous.dateWindow.extra = 'private-secret';
  assert.ok(!JSON.stringify(compareReports(current, previous)).includes('private-secret'));
});

test('frozen cohort rejects valid same-origin membership changes within this version', () => {
  const changed = structuredClone(cohort);
  changed.urls[0] = 'https://toolblip.com/tools/unapproved';
  assert.throws(() => validateCohort(changed));
});
