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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <a
          href="/tools"
          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          All Tools
        </a>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl leading-none mt-0.5">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tool.name}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">
              {tool.description}
            </p>
            <span className="inline-block mt-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <ToolUI tool={tool} />
    </div>
  );
}
