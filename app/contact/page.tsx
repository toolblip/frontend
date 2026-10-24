import type { Metadata } from 'next';
import ContactClient from './ContactClient';

const description = 'How to reach the Toolblip team for support, bug reports, tool requests, and partnerships. Reveal the contact address after a quick security check.';

export const metadata: Metadata = {
  title: 'Contact | Toolblip',
  description,
  alternates: {
    canonical: 'https://toolblip.com/contact',
  },
  openGraph: {
    title: 'Contact | Toolblip',
    description,
    url: 'https://toolblip.com/contact',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Toolblip',
    description,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
