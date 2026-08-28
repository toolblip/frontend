'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = `apple
banana
apple
cherry
banana
orange
apple`;

function findDuplicates(input: string, caseSensitive: boolean) {
  const lines = input.split('\n');
  const seen = new Map<string, { count: number; indices: number[] }>();

  lines.forEach((line, idx) => {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!key.trim()) return;
    const existing = seen.get(key);
    if (existing) {
      existing.count++;
      existing.indices.push(idx + 1);
    } else {
      seen.set(key, { count: 1, indices: [idx + 1] });
    }
  });

  return Array.from(seen.entries())
    .filter(([, v]) => v.count > 1)
    .map(([text, v]) => ({ line: v.indices[0], text, duplicates: v.indices.slice(1) }));
}

export default function DuplicateLineFinderClient() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showLineNums, setShowLineNums] = useState(true);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => findDuplicates(input, caseSensitive), [input, caseSensitive]);

  const copy = () => {
    const text = results
      .map((r) => `Line ${r.line}: "${r.text}" (also at lines ${r.duplicates.join(', ')})`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input Text</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste text with duplicate lines..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="Text input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Options</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          Case sensitive
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={showLineNums} onChange={(e) => setShowLineNums(e.target.checked)} />
          Show line numbers
        </label>
      </div>

      {!input.trim() ? (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter text to find duplicate lines</span>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Duplicate Lines ({results.length} found)</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {results.map((r) => (
              <div
                key={`${r.line}-${r.text}`}
                style={{ marginBottom: 12, padding: 8, background: 'var(--tb-bg-secondary)', borderRadius: 6, fontSize: 13 }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {showLineNums ? `Line ${r.line}` : 'Occurrence 1'}: &quot;{r.text}&quot;
                </div>
                <div style={{ color: 'var(--tb-text-secondary)', fontSize: 12 }}>
                  Also at line{r.duplicates.length > 1 ? 's' : ''}: {r.duplicates.join(', ')} · {r.duplicates.length + 1}{' '}
                  total occurrences
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>No duplicate lines found</span>
        </div>
      )}
    </div>
  );
}
