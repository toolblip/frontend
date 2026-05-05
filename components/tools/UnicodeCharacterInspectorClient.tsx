'use client';

import { useState, useCallback } from 'react';

export default function UnicodeCharacterInspectorClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{
    char: string;
    name: string;
    codePoint: string;
    hex: string;
    decimal: string;
    binary: string;
    utf8: string;
    html: string;
    category: string;
  }[]>([]);

  const inspect = useCallback(() => {
    const chars = [...input];
    const inspected = chars.map(char => {
      const code = char.codePointAt(0) || 0;
      const hex = code.toString(16).toUpperCase().padStart(4, '0');
      const binary = code.toString(2).padStart(16, '0');
      const utf8 = new TextEncoder().encode(char).reduce((a, b) => a + b.toString(16).toUpperCase().padStart(2, '0') + ' ', '').trim();
      return {
        char,
        name: getUnicodeName(code) || 'UNKNOWN',
        codePoint: `U+${hex}`,
        hex: `0x${hex}`,
        decimal: code.toString(),
        binary: binary.slice(0, 8) + ' ' + binary.slice(8),
        utf8,
        html: `&#${code};`,
        category: getCategory(code),
      };
    });
    setResults(inspected);
  }, [input]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Characters</span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter characters to inspect..."
        className="tb-v2-tool-input"
        aria-label="Character input"
      />
      <button type="button" onClick={inspect} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        Inspect
      </button>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Character Details</span>
          </div>
          <div className="tb-v2-tool-output-body">
            {results.map((r, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 32 }}>{r.char}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>{r.category}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, fontSize: 13 }}>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>Code point:</span> <code>{r.codePoint}</code></div>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>Hex:</span> <code>{r.hex}</code></div>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>Decimal:</span> <code>{r.decimal}</code></div>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>Binary:</span> <code>{r.binary}</code></div>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>UTF-8:</span> <code>{r.utf8}</code></div>
                  <div><span style={{ color: 'var(--tb-text-secondary)' }}>HTML:</span> <code>{r.html}</code></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getUnicodeName(code: number): string {
  const names: Record<number, string> = {
    32: 'SPACE', 33: 'EXCLAMATION MARK', 34: 'QUOTATION MARK', 48: 'DIGIT ZERO',
    65: 'LATIN CAPITAL LETTER A', 97: 'LATIN SMALL LETTER A',
  };
  return names[code] || '';
}

function getCategory(code: number): string {
  if (code >= 65 && code <= 90) return 'Uppercase Letter';
  if (code >= 97 && code <= 122) return 'Lowercase Letter';
  if (code >= 48 && code <= 57) return 'Digit';
  if (code >= 0x4E00 && code <= 0x9FFF) return 'CJK Unified Ideographs';
  return 'Other';
}