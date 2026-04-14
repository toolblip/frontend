import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
};

export default function LoginPage() {
  return <LoginForm />;
}
