import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Start a 14-day free trial, or keep using the free plan. No credit card required. Free, Starter ($4.99/mo), Pro ($19.99/mo), and Max ($49.99/mo) plans with no ads or sponsor strip, cloud storage, and team features.',
  alternates: {
    canonical: 'https://toolblip.com/pricing',
  },
  openGraph: {
    title: 'Pricing | Toolblip',
    description: 'Start a 14-day free trial, or keep using the free plan. No credit card required.',
    url: 'https://toolblip.com/pricing',
    siteName: 'Toolblip',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Toolblip Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Toolblip',
    description: 'Start a 14-day free trial, or keep using the free plan. No credit card required.',
    images: ['/og-pricing.png'],
  },
};

const faqSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I cancel my subscription anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can cancel anytime from your account page. Your access continues until the end of the billing period.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Toolblip includes a 14-day free trial with no credit card required. You can also stay on the free plan and upgrade later when you're ready.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does yearly billing work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yearly plans are billed as a single payment for 12 months at a 20% discount - equivalent to 10 months of the monthly price.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No credit card is required to start the free trial. If you upgrade later, we accept all major credit and debit cards via Stripe.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is cloud storage used for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cloud storage lets you save processed files and results between sessions. All tools process files client-side by default.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my plan with team members?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pro plans include 3 team seats and Max plans include 10 team seats, allowing multiple users to collaborate under one account.',
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient />
    </>
  );
}
