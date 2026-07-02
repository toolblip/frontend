import type { Metadata } from 'next';
import FrontendHealthClient from './FrontendHealthClient';

export const metadata: Metadata = {
  title: 'Frontend Health | Toolblip',
  description:
    'Live status dashboard for Toolblip frontend, API, and custom domain. Check service availability and response times in real time.',
  openGraph: {
    title: 'Frontend Health | Toolblip',
    description:
      'Live status dashboard for Toolblip frontend, API, and custom domain. Check service availability and response times in real time.',
    url: 'https://toolblip.com/frontend-health',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [
      { url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Frontend Health | Toolblip',
    description:
      'Live status dashboard for Toolblip frontend, API, and custom domain. Check service availability and response times in real time.',
  },
};

export default function FrontendHealthPage() {
  return <FrontendHealthClient />;
}
