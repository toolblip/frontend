import type { MetadataRoute } from 'next';
import { webAppManifestUrl } from '@/lib/pwa-install';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Toolblip',
    short_name: 'Toolblip',
    description:
      'Free browser-based developer tools: JSON formatter, Base64, UUID generator, and more.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#1a1a1f',
    theme_color: '#1a1a1f',
    categories: ['developer', 'utilities', 'productivity'],
    prefer_related_applications: false,
    related_applications: [
      {
        platform: 'webapp',
        url: webAppManifestUrl(process.env.NEXT_PUBLIC_APP_URL),
      },
    ],
    // Chrome shows its richer install dialog only with a `wide` (desktop) and a
    // phone screenshot. Regenerate with scripts/capture-pwa-screenshots.mjs.
    screenshots: [
      {
        src: '/screenshots/desktop-home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Toolblip home page with a live word counter',
      },
      {
        src: '/screenshots/desktop-json-formatter.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'JSON Formatter tool',
      },
      {
        src: '/screenshots/phone-home.png',
        sizes: '824x1784',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Toolblip home page on a phone',
      },
      {
        src: '/screenshots/phone-json-formatter.png',
        sizes: '824x1784',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'JSON Formatter tool on a phone',
      },
    ],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
