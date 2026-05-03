import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'Complete Toolblip REST API reference. Integrate tools, user auth, and more with simple Bearer token authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description:
      'Toolblip REST API reference. Integrate tools, user auth, and more with simple Bearer token authentication.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip API Documentation' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Integrate tools, user auth, and more.',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
