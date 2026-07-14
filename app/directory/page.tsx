import type { Metadata } from 'next';
import { Suspense } from 'react';
import DirectoryClient from './DirectoryClient';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = params && Object.keys(params).length > 0;

  return {
    title: isFiltered ? 'Tools - Toolblip' : 'Tool Directory | Toolblip',
    description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    alternates: {
      canonical: 'https://toolblip.com/directory',
    },
    robots: isFiltered ? { index: false, follow: true } : undefined,
    openGraph: {
      title: 'Tool Directory | Toolblip',
      description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
      url: 'https://toolblip.com/directory',
      siteName: 'Toolblip',
      type: 'website',
      locale: 'en_US',
      images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
    },
    twitter: {
      card: 'summary',
      title: 'Tool Directory | Toolblip',
      description: 'Browse all free browser-based tools on Toolblip. Text, developer, image, conversion, math, CSS tools and more.',
    },
  };
}

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryClient />
    </Suspense>
  );
}
