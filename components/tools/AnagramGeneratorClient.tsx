'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'LISTEN';

export default function AnagramGeneratorClient() {
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(50);
  const [copied, setCopied] = useState(false);

  const generateAnagrams = (str: string): string[] => {
    if (!str || str.length === 0) return [];
    const results: string[] = [];

    const generate = (arr: string[], current: string) => {
      if (arr.length === 0) {
        results.push(current);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
          generate(remaining, current + arr[i]);
        }
      }
    };

    const chars = str
      .toLowerCase()
      .split('')
      .filter((c) => /[a-z]/.test(c));
    generate(chars, '');

    return results
      .filter((w) => w.length >= minLength)
      .filter((w, i, arr) => arr.indexOf(w) === i)
      .slice(0, maxResults);
  };

  const anagrams = useMemo(() => generateAnagrams(input), [input, minLength, maxResults]);

  const copy = () => {
    navigator.clipboard.writeText(anagrams.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Letters</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
        className="tb-v2-tool-textarea"
        placeholder="Enter letters (e.g., LISTEN)"
        maxLength={10}
        style={{ minHeight: 48, fontFamily: 'var(--f-mono)', textTransform: 'uppercase' }}
      />
      <p style={{ fontSize: 12, color: 'var(--fg-2)', margin: '8px 20px 0' }}>
        Max 10 characters. Only letters allowed.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: '16px 20px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div>
          <label className="tb-v2-tool-label">Min word length: {minLength}</label>
          <input
            type="range"
            min={1}
            max={input.length || 10}
            value={minLength}
            onChange={(e) => setMinLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Max results: {maxResults}</label>
          <input
            type="range"
            min={10}
            max={500}
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {input && anagrams.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{anagrams.length} anagrams found</span>
            <button type="button" onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {anagrams.map((word, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--tb-bg-secondary)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    fontFamily: 'var(--f-mono)',
                    fontSize: 13,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {input.length > 0 && anagrams.length === 0 && (
        <div className="tb-v2-tool-output-body">
          <p style={{ fontSize: 14, color: 'var(--fg-2)' }}>
            No rearrangements found. Try lowering the minimum word length.
          </p>
        </div>
      )}

      {!input && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">Enter letters above to generate rearrangements</div>
        </div>
      )}
    </div>
  );
}
