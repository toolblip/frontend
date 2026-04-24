import type { FAQ } from '@/lib/faq';

type Props = { toolName: string; faqs: FAQ[] };

export default function FaqSection({ toolName, faqs }: Props) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="tb-v2-faq" aria-labelledby="tb-v2-faq-title">
      <h2 id="tb-v2-faq-title" className="tb-v2-faq-title">
        Frequently asked questions about the {toolName}
      </h2>
      <div className="tb-v2-faq-list">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
