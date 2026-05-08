import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlug, tools } from '../../../data/tools';
import ToolDetailClient from './ToolDetailClient';

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Toolblip',
    };
  }

  return {
    title: `${tool.name} | Toolblip`,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolDetailClient tool={tool} />;
}
