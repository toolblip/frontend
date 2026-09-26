import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { getBrowserPolicy } from '../../lib/browser-policy.mjs';

const origin = 'http://127.0.0.1:3190';
const results = [];
const stripUpgrade = csp => csp.split(';').filter(part => part.trim() !== 'upgrade-insecure-requests').join(';');
for (const engine of ['chrome', 'webkit']) {
  console.log(`${engine}: starting`);
  const browser = await (engine === 'chrome' ? chromium.launch({ channel: 'chrome', headless: true }) : webkit.launch({
    executablePath: '/private/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/webkit-qa/pw_run.sh', headless: true,
  }));
  try {
    console.log(`${engine}: browser ready`);
    const context = await browser.newContext({ serviceWorkers: 'block' });
    if (engine === 'chrome') await context.grantPermissions(['local-network-access'], { origin });
    // Only local development's upgrade directive is removed; all scopes remain enforced.
    await context.route(`${origin}/**`, async route => {
      if (route.request().resourceType() !== 'document') return route.continue();
      const response = await route.fetch({ maxRedirects: 0, timeout: 90000 });
      const headers = response.headers();
      if (headers['content-security-policy']) headers['content-security-policy'] = stripUpgrade(headers['content-security-policy']);
      await route.fulfill({ response, headers });
    });
    await context.addInitScript(() => {
      window.documentIdentity = Math.random().toString(36);
      window.policyViolations = [];
      document.addEventListener('securitypolicyviolation', e => window.policyViolations.push(e.effectiveDirective));
    });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    const documents = [];
    const hydrationErrors = [];
    let refreshCount = 0;
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) console.log('NAV', frame.url()); });
    page.on('console', m => { if (m.text().includes('performing full reload')) { refreshCount++; console.log('Fast Refresh interrupted this page'); } if (/hydration|didn't match|did not match/i.test(m.text())) hydrationErrors.push(m.text()); });
    page.on('response', response => {
      if (response.request().resourceType() === 'document' && response.request().frame() === page.mainFrame()) {
        console.log('DOCUMENT', response.url());
        documents.push({ url: response.url(), headers: response.headers() });
      }
    });
    const hydrated = async () => {
      await page.waitForFunction(() => {
        const el = document.querySelector('button[aria-label="Open search"]');
        return document.readyState === 'complete' && el && Object.keys(el).some(key => key.startsWith('__reactProps$'));
      });
      // Allow hydration's passive effects (including Next's popstate listener)
      // to settle before issuing an immediate second navigation.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      // Exercise a stateful control, so this is interactive hydration rather
      // than merely SSR elements with React props attached.
      await page.getByRole('button', { name: 'Open search', exact: true }).click();
      await page.locator('.tb-v2-sp-panel').waitFor();
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await page.locator('.tb-v2-sp-panel').waitFor({ state: 'hidden' });
    };
    const identity = () => page.evaluate(() => window.documentIdentity);
    const verify = async (path, previous, reload) => {
      await page.waitForURL(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
      if (reload) await page.waitForFunction(id => window.documentIdentity !== id, previous);
      await hydrated();
      assert.equal((await identity()) !== previous, reload, `document replacement: ${path}`);
      assert.equal(page.url(), `${origin}${path}`, 'destination remains correct after hydration');
      const expected = getBrowserPolicy(new URL(`${origin}${path}`).pathname);
      const doc = documents.at(-1);
      assert.equal(doc.headers['content-security-policy'], stripUpgrade(expected.csp));
      assert.equal(doc.headers['permissions-policy'], expected.permissions);
      results.push({ engine, path, reload, document: doc.url, policy: expected });
      console.log(`${engine}: ${path} (${reload ? 'new document' : 'client navigation'})`);
    };
    const search = async (query, path, reload = true) => {
      for (let attempt = 0; attempt < 4; attempt++) {
        await hydrated();
        const before = await identity();
        const refreshBefore = refreshCount;
        await page.getByRole('button', { name: 'Open search', exact: true }).click();
        await page.getByPlaceholder('Search 100+ tools by name, category, or what they do…').fill(query);
        await page.locator(`.tb-v2-sp-panel a[href="${path}"]`).click();
        try {
          await page.waitForURL(`${origin}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (error) {
          if (refreshCount > refreshBefore && attempt < 3) {
            console.log(`Retrying ${path} after observed Fast Refresh`);
            continue;
          }
          throw error;
        }
        await verify(path, before, reload);
        return;
      }
    };
    await page.goto(`${origin}/tools`, { waitUntil: 'domcontentloaded' });
    await hydrated();
    let before = await identity();
    await page.locator('main a[href="/tools/dns-lookup"]').click();
    await verify('/tools/dns-lookup', before, true);
    await page.getByRole('button', { name: 'Examples', exact: true }).click();
    await page.getByRole('button', { name: 'Lookup', exact: true }).click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('pre[aria-label="Result"], main [role="alert"]')).some(e => e.textContent.trim()));
    assert(!(await page.evaluate(() => window.policyViolations)).includes('connect-src'));
    results.push({ engine, dnsOutput: await page.locator('pre[aria-label="Result"], main [role="alert"]').allTextContents() });
    await search('html live preview', '/tools/html-live-preview');
    await page.locator('main iframe').waitFor();
    const frame = await (await page.locator('main iframe').elementHandle()).contentFrame();
    await frame.waitForFunction(() => document.body?.innerText.includes('Hello World'));
    assert(!(await page.evaluate(() => window.policyViolations)).includes('frame-src'));
    await search('speech to text', '/tools/speech-to-text');
    const microphone = await page.evaluate(() => document.featurePolicy?.allowsFeature('microphone') ?? null);
    if (engine === 'chrome') assert.equal(microphone, true);
    await search('word counter', '/tools/word-counter');
    if (engine === 'chrome') assert.equal(await page.evaluate(() => document.featurePolicy.allowsFeature('microphone')), false);
    // The restrictive document blocks both previously allowed capabilities.
    const baseline = await page.evaluate(async () => {
      try { await fetch('https://dns.google/resolve?name=example.com&type=A'); } catch {}
      const iframe = document.createElement('iframe'); iframe.src = '/robots.txt'; document.body.append(iframe);
      await new Promise(resolve => setTimeout(resolve, 150)); iframe.remove();
      return window.policyViolations;
    });
    assert(baseline.includes('connect-src')); assert(baseline.includes('frame-src'));
    before = await identity(); await page.goBack(); await verify('/tools/speech-to-text', before, true);
    before = await identity(); await page.goBack(); await verify('/tools/html-live-preview', before, true);
    before = await identity(); await page.goForward(); await verify('/tools/speech-to-text', before, true);
    // Direct entry and SSR/canonical coverage, followed by catalog entry into each scope.
    for (const [query, path] of [['html live preview', '/tools/html-live-preview'], ['speech to text', '/tools/speech-to-text']]) {
      await page.goto(`${origin}/tools`); await hydrated(); await search(query, path);
    }
    await page.goto(`${origin}/tools/dns-lookup?q=deep#result`); await hydrated();
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).pathname, '/tools/dns-lookup');
    before = await identity();
    await page.evaluate(() => window.next.router.push('/tools/dns-lookup?q=changed#new-result'));
    await verify('/tools/dns-lookup?q=changed#new-result', before, false);
    await page.evaluate(() => window.next.router.push('/tools/dns-lookup?q=changed#another-result'));
    await verify('/tools/dns-lookup?q=changed#another-result', before, false);
    await search('ping test', '/tools/ping-test', false);
    const noJs = await context.newPage();
    const response = await noJs.request.get(`${origin}/tools/dns-lookup`);
    assert((await response.text()).includes('DNS Lookup'));
    await noJs.close();
    assert.deepEqual(hydrationErrors, []);
    results.push({ engine, microphone, baseline, hydrationErrors, pageErrors, documentCount: documents.length, status: 'PASS' });
    await context.close();
  } catch (error) { console.error(engine, error); throw error; }
  finally { await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 3000))]); }
}
await fs.writeFile('/private/tmp/browser-policy-navigation-results.json', JSON.stringify(results, null, 2));
