import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';
import { getToolPath } from '@/lib/tool-path';

interface RelatedToolsProps {
  slug: string;
  category: string;
}

const MIN_RELATED = 4;
const MAX_RELATED = 6;

function sharedTagCount(a: Tool, b: Tool): number {
  if (!a.tags?.length || !b.tags?.length) return 0;
  const bTags = new Set(b.tags.map((tag) => tag.toLowerCase()));
  return a.tags.reduce((count, tag) => count + (bTags.has(tag.toLowerCase()) ? 1 : 0), 0);
}

// Deterministic stand-in for Math.random(): tool pages are statically
// generated, so any per-request randomness here would just pick once at
// build time anyway — a hash keeps the "random" order stable and reproducible.
function shuffleKey(seed: string, value: string): number {
  let hash = 0;
  const input = `${seed}:${value}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return hash;
}

export default function RelatedTools({ slug, category }: RelatedToolsProps) {
  const current = tools.find((tool) => tool.slug === slug);
  const candidates = tools.filter((tool) => tool.slug !== slug && tool.category === category);

  if (candidates.length === 0) return null;

  const ranked = [...candidates].sort((a, b) => {
    const tagDiff = (current ? sharedTagCount(current, b) : 0) - (current ? sharedTagCount(current, a) : 0);
    if (tagDiff !== 0) return tagDiff;
    return shuffleKey(slug, a.slug) - shuffleKey(slug, b.slug);
  });

  const related = ranked.slice(0, Math.min(MAX_RELATED, Math.max(MIN_RELATED, ranked.length)));

  return (
    <section aria-labelledby="related-tools-title" className="mb-10">
      <h2 id="related-tools-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related {category} tools
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={getToolPath(tool)}
            className="group shrink-0 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-600 rounded-xl p-4 transition-all"
          >
            <span className="text-2xl" aria-hidden="true">{tool.emoji}</span>
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
              {tool.name}
            </h3>
            <span className="inline-block mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full font-medium">
              {tool.category}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
