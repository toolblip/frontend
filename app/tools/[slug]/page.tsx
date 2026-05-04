import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolDetailClient from './ToolDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Slugs that exist in old blog posts / wild URLs but not in data/tools.ts */
const REDIRECTS: Record<string, string> = {
  'lorem-ipsum':         'lorem-ipsum-generator',
  'letter-counter':      'word-counter',
  'mime-type-checker':   'mime-types-reference',
  'random-string':       'password-generator',
  'uuid-v4':             'uuid-generator',
  'wifi-qr':             'wifi-qr-code-generator',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (REDIRECTS[slug]) return { title: 'Redirecting…' };
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
  if (REDIRECTS[slug]) redirect(`/tools/${REDIRECTS[slug]}`);
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();
  return <ToolDetailClient tool={tool} />;
}
