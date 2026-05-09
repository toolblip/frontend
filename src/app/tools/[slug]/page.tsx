import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlug, tools } from '../../../data/tools';
import ToolDetailClient from './ToolDetailClient';

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Toolblip',
      description: 'The requested Toolblip tool could not be found.',
      openGraph: {
        title: 'Tool Not Found | Toolblip',
        description: 'The requested Toolblip tool could not be found.',
        url: `https://toolblip.com/tools/${slug}`,
        siteName: 'Toolblip',
      },
      twitter: {
        card: 'summary',
        title: 'Tool Not Found | Toolblip',
        description: 'The requested Toolblip tool could not be found.',
      },
    };
  }

  const url = `https://toolblip.com/tools/${slug}`;

  return {
    title: `${tool.name} | Toolblip`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url,
      siteName: 'Toolblip',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
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
