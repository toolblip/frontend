import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Tool | Toolblip',
  description: 'Submit a useful browser-based tool to the Toolblip community directory for review.',
  alternates: {
    canonical: 'https://toolblip.com/submit-tool',
  },
  // Account-funnel/form page with no unique content for a searcher to land
  // on — keep it out of the index but let link equity flow through.
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Submit a Tool | Toolblip',
    description: 'Submit a useful browser-based tool to the Toolblip community directory for review.',
    url: 'https://toolblip.com/submit-tool',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Submit a Tool | Toolblip',
    description: 'Submit a useful browser-based tool to the Toolblip community directory for review.',
  },
};

export default function SubmitToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
