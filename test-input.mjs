import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://toolblip.com/tools/case-converter', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

// Check initial state
const taInit = await page.$('textarea');
console.log('Initial textarea value via $eval:', await page.$eval('textarea', el => el.value));

// Try fill
await page.locator('textarea').first().fill('helloWorld');
await page.waitForTimeout(1000);

const taVal = await page.$eval('textarea', el => el.value);
console.log('After fill textarea value:', taVal);

// Check output
const body = await page.textContent('body');
const hasUpper = body.includes('HELLOWORLD');
const hasLower = body.includes('helloworld');
console.log('Has HELLOWORLD:', hasUpper);
console.log('Has helloworld:', hasLower);

await browser.close();
