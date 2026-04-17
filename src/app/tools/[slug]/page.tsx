import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolDetail from './ToolDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return {};
  const url = `https://toolblip.com/tools/${tool.slug}`;
  return {
    title: `${tool.name} — Free Online Tool | Toolblip`,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
      url,
      siteName: 'Toolblip',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} — Free Online Tool | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) notFound();

  return (
    <ToolDetail tool={tool} />
  );
}
