import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseSitemap, groupResults, collect, main } from './gsc-sitemap-inspection.mjs';

const urls = ['https://toolblip.com/tools/alpha', 'https://toolblip.com/tools/beta', 'https://toolblip.com/tools/gamma'];
const xml = entries => `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(url => `<url><loc>${url}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('')}</urlset>`;
const response = (body, status = 200) => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
const stored = (verdict, coverageState) => ({ inspectionResult: { indexStatusResult: { verdict, coverageState, indexingState: 'INDEXING_ALLOWED', googleCanonical: urls[0] } } });
const token = { access_token: 'fixture-token', token_type: 'Bearer', expires_in: 3600 };

test('sitemap validation accepts generated XML and rejects unsafe or duplicate URLs and markup', () => {
  assert.deepEqual(parseSitemap(xml(urls)), urls);
  assert.deepEqual(parseSitemap(xml(['https://toolblip.com/tools/images/resize-image'])), ['https://toolblip.com/tools/images/resize-image']);
  for (const bad of [[], [urls[0], urls[0]], ['http://toolblip.com/tools/a'], ['https://evil.test/tools/a'], ['https://toolblip.com/tools/a?x=1'], ['https://toolblip.com/tools/a#x'], ['https://toolblip.com/tools/%61'], ['https://toolblip.com/tools/a/'], ['https://toolblip.com/other/a']]) assert.throws(() => parseSitemap(xml(bad)));
  for (const bad of ['<!DOCTYPE urlset [<!ENTITY x "secret">]>', '<urlset><url><loc>https://toolblip.com/tools/a</loc></url><script/></urlset>', '<urlset><url><loc>https://toolblip.com/tools/a&amp;evil;</loc></url></urlset>', '<urlset><url><loc>https://toolblip.com/tools/a</loc></url></urlset><extra/>']) assert.throws(() => parseSitemap(bad));
  assert.throws(() => parseSitemap(xml(Array(501).fill(urls[0]))));
});

test('authentication failure and bounded ordinary failures leave remaining URLs skipped', async () => {
  let requests = 0;
  const many = Array.from({ length: 25 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
  const transport = async url => {
    if (url.includes('sitemap-tools')) return response(xml(many));
    requests++;
    return response({ error: 'upstream-private-body' }, 400);
  };
  const auth = await collect({ getToken: async () => { throw Error('credential-secret'); }, transport });
  assert.equal(requests, 0);
  assert.equal(auth.counts.skipped, 25);
  assert.ok(!JSON.stringify(auth).includes('credential-secret'));
  const report = await collect({ getToken: async () => 'fixture-token', transport, sleep: async () => {} });
  assert.ok(requests >= 20 && requests <= 23);
  assert.equal(report.stopReason, 'ERROR_LIMIT');
  assert.equal(report.counts.errors, requests);
  assert.equal(report.counts.skipped, 25 - requests);
  assert.ok(!JSON.stringify(report).includes('upstream-private-body'));
});

test('grouping counts stored verdict and coverage independently', () => {
  assert.deepEqual(groupResults([{ inspection: { data: { verdict: 'PASS', coverageState: 'Indexed' } } }, { inspection: { data: { verdict: 'PASS', coverageState: 'Other' } } }, { inspection: { data: null, error: 'HTTP_500' } }]), { verdict: { PASS: 2 }, coverageState: { Indexed: 1, Other: 1 }, inspected: 2, errors: 1, skipped: 0 });
});

test('collection paces inspection starts, records partial failures, and never exposes upstream bodies', async () => {
  let inspections = 0;
  const sleeps = [];
  const report = await collect({ env: { GSC_SERVICE_ACCOUNT: '{}' }, getToken: async () => 'fixture-token', sleep: async ms => sleeps.push(ms), transport: async (url, init) => {
    if (url.includes('sitemap-tools')) { assert.equal(init.redirect, 'error'); return response(xml(urls)); }
    inspections++;
    assert.equal(JSON.parse(init.body).inspectionUrl, urls[inspections - 1]);
    return inspections === 2 ? response({ error: 'secret-body' }, 400) : response(stored('PASS', 'Indexed'));
  } });
  assert.equal(report.status, 'partial-failure');
  assert.equal(inspections, 3);
  assert.deepEqual(sleeps, [200, 200]);
  assert.equal(report.results[1].inspection.error, 'HTTP_400');
  assert.equal(report.counts.verdict.PASS, 2);
  assert.ok(!JSON.stringify(report).includes('secret-body'));
});

test('collection keeps at most four inspections in flight and reports sitemap order', async () => {
  const many = Array.from({ length: 6 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
  const releases = [];
  let active = 0;
  let peak = 0;
  let started = 0;
  const collecting = collect({ getToken: async () => 'fixture-token', sleep: async () => {}, transport: async (url, init) => {
    if (url.includes('sitemap-tools')) return response(xml(many));
    const index = many.indexOf(JSON.parse(init.body).inspectionUrl);
    started++;
    active++;
    peak = Math.max(peak, active);
    await new Promise(resolve => { releases[index] = resolve; });
    active--;
    return response(stored(`PASS_${index}`, 'Indexed'));
  } });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(started, 4);
  assert.equal(peak, 4);
  releases[3]();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(started, 5);
  releases[4]();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(started, 6);
  releases[5]();
  releases[2]();
  releases[1]();
  releases[0]();
  const report = await collecting;
  assert.ok(peak <= 4);
  assert.deepEqual(report.results.map(row => row.url), many);
  assert.deepEqual(report.results.map(row => row.inspection.data.verdict), many.map((_, i) => `PASS_${i}`));
});

test('inspection starts are globally spaced by at least 200 ms', async () => {
  const many = Array.from({ length: 7 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
  let time = 0;
  const starts = [];
  await collect({ getToken: async () => 'fixture-token', sleep: async ms => { time += ms; }, transport: async url => {
    if (url.includes('sitemap-tools')) return response(xml(many));
    starts.push(time);
    return response(stored('PASS', 'Indexed'));
  } });
  assert.equal(starts.length, many.length);
  assert.ok(starts.every((start, index) => index === 0 || start - starts[index - 1] >= 200));
});

test('quota stop leaves in-flight inspections to settle and skips unstarted URLs', async () => {
  const many = Array.from({ length: 8 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
  const releases = [];
  let started = 0;
  const collecting = collect({ getToken: async () => 'fixture-token', sleep: async () => {}, transport: async url => {
    if (url.includes('sitemap-tools')) return response(xml(many));
    const index = started++;
    await new Promise(resolve => { releases[index] = resolve; });
    return response(index === 0 ? { error: 'private' } : stored('PASS', 'Indexed'), index === 0 ? 403 : 200);
  } });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(started, 4);
  releases[0]();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(started, 4);
  releases[1](); releases[2](); releases[3]();
  const report = await collecting;
  assert.equal(report.stopReason, 'HTTP_403');
  assert.equal(report.counts.inspected, 3);
  assert.equal(report.counts.errors, 1);
  assert.equal(report.counts.skipped, 4);
  assert.deepEqual(report.results.map(row => row.url), many);
});

test('progress callback reports counts at 25 completions and at the end', async () => {
  const many = Array.from({ length: 26 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
  const updates = [];
  await collect({ getToken: async () => 'fixture-token', sleep: async () => {}, onProgress: update => updates.push(update), transport: async url => response(url.includes('sitemap-tools') ? xml(many) : stored('PASS', 'Indexed')) });
  assert.deepEqual(updates, [
    { completed: 25, total: 26, inspected: 25, errors: 0, skipped: 0 },
    { completed: 26, total: 26, inspected: 26, errors: 0, skipped: 0 },
  ]);
  assert.ok(!JSON.stringify(updates).includes('toolblip.com'));
});

test('quota and auth errors stop subsequent inspection requests', async () => {
  for (const status of [401, 403, 429]) {
    let calls = 0;
    const report = await collect({ getToken: async () => 'fixture-token', sleep: async () => {}, transport: async url => url.includes('sitemap-tools') ? response(xml(urls)) : (calls++, response({ error: 'secret' }, status)) });
    assert.ok(calls >= (status === 429 ? 3 : 1) && calls <= (status === 429 ? 12 : 4));
    assert.equal(report.counts.skipped + report.counts.errors, urls.length);
    assert.equal(report.stopReason, `HTTP_${status}`);
  }
});

test('CLI writes separate JSON and Markdown artifacts on partial and sitemap failure', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gsc-sitemap-'));
  try {
    const options = { getToken: async () => 'fixture-token', sleep: async () => {}, transport: async url => response(url.includes('sitemap-tools') ? xml(urls) : stored('PASS', 'Indexed')) };
    assert.equal(await main(['--output', dir], options), 0);
    const report = JSON.parse(await readFile(join(dir, 'report.json'), 'utf8'));
    assert.equal(report.results.length, 3);
    assert.match(await readFile(join(dir, 'report.md'), 'utf8'), /stored index.*not a live test or indexing request/i);
    assert.equal(await main(['--output', dir], { transport: async () => response('private-body', 500), sleep: async () => {} }), 1);
    assert.equal(JSON.parse(await readFile(join(dir, 'report.json'), 'utf8')).sitemap.error, 'HTTP_500');
    assert.ok(!(await readFile(join(dir, 'report.md'), 'utf8')).includes('private-body'));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
