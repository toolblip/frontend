import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { IMAGE_CATEGORY_PATH } from '@/lib/tool-path';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Browse all free browser-based developer tools on Toolblip. JSON formatter, Base64 encoder, UUID generator, color picker, and more.',
  alternates: { canonical: 'https://toolblip.com/tools' },
  openGraph: {
    title: 'Tools | Toolblip',
    description: 'Browse all free browser-based developer tools on Toolblip. JSON formatter, Base64 encoder, UUID generator, color picker, and more.',
    url: 'https://toolblip.com/tools',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip Tools' }],
  },
  twitter: { card: 'summary', title: 'Tools | Toolblip', description: 'Browse all free browser-based developer tools on Toolblip.' },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  if (category && category.toLowerCase() === 'image') {
    redirect(IMAGE_CATEGORY_PATH);
  }
  return <ToolsClient initialCategory={category} />;
}
