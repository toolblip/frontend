import type { Metadata } from 'next';
import { DirectoryClient } from './DirectoryClient';

export const metadata: Metadata = {
  title: 'All Tools — Free Browser-Based Utilities | Toolblip',
  description:
    'Browse all free browser-based tools. Text editors, encoders, developers utilities, QR generators, and more. No sign-up, no ads, instant results.',
  openGraph: {
    title: 'All Tools — Free Browser-Based Utilities | Toolblip',
    description:
      'Browse all free browser-based tools. Text editors, encoders, developers utilities, QR generators, and more. No sign-up, no ads, instant results.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'All Tools — Free Browser-Based Utilities | Toolblip',
    description:
      'Browse all free browser-based tools. Text editors, encoders, developers utilities, QR generators, and more. No sign-up, no ads, instant results.',
  },
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
