import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const slug = 'case-converter';
const testCase = {
  input: 'helloWorld',
  check: (output) => output.toLowerCase().includes('helloworld'),
  label: 'Case converted'
};

const url = `https://toolblip.com/tools/${slug}`;

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(3000);

const bodyText = await page.textContent('body');
console.log('Is stub:', bodyText.includes('Configure and use this tool') || bodyText.includes('Coming Soon'));

// Find textarea
const taCount = await page.locator('textarea').count();
const inputCount = await page.locator('input[type="text"]').count();
const specificTa = await page.locator('textarea[class*="tb-v2-tool-textarea"]').count();
console.log(`Textareas: ${taCount}, specific: ${specificTa}, inputs: ${inputCount}`);

let sel = 'textarea';
if (specificTa > 0) sel = 'textarea[class*="tb-v2-tool-textarea"]';
else if (taCount === 0) sel = 'input[type="text"]';
console.log('Using selector:', sel);

// Fill
await page.locator(sel).first().fill('helloWorld');
await page.waitForTimeout(1000);

// Verify fill
const val = await page.$eval(sel, el => el.value);
console.log('Filled value:', JSON.stringify(val));

// Action button
const actionBtn = await page.$('button:has-text("Generate"), button:has-text("Convert"), button:has-text("Process"), button:has-text("Encode"), button:has-text("Decode"), button:has-text("Parse"), button:has-text("Test"), button:has-text("Run"), button:has-text("Check"), button:has-text("Calculate")');
console.log('Action button found:', actionBtn ? await actionBtn.textContent() : 'none');
if (actionBtn) {
  await actionBtn.click();
  await page.waitForTimeout(1500);
}

// Read output
const preEl = await page.$('.tb-v2-tool-output-body pre');
const output = preEl ? await preEl.textContent() : '';
console.log('Output pre content:', JSON.stringify(output.slice(0, 200)));
console.log('Check result:', testCase.check(output));

await browser.close();
