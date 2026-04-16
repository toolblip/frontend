import type { Metadata } from 'next';
import DirectoryClient from './DirectoryClient';

export const metadata: Metadata = {
  title: 'Tool Directory | Toolblip',
  description:
    'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  openGraph: {
    title: 'Tool Directory | Toolblip',
    description:
      'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    url: 'https://toolblip.com/directory',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'Tool Directory | Toolblip',
    description:
      'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
  },
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
