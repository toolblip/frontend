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
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Item separator:</span>
        <div className="flex gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
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
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500 resize-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Formatted output</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
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
