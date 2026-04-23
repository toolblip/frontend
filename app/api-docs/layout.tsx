import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description: 'Toolblip REST API reference. Browse developer tools, manage accounts, and authenticate with Bearer tokens. Base URL: https://api.toolblip.com.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Browse developer tools, manage accounts, and authenticate with Bearer tokens.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API reference. Browse developer tools, manage accounts, and authenticate with Bearer tokens.',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
