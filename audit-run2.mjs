import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const TOOLBLIP_URL = 'https://toolblip.com';

const TEST_CASES = {
  'json-formatter': { input: '{"name":"Ada","age":36}', check: (o) => o.includes('"name"'), label: 'JSON formatted' },
  'json-to-markdown-table': { input: '[{"name":"Ada","age":36}]', check: (o) => o.includes('| name |'), label: 'Markdown table' },
  'yaml-to-json': { input: 'name: Ada\\nage: 36', check: (o) => o.includes('"name"'), label: 'YAML→JSON' },
  'json-to-yaml': { input: '{"name":"Ada","age":36}', check: (o) => o.includes('name:'), label: 'JSON→YAML' },
  'sql-to-json': { input: "INSERT INTO u (id,name) VALUES(1,'Ada')", check: (o) => o.includes('"id"'), label: 'SQL→JSON' },
  'url-encode': { input: 'hello world & foo=bar', check: (o) => o.includes('%20'), label: 'URL encode' },
  'case-converter': { input: 'helloWorld', check: (o) => o.includes('HELLOWORLD'), label: 'Case convert' },
  'word-counter': { input: 'The quick brown fox jumps over the lazy dog', check: (o) => /9/.test(o), label: 'Word count' },
  'character-counter': { input: 'Hello', check: (o) => /5/.test(o), label: 'Char count' },
  'regex-tester': { input: 'hello world', check: (o) => o.length > 0, label: 'Regex tested' },
  'regex-escape': { input: 'hello.world', check: (o) => o.includes('\\.'), label: 'Regex escape' },
  'hash-from-text': { input: 'hello', check: (o) => /^[0-9a-f]{32,}$/i.test(o.replace(/\s/g,'')), label: 'Hash generated' },
  'css-minifier': { input: '.foo { color: red; }', check: (o) => !o.includes('\\n') && !o.includes('  '), label: 'CSS minified' },
  'jwt-decoder': { input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.doz1N3clOX4xw0Hl09VvKqBFMuW4H_7Z-dGxFI6t0k8', check: (o) => o.includes('1234567890') || o.includes('Jane Doe'), label: 'JWT decoded' },
  'xml-formatter': { input: '<root><item id="1">Hello</item></root>', check: (o) => o.includes('<item') && o.includes('id="1"'), label: 'XML formatted' },
  'cron-parser': { input: '0 9 * * *', check: (o) => o.toLowerCase().includes('day') || o.includes('9:00'), label: 'Cron parsed' },
  'markdown-to-html': { input: '# Hello World', check: (o) => o.includes('<h1') || o.includes('Hello'), label: 'Markdown→HTML' },
  'meta-tag-generator': { input: 'My Page', check: (o) => o.includes('<title>'), label: 'Meta tags generated' },
  'url-slug-generator': { input: 'My Blog Post!', check: (o) => o.includes('my-blog-post'), label: 'URL slug' },
  'color-palette-generator': { input: '#3498db', check: (o) => o.length > 0, label: 'Color palette' },
  'age-calculator': { input: '1990-01-01', check: (o) => /\\d{2,3}/.test(o), label: 'Age calculated' },
  'binary-to-text': { input: '01001000 01100101', check: (o) => o.toLowerCase().includes('he'), label: 'Binary decode' },
  'number-to-words': { input: '42', check: (o) => o.toLowerCase().includes('forty'), label: 'Number to words' },
  'readability-score': { input: 'The cat sat. The dog ran. A nice day.', check: (o) => /\\d/.test(o), label: 'Readability score' },
  'html-encoder': { input: '<div>Hello & "World"</div>', check: (o) => o.includes('&lt;') || o.includes('&amp;'), label: 'HTML encoded' },
  'base64-encoder-decoder': { input: 'Hello!', check: (o) => /^[A-Za-z0-9+/]/.test(o.replace(/\\s/g,'')), label: 'Base64 encoded' },
  'html-encoder-decoder': { input: '<p>Test & more</p>', check: (o) => o.includes('&lt;') || o.includes('&amp;'), label: 'HTML enc/dec' },
  'regex-explainer': { input: '^\\w+$', check: (o) => o.length > 10, label: 'Regex explain' },
  'password-generator': { input: '', check: (o) => o.length >= 8, label: 'Password generated' },
  'uuid-generator': { input: '', check: (o) => /[0-9a-f]{8}/i.test(o), label: 'UUID generated' },
  'random-number-generator': { input: '', check: (o) => /\\d/.test(o), label: 'Random number' },
};

async function testTool(page, slug, tc) {
  const url = `${TOOLBLIP_URL}/tools/${slug}`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Wait for React to hydrate
    await page.waitForSelector('textarea', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const bodyText = await page.textContent('body');
    if (bodyText.includes('Configure and use this tool') || bodyText.includes('Coming Soon')) {
      return { status: 'stub' };
    }
    
    const sel = await page.locator('textarea[class*="tb-v2-tool-textarea"]').count() > 0
      ? 'textarea[class*="tb-v2-tool-textarea"]'
      : await page.locator('textarea').count() > 0 ? 'textarea' : 'input[type="text"]';
    
    if (await page.locator(sel).count() === 0) {
      return { status: 'no-input' };
    }
    
    if (tc.input) {
      await page.locator(sel).first().fill(tc.input);
      await page.waitForTimeout(1000);
    }
    
    const actionBtn = await page.$('button:has-text("Generate"), button:has-text("Convert"), button:has-text("Process"), button:has-text("Encode"), button:has-text("Decode"), button:has-text("Parse"), button:has-text("Test"), button:has-text("Run"), button:has-text("Check"), button:has-text("Calculate")');
    if (actionBtn) { await actionBtn.click(); await page.waitForTimeout(1500); }
    
    // ─── Read output ──────────────────────────────────────────────────────────
    // Read whatever output-body contains (works for pre, span, div, etc.)
    let output = '';
    const bodyEl = await page.$('.tb-v2-tool-output-body');
    if (bodyEl) {
      output = await bodyEl.textContent() || '';
      output = output.replace(/Copy/gi, '').trim(); // Remove "Copy" button labels
    } else {
      // Fallback: any <pre> with content
      const allPres = await page.$$('pre');
      for (const pre of allPres) {
        const text = await pre.textContent() || '';
        if (text.length > 0 && text !== '—') {
          output = text;
          break;
        }
      }
    }
    
    if (tc.check(output || '')) return { status: 'pass', output: output.slice(0, 200) };
    return { status: 'fail', output: output.slice(0, 200), expected: tc.label };
  } catch (e) {
    return { status: 'error', error: e.message.slice(0, 100) };
  }
}

async function main() {
  const results = [];
  const slugs = Object.keys(TEST_CASES);
  
  // Process in small batches
  const BATCH_SIZE = 5;
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Batch: ${batch.join(', ')} ---`);
    const browser = await chromium.launch({ headless: true });
    
    for (const slug of batch) {
      const page = await browser.newPage();
      const result = await testTool(page, slug, TEST_CASES[slug]);
      console.log(`  ${slug}: ${result.status.toUpperCase()}${result.output ? ' | ' + result.output.slice(0,60) : ''}`);
      results.push({ slug, ...result });
      await page.close();
    }
    
    await browser.close();
    console.log(`Progress: ${results.length}/${slugs.length}`);
  }
  
  writeFileSync('/Users/ray/Work/toolblip/audit-results.json', JSON.stringify(results, null, 2));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errors = results.filter(r => ['error','no-input','stub','crash'].includes(r.status)).length;
  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed, ${errors} errors ===`);
}

main().catch(console.error);
