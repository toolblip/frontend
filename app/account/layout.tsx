import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account | Toolblip',
  description: 'Manage your Toolblip account, subscription, API access, and profile settings.',
  openGraph: {
    title: 'Account | Toolblip',
    description: 'Manage your Toolblip account, subscription, API access, and profile settings.',
    url: 'https://toolblip.com/account',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Account | Toolblip',
    description: 'Manage your Toolblip account, subscription, API access, and profile settings.',
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
