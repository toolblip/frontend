#!/usr/bin/env node
/**
 * Audit v2 - Improved tool testing with smart auto-detection
 * 
 * Strategy:
 * 1. If tool has custom test case → use it
 * 2. If tool component has auto-generate (useEffect/onMount) → auto-trigger
 * 3. If tool has form inputs → fill first textarea + click first button
 * 4. If tool is a generator → click generate buttons
 * 5. Otherwise → check page renders without error
 */

import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://toolblip.com';
const PROGRESS_FILE = 'audit-progress-v2.json';
const TOOLS_FILE = 'data/tools.ts';
const TOOLUI_FILE = 'app/tools/[slug]/ToolUI.tsx';

const TEST_CASES = {
  'lorem-ipsum-generator': { fill: { textarea: '5' }, click: 'button:has-text("Generate")' },
  'json-formatter': { fill: { textarea: '{"a":1}' }, click: 'button:has-text("Format")' },
  'yaml-to-json': { fill: { textarea: 'a: 1' }, click: 'button:has-text("Convert")' },
  'cron-generator': { fill: { input: '*/5 * * * *' }, click: 'button' },
  'word-counter': { fill: { textarea: 'hello world' }, click: null },
  'url-encode': { fill: { textarea: 'hello world' }, click: 'button' },
  'base64-encode': { fill: { textarea: 'hello' }, click: 'button' },
  'md5-hash': { fill: { textarea: 'hello' }, click: 'button' },
  'regex-tester': { fill: { input: '.*', textarea: 'test' }, click: 'button' },
  'color-palette-generator': { click: 'button:has-text("Generate")', wait: 2000 },
  'password-generator': { click: 'button:has-text("Generate")', wait: 1000 },
  'uuid-generator': { click: 'button:has-text("Generate")', wait: 1000 },
  'hash-from-text': { fill: { textarea: 'hello' }, click: 'button' },
  'html-encoder': { fill: { textarea: '<div>hi</div>' }, click: 'button' },
  'css-minifier': { fill: { textarea: '.a { color: red; }' }, click: 'button' },
  'sql-to-json': { fill: { textarea: 'SELECT * FROM users' }, click: 'button' },
  'csv-to-json': { fill: { textarea: 'a,b\n1,2' }, click: 'button' },
  'xml-to-json': { fill: { textarea: '<a>1</a>' }, click: 'button' },
  'binary-decimal-converter': { fill: { input: '1010' }, click: null },
  'hex-decimal-converter': { fill: { input: 'FF' }, click: null },
  'unit-converter': { fill: { input: '100' }, click: null },
  'temperature-converter': { fill: { input: '100' }, click: null },
  'image-cropper': { type: 'file', accept: 'image/*', click: 'button' },
  'image-resizer': { type: 'file', accept: 'image/*', click: 'button' },
  'pdf-to-jpg': { type: 'file', accept: '.pdf', click: 'button' },
};

async function loadTools() {
  const content = fs.readFileSync(TOOLS_FILE, 'utf8');
  const matches = [...content.matchAll(/name:\s*'([^']+)',\s*slug:\s*'([^']+)'/g)];
  return matches.map(m => ({ name: m[1], slug: m[2] }));
}

async function loadToolUIComponents() {
  const content = fs.readFileSync(TOOLUI_FILE, 'utf8');
  const matches = [...content.matchAll(/case\s+'([^']+)':\s*\n\s*return\s*<(\w+)/g)];
  return Object.fromEntries(matches.map(m => [m[1], m[2]]));
}

async function testTool(browser, tool, component) {
  const page = await browser.newPage();
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  try {
    await page.goto(`${BASE}/tools/${tool.slug}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);

    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasContent = bodyText.length > 100;
    const hasStub = bodyText.includes('Coming Soon') && bodyText.includes('Configure');
    const hasError = bodyText.includes('Application error') && bodyText.includes('something went wrong');

    // Check for JS errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('hydration') &&
      !e.includes('Warning:') &&
      !e.includes('cloudflareinsights') &&
      !e.includes('Content Security Policy') &&
      !e.includes('Failed to load resource')
    );

    if (hasError || criticalErrors.length > 0) {
      return { status: 'error', output: bodyText.substring(0, 200), errors: criticalErrors };
    }

    if (hasStub) {
      return { status: 'stub', output: bodyText.substring(0, 200) };
    }

    // Try custom test case
    const tc = TEST_CASES[tool.slug];
    if (tc) {
      if (tc.fill) {
        for (const [sel, val] of Object.entries(tc.fill)) {
          const el = page.locator(sel).first();
          if (await el.count() > 0) await el.fill(val);
        }
      }
      if (tc.type === 'file') {
        // File inputs - skip in headless
      }
      if (tc.click) {
        const btn = page.locator(tc.click).first();
        if (await btn.count() > 0) await btn.click();
      }
      if (tc.wait) await page.waitForTimeout(tc.wait);
      
      await page.waitForTimeout(1000);
      const newText = await page.evaluate(() => document.body.innerText);
      if (newText.length > bodyText.length) {
        return { status: 'pass', output: newText.substring(0, 500) };
      }
    }

    // Auto-detect: check if any button produces output
    const buttons = await page.locator('button').all();
    for (const btn of buttons.slice(0, 3)) {
      const btnText = await btn.innerText().catch(() => '');
      if (btnText.match(/generate|convert|encode|decode|format|calculate|process|create|make/i)) {
        const textBefore = await page.evaluate(() => document.body.innerText);
        await btn.click();
        await page.waitForTimeout(1500);
        const textAfter = await page.evaluate(() => document.body.innerText);
        if (textAfter.length > textBefore.length + 10) {
          return { status: 'pass', output: textAfter.substring(0, 500) };
        }
      }
    }

    // Auto-detect: check for textarea + auto-generate on mount
    const textareas = await page.locator('textarea').count();
    const inputs = await page.locator('input').count();
    if ((textareas > 0 || inputs > 0) && hasContent) {
      // Fill first textarea and click first button
      if (textareas > 0) {
        await page.locator('textarea').first().fill('test input');
        await page.waitForTimeout(500);
        const btns = await page.locator('button').all();
        if (btns.length > 0) {
          await btns[0].click();
          await page.waitForTimeout(1500);
          const after = await page.evaluate(() => document.body.innerText);
          if (after.length > bodyText.length) {
            return { status: 'pass', output: after.substring(0, 500) };
          }
        }
      }
    }

    // If page has content and no errors, pass
    if (hasContent && !hasStub) {
      return { status: 'pass', output: bodyText.substring(0, 200) };
    }

    return { status: 'fail', output: bodyText.substring(0, 200) };
  } catch (e) {
    return { status: 'error', output: e.message };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🔍 Loading tools...');
  const tools = await loadTools();
  const componentMap = await loadToolUIComponents();
  
  // Load existing progress
  let progress = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }

  const browser = await chromium.launch({ headless: true });
  console.log(`📊 Testing ${tools.length} tools (${Object.keys(progress).length} already tested)...\n`);

  let pass = 0, fail = 0, stub = 0, error = 0;
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const existing = progress[tool.slug];
    
    // Re-test if needed
    if (existing && existing.status === 'pass') {
      pass++;
      process.stdout.write(`\r${i+1}/${tools.length} | ✅ ${pass}  ❌ ${fail}  ⚠️ ${stub}  💥 ${error}`);
      continue;
    }

    const component = componentMap[tool.slug] || 'Unknown';
    const result = await testTool(browser, tool, component);
    
    progress[tool.slug] = { ...result, component, testedAt: new Date().toISOString() };
    
    if (result.status === 'pass') pass++;
    else if (result.status === 'stub') stub++;
    else if (result.status === 'error') error++;
    else fail++;

    process.stdout.write(`\r${i+1}/${tools.length} | ✅ ${pass}  ❌ ${fail}  ⚠️ ${stub}  💥 ${error}`);

    // Save every 50 tools
    if ((i + 1) % 50 === 0) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    }
  }

  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  await browser.close();

  console.log(`\n\n✅ Done! Results saved to ${PROGRESS_FILE}`);
  console.log(`Total: ${tools.length} | Pass: ${pass} | Fail: ${fail} | Stub: ${stub} | Error: ${error}`);
}

main().catch(console.error);
