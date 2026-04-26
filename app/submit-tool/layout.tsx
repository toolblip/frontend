import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Tool',
  description:
    'Know a great free tool that should be on Toolblip? Submit it for review and we will add it to the community directory if it meets our standards.',
  openGraph: {
    title: 'Submit a Tool | Toolblip',
    description:
      'Know a great free tool that should be on Toolblip? Submit it for review and we will add it to the community directory if it meets our standards.',
    url: 'https://toolblip.com/submit-tool',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Submit a Tool | Toolblip',
    description: 'Know a great free tool? Submit it to the Toolblip community directory.',
  },
};

export default function SubmitToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
