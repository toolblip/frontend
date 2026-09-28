import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { tools } from '../data/tools';
import { getToolPathBySlug } from '../lib/tool-path';
import { isToolIndexable } from '../lib/indexable-tools';
import { buildSync } from 'esbuild';
import path from 'node:path';
import bespoke from './remaining/bespoke';
// Bundle the ESM QA modules into one temporary CommonJS registry. The project's
// Playwright TS transform otherwise rewrites their .mjs imports incompatibly.
const registryPath = path.resolve('node_modules/.cache/remaining-cases.cjs');
buildSync({stdin:{contents: "import a from './scripts/qa/cases/developer-security.mjs'; import b from './scripts/qa/cases/developer-general.mjs'; import c from './scripts/qa/cases/developer-data.mjs'; import d from './scripts/qa/cases/utility-design.mjs'; import e from './scripts/qa/cases/seo-network.mjs'; import f from './scripts/qa/cases/historical-regressions.mjs'; import g from './scripts/qa/cases/images.mjs'; export default [...a,...b,...c,...d,...e,...f,...g];",resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',packages:'external',outfile:registryPath});
const registry = [...bespoke, ...require(registryPath).default] as {slug:string; test:(ctx:any)=>Promise<void>}[];
const original = require('../docs/gsc-remaining-review-2026-09-26.json').rows as {slug:string}[];
const cohort = process.env.REMAINING_TARGETS ? process.env.REMAINING_TARGETS.split(',').map(slug=>({slug})) : original;
const selected = process.env.REMAINING_SET;
for (const width of [1440, 375]) for (const entry of cohort) {
  if (selected === 'bespoke' && !bespoke.some(t=>t.slug===entry.slug)) continue;
  const fixture = registry.find(f => f.slug === entry.slug);
  if (!fixture) throw new Error(`Missing purpose-specific fixture: ${entry.slug}`);
  test(`${entry.slug} ${width}px`, async ({ page, baseURL }) => {
    await page.addLocatorHandler(page.getByRole('dialog', {name:'Cookie consent'}), async () => { await page.getByRole('button', {name:'Decline analytics cookies'}).click(); }, {times: 1});
    await page.setViewportSize({width, height: 1000});
    const response = await page.goto(getToolPathBySlug(entry.slug), { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    const tool = page.locator('.tb-v2-tool-card').first();
    await expect(tool).toBeVisible();
    await page.waitForFunction(() => {
      const root = document.querySelector('.tb-v2-tool-card');
      return root && Array.from(root.querySelectorAll('button,input,textarea,select')).some(el => Object.keys(el).some(k => k.startsWith('__reactProps$')));
    }, undefined, {timeout:30000});
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://toolblip.com${getToolPathBySlug(entry.slug)}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', process.env.REMAINING_TARGETS && isToolIndexable(entry.slug) ? /^index, follow$/ : /noindex/);
    const artifactsDir = test.info().outputPath('case');
    await mkdir(artifactsDir, {recursive:true});
    const assertions: string[] = [];
    // Old cases request 320px. Run those same interactions at each requested review width.
    const fixturePage = new Proxy(page, {get(target, key) {
      if (key === 'setViewportSize') return () => target.setViewportSize({width,height:1000});
      const value = Reflect.get(target,key); return typeof value === 'function' ? value.bind(target) : value;
    }});
    await fixture.test({page:fixturePage, tool, expect, slug:entry.slug, baseURL, artifactsDir,
      check(value: boolean, message: string) { expect(value, message).toBe(true); assertions.push(message.replaceAll('320px', `${width}px`)); },
      abortExpectedRequest: async () => { throw new Error('Network fault injection is not public acceptance; use a separate local regression.'); },
    });
    expect(assertions.length).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await test.info().attach('functional-evidence', {body: JSON.stringify({slug:entry.slug,width,assertions}), contentType:'application/json'});
  });
}
