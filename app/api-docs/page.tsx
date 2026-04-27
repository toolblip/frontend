import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'API Documentation — Toolblip REST API Reference',
  description:
    'Complete Toolblip REST API reference. Integrate tools, user auth, and more with simple Bearer token authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Browse tools, register, login, and more.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip API Documentation' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
