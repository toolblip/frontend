import type { Metadata } from 'next';
import ArchiveClient from './ArchiveClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Monthly Sponsor Archive | Toolblip',
  description: 'Browse Toolblip sponsor placements from previous months.',
  alternates: {
    canonical: 'https://toolblip.com/sponsors/archive',
  },
  openGraph: {
    title: 'Monthly Sponsor Archive | Toolblip',
    description: 'Browse Toolblip sponsor placements from previous months.',
    url: 'https://toolblip.com/sponsors/archive',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
};

export default function SponsorsArchivePage() {
  return <ArchiveClient />;
}
