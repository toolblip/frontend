import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'Toolblip API Docs | REST Reference',
  description:
    'Complete Toolblip REST API reference with base URLs, Bearer token authentication, endpoint docs, curl examples, and JSON response samples.',
  openGraph: {
    title: 'Toolblip API Docs | REST Reference',
    description:
      'Complete Toolblip REST API reference with auth, endpoint docs, curl examples, and JSON response samples.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Toolblip API Docs | REST Reference',
    description:
      'Complete Toolblip REST API reference with auth, endpoint docs, curl examples, and JSON response samples.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
