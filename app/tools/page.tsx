import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Browse all free browser-based developer tools on Toolblip. JSON formatter, Base64 encoder, UUID generator, color picker, and more.',
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
  const params = category ? `?category=${encodeURIComponent(category)}` : '';
  redirect(`/directory${params}`);
}
