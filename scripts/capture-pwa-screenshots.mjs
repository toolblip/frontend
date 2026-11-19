// Regenerates public/screenshots/*.png for the manifest (Chrome's richer install dialog).
// Usage: node scripts/capture-pwa-screenshots.mjs [baseUrl]   (default https://toolblip.com)
// PW_CHROMIUM=/path/to/chromium uses a specific browser binary.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'https://toolblip.com';
// Chrome needs every screenshot of one form factor to share an aspect ratio.
const shots = [
  { file: 'desktop-home', path: '/', width: 1280, height: 720, scale: 1 },
  { file: 'desktop-json-formatter', path: '/tools/json-formatter', width: 1280, height: 720, scale: 1 },
  { file: 'phone-home', path: '/', width: 412, height: 892, scale: 2 },
  { file: 'phone-json-formatter', path: '/tools/json-formatter', width: 412, height: 892, scale: 2 },
];

mkdirSync('public/screenshots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: shot.scale,
    isMobile: shot.width < 600,
    hasTouch: shot.width < 600,
    colorScheme: 'light',
  });
  // No cookie banner, install chip or this month's sponsors in a long-lived image.
  await context.addInitScript(() => localStorage.setItem('toolblip_cookie_consent', 'declined'));
  const page = await context.newPage();
  await page.goto(base + shot.path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.tb-pwa-install,.tb-v2-sponsor-strip{display:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/screenshots/${shot.file}.png` });
  await context.close();
}
await browser.close();
console.log(`Wrote ${shots.length} screenshots to public/screenshots`);
