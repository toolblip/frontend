'use client';

import { useMemo, useState } from 'react';

interface KeywordSection {
  label: string;
  items: string[];
}

function buildKeywordIdeas(rawSeed: string): KeywordSection[] {
  const seed = rawSeed.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!seed) return [];
  const year = new Date().getFullYear();

  return [
    {
      label: 'Questions',
      items: [
        `what is ${seed}`,
        `how to ${seed}`,
        `why ${seed}`,
        `when ${seed}`,
        `where ${seed}`,
        `can ${seed}`,
        `is ${seed}`,
      ],
    },
    {
      label: 'Prepositions',
      items: [
        `${seed} for`,
        `${seed} with`,
        `${seed} without`,
        `${seed} near`,
        `${seed} vs`,
      ],
    },
    {
      label: 'Modifiers',
      items: [
        `best ${seed}`,
        `cheap ${seed}`,
        `free ${seed}`,
        `${seed} ${year}`,
        `${seed} review`,
        `${seed} guide`,
        `${seed} alternative`,
        `how to use ${seed}`,
      ],
    },
  ];
}

export default function KeywordGeneratorExpressClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const sections = useMemo(() => buildKeywordIdeas(input), [input]);
  const all = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    window.setTimeout(() => setCopied((k) => (k === key ? null : k)), 1200);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Seed Keyword</span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a seed keyword..."
        className="tb-v2-input"
        style={{ margin: '12px 20px', width: 'calc(100% - 40px)' }}
        aria-label="Seed keyword"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{all.length > 0 ? `${all.length} Ideas` : 'Keyword Ideas'}</span>
        <button
          type="button"
          onClick={() => copy(all.join('\n'), 'all')}
          disabled={all.length === 0}
          className={`tb-v2-copy-btn ${copied === 'all' ? 'done' : ''}`}
        >
          {copied === 'all' ? 'Copied All' : 'Copy All'}
        </button>
      </div>

      <div className="tb-v2-tool-output-body">
        {sections.length === 0 ? (
          <p className="tb-v2-empty">Type a seed keyword to generate quick keyword ideas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sections.map((section) => (
              <div key={section.label}>
                <div className="tb-v2-tool-label" style={{ marginBottom: 6 }}>{section.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {section.items.map((item) => {
                    const key = `${section.label}:${item}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => copy(item, key)}
                        className="tb-v2-mode-tab"
                        title="Click to copy"
                      >
                        {copied === key ? 'Copied ✓' : item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ padding: '0 20px 16px', fontSize: 12, color: 'var(--fg-3)' }}>
        Free keyword ideas based on common search patterns — no search volume data included.
      </p>
    </div>
  );
}
