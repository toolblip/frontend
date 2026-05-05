import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const slugs = ['case-converter', 'word-counter', 'yaml-to-json', 'regex-escape', 'jwt-decoder'];

for (const slug of slugs) {
  console.log(`\n=== ${slug} ===`);
  await page.goto(`https://toolblip.com/tools/${slug}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('textarea', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Check all buttons and inputs
  const info = await page.evaluate(() => ({
    buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()),
    textareaFound: !!document.querySelector('textarea'),
    inputFound: !!document.querySelector('input[type="text"]'),
  }));
  console.log('Buttons:', info.buttons);
  console.log('Has textarea:', info.textareaFound, '| Has input:', info.inputFound);
  
  // Try to fill and get output
  const sel = info.textareaFound ? 'textarea' : 'input[type="text"]';
  const testInputs = {
    'case-converter': 'helloWorld',
    'word-counter': 'The quick brown fox jumps over the lazy dog',
    'yaml-to-json': 'name: Ada\nage: 36',
    'regex-escape': 'hello.world',
    'jwt-decoder': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.doz1N3clOX4xw0Hl09VvKqBFMuW4H_7Z-dGxFI6t0k8',
  };
  
  await page.locator(sel).first().fill(testInputs[slug] || 'test');
  await page.waitForTimeout(500);
  
  const btn = info.buttons.find(b => b.includes('Generate') || b.includes('Convert') || b.includes('Process') || b.includes('Run') || b.includes('Test') || b.includes('Check'));
  if (btn) {
    await page.click(`button:has-text("${btn}")`);
    await page.waitForTimeout(1500);
  }
  
  const output = await page.evaluate(() => {
    const pres = Array.from(document.querySelectorAll('pre')).map(p => p.textContent.trim()).filter(t => t && t !== '—');
    return pres;
  });
  console.log('Output pre:', output.slice(0, 3));
}

await browser.close();
