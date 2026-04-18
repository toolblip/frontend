import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ToolUI from './ToolUI';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          {tool.description}
        </p>
        <span className="inline-block mt-3 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
          {tool.category}
        </span>
      </div>

      {/* Tool UI */}
      <ToolUI tool={tool} />
    </div>
  );
}
