'use client';

import { useState } from 'react';

export default function MetaTagGenProClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    if (!url) return;
    setResult('<!-- Meta tags for ' + url + ' -->');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Meta Tag Generator</h1>
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="tb-v2-input"
        placeholder="https://example.com"
      />
      <button
        onClick={generate}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Generate
      </button>
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Generated Code</span>
            <button onClick={() => navigator.clipboard.writeText(result)} className="text-indigo-500 hover:text-indigo-600">Copy</button>
          </div>
          <textarea
            value={result}
            readOnly
            className="tb-v2-input"
          />
        </div>
      )}
    </div>
  );
}