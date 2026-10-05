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
