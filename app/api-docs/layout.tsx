import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Complete Toolblip REST API reference. Base URL https://api.toolblip.com. Browse tools, register, login, and more — all with Bearer token auth.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Base URL: https://api.toolblip.com.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Base URL: https://api.toolblip.com.',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
