import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => {
  if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text().slice(0, 200));
});

const slug = 'json-to-markdown-table';
const input = '[{"name":"Ada","age":36}]';

await page.goto(`https://toolblip.com/tools/${slug}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForSelector('textarea', { timeout: 10000 });
await page.waitForTimeout(3000);

// Check page state before interaction
const before = await page.evaluate(() => {
  const textarea = document.querySelector('textarea');
  return {
    textareaValue: textarea?.value,
    textareaTag: textarea?.tagName,
    outputPre: document.querySelector('.tb-v2-tool-output-body pre')?.textContent || 'EMPTY',
    outputBody: document.querySelector('.tb-v2-tool-output-body')?.textContent || 'NO OUTPUT BODY',
    bodyHTML: document.body.innerHTML.slice(0, 1000)
  };
});
console.log('BEFORE CLICK:', JSON.stringify(before, null, 2));

// Click the Convert button
const btn = await page.locator('button').filter({ hasText: 'Convert' }).first();
console.log('Button found:', !!btn);
await btn.click();
await page.waitForTimeout(2000);

// Check page state after
const after = await page.evaluate(() => {
  const textarea = document.querySelector('textarea');
  return {
    textareaValue: textarea?.value,
    outputPre: document.querySelector('.tb-v2-tool-output-body pre')?.textContent || 'EMPTY',
    outputBody: document.querySelector('.tb-v2-tool-output-body')?.textContent || 'NO OUTPUT BODY',
    allPre: Array.from(document.querySelectorAll('pre')).map(p => p.textContent.slice(0, 80)),
    allDivs: Array.from(document.querySelectorAll('div')).filter(d => d.textContent.includes('| name |') || d.textContent.includes('| Ada |')).map(d => d.className + ': ' + d.textContent.slice(0, 100))
  };
});
console.log('AFTER CLICK:', JSON.stringify(after, null, 2));

await browser.close();
