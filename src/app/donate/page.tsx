import type { Metadata } from 'next';
import DonateClient from './DonateClient';

export const metadata: Metadata = {
  title: 'Donate — Support Toolblip',
  description:
    'Support Toolblip with a donation. Help us keep developer tools free, ad-free, and privacy-respecting for everyone.',
  openGraph: {
    title: 'Donate — Support Toolblip',
    description:
      'Help us keep tools free, ad-free, and privacy-respecting. Every contribution counts.',
    url: 'https://toolblip.com/donate',
    siteName: 'Toolblip',
    type: 'website',
  },
};

export default function DonatePage() {
  return <DonateClient />;
}
