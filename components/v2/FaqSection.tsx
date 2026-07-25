import type { FAQ } from '@/lib/faq';
import type { ToolContent } from '@/data/tool-content';

type Props = { toolName: string; faqs: FAQ[]; content?: ToolContent };

export default function FaqSection({ toolName, faqs, content }: Props) {
  if (faqs.length === 0 && !content) return null;

  const jsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <section className="tb-v2-faq" aria-labelledby="tb-v2-faq-title">
      <h2 id="tb-v2-faq-title" className="tb-v2-faq-title">
        Quick answers for {toolName}
      </h2>
      <div className="tb-v2-faq-list">
        {content && (
          <details className="tb-v2-faq-item">
            <summary className="tb-v2-faq-q">
              <span>More about the {toolName}</span>
              <svg
                className="tb-v2-faq-chev"
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="tb-v2-faq-a space-y-5">
              <p className="leading-relaxed">{content.description}</p>

              {content.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--fg-0)' }}>
                    Examples
                  </h3>
                  {content.examples.map((example) => (
                    <div key={example.title}>
                      <p className="mb-1.5 text-sm font-medium" style={{ color: 'var(--fg-0)' }}>
                        {example.title}
                      </p>
                      <pre className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 text-xs text-gray-800 dark:text-gray-200">
                        <code>{example.code}</code>
                      </pre>
                      {example.note && (
                        <p className="mt-1.5 text-xs" style={{ color: 'var(--fg-3)' }}>
                          {example.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {content.features.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--fg-0)' }}>
                    Key features
                  </h3>
                  <ul className="space-y-1.5">
                    {content.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                          width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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

        {faqs.map((f, i) => (
          <details key={i} className="tb-v2-faq-item">
            <summary className="tb-v2-faq-q">
              <span>{f.q}</span>
              <svg
                className="tb-v2-faq-chev"
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="tb-v2-faq-a">{f.a}</div>
          </details>
        ))}
      </div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </section>
  );
}
