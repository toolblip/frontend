import type { Metadata } from 'next';
import { Suspense } from 'react';
import DirectoryClient from './DirectoryClient';

export const metadata: Metadata = {
  title: 'Tool Directory',
  description:
    'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  openGraph: {
    title: 'Tool Directory | Toolblip',
    description:
      'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Tool Directory | Toolblip',
    description:
      'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  },
};

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryClient />
    </Suspense>
  );
}
