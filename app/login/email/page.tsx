import type { Metadata } from 'next';
import EmailAuthPage from '@/components/auth/EmailAuthPage';

export const metadata: Metadata = {
  title: 'Sign In with Email | Toolblip',
  alternates: { canonical: 'https://toolblip.com/login/email' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <EmailAuthPage intent="signin" />;
}
