import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'Toolblip REST API reference. Base URL: https://toolblip-api-production.up.railway.app (api.toolblip.com once SSL ready). Browse tools, register, login, and more - all with Bearer token auth.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Base URL: https://toolblip-api-production.up.railway.app.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Base URL: https://toolblip-api-production.up.railway.app.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
