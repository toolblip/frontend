import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { categories } from '@/data/tools';
import { IMAGE_CATEGORY_PATH } from '@/lib/tool-path';
import ToolsClient from './ToolsClient';

const BASE_DESCRIPTION =
  'Browse all free browser-based developer tools on Toolblip. JSON formatter, Base64 encoder, UUID generator, color picker, and more.';
const BASE_TITLE = 'Free Online Developer Tools | Toolblip';

function matchCategory(category?: string): string | undefined {
  if (!category) return undefined;
  return categories.find((c) => c !== 'All' && c.toLowerCase() === category.toLowerCase());
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const matched = matchCategory(category);
  const title = matched ? `${matched} Tools — Free Online | Toolblip` : BASE_TITLE;
  const description = matched
    ? `Browse free ${matched} tools on Toolblip. Part of a catalog of 100+ free browser-based developer tools.`
    : BASE_DESCRIPTION;
  return {
    title,
    description,
    alternates: { canonical: 'https://toolblip.com/tools' },
    openGraph: {
      title,
      description,
      url: 'https://toolblip.com/tools',
      siteName: 'Toolblip',
      type: 'website',
      images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip Tools' }],
    },
    twitter: { card: 'summary', title, description },
  };
}

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
