import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseSitemap, groupResults, collect, main, selectOnly } from './gsc-sitemap-inspection.mjs';

const urls = ['https://toolblip.com/tools/alpha', 'https://toolblip.com/tools/beta', 'https://toolblip.com/tools/gamma'];
const blogUrls = ['https://toolblip.com/blog/first-post', 'https://toolblip.com/blog/another-2026-post'];
const coreUrls = ['https://toolblip.com', 'https://toolblip.com/directory', 'https://toolblip.com/tools', 'https://toolblip.com/tools/images', 'https://toolblip.com/all-tools', 'https://toolblip.com/blog', 'https://toolblip.com/pricing', 'https://toolblip.com/sponsors', 'https://toolblip.com/sponsors/archive', 'https://toolblip.com/about', 'https://toolblip.com/products', 'https://toolblip.com/seo', 'https://toolblip.com/api-docs'];
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

test('blog and core validation enforce canonical cohort paths and the exact core route set', () => {
  assert.deepEqual(parseSitemap(xml(blogUrls), 'blog'), blogUrls);
  assert.deepEqual(parseSitemap(xml(coreUrls), 'core'), coreUrls);
  for (const bad of ['https://toolblip.com/blog', 'https://toolblip.com/blog/first-post/', 'https://toolblip.com/blog/first-post/child', 'https://toolblip.com/blog/%66irst-post', 'https://toolblip.com/tools/alpha', 'https://evil.test/blog/first-post', 'https://toolblip.com/blog/first-post?secret=1']) {
    assert.throws(() => parseSitemap(xml([bad]), 'blog'), /INVALID_SITEMAP/);
  }
  for (const bad of [coreUrls.slice(1), coreUrls.filter(url => url !== 'https://toolblip.com/products'), [...coreUrls, 'https://toolblip.com/tools/alpha'], [...coreUrls.slice(0, 1), ...coreUrls.slice(2), 'https://toolblip.com/blog/first-post'], coreUrls.map(url => url === 'https://toolblip.com' ? 'https://toolblip.com/' : url)]) {
    assert.throws(() => parseSitemap(xml(bad), 'core'), /INVALID_SITEMAP/);
  }
  assert.throws(() => parseSitemap(xml(urls), 'unknown'), /INVALID_SITEMAP/);
});

test('blog and core collection fetch only their fixed sitemap URLs and label reports', async () => {
  for (const [cohort, entries] of [['blog', blogUrls], ['core', coreUrls]]) {
    const fetched = [];
    const inspected = [];
    const report = await collect({ sitemap: cohort, getToken: async () => 'fixture-token', sleep: async () => {}, transport: async (url, init) => {
      if (url.endsWith('.xml')) { fetched.push(url); assert.equal(init.redirect, 'error'); return response(xml(entries)); }
      inspected.push(JSON.parse(init.body).inspectionUrl);
      return response(stored('PASS', 'Indexed'));
    } });
    assert.deepEqual(fetched, [`https://toolblip.com/sitemap-${cohort}.xml`]);
    assert.deepEqual(inspected, entries);
    assert.equal(report.sitemap.cohort, cohort);
    assert.equal(report.sitemap.url, fetched[0]);
    assert.deepEqual(report.results.map(row => row.url), entries);
    assert.equal(report.counts.inspected, entries.length);
    assert.equal(report.status, 'complete');
  }
});

test('cross-cohort sitemap contents and invalid cohort fail before authentication or inspection', async () => {
  for (const [cohort, entry] of [['blog', urls[0]], ['core', blogUrls[0]]]) {
    let authenticated = false;
    const report = await collect({ sitemap: cohort, transport: async url => {
      assert.equal(url, `https://toolblip.com/sitemap-${cohort}.xml`);
      return response(xml([entry]));
    }, getToken: async () => { authenticated = true; return 'fixture-token'; } });
    assert.equal(report.sitemap.error, 'INVALID_SITEMAP');
    assert.equal(authenticated, false);
    assert.equal(report.counts.inspected, 0);
  }
  await assert.rejects(collect({ sitemap: 'https://evil.test/sitemap-blog.xml', transport: async () => { throw Error('must not fetch'); } }), /INVALID_SITEMAP/);
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

test('transient inspection failure succeeds on one retry without an extra progress result', async () => {
  let attempts = 0;
  const sleeps = [];
  const updates = [];
  const report = await collect({ getToken: async () => 'fixture-token', sleep: async ms => sleeps.push(ms), onProgress: update => updates.push(update), transport: async url => {
    if (url.includes('sitemap-tools')) return response(xml([urls[0]]));
    attempts++;
    if (attempts === 1) throw Error('private-url-and-token');
    return response(stored('PASS', 'Indexed'));
  } });
  assert.equal(attempts, 2);
  assert.deepEqual(sleeps, [1000, 200]);
  assert.equal(report.status, 'complete');
  assert.deepEqual(report.counts, { verdict: { PASS: 1 }, coverageState: { Indexed: 1 }, inspected: 1, errors: 0, skipped: 0 });
  assert.deepEqual(updates, [{ completed: 1, total: 1, inspected: 1, errors: 0, skipped: 0 }]);
  assert.ok(!JSON.stringify(report).includes('private-url-and-token'));
});

test('persistent transient inspection failures stop after the second attempt and record one safe error', async () => {
  for (const [failure, code] of [[() => { throw Error('private-url-and-token'); }, 'REQUEST_FAILED'], [() => new Promise(() => {}), 'REQUEST_TIMEOUT']]) {
    let attempts = 0;
    const sleeps = [];
    const updates = [];
    const report = await collect({ getToken: async () => 'fixture-token', sleep: async ms => sleeps.push(ms), onProgress: update => updates.push(update), transport: async url => {
      if (url.includes('sitemap-tools')) return response(xml([urls[0]]));
      attempts++;
      return failure();
    } });
    assert.equal(attempts, 2);
    assert.deepEqual(sleeps, [1000, 200]);
    assert.equal(report.status, 'partial-failure');
    assert.equal(report.results[0].inspection.error, code);
    assert.deepEqual(report.counts, { verdict: {}, coverageState: {}, inspected: 0, errors: 1, skipped: 0 });
    assert.deepEqual(updates, [{ completed: 1, total: 1, inspected: 0, errors: 1, skipped: 0 }]);
    assert.ok(!JSON.stringify(report).includes('private-url-and-token'));
  }
});

test('HTTP 4xx and invalid inspection responses do not trigger the transient retry', async () => {
  for (const [body, status, code] of [[{ error: 'private-body' }, 400, 'HTTP_400'], [{ inspectionResult: {} }, 200, 'INVALID_INSPECTION_RESPONSE']]) {
    let attempts = 0;
    const sleeps = [];
    const report = await collect({ getToken: async () => 'fixture-token', sleep: async ms => sleeps.push(ms), transport: async url => {
      if (url.includes('sitemap-tools')) return response(xml([urls[0]]));
      attempts++;
      return response(body, status);
    } });
    assert.equal(attempts, 1);
    assert.deepEqual(sleeps, []);
    assert.equal(report.results[0].inspection.error, code);
    assert.equal(report.counts.errors, 1);
    assert.ok(!JSON.stringify(report).includes('private-body'));
  }
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

test('auth and quota stops leave only initial in-flight inspections to settle and skip unstarted URLs', async () => {
  for (const status of [403, 429]) {
    const many = Array.from({ length: 8 }, (_, i) => `https://toolblip.com/tools/tool-${i}`);
    const releases = [];
    const sleeps = [];
    let started = 0;
    const collecting = collect({ getToken: async () => 'fixture-token', sleep: async ms => { sleeps.push(ms); }, transport: async url => {
      if (url.includes('sitemap-tools')) return response(xml(many));
      const index = started++;
      await new Promise(resolve => { releases[index] = resolve; });
      return response(index === 0 ? { error: 'private' } : stored('PASS', 'Indexed'), index === 0 ? status : 200);
    } });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(started, 4);
    releases[0]();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(started, 4);
    releases[1](); releases[2](); releases[3]();
    const report = await collecting;
    assert.equal(started, 4);
    assert.deepEqual(sleeps, [200, 200, 200]);
    assert.equal(report.stopReason, `HTTP_${status}`);
    assert.equal(report.counts.inspected, 3);
    assert.equal(report.counts.errors, 1);
    assert.equal(report.counts.skipped, 4);
    assert.deepEqual(report.results.map(row => row.url), many);
  }
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
    assert.ok(calls >= 1 && calls <= 4);
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

test('one listed URL is inspected and a URL outside the sitemap makes no inspection request', async () => {
  assert.deepEqual(selectOnly(blogUrls, blogUrls[0]), [blogUrls[0]]);
  assert.throws(() => selectOnly(blogUrls, 'https://toolblip.com/blog/missing'), /ONLY_URL_NOT_LISTED/);
  const inspected = [];
  const report = await collect({
    sitemap: 'blog',
    only: blogUrls[1],
    getToken: async () => 'fixture-token',
    sleep: async () => {},
    transport: async (url, init) => {
      if (init?.method === 'POST') inspected.push(JSON.parse(init.body).inspectionUrl);
      return response(url.endsWith('.xml') ? xml(blogUrls) : stored('NEUTRAL', 'Not found (404)'));
    },
  });
  assert.deepEqual(inspected, [blogUrls[1]]);
  assert.equal(report.results.length, 1);
  assert.equal(report.sitemap.only, blogUrls[1]);
  const missed = await collect({
    sitemap: 'blog',
    only: 'https://toolblip.com/blog/missing',
    getToken: async () => { throw new Error('must not authenticate'); },
    transport: async url => response(url.endsWith('.xml') ? xml(blogUrls) : stored('PASS', 'Indexed')),
  });
  assert.equal(missed.sitemap.error, 'ONLY_URL_NOT_LISTED');
  assert.equal(missed.results.length, 0);
});

test('CLI selects blog and core reports and rejects arbitrary sitemap selectors', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gsc-sitemap-cohorts-'));
  try {
    for (const [cohort, entries] of [['blog', blogUrls], ['core', coreUrls]]) {
      const output = join(dir, cohort);
      const code = await main(['--sitemap', cohort, '--output', output], {
        getToken: async () => 'fixture-token', sleep: async () => {},
        transport: async url => response(url.endsWith('.xml') ? xml(entries) : stored('PASS', 'Indexed')),
      });
      assert.equal(code, 0);
      assert.equal(JSON.parse(await readFile(join(output, 'report.json'), 'utf8')).sitemap.cohort, cohort);
      assert.match(await readFile(join(output, 'report.md'), 'utf8'), new RegExp(`validated ${cohort} URLs`));
    }
    let fetched = false;
    assert.equal(await main(['--sitemap', 'https://evil.test/sitemap-blog.xml', '--output', dir], { transport: async () => { fetched = true; } }), 1);
    assert.equal(fetched, false);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
