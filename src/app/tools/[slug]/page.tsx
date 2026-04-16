import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ToolUI from './ToolUI';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <a
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
      >
        ← All Tools
      </a>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool UI */}
      <ToolUI tool={tool} />
    </div>
  );
}
