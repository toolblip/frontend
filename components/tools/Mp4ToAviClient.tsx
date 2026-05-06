'use client';

import { useState } from 'react';

export default function Mp4ToAviClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      setOutput(input.trim());
    } catch (e) {
      setError('Processing failed.');
      setOutput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">MP4 to AVI Converter</h1>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full h-40 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
        placeholder="Enter input..."
      />
      <button
        onClick={process}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Convert
      </button>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Output ({output.length} chars)</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-indigo-500 hover:text-indigo-600">Copy</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-40 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm bg-gray-50 dark:bg-gray-900"
          />
        </div>
      )}
    </div>
  );
}