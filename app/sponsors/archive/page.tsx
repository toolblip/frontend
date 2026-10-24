import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Monthly Sponsor Archive | Toolblip',
  description: 'Browse past Toolblip sponsor placements month by month, with the top three ranked sponsors and their links for every closed sponsorship period.',
  alternates: {
    canonical: 'https://toolblip.com/sponsors/archive',
  },
  openGraph: {
    title: 'Monthly Sponsor Archive | Toolblip',
    description: 'Browse past Toolblip sponsor placements month by month, with the top three ranked sponsors and their links for every closed sponsorship period.',
    url: 'https://toolblip.com/sponsors/archive',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
};

export default function SponsorsArchivePage() {
  return <ArchiveClient />;
}
