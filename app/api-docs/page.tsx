import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description:
    'Toolblip REST API reference. Base URL: https://api.toolblip.com. Browse tools, register, login, and more - all with Bearer token auth. SSL active.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Base URL: https://api.toolblip.com.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Base URL: https://api.toolblip.com.',
  },
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
