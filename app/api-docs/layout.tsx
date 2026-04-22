import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs | Toolblip',
  description:
    'Toolblip REST API reference. Browse tools, authenticate, and manage user accounts via the Toolblip API. Base URL: https://api.toolblip.com.',
  openGraph: {
    title: 'API Docs | Toolblip',
    description:
      'Toolblip REST API reference. Browse tools, authenticate, and manage user accounts via the Toolblip API. Base URL: https://api.toolblip.com.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Docs | Toolblip',
    description:
      'Toolblip REST API reference. Browse tools, authenticate, and manage user accounts.',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
