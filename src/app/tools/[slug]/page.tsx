import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ToolDetail from './ToolDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();
  return <ToolDetail tool={tool} />;
}
