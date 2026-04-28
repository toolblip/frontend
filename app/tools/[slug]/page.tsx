import { tools } from '@/data/tools';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ToolUI from './ToolUI';

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.name} - Free Online Tool | Toolblip`,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-4 transition-colors"
          >
            ← All Tools
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{tool.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-2xl">
                {tool.description}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-block text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ToolUI tool={tool} />
      </div>
    </div>
  );
}
