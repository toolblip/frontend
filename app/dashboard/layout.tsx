import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Toolblip',
  description: 'Manage your Toolblip dashboard, subscription, API access, and profile settings.',
  // Account-only, auth-gated surface with no public content — keep it out of the index.
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Dashboard | Toolblip',
    description: 'Manage your Toolblip dashboard, subscription, API access, and profile settings.',
    url: 'https://toolblip.com/dashboard',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Dashboard | Toolblip',
    description: 'Manage your Toolblip dashboard, subscription, API access, and profile settings.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
