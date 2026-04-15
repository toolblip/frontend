import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Toolblip',
  description:
    'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
  openGraph: {
    title: 'Sign In | Toolblip',
    description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
    url: 'https://toolblip.com/login',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Sign In | Toolblip', description: 'Sign in to your Toolblip account.' },
};

export default function LoginPage() {
  return <LoginForm />;
}
