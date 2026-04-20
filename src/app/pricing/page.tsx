import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing | Toolblip',
  description: 'Upgrade to Toolblip Pro for an ad-free, uninterrupted experience. Plans starting at $4.99/month.',
  openGraph: {
    title: 'Pricing | Toolblip',
    description: 'Upgrade to Toolblip Pro for an ad-free, uninterrupted experience. Plans starting at $4.99/month.',
    url: 'https://toolblip.com/pricing',
    siteName: 'Toolblip',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
