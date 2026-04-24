import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolClient from './ToolClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };

  const ogImage = `/images/tools/${slug}-og.png`;

  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url: `https://toolblip.com/tools/${tool.slug}`,
      siteName: 'Toolblip',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      images: [ogImage],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ToolClient tool={tool} />;
}
