import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCanonicalToolSlug, getToolBySlug } from '@/data/tools';
import { getImageTools, getToolPath, IMAGE_CATEGORY } from '@/lib/tool-path';
import ToolDetailView from '../../ToolDetailView';
import { buildToolMetadata } from '../../tool-page-meta';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getImageTools().map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool || tool.category !== IMAGE_CATEGORY) return { title: 'Redirecting...' };
  return buildToolMetadata(tool);
}

export default async function ImageToolPage({ params }: PageProps) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalToolSlug(slug);
  const tool = getToolBySlug(canonicalSlug);
  if (!tool) notFound();
  if (tool.category !== IMAGE_CATEGORY || canonicalSlug !== slug) {
    permanentRedirect(getToolPath(tool));
  }
  return <ToolDetailView tool={tool} />;
}
