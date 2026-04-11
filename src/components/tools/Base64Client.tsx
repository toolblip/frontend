'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        setError('');
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        setError('');
        return decodeURIComponent(escape(atob(input)));
      }
    } catch {
      setError('Invalid Base64 string');
      return '';
    }
  })();

  const copy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {(['encode', 'decode'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              mode === m ? 'bg-green-600 text-black font-medium' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(''); }}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-green-500 placeholder-gray-500 font-mono"
        aria-label={`${mode} input`}
      />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase">Result</span>
          {result && (
            <button onClick={copy} className="text-xs text-green-400 hover:text-green-300 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
          {result || '—'}
        </pre>
      </div>

      <p className="text-xs text-gray-500">
        100% client-side. Your text never leaves your browser.
      </p>
    </div>
  );
}
