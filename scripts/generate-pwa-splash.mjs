// Regenerates public/splash/*.png from the app icon. Needs ImageMagick (`magick`).
// Run after changing the icon or lib/pwa-splash-screens.mjs: node scripts/generate-pwa-splash.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { PWA_SPLASH_SCREENS } from '../lib/pwa-splash-screens.mjs';

const BACKGROUND = '#1c1c1e'; // the icon's own background, so its edge does not show

mkdirSync('public/splash', { recursive: true });
for (const { url, width, height } of PWA_SPLASH_SCREENS) {
  const logo = Math.round(Math.min(width, height) * 0.28);
  execFileSync('magick', [
    'public/icons/icon-512.png',
    '-background', BACKGROUND, '-alpha', 'remove', '-alpha', 'off',
    '-resize', `${logo}x${logo}`,
    '-gravity', 'center', '-extent', `${width}x${height}`,
    '-colors', '64', '-strip', '-define', 'png:compression-level=9',
    `public${url}`,
  ]);
}
console.log(`Wrote ${PWA_SPLASH_SCREENS.length} splash screens to public/splash`);
