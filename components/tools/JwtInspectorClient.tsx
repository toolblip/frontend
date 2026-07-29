'use client';

import { useState } from 'react';

export default function JwtInspectorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError('Invalid JSON: ' + String(e));
      setOutput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">JWT Inspector</h1>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-input"
        placeholder="Paste JSON here..."
      />
      <button
        onClick={process}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Format / Process
      </button>
      {error && <div className="tb-v2-banner tb-v2-banner-err">{error}</div>}
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Output</span>
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