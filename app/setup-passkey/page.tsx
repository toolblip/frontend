import type { Metadata } from 'next';
import SetupPasskeyClient from './SetupPasskeyClient';

export const metadata: Metadata = {
  title: 'Set Up a Passkey | Toolblip',
  robots: { index: false, follow: false },
};

export default function SetupPasskeyPage() {
  return <SetupPasskeyClient />;
}
