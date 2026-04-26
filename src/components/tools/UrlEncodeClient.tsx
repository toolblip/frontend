'use client';

import React, { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function UrlEncodeClient() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleProcess() {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid URL-encoded string.');
      setOutput('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-red-600 text-white dark:bg-red-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-red-600 text-white dark:bg-red-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Decode
        </button>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />

      <button
        onClick={handleProcess}
        className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {output && !error && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Output</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={5}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
