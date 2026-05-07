#!/usr/bin/env node
/**
 * Toolblip Full Functionality Audit v3
 * Smart browser-based audit: loads page, checks for working UI + output
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLBLIP_URL = 'https://toolblip.com';
const OUTFILE = join(ROOT, 'audit-full-results.json');
const PROGRESS_FILE = join(ROOT, 'audit-progress.json');

// ─── Load tools ───────────────────────────────────────────────────────────────
function loadAllTools() {
  const content = readFileSync(join(ROOT, 'data/tools.ts'), 'utf8');
  const regex = /\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*description:\s*'([^']+)',\s*emoji:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
  const tools = [];
  let m;
  while ((m = regex.exec(content)) !== null) tools.push({ name: m[1], slug: m[2] });
  return tools;
}

function loadComponentMap() {
  const content = readFileSync(join(ROOT, 'app/tools/[slug]/ToolUI.tsx'), 'utf8');
  const map = {};
  const regex = /case\s+'([^']+)':\s*\n\s*return\s*<(\w+)/g;
  let m;
  while ((m = regex.exec(content)) !== null) map[m[1]] = m[2];
  return map;
}

// ─── Test patterns per component ─────────────────────────────────────────────
const TEST_CASES = {
  JsonFormatter:          { type: 'textarea', input: '{"name":"Ada","age":36}', check: (o) => o.includes('"name"') },
  JsonToMarkdownTable:    { type: 'textarea', input: '[{"name":"Ada","age":36}]', check: (o) => o.includes('| name |') },
  JsonToYaml:             { type: 'textarea', input: '{"name":"Ada","age":36}', check: (o) => o.includes('name:') },
  YamlToJson:             { type: 'textarea', input: 'name: Ada\nage: 36', check: (o) => o.includes('"name"') },
  SqlToJson:              { type: 'textarea', input: "INSERT INTO u(id) VALUES(1)", check: (o) => o.length > 0 },
  JsonCompare:            { type: 'textarea', input: '[[1,2],[3,4]]', check: (o) => o.length > 0 },
  XmlFormatter:           { type: 'textarea', input: '<root><item id="1">Hello</item></root>', check: (o) => o.includes('<root>') },
  XmlToJson:              { type: 'textarea', input: '<root><item>Hello</item></root>', check: (o) => o.length > 0 },
  JsonToXml:              { type: 'textarea', input: '{"root":{"item":"Hello"}}', check: (o) => o.includes('<root>') },
  HtmlEncoder:            { type: 'textarea', input: '<div>Hello & World</div>', check: (o) => o.includes('&lt;') || o.includes('&amp;') },
  HtmlEncoderDecoder:      { type: 'textarea', input: '<p>Test & more</p>', check: (o) => o.includes('&lt;') || o.includes('&amp;') },
  CssMinifier:            { type: 'textarea', input: '.foo { color: red; }', check: (o) => o.includes('color:red') || o.includes('color: red') },
  UrlEncode:              { type: 'textarea', input: 'hello world & foo=bar', check: (o) => o.includes('%20') && o.includes('%26') },
  Base64EncoderDecoder:   { type: 'textarea', input: 'Hello, World!', check: (o) => /^[A-Za-z0-9+/=]+$/.test(o.replace(/\s/g,'')) },
  HashFromText:           { type: 'textarea', input: 'hello', check: (o) => /^[0-9a-f]{32,}$/i.test(o.replace(/\s/g,'')) },
  CaseConverter:          { type: 'textarea', input: 'helloWorld', check: (o) => o.length > 0 },
  WordCounter:            { type: 'textarea', input: 'The quick brown fox jumps over the lazy dog', check: (o) => /9/.test(o) },
  CharacterCounter:       { type: 'textarea', input: 'Hello', check: (o) => /5/.test(o) },
  BinaryToText:          { type: 'textarea', input: '01001000 01100101 01101100', check: (o) => o.toLowerCase().includes('hel') },
  NumberToWords:          { type: 'textarea', input: '42', check: (o) => o.toLowerCase().includes('forty') },
  ReadabilityScore:       { type: 'textarea', input: 'The cat sat. The dog ran. A nice day.', check: (o) => /\d/.test(o) },
  RegexTester:            { type: 'textarea', input: 'hello world', check: (o) => o.length > 0 },
  RegexExplainer:         { type: 'textarea', input: '^\\w+$', check: (o) => o.length > 10 },
  RegexEscape:            { type: 'textarea', input: 'hello.world', check: (o) => o.includes('\\.') },
  JwtDecoder:             { type: 'textarea', input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.doz1N3clOX4xw0Hl09VvKqBFMuW4H_7Z-dGxFI6t0k8', check: (o) => o.length > 0 },
  AgeCalculator:          { type: 'input', input: '1990-01-01', check: (o) => /\d{2,3}/.test(o) },
  DateCalculator:        { type: 'input', input: '2024-01-15', check: (o) => o.length > 0 },
  CronParser:            { type: 'input', input: '0 9 * * *', check: (o) => o.toLowerCase().includes('day') },
  MarkdownToHtml:        { type: 'textarea', input: '# Hello World', check: (o) => o.includes('<h1') || o.includes('Hello') },
  MetaTagGenerator:       { type: 'input', input: 'My Page Title', check: (o) => o.includes('<title>') || o.length > 0 },
  UrlSlugGenerator:       { type: 'input', input: 'My Blog Post Title!', check: (o) => o.includes('my-blog') },
  UuidGenerator:          { type: 'button', input: '', check: (o) => /[0-9a-f]{8}-/i.test(o) },
  RandomNumberGenerator:  { type: 'button', input: '', check: (o) => /\d+/.test(o) },
  PasswordGenerator:      { type: 'button', input: '', check: (o) => o.length >= 8 },
  ColorPaletteGenerator:  { type: 'button', input: '', check: (o) => o.length > 0 },
  JsonLdGenerator:        { type: 'textarea', input: '{"@type":"Person"}', check: (o) => o.includes('"@type"') || o.length > 0 },
  RobotsTxtGenerator:     { type: 'input', input: 'https://example.com', check: (o) => o.includes('User-agent') || o.length > 0 },
  SecurityHeadersGenerator: { type: 'input', input: 'https://example.com', check: (o) => o.length > 0 },
  HashIdentifier:         { type: 'input', input: '5d41402abc4b2a76b9719d911017c592', check: (o) => o.length > 0 },
  LoremIpsumGenerator:    { type: 'auto', check: (o) => o.length > 10 && /[a-z]/i.test(o) },
  TextStatistics:         { type: 'auto', check: (o) => /\d/.test(o) },
  PunctuationFixer:       { type: 'auto', check: (o) => o.length > 0 },
};

function getTestCase(component) {
  const base = component.replace(/Client$/, '');
  return TEST_CASES[base] || TEST_CASES.Default || { type: 'auto', check: (o) => o.length > 0 };
}

// ─── Core test ───────────────────────────────────────────────────────────────
async function testTool(page, slug, component) {
  const url = `${TOOLBLIP_URL}/tools/${slug}`;
  const tc = getTestCase(component);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3500); // React hydration

    const body = await page.textContent('body');

    // Stub pages
    if (body.includes('Coming Soon') || body.includes('Configure and use this tool')) {
      return { status: 'stub', output: '', component };
    }

    let output = '';

    // ── AUTO-GENERATED output tools (lorem ipsum etc.) ──────────────────────
    if (tc.type === 'auto') {
      // Wait for output to appear
      await page.waitForTimeout(2000);
      const outEl = await page.$('.tb-v2-tool-output-body');
      if (outEl) {
        output = (await outEl.textContent() || '').replace(/Copy/gi, '').trim();
      }
      if (tc.check(output)) {
        return { status: 'pass', output: output.slice(0, 100), component };
      } else {
        return { status: 'fail', output: output.slice(0, 100), expected: tc.check.toString().slice(0, 60), component };
      }
    }

    // ── INPUT-BASED tools ───────────────────────────────────────────────────
    // Find first input (textarea, input[type=text], or number input)
    const taSel = 'textarea[class*="tb-v2"], textarea';
    const inputSel = 'input[type="text"][class*="tb-v2"], input[type="text"]';
    const numSel = 'input[type="number"][class*="tb-v2"], input[type="number"]';

    let foundInput = false;

    // Fill textarea if this tool uses textarea
    if (tc.type === 'textarea') {
      const taCount = await page.locator(taSel).count();
      if (taCount > 0) {
        await page.locator(taSel).first().fill(tc.input || '');
        foundInput = true;
        await page.waitForTimeout(500);
      }
    }

    // Fill text input for input-type tools
    if (tc.type === 'input') {
      const inCount = await page.locator(inputSel).count();
      const numCount = await page.locator(numSel).count();
      if (inCount > 0) {
        await page.locator(inputSel).first().fill(tc.input || '');
        foundInput = true;
        await page.waitForTimeout(500);
      } else if (numCount > 0) {
        await page.locator(numSel).first().fill(tc.input || '');
        foundInput = true;
        await page.waitForTimeout(500);
      }
    }

    // Click action button if found
    const btnSel = 'button:has-text("Generate"), button:has-text("Convert"), button:has-text("Process"), button:has-text("Encode"), button:has-text("Decode"), button:has-text("Parse"), button:has-text("Test"), button:has-text("Run"), button:has-text("Check"), button:has-text("Calculate"), button:has-text("Format"), button:has-text("Fix"), button:has-text("Regenerate"), button:has-text("Create"), button:has-text("Submit")';
    const btn = await page.$(btnSel);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(2000);
    } else if (!foundInput) {
      // No input, no button - check if it auto-computed
      await page.waitForTimeout(1000);
    }

    // Read output
    const outEl = await page.$('.tb-v2-tool-output-body');
    if (outEl) {
      output = (await outEl.textContent() || '').replace(/Copy/gi, '').trim();
    } else {
      const pres = await page.$$('pre');
      for (const pre of pres) {
        const text = await pre.textContent() || '';
        if (text.trim().length > 0 && text.trim() !== '—') {
          output = text.trim();
          break;
        }
      }
    }

    if (tc.check(output || '')) {
      return { status: 'pass', output: output.slice(0, 150), component };
    } else {
      return { status: 'fail', output: output.slice(0, 150), expected: tc.check.toString().slice(0, 60), component };
    }
  } catch (e) {
    return { status: 'error', error: e.message.slice(0, 100), component };
  }
}

// ─── Progress ────────────────────────────────────────────────────────────────
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    try {
      const d = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
      return Array.isArray(d) ? d : [];
    } catch { return []; }
  }
  return [];
}

function saveProgress(results) { writeFileSync(PROGRESS_FILE, JSON.stringify(results, null, 2)); }

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('Loading...');
  const tools = loadAllTools();
  const compMap = loadComponentMap();
  console.log(`${tools.length} tools, ${Object.keys(compMap).length} components\n`);

  let results = loadProgress();
  const done = new Set(results.map(r => r.slug));
  const remaining = tools.filter(t => !done.has(t.slug));
  console.log(`${results.length} done, ${remaining.length} to test\n`);

  if (remaining.length === 0) { printSummary(results); return; }

  for (let i = 0; i < remaining.length; i++) {
    const tool = remaining[i];
    const comp = compMap[tool.slug] || 'Default';

    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    process.stdout.write(`[${i + 1}/${remaining.length}] ${tool.slug} (${comp})... `);
    const result = await testTool(page, tool.slug, comp);
    await page.close();
    await browser.close();

    console.log(result.status.toUpperCase());
    results.push({ slug: tool.slug, ...result });

    if ((i + 1) % 50 === 0) {
      saveProgress(results);
      const p = results.filter(r => r.status === 'pass').length;
      const f = results.filter(r => r.status === 'fail').length;
      const e = results.filter(r => ['error','no-input','stub'].includes(r.status)).length;
      console.log(`  📊 ${results.length}/${tools.length} | ✅${p} ❌${f} ⚠️${e}`);
    }
  }

  saveProgress(results);
  writeFileSync(OUTFILE, JSON.stringify(results, null, 2));
  printSummary(results);
}

function printSummary(results) {
  const p = results.filter(r => r.status === 'pass').length;
  const f = results.filter(r => r.status === 'fail').length;
  const s = results.filter(r => r.status === 'stub').length;
  const e = results.filter(r => r.status === 'error').length;
  const t = results.length;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`FULL AUDIT: ${t} tools`);
  console.log(`  ✅ PASS:  ${p} (${t ? ((p/t)*100).toFixed(1) : 0}%)`);
  console.log(`  ❌ FAIL:  ${f}`);
  console.log(`  🔖 STUB:  ${s}`);
  console.log(`  💥 ERROR: ${e}`);
  console.log(`${'='.repeat(50)}`);
  if (f > 0) {
    console.log(`\n❌ Failed:`);
    results.filter(r => r.status === 'fail').forEach(r => console.log(`  ${r.slug}: "${r.output}"`));
  }
  if (s > 0) {
    console.log(`\n🔖 Stubs: ${results.filter(r => r.status === 'stub').map(r => r.slug).slice(0, 30).join(', ')}`);
  }
  if (e > 0) {
    console.log(`\n💥 Errors:`);
    results.filter(r => r.status === 'error').forEach(r => console.log(`  ${r.slug}: ${r.error}`));
  }
}

main().catch(console.error);
