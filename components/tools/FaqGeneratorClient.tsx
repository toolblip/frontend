'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const QUESTION_TEMPLATES: { question: (t: string) => string; placeholder: (t: string) => string }[] = [
  {
    question: t => `What is ${t}?`,
    placeholder: t => `[Explain what ${t} does and its main benefit in 1-2 sentences]`,
  },
  {
    question: t => `How much does ${t} cost?`,
    placeholder: t => `[State the pricing plans or cost of ${t}, e.g. free, one-time fee, or subscription tiers]`,
  },
  {
    question: t => `Is ${t} free to use?`,
    placeholder: t => `[Clarify whether ${t} is free, freemium, or paid, and mention any free trial]`,
  },
  {
    question: t => `How do I get started with ${t}?`,
    placeholder: t => `[Walk through the steps a new user takes to sign up or start using ${t}]`,
  },
  {
    question: t => `Is ${t} safe and secure?`,
    placeholder: t => `[Describe the security measures, certifications, or data practices behind ${t}]`,
  },
  {
    question: t => `What are the best alternatives to ${t}?`,
    placeholder: t => `[List 2-3 alternatives to ${t} and briefly note how it compares]`,
  },
  {
    question: t => `Does ${t} work on mobile?`,
    placeholder: t => `[Explain mobile app or browser support and any platform limitations for ${t}]`,
  },
  {
    question: t => `Can I cancel or get a refund for ${t}?`,
    placeholder: t => `[Explain the cancellation process and refund policy for ${t}]`,
  },
  {
    question: t => `Who is ${t} best suited for?`,
    placeholder: t => `[Describe the ideal users or use cases for ${t}]`,
  },
  {
    question: t => `Do I need to create an account to use ${t}?`,
    placeholder: t => `[State whether an account or sign-up is required to use ${t}]`,
  },
];

export default function FaqGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const generate = () => {
    const t = topic.trim();
    if (!t) return;
    setFaqs(
      QUESTION_TEMPLATES.map(tpl => ({
        question: tpl.question(t),
        answer: tpl.placeholder(t),
      }))
    );
  };

  const updateAnswer = (index: number, value: string) => {
    setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, answer: value } : f)));
  };

  const copyAsPlainText = () => {
    if (faqs.length === 0) return;
    const text = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  const copyAsJsonLd = () => {
    if (faqs.length === 0) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    navigator.clipboard.writeText(jsonLd).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Generate FAQ sections for any topic. SEO-friendly question-answer pairs.
      </p>

      <div className="flex flex-col gap-1">
        <span className="tb-v2-tool-label">Topic / Product / Service</span>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          className="tb-v2-input"
          placeholder="e.g., Toolblip, our project management app, the return policy"
        />
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={!topic.trim()}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        Generate FAQ Scaffold
      </button>

      {faqs.length === 0 && (
        <p className="tb-v2-empty">
          Enter a topic and generate a scaffold of common FAQ questions with editable answer placeholders.
        </p>
      )}

      {faqs.length > 0 && (
        <div className="tb-v2-tool-output-body">
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">
              Starting scaffold — edit each answer with real information about your topic before publishing.
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="tb-v2-tool-label">{faq.question}</span>
                <textarea
                  value={faq.answer}
                  onChange={e => updateAnswer(i, e.target.value)}
                  className="tb-v2-input"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" onClick={copyAsPlainText} className="tb-v2-copy-btn">
              {copiedText ? 'Copied' : 'Copy as Plain Text'}
            </button>
            <button type="button" onClick={copyAsJsonLd} className="tb-v2-copy-btn">
              {copiedJson ? 'Copied' : 'Copy as JSON-LD FAQPage Schema'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
