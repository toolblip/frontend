import { reviewedRelatedTools, type ReviewedToolSlug } from '@/data/reviewed-tools';
import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';
import { getToolPath } from '@/lib/tool-path';

interface RelatedToolsProps {
  slug: string;
  category: string;
}

const MAX_UNCURATED = 3;

function sharedTagCount(a: Tool, b: Tool): number {
  if (!a.tags?.length || !b.tags?.length) return 0;
  const bTags = new Set(b.tags.map((tag) => tag.toLowerCase()));
  return a.tags.reduce((count, tag) => count + (bTags.has(tag.toLowerCase()) ? 1 : 0), 0);
}

export function selectRelatedTools(catalog: readonly Tool[], { slug }: { slug: string; category: string }): Tool[] {
  if (Object.prototype.hasOwnProperty.call(reviewedRelatedTools, slug)) {
    const targets = reviewedRelatedTools[slug as ReviewedToolSlug];
    return targets.flatMap((target) => catalog.filter((tool) => tool.slug === target && tool.slug !== slug));
  }

  const current = catalog.find((tool) => tool.slug === slug);
  if (!current?.tags?.length) return [];

  return catalog
    .filter((tool) => tool.slug !== slug && sharedTagCount(current, tool) > 0)
    .sort((a, b) => {
      const tagDiff = sharedTagCount(current, b) - sharedTagCount(current, a);
      if (tagDiff !== 0) return tagDiff;
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    })
    .slice(0, MAX_UNCURATED);
}

export default function RelatedTools({ slug, category }: RelatedToolsProps) {
  const related = selectRelatedTools(tools, { slug, category });
  if (!related.length) return null;
  const sameCategory = related.every((tool) => tool.category === category);

  return (
    <section aria-labelledby="related-tools-title" className="mb-10">
      <h2 id="related-tools-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related {sameCategory ? `${category} tools` : 'tools'}
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
