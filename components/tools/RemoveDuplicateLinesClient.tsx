'use client';

import { useState } from 'react';

export default function RemoveDuplicateLinesClient() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!input.trim()) return '';
    const lines = input.split('\n');
    const seen = new Set<string>();
    return lines
      .filter((line) => {
        const key = caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .join('\n');
  })();

  const stats = {
    original: input ? input.split('\n').length : 0,
    after: result ? result.split('\n').length : 0,
    removed: (input ? input.split('\n').length : 0) - (result ? result.split('\n').length : 0),
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-600"
          />
          Case-sensitive
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your text here (one item per line)..."
        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-green-500 placeholder-gray-500"
        aria-label="Text input"
      />

      {input && (
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">
            Original: <span className="text-white">{stats.original}</span> lines
          </span>
          <span className="text-gray-400">
            After: <span className="text-green-400">{stats.after}</span> lines
          </span>
          <span className="text-red-400">
            Removed: <span className="text-red-300">{stats.removed}</span> duplicates
          </span>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase">Result</span>
          {result && (
            <button onClick={copy} className="text-xs text-green-400 hover:text-green-300 transition-colors">
              {copied ? 'Copied!' : 'Copy result'}
            </button>
          )}
        </div>
        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
          {result || '—'}
        </pre>
      </div>
    </div>
  );
}
