import type { ToolContent } from '@/data/tool-content';

type Props = {
  toolName: string;
  content: ToolContent | undefined;
};

// Splits off the first couple of sentences as an always-visible SEO teaser,
// leaving the rest to go behind the "See more" toggle below. Uses split()
// rather than a match-and-require-trailing-whitespace regex so a period that
// isn't followed by whitespace (decimals like "273.15", abbreviations, a
// period butted up against a closing quote) just fails to split there
// instead of silently dropping that whole stretch of text.
function splitDescription(description: string, sentenceCount = 2): { teaser: string; rest: string } {
  const sentences = description.split(/(?<=[.!?])\s+/);
  return {
    teaser: sentences.slice(0, sentenceCount).join(' ').trim(),
    rest: sentences.slice(sentenceCount).join(' ').trim(),
  };
}

export default function ToolContentSection({ toolName, content }: Props) {
  if (!content) return null;

  const { teaser, rest } = splitDescription(content.description);
  const hasMore = rest.length > 0 || content.examples.length > 0 || content.features.length > 0;

  return (
    <section className="mb-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <p className="px-5 py-4 text-gray-600 dark:text-gray-300 leading-relaxed">{teaser}</p>

      {hasMore && (
        <details className="group border-t border-gray-200 dark:border-gray-800">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              <span className="group-open:hidden">See more</span>
              <span className="hidden group-open:inline">See less</span>
              <span className="sr-only"> about the {toolName}</span>
            </span>
            <svg
              className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>

          <div className="space-y-6 border-t border-gray-200 dark:border-gray-800 px-5 py-5">
            {rest && <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{rest}</p>}

            {content.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Examples</h3>
                {content.examples.map((example) => (
                  <div key={example.title}>
                    <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">{example.title}</p>
                    <pre className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 text-xs text-gray-800 dark:text-gray-200">
                      <code>{example.code}</code>
                    </pre>
                    {example.note && (
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{example.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {content.features.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Key features</h3>
                <ul className="space-y-1.5">
                  {content.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}
    </section>
  );
}
