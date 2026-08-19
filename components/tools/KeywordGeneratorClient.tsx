'use client';

import { useMemo, useState } from 'react';

interface KeywordSection {
  key: string;
  label: string;
  items: string[];
}

function buildKeywordSections(rawSeed: string): KeywordSection[] {
  const seed = rawSeed.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!seed) return [];
  const year = new Date().getFullYear();

  return [
    {
      key: 'questions',
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
      key: 'prepositions',
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
      key: 'modifiers',
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

export default function KeywordGeneratorClient() {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sections = useMemo(() => buildKeywordSections(input), [input]);
  const totalCount = useMemo(() => sections.reduce((n, s) => n + s.items.length, 0), [sections]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
  };

  const copyAll = () => {
    const all = sections.map((s) => `${s.label}\n${s.items.join('\n')}`).join('\n\n');
    copyText(all, 'all');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Seed Keyword</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. project management software"
          className="tb-v2-input"
          aria-label="Seed keyword"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {totalCount > 0 ? `${totalCount} Keyword Ideas` : 'Keyword Ideas'}
        </span>
        <button
          type="button"
          onClick={copyAll}
          disabled={totalCount === 0}
          className={`tb-v2-copy-btn ${copiedKey === 'all' ? 'done' : ''}`}
        >
          {copiedKey === 'all' ? 'Copied All' : 'Copy All'}
        </button>
      </div>

      <div className="tb-v2-tool-output-body">
        {sections.length === 0 ? (
          <p className="tb-v2-empty">
            Type a seed keyword above to generate question, preposition, and modifier variations.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {sections.map((section) => (
              <div key={section.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="tb-v2-tool-label">{section.label}</span>
                  <button
                    type="button"
                    onClick={() => copyText(section.items.join('\n'), section.key)}
                    className={`tb-v2-copy-btn ${copiedKey === section.key ? 'done' : ''}`}
                  >
                    {copiedKey === section.key ? 'Copied' : 'Copy Section'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {section.items.map((item) => {
                    const itemKey = `${section.key}:${item}`;
                    return (
                      <div
                        key={itemKey}
                        className="tb-v2-tool-pre"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', maxHeight: 'none' }}
                      >
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5 }}>{item}</span>
                        <button
                          type="button"
                          onClick={() => copyText(item, itemKey)}
                          className={`tb-v2-copy-btn ${copiedKey === itemKey ? 'done' : ''}`}
                        >
                          {copiedKey === itemKey ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ padding: '0 20px 16px', fontSize: 12.5, color: 'var(--fg-3)' }}>
        Free keyword ideas based on common search patterns — no real search volume or competition data included.
      </p>
    </div>
  );
}
