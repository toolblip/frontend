import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolUI from './ToolUI';
import ShareButtons from '@/components/ShareButtons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };
  return {
    title: `${tool.name} — Toolblip`,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tool.name}
            </h1>
            <span className="inline-block mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Share */}
      <div className="mb-8">
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Tool UI */}
      <ToolUI slug={slug} />
    </div>
  );
}
