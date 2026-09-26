import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { wwwSchemes } from '../regressions/misc-review.mjs';

// Independent fixture values. These cases never mock a successful service response.
// Network availability failures should fail the integration run, not silently pass.
async function example(ctx) {
  await ctx.tool.getByRole('button', { name: /^Examples?$/ }).click();
  await responsive(ctx);
}
async function clear(ctx) {
  const { tool, expect, check } = ctx;
  await responsive(ctx);
  await tool.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(tool.getByLabel('Result', { exact: true })).toHaveCount(0);
  await expect(tool.getByRole('alert')).toHaveCount(0);
  check(true, 'Clear removes the result and error state.');
}
async function report(ctx) {
  const { tool, expect } = ctx;
  const output = tool.getByLabel('Result', { exact: true });
  await expect(output).toBeVisible();
  await responsive(ctx);
  return JSON.parse(await output.innerText());
}
async function download(ctx, button = 'Download') {
  await mkdir(ctx.artifactsDir, { recursive: true });
  const pending = ctx.page.waitForEvent('download');
  await ctx.tool.getByRole('button', { name: button, exact: true }).click();
  const file = await pending;
  const target = path.join(ctx.artifactsDir, `seo-network-${Date.now()}-${file.suggestedFilename().replace(/[^a-zA-Z0-9._-]/g, '_')}`);
  await file.saveAs(target);
  return readFile(target);
}
async function responsive({ page, tool, check }) {
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: 320, height: 800 });
  const fits = await tool.evaluate(el => el.scrollWidth <= el.clientWidth + 1);
  check(fits, 'Tool content fits its container at 320px.');
  if (viewport) await page.setViewportSize(viewport);
}
async function robots(ctx) {
  const { tool, check, expect } = ctx;
  await example(ctx);
  let result = await report(ctx);
  check(result.errors.length === 0 && result.decision.allowed === false, 'Private path is disallowed by the example rule.');
  await tool.getByLabel('Test path', { exact: true }).fill('/private/public');
  result = await report(ctx); check(result.decision.allowed === true, 'Longer Allow rule overrides Disallow.');
  const bytes = await download(ctx, 'Download robots.txt');
  check(bytes.toString().includes('Disallow: /private/'), 'robots.txt download contains the editable source.');
  await tool.getByLabel('robots.txt', { exact: true }).fill('Disallow: /orphan');
  result = await report(ctx); check(result.errors.some(e => e.includes('User-agent')), 'Orphan rule is reported as invalid.');
  await tool.getByLabel('Input mode').selectOption('url');
  await expect(tool.getByLabel('Result', { exact: true })).toHaveCount(0);
  await clear(ctx);
}
async function sitemap(ctx) {
  const { tool, check, expect } = ctx;
  await example(ctx); let result = await report(ctx);
  check(result.count === 2 && result.entries[0].loc === 'https://example.com/?a=1&b=2' && !result.errors.length, 'XML entities decode and two sitemap entries are parsed.');
  check((await download(ctx, 'Download urls.txt')).toString() === 'https://example.com/?a=1&b=2\nhttps://example.com/about', 'URL download contains the complete decoded location list.');
  await tool.getByLabel('Sitemap XML', { exact: true }).fill('<s:sitemapindex xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"><s:sitemap><s:loc>https://example.com/one.xml</s:loc></s:sitemap></s:sitemapindex>');
  result = await report(ctx); check(result.type === 'sitemapindex' && result.count === 1 && !result.errors.length, 'Namespaced sitemap index is accepted without a urlset requirement.');
  await tool.getByLabel('Sitemap XML', { exact: true }).fill('<urlset><url></urlset>');
  await expect(tool.getByRole('alert')).toContainText('Malformed XML');
  await clear(ctx);
}
async function htmlAnalysis(ctx, kind) {
  const { tool, check, expect } = ctx;
  await example(ctx); let result = await report(ctx);
  if (kind === 'headings') check(result.headings[0].text === 'Tea & Coffee' && result.headings[1].level === 3 && result.issues.length === 1, 'Nested heading markup is decoded in document order and the level skip is found.');
  else if (kind === 'accessibility') {
    check(result.count === 1 && result.issues[0] === 'Image is missing alt text.', 'Exactly the missing alt attribute is detected.');
    await tool.getByLabel('HTML', { exact: true }).fill('<html lang="en"><title>Test</title><main><label>Name<input id="quote&quot;id"></label><input type="hidden"><button aria-labelledby="b"><span id="b">Save</span></button><a href="/"><img alt="Home"></a></main></html>');
    result = await report(ctx); check(result.count === 0, 'Wrapped label, hidden input, referenced name and image link name are handled.');
  } else check(result.titles[0] === 'Tea & Coffee' && result.tags.find(t => t.name === 'description').content === 'Fresh tea and coffee.', 'HTML entities and meta attributes are parsed from actual markup.');
  await tool.getByLabel('Input mode').selectOption('url');
  await tool.getByLabel('Page URL', { exact: true }).fill('javascript:alert(1)');
  await tool.getByRole('button', { name: 'Fetch', exact: true }).click();
  await expect(tool.getByRole('alert')).toContainText('HTTP');
  await clear(ctx);
}
async function textAnalysis(ctx, kind) {
  const { tool, check } = ctx;
  await example(ctx); let result = await report(ctx);
  check(result.values[0].characters === (kind === 'title' ? 12 : 21), 'Unicode character count matches independently counted example text.');
  await tool.getByLabel('Content format').selectOption('HTML');
  await tool.getByLabel('HTML', { exact: true }).fill('<title>A &amp; B</title><meta content="Tea &amp; coffee" name="description">');
  result = await report(ctx);
  check(result.values[0].text === (kind === 'title' ? 'A & B' : 'Tea & coffee'), 'HTML mode extracts and decodes the selected field.');
  await clear(ctx);
}
async function keywords(ctx) {
  const { tool, check } = ctx;
  await example(ctx); await tool.getByLabel('Keyword or phrase (optional)').fill('cat');
  let result = await report(ctx);
  check(result.total === 4 && result.keyword.count === 2 && result.keyword.density === 50, 'cat matches two of four whole words; scatter is not a match.');
  await tool.getByLabel('Text', { exact: true }).fill('red blue red blue');
  await tool.getByLabel('Phrase size').selectOption('2');
  await tool.getByLabel('Keyword or phrase (optional)').fill('red blue');
  result = await report(ctx);
  check(result.windows === 3 && result.keyword.count === 2 && result.keyword.density === 66.67, 'Two occurrences among three bigram windows produce 66.67%.');
  await clear(ctx);
}
async function ideas(ctx) {
  await example(ctx);
  const text = await ctx.tool.getByLabel('Result', { exact: true }).innerText();
  ctx.check(text.includes('what is coffee') && text.includes('coffee guide'), 'Deterministic local phrase templates use the seed.');
  await clear(ctx);
}
async function canonical(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await tool.getByLabel('Force HTTPS').check(); await tool.getByLabel('Remove www').check(); await tool.getByLabel('Remove trailing slash').check(); await tool.getByLabel('Remove fragment').check();
  const expected = '<link rel="canonical" href="https://example.com/page?a=1&amp;b=2" />';
  await expect(tool.getByLabel('Result', { exact: true })).toHaveText(expected);
  check((await download(ctx)).toString() === expected, 'Canonical download preserves query values and escapes markup.');
  await tool.getByLabel('URL', { exact: true }).fill('javascript:alert(1)'); await expect(tool.getByRole('alert')).toBeVisible(); await clear(ctx);
}
async function duplicates(ctx) {
  const { tool, check } = ctx; await example(ctx);
  let result = await report(ctx); check(result.unique.length === 2 && result.groups[0].originals.length === 2, 'Exact duplicate detected without merging different paths.');
  check((await download(ctx, 'Download urls.txt')).toString() === 'https://example.com/a\nhttps://example.com/b', 'Deduplicated download has each URL once.');
  await tool.getByLabel('URLs', { exact: true }).fill('https://e.com/?a=x%26b%3D1\nhttps://e.com/?a=x&b=1\nftp://e.com/a');
  result = await report(ctx); check(result.groups.length === 0 && result.invalid.length === 1, 'Encoded query delimiters are preserved and non-HTTP URL is rejected.'); await clear(ctx);
}
async function hreflang(ctx) {
  const { tool, page, check, expect } = ctx; await example(ctx);
  await tool.getByLabel('Output format').selectOption('sitemap');
  const xml = (await download(ctx)).toString();
  const result = await page.evaluate(xml => { const doc = new DOMParser().parseFromString(xml, 'application/xml'); return { error: !!doc.querySelector('parsererror'), counts: [...doc.getElementsByTagName('url')].map(e => e.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link').length) }; }, xml);
  check(!result.error && result.counts.length === 2 && result.counts.every(c => c === 3), 'Each language URL gets all reciprocal alternates and x-default in downloaded XML.');
  await tool.getByLabel('Output format').selectOption('json'); check((await report(ctx)).length === 3, 'JSON mode preserves three language alternatives.');
  await tool.getByLabel('Language URLs').fill('en invalid'); await expect(tool.getByRole('alert')).toBeVisible(); await clear(ctx);
}
async function preview(ctx, kind) {
  const { tool, check, expect } = ctx; await example(ctx);
  await tool.getByLabel('Title', { exact: true }).fill('Tea "&" <Coffee>');
  const text = await tool.getByLabel('Result', { exact: true }).innerText();
  check(text.includes('Tea &quot;&amp;&quot; &lt;Coffee&gt;'), 'Tag output escapes quotes, ampersands and markup.');
  check((await download(ctx)).toString() === text, 'Downloaded tags exactly match current output.');
  await tool.getByLabel('Device', { exact: true }).selectOption('mobile');
  await expect(tool.getByRole('region', { name: 'Preview' })).toContainText('Tea "&" <Coffee>');
  if (kind === 'twitter') { await tool.getByLabel('Card type').selectOption('summary'); await expect(tool.getByLabel('Result', { exact: true })).toContainText('content="summary"'); }
  await responsive(ctx);
  await tool.getByLabel('Page URL', { exact: true }).fill('ftp://example.com'); await expect(tool.getByRole('alert')).toBeVisible(); await clear(ctx);
}
async function lookup(ctx, kind) {
  const { tool, page, check, expect, baseURL } = ctx;
  await example(ctx);
  const input = tool.getByLabel(kind === 'links' ? 'URLs' : 'Hostname', { exact: true });
  await input.fill(kind === 'links' ? `${baseURL}/` : kind === 'rdap' ? 'example.com' : 'dns.google');
  if (kind === 'dns') await tool.getByLabel('Record type').selectOption('A');
  await tool.getByRole('button', { name: 'Lookup', exact: true }).click();
  await expect(tool.getByLabel('Result', { exact: true })).toBeVisible({ timeout: 25000 });
  const result = await report(ctx);
  if (kind === 'links') check(result[0].status === 200, '[live-read-only] Real same-origin HEAD request returns HTTP 200.');
  else if (kind === 'rdap') check(result.registered.startsWith('1995-08-14') && result.ageDays > 10000, '[live-public] Public example.com RDAP registration date matches 1995-08-14.');
  else { const results = kind === 'ping' ? result.results : result; const records = results.flatMap(r => r.records ?? []); check(records.some(r => r.data === '8.8.8.8'), '[live-public] Real dns.google A lookup contains the documented resolver address 8.8.8.8.'); }
  check(JSON.parse((await download(ctx)).toString()) !== null, 'Current network report downloads as JSON.');
  // Controlled FAILURE only; no synthetic success response.
  const pattern = kind === 'rdap' ? '**/rdap.org/**' : kind === 'links' ? `${baseURL}/**` : '**/dns.google/resolve?*';
  await page.route(pattern, route => ctx.abortExpectedRequest(route, 'Controlled lookup network failure verifies explicit error output'));
  try {
    await tool.getByRole('button', { name: 'Lookup', exact: true }).click();
    if (kind === 'rdap') await expect(tool.getByRole('alert')).toBeVisible();
    else {
      const failed = await report(ctx);
      check(kind === 'links' ? failed[0].result === 'Unknown' && failed[0].status === null : (kind === 'ping' ? failed.results : failed).every(r => r.error), '[controlled-error] Network failure is explicit, never a false no-records or broken-link result.');
    }
  } finally { await page.unroute(pattern); }
  await input.fill('bad host'); await tool.getByRole('button', { name: 'Lookup', exact: true }).click(); await expect(tool.getByRole('alert')).toBeVisible();
  // Start a real request and immediately clear. There must be no stale output.
  await input.fill(kind === 'links' ? `${baseURL}/` : 'example.com'); await tool.getByRole('button', { name: 'Lookup', exact: true }).click(); await clear(ctx);
  await expect(tool.getByRole('button', { name: 'Lookup', exact: true })).toBeEnabled();
}
async function mac(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await tool.getByRole('button', { name: 'Generate', exact: true }).click();
  const text = await tool.getByLabel('Result', { exact: true }).innerText(), rows = text.split('\n');
  check(rows.length === 5 && new Set(rows).size === 5 && rows.every(r => /^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(r) && (parseInt(r.slice(0, 2), 16) & 3) === 2), 'Five distinct six-octet locally administered unicast addresses.');
  check((await download(ctx)).toString() === text, 'MAC download matches the generated values.');
  await tool.getByLabel('Format', { exact: true }).selectOption(''); await expect(tool.getByLabel('Result', { exact: true })).toHaveCount(0);
  await tool.getByRole('button', { name: 'Generate', exact: true }).click(); await expect(tool.getByLabel('Result', { exact: true })).toHaveText(/^[0-9A-F]{12}(\n[0-9A-F]{12}){4}$/);
  await tool.getByLabel('Count', { exact: true }).fill('0'); await tool.getByRole('button', { name: 'Generate', exact: true }).click(); await expect(tool.getByRole('alert')).toContainText('1 to 1000'); await clear(ctx);
}
async function favicon(ctx) {
  const { tool, check, expect, page } = ctx; await example(ctx);
  await tool.getByRole('button', { name: 'Fetch Favicons', exact: true }).click();
  const button = tool.getByRole('button', { name: 'Download google.com', exact: true }); await expect(button).toBeVisible({ timeout: 20000 });
  const bytes = await download(ctx, 'Download google.com');
  check(bytes.length > 24 && (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || bytes.subarray(0,4).equals(Buffer.from([0,0,1,0]))), '[live-public] Download contains actual PNG/ICO bytes, not a cross-origin link or HTML page.');
  const image = tool.getByRole('img', { name: 'Provider favicon for google.com' }); await expect(image).toBeVisible();
  check(await image.evaluate(img => img.complete && img.naturalWidth > 0), 'Downloaded image decodes in the browser.');
  await clear(ctx); await expect(image).toHaveCount(0);
  await tool.getByLabel('URLs input', { exact: true }).fill('bad host'); await tool.getByRole('button', { name: 'Fetch Favicons', exact: true }).click(); await expect(tool.getByRole('alert')).toBeVisible();
  await page.route('**/api/favicon?*', route => route.abort('failed'));
  try { await example(ctx); await tool.getByRole('button', { name: 'Fetch Favicons', exact: true }).click(); await expect(tool.getByLabel('Result', { exact: true })).toContainText('google.com:'); await expect(button).toHaveCount(0); check(true, '[controlled-error] Favicon failure exposes no download or success image.'); } finally { await page.unroute('**/api/favicon?*'); }
  await clear(ctx);
}
async function robotGenerator(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await expect(tool.locator('pre')).toContainText('Disallow: /admin/');
  const text = (await download(ctx)).toString();
  const bing = text.split('User-agent: Bingbot')[1];
  check(text.includes('Sitemap: https://example.com/sitemap.xml') && bing.includes('Disallow: /admin/') && bing.includes('Crawl-delay: 5'), 'Dedicated bot group retains the configured access restrictions and crawl delay.');
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.locator('pre')).toHaveCount(0);
}
async function xmlGenerator(ctx) {
  const { tool, page, check, expect } = ctx; await example(ctx);
  await expect(tool.locator('pre')).toContainText('https://example.com/about');
  const xml = (await download(ctx, 'Download sitemap.xml')).toString();
  const parsed = await page.evaluate(xml => { const doc = new DOMParser().parseFromString(xml, 'application/xml'); return { error: !!doc.querySelector('parsererror'), loc: doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0]?.textContent, image: doc.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')[0]?.textContent }; }, xml);
  check(!parsed.error && parsed.loc === 'https://example.com/about' && parsed.image === 'https://example.com/images/about.jpg', 'Downloaded XML has real sitemap and image namespaces with known locations.');
  await tool.getByLabel('Sitemap URL', { exact: true }).fill('/tea?a=1&b=2'); await tool.getByRole('button', { name: 'Add', exact: true }).click(); await expect(tool.locator('pre')).toContainText('https://example.com/tea?a=1&amp;b=2');
  await tool.getByLabel('Sitemap URL', { exact: true }).fill('ftp://example.com'); await tool.getByRole('button', { name: 'Add', exact: true }).click(); await expect(tool.getByRole('alert')).toBeVisible();
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.locator('pre')).toHaveCount(0);
}
async function jsonLd(ctx) {
  const { tool, check, expect } = ctx;
  const types = { 'Web Site': 'WebSite', 'Web Page': 'WebPage', Article: 'Article', 'News Article': 'NewsArticle', 'Blog Post': 'BlogPosting', Product: 'Product', 'Local Business': 'LocalBusiness', Restaurant: 'Restaurant', Event: 'Event', Person: 'Person', Organization: 'Organization', 'Breadcrumb List': 'BreadcrumbList', 'FAQ Page': 'FAQPage' };
  for (const [label, type] of Object.entries(types)) {
    await tool.getByRole('tab', { name: label, exact: true }).click(); await example(ctx);
    await example(ctx); // Repeated examples must retain the generated result.
    await expect(tool.locator('pre')).toContainText(`"@type": "${type}"`);
    const text = await tool.locator('pre').innerText(), data = JSON.parse(text.replace(/^<script[^>]*>\s*/, '').replace(/\s*<\/script>$/, ''));
    check(data['@context'] === 'https://schema.org' && data['@type'] === type, `${type} mode generates parseable structured data.`);
    if (type === 'Product') check(data.offers.price === '29.99' && !('availability' in data.offers), 'Product price is preserved without inventing inventory availability.');
    if (type === 'BreadcrumbList') check(data.itemListElement.length === 3 && data.itemListElement[2].position === 3, 'Breadcrumb positions are sequential.');
    if (type === 'FAQPage') check(data.mainEntity.length === 2 && data.mainEntity[0].acceptedAnswer['@type'] === 'Answer', 'FAQ mode includes two real question/answer pairs.');
  }
  await tool.getByRole('tab', { name: 'Web Site', exact: true }).click(); await example(ctx);
  await tool.getByLabel('Site Name', { exact: true }).fill('</script><img src=x>');
  const downloaded = (await download(ctx)).toString(); check(!downloaded.includes('<img') && downloaded.includes('\\u003c/script>'), 'JSON-LD download safely escapes script termination.');
  await tool.getByLabel('Site URL', { exact: true }).fill('javascript:alert(1)'); await expect(tool.getByRole('alert')).toBeVisible();
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.locator('pre')).toHaveCount(0);
}
async function redirects(ctx) {
  await wwwSchemes(ctx);
  ctx.check(true, 'Both www redirect modes preserve the incoming HTTP or HTTPS scheme.');
  const { tool, check, expect } = ctx; await example(ctx);
  await expect(tool.getByLabel('Output', { exact: true })).not.toHaveValue('');
  const text = (await download(ctx)).toString();
  check(text.includes('RedirectMatch 301 ^/old-page\\.html$ /new-page') && text.includes('https://www.example.com%{REQUEST_URI}'), 'Exact path is regex-escaped and redirect status/destination are generated.');
  await tool.getByLabel('Redirect status').selectOption('308'); await expect(tool.getByLabel('Output', { exact: true })).toHaveValue(/RedirectMatch 308/);
  await tool.getByLabel('Redirect destination').fill('/bad destination'); await expect(tool.getByRole('alert')).toBeVisible(); await expect(tool.getByLabel('Output', { exact: true })).toHaveCount(0);
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click();
}
async function security(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  const text = (await download(ctx)).toString();
  check(text.includes('X-Content-Type-Options: nosniff') && text.includes("Content-Security-Policy: default-src 'self'") && text.includes('Cache-Control: no-store'), 'Header download reflects preset and custom values.');
  await tool.getByLabel('Content-Security-Policy value', { exact: true }).fill("default-src 'self'; report-uri /$reports");
  await tool.locator('summary').filter({ hasText: 'Nginx Configuration' }).click();
  await expect(tool.locator('details').filter({ hasText: 'Nginx Configuration' }).locator('pre')).toContainText('\\$reports');
  check(true, 'Nginx output escapes dollar interpolation.');
  await tool.getByLabel('Custom header name').fill('Bad Header'); await tool.getByLabel('Custom header value').fill('value'); await tool.getByRole('button', { name: 'Add', exact: true }).click(); await expect(tool.getByRole('alert')).toBeVisible();
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.getByRole('button', { name: 'Download', exact: true })).toBeDisabled();
}
async function cidr(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await tool.getByLabel('CIDR input', { exact: true }).fill('192.168.1.129/25');
  await expect(tool).toContainText('192.168.1.128'); await expect(tool).toContainText('192.168.1.254'); check(true, 'A /25 computes network .128 and final usable host .254.');
  await tool.getByLabel('CIDR input', { exact: true }).fill('10.0.0.0/31'); await expect(tool).toContainText('10.0.0.1');
  await tool.getByLabel('CIDR input', { exact: true }).fill('300.0.0.0/24'); await expect(tool).toContainText('Enter a valid IPv4 CIDR');
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.getByLabel('CIDR input', { exact: true })).toHaveValue('');
}
async function range(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await tool.getByLabel('Start IP', { exact: true }).fill('10.0.0.254'); await tool.getByLabel('End IP', { exact: true }).fill('10.0.1.1');
  await expect(tool).toContainText('10.0.0.0/23');
  const countRow = tool.locator('.tb-v2-tool-output-body > div').filter({ hasText: 'Inclusive Address Count' }); await expect(countRow).toContainText('4'); check(true, 'Four addresses spanning two /24 blocks need enclosing /23.');
  await tool.getByLabel('End IP', { exact: true }).fill('10.0.0.1'); await expect(tool).toContainText('start at or before the end');
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click();
}
async function compose(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  const templates = { 'full-stack': ['app', 'db', 'cache'], 'node-postgres': ['app', 'db'], 'node-mysql': ['app', 'db'], 'node-redis': ['app', 'cache'], 'wordpress-mysql': ['wordpress', 'db'], 'nginx-static': ['web'] };
  for (const [template, expected] of Object.entries(templates)) {
    await tool.getByLabel('Compose template').selectOption(template);
    const output = (await download(ctx)).toString(), parsed = yaml.load(output);
    check(JSON.stringify(Object.keys(parsed.services)) === JSON.stringify(expected), `${template} downloads valid YAML with the expected services.`);
  }
  await tool.getByLabel('Compose template').selectOption('node-postgres'); await tool.getByLabel('dbPassword', { exact: true }).fill('a$B');
  const parsed = yaml.load((await download(ctx)).toString()); check(parsed.services.db.environment.includes('POSTGRES_PASSWORD=a$$B'), 'Compose escapes dollar signs instead of interpolating environment variables.');
  await tool.getByLabel('Service name').fill('db'); await expect(tool).toContainText('must differ from db and cache'); await expect(tool.getByRole('button', { name: 'Download', exact: true })).toBeDisabled();
  await responsive(ctx); await tool.getByRole('button', { name: 'Clear', exact: true }).click();
}
async function algorithm(ctx) {
  const { tool, check, expect } = ctx; await example(ctx);
  await expect(tool).toContainText('BERT'); await expect(tool).toContainText('Oct 2019'); await expect(tool.locator('ol > li')).toHaveCount(1);
  check(true, 'Historical BERT filter returns the October 2019 milestone only.');
  await tool.getByLabel('Search algorithm updates').fill('does-not-exist'); await expect(tool).toContainText('No updates match');
  await tool.getByRole('button', { name: 'Clear', exact: true }).click(); await expect(tool.getByLabel('Search algorithm updates')).toHaveValue('');
  check(await tool.getByRole('link', { name: 'official Google Search ranking history' }).getAttribute('href') === 'https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history', 'Static reference links to the authoritative live history.');
}

const cases = [
  { slug: 'robots-txt-generator', async test(ctx) { await robotGenerator(ctx); } },
  { slug: 'security-headers-generator', async test(ctx) { await security(ctx); } },
  { slug: 'xml-sitemap-generator', async test(ctx) { await xmlGenerator(ctx); } },
  { slug: 'json-ld-generator', async test(ctx) { await jsonLd(ctx); } },
  { slug: 'htaccess-redirect-generator', async test(ctx) { await redirects(ctx); } },
  { slug: 'meta-tag-generator', async test(ctx) { await preview(ctx, 'meta'); } },
  { slug: 'serp-preview', async test(ctx) { await preview(ctx, 'serp'); } },
  { slug: 'keyword-density-checker', async test(ctx) { await keywords(ctx); } },
  { slug: 'mac-address-generator', async test(ctx) { await mac(ctx); } },
  { slug: 'open-graph-preview', async test(ctx) { await preview(ctx, 'social'); } },
  { slug: 'twitter-card-preview', async test(ctx) { await preview(ctx, 'twitter'); } },
  { slug: 'ping-test', async test(ctx) { await lookup(ctx, 'ping'); } },
  { slug: 'robots-txt-analyzer', async test(ctx) { await robots(ctx); } },
  { slug: 'keyword-extractor', async test(ctx) { await keywords(ctx); } },
  { slug: 'broken-link-checker', async test(ctx) { await lookup(ctx, 'links'); } },
  { slug: 'google-algorithm-tracker', async test(ctx) { await algorithm(ctx); } },
  { slug: 'meta-description-checker', async test(ctx) { await textAnalysis(ctx, 'description'); } },
  { slug: 'domain-age-checker', async test(ctx) { await lookup(ctx, 'rdap'); } },
  { slug: 'accessibility-checker', async test(ctx) { await htmlAnalysis(ctx, 'accessibility'); } },
  { slug: 'sitemap-analyzer', async test(ctx) { await sitemap(ctx); } },
  { slug: 'open-graph-generator', async test(ctx) { await preview(ctx, 'og'); } },
  { slug: 'dns-lookup', async test(ctx) { await lookup(ctx, 'dns'); } },
  { slug: 'serp-snippet-preview', async test(ctx) { await preview(ctx, 'serp'); } },
  { slug: 'seo-meta-tag-analyzer', async test(ctx) { await htmlAnalysis(ctx, 'meta'); } },
  { slug: 'cidr-calculator', async test(ctx) { await cidr(ctx); } },
  { slug: 'ip-range-calculator', async test(ctx) { await range(ctx); } },
  { slug: 'robots-txt-validator', async test(ctx) { await robots(ctx); } },
  { slug: 'hreflang-tag-generator', async test(ctx) { await hreflang(ctx); } },
  { slug: 'google-serp-preview', async test(ctx) { await preview(ctx, 'serp'); } },
  { slug: 'keyword-generator', async test(ctx) { await ideas(ctx); } },
  { slug: 'heading-tag-analyzer', async test(ctx) { await htmlAnalysis(ctx, 'headings'); } },
  { slug: 'page-title-checker', async test(ctx) { await textAnalysis(ctx, 'title'); } },
  { slug: 'sitemap-extractor', async test(ctx) { await sitemap(ctx); } },
  { slug: 'batch-favicon-downloader', async test(ctx) { await favicon(ctx); } },
  { slug: 'docker-compose-generator', async test(ctx) { await compose(ctx); } },
  { slug: 'robots-txt-editor', async test(ctx) { await robots(ctx); } },
  { slug: 'og-tag-debugger', async test(ctx) { await htmlAnalysis(ctx, 'meta'); } },
  { slug: 'canonical-url-generator', async test(ctx) { await canonical(ctx); } },
  { slug: 'random-mac-generator', async test(ctx) { await mac(ctx); } },
  { slug: 'seo-title-analyzer', async test(ctx) { await textAnalysis(ctx, 'title'); } },
  { slug: 'serp-simulator', async test(ctx) { await preview(ctx, 'serp'); } },
  { slug: 'robots-txt-checker', async test(ctx) { await robots(ctx); } },
  { slug: 'duplicate-url-detector', async test(ctx) { await duplicates(ctx); } },
  { slug: 'keyword-density-analyzer', async test(ctx) { await keywords(ctx); } },
  { slug: 'favicon-grabber', async test(ctx) { await favicon(ctx); } },
  { slug: 'dns-lookup-tool', async test(ctx) { await lookup(ctx, 'batch-dns'); } },
  { slug: 'google-serp-simulator', async test(ctx) { await preview(ctx, 'serp'); } },
];
export default cases;
