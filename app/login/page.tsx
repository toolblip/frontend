import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Toolblip',
  description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Sign In | Toolblip',
    description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
    url: 'https://toolblip.com/login',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Toolblip',
    description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
