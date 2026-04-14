// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Purely static output  -  CF Pages serves dist/ directly.
// API calls are proxied via functions/_middleware.ts (CF Pages Function, separate from Astro).
export default defineConfig({
  output: 'static',
  site: 'https://toolblip.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
