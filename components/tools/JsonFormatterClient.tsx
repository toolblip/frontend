'use client';

import { useState } from 'react';

type Mode = 'format' | 'minify';

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!input.trim()) return '';
    try {
      const parsed = JSON.parse(input);
      setError('');
      if (mode === 'minify') {
        return JSON.stringify(parsed);
      }
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      setError((e as Error).message);
      return '';
    }
  })();

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {(['format', 'minify'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                mode === m ? 'bg-red-600 text-black font-medium' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
        {result && (
          <button onClick={copy} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(''); }}
        placeholder='{"key": "value"}'
        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500 font-mono"
        aria-label="JSON input"
      />

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
          <strong>Syntax error:</strong> {error}
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap break-all">
          {result || '-'}
        </pre>
      </div>
    </div>
  );
}
