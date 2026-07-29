'use client';

import { useState } from 'react';

export default function PlainTextFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(input.trim());
  };

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">Plain Text Formatter</h1>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
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
            className="tb-v2-input"
          />
        </div>
      )}
    </div>
  );
}