import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, tools } from '@/data/tools';
import { ToolUI } from './ToolUI';
import ShareButtons from '@/components/ShareButtons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool | Toolblip`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url: `https://toolblip.com/tools/${slug}`,
      siteName: 'Toolblip',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <a
        href="/directory"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        ← All Tools
      </a>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {tool.name}
          </h1>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {tool.category}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {tool.description}
      </p>

      <div className="mb-8">
        <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
      </div>

      {/* Tool UI */}
      <ToolUI tool={tool} />
    </div>
  );
}
