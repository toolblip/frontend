import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolDetailClient from './ToolDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();
  return <ToolDetailClient tool={tool} />;
}
