import type { Metadata } from 'next';
import ApiDocsPage from './page';

export const metadata: Metadata = {
  title: 'API Docs | Toolblip',
  description:
    'Toolblip REST API reference. Browse public developer tool endpoints, register for a Bearer token, and manage authenticated user accounts.',
  openGraph: {
    title: 'API Docs | Toolblip',
    description:
      'Toolblip REST API reference. Browse public developer tool endpoints, register for a Bearer token, and manage authenticated user accounts.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Docs | Toolblip',
    description: 'Toolblip REST API reference. Public tool endpoints, Bearer token auth, and user account management.',
  },
};

export default function ApiDocsLayout() {
  return <ApiDocsPage />;
}
