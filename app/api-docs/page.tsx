import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts with copy-ready curl and JSON examples.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts with copy-ready curl and JSON examples.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts with copy-ready curl and JSON examples.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
