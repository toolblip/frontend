'use client';

import { useMemo, useState } from 'react';

function formatChar(char: string): { display: string; title: string } {
  if (char === ' ') return { display: '␣', title: 'Space' };
  if (char === '\n') return { display: '↵', title: 'Newline' };
  if (char === '\t') return { display: '⇥', title: 'Tab' };
  if (char === '\r') return { display: '⏎', title: 'Carriage return' };
  return { display: char, title: char };
}

export default function CharacterFrequencyCounterClient() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [sortBy, setSortBy] = useState<'frequency' | 'character'>('frequency');
  const [copied, setCopied] = useState(false);

  const frequencyData = useMemo(() => {
    if (!text) return [];

    const charCount: Record<string, number> = {};
    for (const char of text) {
      const key = caseSensitive ? char : char.toLowerCase();
      charCount[key] = (charCount[key] || 0) + 1;
    }

    const entries = Object.entries(charCount);
    if (sortBy === 'frequency') {
      entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    } else {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }
    return entries;
  }, [text, caseSensitive, sortBy]);

  const totalChars = text.length;
  const uniqueChars = frequencyData.length;
  const maxFrequency = frequencyData.length > 0 ? Math.max(...frequencyData.map(([, count]) => count)) : 0;

  const loadExample = () => {
    setText('The quick brown fox jumps over the lazy dog.');
  };

  const exportAsCsv = () => {
    const csv = frequencyData.map(([char, count]) => `"${char.replace(/"/g, '""')}",${count}`).join('\n');
    navigator.clipboard.writeText(`Character,Frequency\n${csv}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
        aria-label="Text input"
      />

      {text ? (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Options</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="tb-v2-mode-tabs" role="group" aria-label="Case sensitivity">
              <button
                type="button"
                className={`tb-v2-mode-tab ${caseSensitive ? 'on' : ''}`}
                onClick={() => setCaseSensitive(true)}
              >
                Case sensitive
              </button>
              <button
                type="button"
                className={`tb-v2-mode-tab ${!caseSensitive ? 'on' : ''}`}
                onClick={() => setCaseSensitive(false)}
              >
                Ignore case
              </button>
            </div>
            <div className="tb-v2-mode-tabs" role="group" aria-label="Sort order">
              <button
                type="button"
                className={`tb-v2-mode-tab ${sortBy === 'frequency' ? 'on' : ''}`}
                onClick={() => setSortBy('frequency')}
              >
                By frequency
              </button>
              <button
                type="button"
                className={`tb-v2-mode-tab ${sortBy === 'character' ? 'on' : ''}`}
                onClick={() => setSortBy('character')}
              >
                By character
              </button>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Summary</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {[
                ['Total characters', totalChars],
                ['Unique characters', uniqueChars],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--tb-accent)', marginTop: 4 }}>{val.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Frequency distribution</span>
            {frequencyData.length > 0 && (
              <button type="button" onClick={exportAsCsv} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
                {copied ? 'Copied' : 'Export CSV'}
              </button>
            )}
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {frequencyData.map(([char, count]) => {
                const pct = totalChars > 0 ? ((count / totalChars) * 100).toFixed(1) : '0.0';
                const barPct = maxFrequency > 0 ? (count / maxFrequency) * 100 : 0;
                const { display, title } = formatChar(char);
                return (
                  <div
                    key={char}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr auto',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      title={title}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: 'var(--tb-bg-secondary)',
                        fontFamily: 'var(--f-mono)',
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {display}
                    </span>
                    <div>
                      <div
                        style={{
                          height: 8,
                          background: 'var(--tb-bg-secondary)',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${barPct}%`,
                            height: '100%',
                            background: 'var(--tb-accent)',
                            borderRadius: 999,
                            transition: 'width 0.25s ease',
                            minWidth: count > 0 ? 4 : 0,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        minWidth: 72,
                        textAlign: 'right',
                        fontSize: 12,
                        color: 'var(--tb-text-secondary)',
                        fontFamily: 'var(--f-mono)',
                      }}
                    >
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>
            Enter text to see per-character frequency counts
          </span>
        </div>
      )}
    </div>
  );
}
