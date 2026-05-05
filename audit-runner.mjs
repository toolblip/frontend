#!/usr/bin/env node
/**
 * Toolblip Tool Audit - Playwright Test Runner
 * Tests client-side tools for functional correctness via headless browser
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLBLIP_URL = 'https://toolblip.com';
const OUTFILE = join(__dirname, 'audit-results.json');

// ─── Test Vectors ────────────────────────────────────────────────────────────
const TEST_CASES = {
  // JSON tools
  'json-formatter': {
    input: '{"name":"Ada","age":36}',
    check: (output) => output.includes('"name"') && output.includes('"Ada"'),
    label: 'JSON formatted'
  },
  'json-to-markdown-table': {
    input: '[{"name":"Ada","age":36},{"name":"Grace","age":85}]',
    check: (output) => output.includes('| name |') && output.includes('| Ada |'),
    label: 'Markdown table generated'
  },
  'json-compare': {
    input: '[[1,2],[3,4]]',
    check: (output) => output.length > 0,
    label: 'JSON compared'
  },
  // YAML
  'yaml-to-json': {
    input: 'name: Ada\\nage: 36',
    check: (output) => output.includes('"name"') && output.includes('Ada'),
    label: 'YAML → JSON converted'
  },
  'json-to-yaml': {
    input: '{"name":"Ada","age":36}',
    check: (output) => output.includes('name:') && output.includes('Ada'),
    label: 'JSON → YAML converted'
  },
  // SQL
  'sql-to-json': {
    input: "INSERT INTO users (id, name) VALUES (1, 'Ada')",
    check: (output) => output.includes('"id"') && output.includes('Ada'),
    label: 'SQL → JSON parsed'
  },
  // Generator tools
  'uuid-generator': {
    input: '',
    check: (output) => /[0-9a-f]{8}-[0-9a-f]{4}-/i.test(output),
    label: 'Valid UUID produced'
  },
  'random-number-generator': {
    input: '',
    check: (output) => /\d+/.test(output),
    label: 'Number generated'
  },
  // Encoding/Decoding
  'url-encode': {
    input: 'hello world & foo=bar',
    check: (output) => output.includes('%20') && output.includes('%26'),
    label: 'URL encoded'
  },
  'html-encoder': {
    input: '<div class="test">Hello & World</div>',
    check: (output) => output.includes('&lt;') && output.includes('&amp;'),
    label: 'HTML encoded'
  },
  'base64-encoder-decoder': {
    input: 'Hello, World!',
    check: (output) => /^[A-Za-z0-9+/=]+$/.test(output.replace(/\s/g,'')),
    label: 'Base64 encoded'
  },
  'html-encoder-decoder': {
    input: '<p>Hello & "World"</p>',
    check: (output) => output.includes('&lt;') || output.includes('&amp;'),
    label: 'HTML encoded'
  },
  // Case conversion
  'case-converter': {
    input: 'helloWorld',
    check: (output) => output.length > 0,
    label: 'Case converted'
  },
  // Binary/Number
  'binary-to-text': {
    input: '01001000 01100101 01101100 01101100 01101111',
    check: (output) => output.toLowerCase().includes('hello'),
    label: 'Binary decoded'
  },
  'number-to-words': {
    input: '42',
    check: (output) => output.toLowerCase().includes('forty'),
    label: 'Number to words'
  },
  // Date/Time
  'age-calculator': {
    input: '1990-01-01',
    check: (output) => /\d+/.test(output),
    label: 'Age calculated'
  },
  'date-calculator': {
    input: '2024-01-15 + 30 days',
    check: (output) => output.length > 0,
    label: 'Date calculated'
  },
  // Text analysis
  'word-counter': {
    input: 'The quick brown fox jumps over the lazy dog',
    check: (output) => /9|9 words/i.test(output),
    label: 'Word count correct'
  },
  'character-counter': {
    input: 'Hello',
    check: (output) => /5|5 characters/i.test(output),
    label: 'Char count correct'
  },
  'readability-score': {
    input: 'The cat sat on the mat. It was a nice day. The dog barked loudly.',
    check: (output) => /\d+\.\d+/.test(output),
    label: 'Score produced'
  },
  // Regex
  'regex-tester': {
    input: 'hello world',
    check: (output) => output.length > 0,
    label: 'Regex tested'
  },
  'regex-explainer': {
    input: '^\\w+$',
    check: (output) => output.length > 0,
    label: 'Regex explained'
  },
  'regex-escape': {
    input: 'hello.world',
    check: (output) => output.includes('\\.'),
    label: 'Regex escaped'
  },
  // JWT
  'jwt-decoder': {
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    check: (output) => output.includes('Jan') || output.includes('1234567890') || output.includes('Jane Doe'),
    label: 'JWT decoded'
  },
  // Hash
  'hash-from-text': {
    input: 'hello',
    check: (output) => /^[0-9a-f]{32,64}$/i.test(output.replace(/\s/g,'')),
    label: 'Hash generated'
  },
  // XML
  'xml-formatter': {
    input: '<root><item id="1">Hello</item></root>',
    check: (output) => output.includes('<root>') && output.includes('id="1"'),
    label: 'XML formatted'
  },
  // CSS
  'css-minifier': {
    input: '.foo { color: red; background: blue; }',
    check: (output) => !output.includes('\\n\\n') && (output.includes('color:red') || output.includes('color: red')),
    label: 'CSS minified'
  },
  // Security
  'password-generator': {
    input: '',
    check: (output) => output.length >= 8,
    label: 'Password generated'
  },
  // Cron
  'cron-parser': {
    input: '0 9 * * *',
    check: (output) => output.toLowerCase().includes('day') || output.toLowerCase().includes('9:00') || output.toLowerCase().includes('am'),
    label: 'Cron parsed'
  },
  // Markdown
  'markdown-to-html': {
    input: '# Hello World',
    check: (output) => output.includes('<h1') || output.includes('Hello'),
    label: 'Markdown converted'
  },
  // SEO
  'meta-tag-generator': {
    input: 'My Page Title',
    check: (output) => output.length > 0,
    label: 'Meta tags generated'
  },
  'url-slug-generator': {
    input: 'My Blog Post Title!',
    check: (output) => output.includes('my-blog-post-title'),
    label: 'URL slug generated'
  },
  // Color
  'color-palette-generator': {
    input: '#3498db',
    check: (output) => output.length > 0,
    label: 'Color palette generated'
  },
};

// ─── Tool Loader ────────────────────────────────────────────────────────────
function loadToolsFromData() {
  const toolsFile = join(__dirname, 'data/tools.ts');
  const content = readFileSync(toolsFile, 'utf8');
  const tools = [];
  const regex = /\{\s*name:?'([^']+)'.?slug:?'([^']+)'.?description:?'([^']+)'.?emoji:?'([^']+)'.?category:?'([^']+)'/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    tools.push({ name: m[1], slug: m[2], description: m[3], emoji: m[4], category: m[5] });
  }
  return tools;
}

// ─── Browser Test ───────────────────────────────────────────────────────────
async function testTool(page, slug, testCase) {
  const url = `${TOOLBLIP_URL}/tools/${slug}`;
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    
    const bodyText = await page.textContent('body');
    
    if (bodyText.includes('Configure and use this tool') || bodyText.includes('Coming Soon')) {
      return { status: 'stub', error: null };
    }
    
    // ─── Find input element ────────────────────────────────────────────────────
    // Priority: specific textarea > generic textarea > input[type=text]
    const taLocator = page.locator('textarea[class*="tb-v2-tool-textarea"]');
    const genericTaLocator = page.locator('textarea').first();
    const inputLocator = page.locator('input[type="text"]').first();
    
    let inputSel = 'textarea[class*="tb-v2-tool-textarea"]';
    let el = await taLocator.elementHandle();
    if (!el) {
      inputSel = 'textarea';
      el = await genericTaLocator.elementHandle();
    }
    if (!el) {
      inputSel = 'input[type="text"]';
      el = await inputLocator.elementHandle();
    }
    if (!el) {
      return { status: 'no-input', error: 'No input found' };
    }
    
    // ─── Fill input ────────────────────────────────────────────────────────────
    // Use first found textarea or input
    const taSel = 'textarea[class*="tb-v2-tool-textarea"]';
    const taCount = await page.locator(taSel).count();
    let sel = taCount > 0 ? taSel : 'textarea';
    if (await page.locator(sel).count() === 0) sel = 'input[type="text"]';
    if (await page.locator(sel).count() === 0) {
      return { status: 'no-input', error: 'No input found' };
    }
    
    if (testCase.input) {
      await page.locator(sel).first().fill(testCase.input);
      await page.waitForTimeout(1000);
    }
    
    // ─── Action button (for imperative tools) ─────────────────────────────────
    // If there's a button that says Generate/Convert/etc, click it
    const actionBtn = await page.$('button:has-text("Generate"), button:has-text("Convert"), button:has-text("Process"), button:has-text("Encode"), button:has-text("Decode"), button:has-text("Parse"), button:has-text("Test"), button:has-text("Run"), button:has-text("Check"), button:has-text("Calculate")');
    if (actionBtn) {
      await actionBtn.click();
      await page.waitForTimeout(1500);
    }
    
    // ─── Read output ──────────────────────────────────────────────────────────
    // Strategy: try <pre> first, then the full output-body div
    let output = '';
    const preEl = await page.$('.tb-v2-tool-output-body pre');
    if (preEl) {
      output = await preEl.textContent() || '';
    } else {
      // Get all text from output body (handles span-based outputs like case-converter)
      const outputBody = await page.$('.tb-v2-tool-output-body');
      if (outputBody) {
        output = await outputBody.textContent() || '';
      }
    }
    
    if (testCase.check(output || '')) {
      return { status: 'pass', output: (output || '').slice(0, 200) };
    } else {
      return { status: 'fail', output: (output || '').slice(0, 200), expected: testCase.label };
    }
  } catch (e) {
    return { status: 'error', error: e.message.slice(0, 150) };
  } finally {
    await page.close();
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('Loading tools from data/tools.ts...\n');
  const tools = loadToolsFromData();
  console.log(`Loaded ${tools.length} tools\n`);
  
  const BATCH = 10; // Restart browser every N tools to avoid memory leaks
  const slugs = Object.keys(TEST_CASES);
  const results = [];
  
  for (let batchStart = 0; batchStart < slugs.length; batchStart += BATCH) {
    const browser = await chromium.launch({ headless: true });
    const batch = slugs.slice(batchStart, batchStart + BATCH);
    
    console.log(`\n--- Batch ${Math.floor(batchStart/BATCH)+1}: ${batch.join(', ')} ---\n`);
    
    for (const slug of batch) {
      const page = await browser.newPage();
      const tc = TEST_CASES[slug];
      try {
        process.stdout.write(`Testing ${slug}... `);
        const result = await testTool(page, slug, tc);
        console.log(result.status.toUpperCase());
        results.push({ slug, label: tc.label, ...result });
      } catch (e) {
        console.log(`CRASH: ${e.message.slice(0, 80)}`);
        results.push({ slug, label: tc.label, status: 'crash', error: e.message.slice(0, 100) });
      } finally {
        await page.close();
      }
    }
    
    await browser.close();
    console.log(`\nBatch complete. Total progress: ${results.length}/${slugs.length}\n`);
  }
  
  writeFileSync(OUTFILE, JSON.stringify(results, null, 2));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errors = results.filter(r => ['error','no-input','stub'].includes(r.status)).length;
  
  console.log(`\\n=== SUMMARY ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Errors/no-input/stubs: ${errors}`);
  console.log(`Results saved to ${OUTFILE}`);
}

main().catch(console.error);
