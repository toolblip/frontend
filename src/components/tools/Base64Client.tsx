'use client';

import React, { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleProcess() {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  }

  function handleSwap() {
    setMode(m => (m === 'encode' ? 'decode' : 'encode'));
    setInput(output);
    setOutput('');
    setError('');
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
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />

      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        {output && (
          <button
            onClick={handleSwap}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Swap ↔
          </button>
        )}
      </div>

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
