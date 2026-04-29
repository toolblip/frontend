import { Suspense } from 'react';
import DirectoryClient from './DirectoryClient';

export const metadata = {
  title: 'Tool Directory — All Free Tools | Toolblip',
  description: 'Browse all free tools on Toolblip. Search and filter by category — text, developer, image, encoder, and more.',
  openGraph: {
    title: 'Tool Directory — All Free Tools | Toolblip',
    description: 'Browse all free tools on Toolblip. Search and filter by category — text, developer, image, encoder, and more.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tool Directory — All Free Tools | Toolblip',
    description: 'Browse all free tools on Toolblip. Search and filter by category — text, developer, image, encoder, and more.',
  },
};

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <DirectoryClient />
    </Suspense>
  );
}
