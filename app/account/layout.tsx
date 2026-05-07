import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account — Toolblip',
  description:
    'Manage your Toolblip account, view your subscription, update your profile, and access API keys.',
  openGraph: {
    title: 'My Account | Toolblip',
    description:
      'Manage your Toolblip account, view your subscription, update your profile, and access API keys.',
    url: 'https://toolblip.com/account',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'My Account | Toolblip',
    description: 'Manage your Toolblip account, subscription, and API keys.',
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
