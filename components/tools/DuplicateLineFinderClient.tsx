'use client';

import { useState, useCallback } from 'react';

export default function DuplicateLineFinderClient() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showLineNums, setShowLineNums] = useState(true);
  const [results, setResults] = useState<{ line: number; text: string; duplicates: number[] }[]>([]);
  const [copied, setCopied] = useState(false);

  const analyze = useCallback(() => {
    const lines = input.split('\n');
    const seen = new Map<string, { count: number; indices: number[] }>();

    lines.forEach((line, idx) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!key) return;
      const existing = seen.get(key);
      if (existing) {
        existing.count++;
        existing.indices.push(idx + 1);
      } else {
        seen.set(key, { count: 1, indices: [idx + 1] });
      }
    });

    const dupes = Array.from(seen.entries())
      .filter(([, v]) => v.count > 1)
      .map(([text, v]) => ({ line: v.indices[0], text, duplicates: v.indices.slice(1) }));

    setResults(dupes);
  }, [input, caseSensitive]);

  const copy = () => {
    const text = results.map(r => `Line ${r.line}: "${r.text}" (also at lines ${r.duplicates.join(', ')})`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input Text</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
            Case sensitive
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input type="checkbox" checked={showLineNums} onChange={(e) => setShowLineNums(e.target.checked)} />
            Show line numbers
          </label>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste text with duplicate lines..."
        className="tb-v2-tool-textarea"
        aria-label="Text input"
      />
      <button type="button" onClick={analyze} className="tb-v2-btn tb-v2-btn-primary" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Find Duplicates
      </button>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Duplicate Lines ({results.length} found)</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {results.map((r, i) => (
              <div key={i} style={{ marginBottom: 12, padding: 8, background: 'var(--surface-2)', borderRadius: 6, fontSize: 13 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {showLineNums ? `Line ${r.line}` : `Occurrence 1`}: "{r.text}"
                </div>
                <div style={{ color: 'var(--fg-2)', fontSize: 12 }}>
                  Also at line{r.duplicates.length > 1 ? 's' : ''}: {r.duplicates.join(', ')} &middot; {r.duplicates.length + 1} total occurrences
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
