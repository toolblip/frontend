import type { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create Account | Toolblip',
  description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
  alternates: {
    canonical: 'https://toolblip.com/signup',
  },
  // Account-funnel page with no unique content for a searcher to land on —
  // keep it out of the index but let link equity flow through.
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Create Account | Toolblip',
    description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
    url: 'https://toolblip.com/signup',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Create Account | Toolblip',
    description: 'Create a free Toolblip account to save API keys, manage your profile, and submit MCP servers to the community directory.',
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
