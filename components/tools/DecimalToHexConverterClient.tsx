'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = '255\n4096\n42\n1000000';

interface LineResult {
  raw: string;
  decimal?: number;
  hex?: string;
  binary?: string;
  error?: string;
}

function convertLines(text: string): LineResult[] {
  return text
    .split(/[\n,]/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(raw => {
      if (!/^-?\d+$/.test(raw)) return { raw, error: 'Not a whole number' };
      const decimal = parseInt(raw, 10);
      return { raw, decimal, hex: decimal.toString(16).toUpperCase(), binary: decimal.toString(2) };
    });
}

export default function DecimalToHexConverterClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => convertLines(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const outputText = useMemo(
    () => results.map(r => (r.error ? `${r.raw} -> error: ${r.error}` : `${r.raw} -> 0x${r.hex} (${r.binary})`)).join('\n'),
    [results]
  );

  const copy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Decimal Numbers (one per line)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'255\n4096'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Hex &amp; Binary (instant)</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length === 0 ? (
          <p className="tb-v2-empty">Enter decimal numbers above to convert them instantly.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {results.map((r, i) => (
              <div key={i} className="tb-v2-tool-pre" style={{ padding: '8px 12px' }}>
                {r.error ? (
                  <span style={{ color: 'var(--red, #dc2626)' }}>{r.raw} &rarr; {r.error}</span>
                ) : (
                  <span>{r.raw} &rarr; <strong>0x{r.hex}</strong> &middot; {r.binary}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
