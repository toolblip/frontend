import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import SponsorsClient from './SponsorsClient';

// SponsorsClient fetches the live leaderboard client-side (same reasoning
// as /directory: nothing request-specific to render server-side), so the
// shell can be statically generated.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sponsors | Toolblip',
  description: 'Bid for a top-3 sponsor spot shown on every Toolblip page. Rank is decided by bid amount; unclaimed credit rolls over to next month.',
  alternates: {
    canonical: 'https://toolblip.com/sponsors',
  },
  openGraph: {
    title: 'Sponsors | Toolblip',
    description: 'Bid for a top-3 sponsor spot shown on every Toolblip page. Rank is decided by bid amount; unclaimed credit rolls over to next month.',
    url: 'https://toolblip.com/sponsors',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Sponsors | Toolblip',
    description: 'Bid for a top-3 sponsor spot shown on every Toolblip page. Rank is decided by bid amount; unclaimed credit rolls over to next month.',
  },
};

export default function SponsorsPage() {
  return (
    <Suspense>
      <SponsorsClient />
      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8, marginBottom: 24 }}>
        <Link href="/sponsors/archive" style={{ color: 'var(--fg-2)', textDecoration: 'underline' }}>
          View the monthly archive
        </Link>
      </p>
    </Suspense>
  );
}
