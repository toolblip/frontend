'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `Our team is committed to delivering high quality results on every project. We believe in delivering high quality results because our customers deserve nothing less.

When you work with us, you get a dedicated team of experts who care about your success. Our dedicated team of experts will guide you through every step of the process.

We look forward to delivering high quality results for your next project as well.`;

const MIN_WORDS = 3;
const MAX_WORDS = 8;
const MIN_OCCURRENCES = 2;
const MAX_RESULTS = 20;

interface Phrase {
  phrase: string;
  words: number;
  count: number;
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function findDuplicatePhrases(text: string): Phrase[] {
  const words = normalizeWords(text);
  if (words.length < MIN_WORDS * 2) return [];

  const accepted: Phrase[] = [];

  for (let n = Math.min(MAX_WORDS, words.length); n >= MIN_WORDS; n--) {
    const freq = new Map<string, number>();
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      freq.set(phrase, (freq.get(phrase) || 0) + 1);
    }
    const candidates = Array.from(freq.entries())
      .filter(([, count]) => count >= MIN_OCCURRENCES)
      .sort((a, b) => b[1] - a[1]);

    for (const [phrase, count] of candidates) {
      if (accepted.some(a => a.phrase.includes(phrase))) continue;
      accepted.push({ phrase, words: n, count });
    }
  }

  return accepted
    .sort((a, b) => (b.words * b.count) - (a.words * a.count))
    .slice(0, MAX_RESULTS);
}

export default function DuplicatePhraseDetectorClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const phrases = useMemo(() => findDuplicatePhrases(input), [input]);
  const totalWords = useMemo(() => normalizeWords(input).length, [input]);

  const outputText = useMemo(
    () => phrases.map(p => `"${p.phrase}" (${p.count}x, ${p.words} words)`).join('\n'),
    [phrases]
  );

  const copy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <ToolExampleClearActions
          onExample={() => {
            setInput(EXAMPLE);
            setCopied(false);
          }}
          onClear={() => {
            setInput('');
            setCopied(false);
          }}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your text to scan for repeated phrases..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 160 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Repeated Phrases ({phrases.length})</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input.trim() ? (
          <p className="tb-v2-empty">Paste text or load the example to scan for repeated phrases of 3+ words.</p>
        ) : totalWords < MIN_WORDS * 2 ? (
          <p className="tb-v2-empty">Enter at least a few sentences of text to scan for repeated phrases.</p>
        ) : phrases.length === 0 ? (
          <p className="tb-v2-empty">No repeated phrases of {MIN_WORDS}+ words found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {phrases.map((p, i) => (
              <div key={i} className="flex justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontStyle: 'italic' }}>&ldquo;{p.phrase}&rdquo;</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-2)', whiteSpace: 'nowrap', marginLeft: 12 }}>{p.count}&times; &middot; {p.words}w</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
