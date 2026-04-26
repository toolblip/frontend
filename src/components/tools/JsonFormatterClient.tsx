'use client';

import React, { useState } from 'react';

type Mode = 'format' | 'minify';

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleProcess() {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => { setMode('format'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'format'
              ? 'bg-red-600 text-white dark:bg-red-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Pretty Print
        </button>
        <button
          onClick={() => { setMode('minify'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'minify'
              ? 'bg-red-600 text-white dark:bg-red-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Minify
        </button>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste your JSON here, e.g. {"name": "Toolblip", "version": 1}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />

      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
        </button>
        {input && (
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400 font-mono">
          {error}
        </div>
      )}

      {output && !error && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Output <span className="text-xs text-gray-400">({output.length} chars)</span>
            </label>
            <button
              onClick={handleCopy}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
