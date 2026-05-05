import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text().slice(0, 200)));
page.on('pageerror', err => console.log('PAGE ERROR:', err.message.slice(0, 200)));

const slug = 'json-to-markdown-table';
await page.goto(`https://toolblip.com/tools/${slug}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForSelector('textarea', { timeout: 10000 });
await page.waitForTimeout(2000);

// Check initial state
const before = await page.evaluate(() => ({
  taValue: document.querySelector('textarea')?.value,
  outputSections: document.querySelectorAll('.tb-v2-tool-output-body, [class*="output"]').length,
}));
console.log('Before:', before);

// Use page.evaluate to set textarea value (React-compatible)
await page.evaluate(() => {
  const ta = document.querySelector('textarea');
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  nativeInputValueSetter.call(ta, '[{"name":"Ada","age":36}]');
  ta.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForTimeout(1000);

const afterInput = await page.evaluate(() => ({
  taValue: document.querySelector('textarea')?.value,
  outputSections: document.querySelectorAll('.tb-v2-tool-output-body').length,
}));
console.log('After input:', afterInput);

// Now click the button
await page.click('button:has-text("Convert")');
await page.waitForTimeout(2000);

const afterClick = await page.evaluate(() => ({
  taValue: document.querySelector('textarea')?.value,
  outputSections: document.querySelectorAll('.tb-v2-tool-output-body').length,
  outputPre: document.querySelector('.tb-v2-tool-output-body pre')?.textContent?.slice(0, 100) || 'EMPTY',
  allText: document.body.textContent.slice(0, 500),
}));
console.log('After click:', JSON.stringify(afterClick, null, 2));

await browser.close();
