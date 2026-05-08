import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts. Base URL, rate limits, and example requests included.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts. Base URL, rate limits, and example requests included.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens, query tools, and manage user accounts. Base URL, rate limits, and example requests included.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
