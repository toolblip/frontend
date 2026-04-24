'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function UrlEncodeClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const result = (() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch {
      return 'Error: invalid encoded string';
    }
  })();

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {(['encode', 'decode'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              mode === m ? 'bg-red-600 text-black font-medium' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500 font-mono"
        aria-label={`${mode} input`}
      />

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase">Result</span>
          {result && (
            <button onClick={copy} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap break-all">
          {result || '-'}
        </pre>
      </div>
    </div>
  );
}
