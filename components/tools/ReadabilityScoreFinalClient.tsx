'use client';

import { useState } from 'react';

export default function ReadabilityScoreFinalClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(input.trim());
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Readability Score</h1>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full h-40 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
        placeholder="Enter text..."
      />
      <button
        onClick={process}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Process
      </button>
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