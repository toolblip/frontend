import type { Metadata } from 'next';
import EmailAuthPage from '@/components/auth/EmailAuthPage';

export const metadata: Metadata = {
  title: 'Sign Up with Email | Toolblip',
  alternates: { canonical: 'https://toolblip.com/signup/email' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <EmailAuthPage intent="signup" />;
}
