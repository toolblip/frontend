import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import { ToolUI } from './ToolUI';
import ShareButtons from '@/src/components/ShareButtons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
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
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <a
          href="/directory"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          ← All Tools
        </a>

        <header className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-5xl sm:text-6xl leading-none" aria-hidden>
                {tool.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/60">
                    {tool.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Free browser tool</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {tool.name}
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              {tool.description}
            </p>

            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-2" aria-label="Tool tags">
                {tool.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-5 shadow-sm">
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Share this tool</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Handy enough to keep around? Send it to yourself or a teammate.
            </p>
            <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
          </aside>
        </header>

        <section
          className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sm:p-6 shadow-sm"
          aria-label={`${tool.name} tool interface`}
        >
          <ToolUI tool={tool} />
        </section>
      </div>
    </main>
  );
}
