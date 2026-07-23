import type { Metadata } from 'next';
import { tools, categories } from '@/data/tools';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Tools | Toolblip',
  description: 'Browse all free online developer tools on Toolblip. 797+ browser-based tools for text, development, encoding, images, conversions, math, CSS, and more.',
  alternates: { canonical: 'https://toolblip.com/all-tools' },
};

export default function AllToolsPage() {
  const toolsByCategory = categories.map((cat) => ({
    name: cat,
    tools: tools.filter((t) => t.category === cat),
  })).filter((g) => g.tools.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500 dark:text-red-400 mb-3">
          All {tools.length} tools
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Toolblip Tool Index
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Every free browser-based tool on Toolblip, organized by category. No signup, no surveillance, just utility.
        </p>
      </header>

      {toolsByCategory.map((group) => (
        <section key={group.name} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {group.name} ({group.tools.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-red-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-red-600"
              >
                <span className="text-xl shrink-0">{tool.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {tool.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {tool.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="text-center mt-10">
        <Link href="/tools" className="text-red-600 dark:text-red-400 hover:underline font-medium">
          Browse by category →
        </Link>
      </div>
    </div>
  );
}
