import type { Metadata } from 'next';
import { Suspense } from 'react';
import DirectoryClient from './DirectoryClient';

// DirectoryClient filters client-side only (query params like ?cat= or
// ?q= are never read server-side or by the client), so there's nothing
// request-specific to render here. Force static generation instead of
// re-rendering all 1,500+ tools on every request, and let the fixed
// canonical URL below consolidate any query-string variants for SEO
// instead of computing a per-request noindex flag.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Tool Directory | Toolblip',
  description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  alternates: {
    canonical: 'https://toolblip.com/directory',
  },
  openGraph: {
    title: 'Tool Directory | Toolblip',
    description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Tool Directory | Toolblip',
    description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  },
};

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryClient />
    </Suspense>
  );
}
