import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'API Docs — Toolblip',
  description:
    'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
  openGraph: {
    title: 'API Docs — Toolblip',
    description:
      'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Docs — Toolblip',
    description:
      'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
