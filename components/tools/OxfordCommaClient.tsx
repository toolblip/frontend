'use client';

import { useState } from 'react';

function formatOxfordComma(items: string[]): string {
  const filtered = items.filter((item) => item.trim() !== '');
  if (filtered.length === 0) return '';
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  const last = filtered[filtered.length - 1];
  const rest = filtered.slice(0, -1);
  return `${rest.join(', ')}, and ${last}`;
}

export default function OxfordCommaClient() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<'comma' | 'newline'>('comma');

  const items = input
    .split(separator === 'comma' ? /[,\n]+/ : /\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const output = formatOxfordComma(items);

  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Item separator:</span>
        <div className="tb-v2-mode-tabs">
          {(['comma', 'newline'] as const).map((sep) => (
            <label key={sep} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="radio"
                name="separator"
                value={sep}
                checked={separator === sep}
                onChange={() => setSeparator(sep)}
                className="accent-red-600"
              />
              {sep === 'comma' ? 'Comma' : 'New line'}
            </label>
          ))}
        </div>
      </div>

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:6}}>
            Items {separator === 'comma' ? '(comma-separated)' : '(one per line)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              separator === 'comma'
                ? 'apple, banana, cherry, date'
                : 'apple\nbanana\ncherry\ndate'
            }
            rows={8}
            className="tb-v2-tool-textarea"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Formatted output</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}
            >
              Copy output
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={8}
            placeholder="Formatted list will appear here..."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      </div>

      {items.length >= 3 && (
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
          <strong>Oxford comma</strong> added before the final &ldquo;and&rdquo; for clarity.
        </div>
      )}
    </div>
  );
}
