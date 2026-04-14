import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
};

export default function SignupPage() {
  return <SignupForm />;
}
