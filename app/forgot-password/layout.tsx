import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Toolblip',
  description: 'Request a secure password reset link for your Toolblip account.',
  openGraph: {
    title: 'Reset Password | Toolblip',
    description: 'Request a secure password reset link for your Toolblip account.',
    url: 'https://toolblip.com/forgot-password',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Reset Password | Toolblip',
    description: 'Request a secure password reset link for your Toolblip account.',
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
