'use client';

import { useState, useMemo } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 149.5 },
  { code: 'CAD', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', rate: 1.53 },
  { code: 'CHF', symbol: 'Fr', rate: 0.88 },
  { code: 'CNY', symbol: '¥', rate: 7.24 },
  { code: 'INR', symbol: '₹', rate: 83.12 },
  { code: 'MXN', symbol: '$', rate: 17.15 },
  { code: 'BRL', symbol: 'R$', rate: 4.97 },
  { code: 'SGD', symbol: 'S$', rate: 1.34 },
];

const EXAMPLE = `100 USD\n50 EUR\n2500 JPY\n75 GBP`;

function formatNumber(num: number): string {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface LineResult {
  raw: string;
  amount: number;
  fromCode: string;
  error?: string;
  converted?: number;
}

function convertLines(text: string, defaultFrom: string, toCode: string): LineResult[] {
  const to = currencies.find(c => c.code === toCode)!;
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(raw => {
      const match = raw.match(/^([\d,]+\.?\d*)\s*([A-Za-z]{3})?$/);
      if (!match) return { raw, amount: 0, fromCode: defaultFrom, error: 'Could not parse (expected "amount" or "amount CODE")' };

      const amount = parseFloat(match[1].replace(/,/g, ''));
      const fromCode = (match[2] || defaultFrom).toUpperCase();
      const from = currencies.find(c => c.code === fromCode);
      if (!from) return { raw, amount, fromCode, error: `Unknown currency code "${fromCode}"` };

      const usd = amount / from.rate;
      const converted = usd * to.rate;
      return { raw, amount, fromCode, converted };
    });
}

export default function CurrencyConverterV2Client() {
  const [input, setInput] = useState(EXAMPLE);
  const [defaultFrom, setDefaultFrom] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => convertLines(input, defaultFrom, toCode), [input, defaultFrom, toCode]);
  const to = currencies.find(c => c.code === toCode)!;

  const total = useMemo(
    () => results.reduce((sum, r) => sum + (r.converted ?? 0), 0),
    [results]
  );

  const loadExample = () => {
    setInput(EXAMPLE);
    setDefaultFrom('USD');
    setToCode('EUR');
  };

  const outputText = useMemo(
    () =>
      results
        .map(r => (r.error ? `${r.raw} -> error: ${r.error}` : `${r.raw} -> ${to.symbol}${formatNumber(r.converted!)} ${toCode}`))
        .join('\n'),
    [results, to, toCode]
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
        <span className="tb-v2-tool-label">Amounts (one per line, e.g. &quot;100 USD&quot;)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'100 USD\n50 EUR'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 140, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div style={{ padding: '0 20px 20px' }} className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Default currency (when a line has no code)</label>
          <select value={defaultFrom} onChange={e => setDefaultFrom(e.target.value)} className="tb-v2-input">
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Convert to</label>
          <select value={toCode} onChange={e => setToCode(e.target.value)} className="tb-v2-input">
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Converted ({results.length} lines, total {to.symbol}{formatNumber(total)} {toCode})</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length === 0 ? (
          <p className="tb-v2-empty">Enter amounts above, one per line, to convert them in a batch.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {results.map((r, i) => (
              <div key={i} className="tb-v2-tool-pre" style={{ padding: '8px 12px' }}>
                {r.error ? (
                  <span style={{ color: 'var(--red, #dc2626)' }}>{r.raw} &rarr; {r.error}</span>
                ) : (
                  <span>{r.raw} &rarr; {to.symbol}{formatNumber(r.converted!)} {toCode}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
