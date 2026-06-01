import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | Toolblip',
  description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Create Account | Toolblip',
    description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
    url: 'https://toolblip.com/signup',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Create Account | Toolblip',
    description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
