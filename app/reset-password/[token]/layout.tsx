import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password | Toolblip',
  description: 'Choose a new password for your Toolblip account using your secure reset link.',
  openGraph: {
    title: 'Set New Password | Toolblip',
    description: 'Choose a new password for your Toolblip account using your secure reset link.',
    url: 'https://toolblip.com/reset-password',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Set New Password | Toolblip',
    description: 'Choose a new password for your Toolblip account using your secure reset link.',
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
