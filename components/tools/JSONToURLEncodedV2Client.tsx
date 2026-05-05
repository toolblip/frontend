'use client';

import { useState } from 'react';

interface Props {
  tool?: { name?: string; slug?: string; description?: string };
}

export default function JSONToURLEncodedV2Client({ tool = { name: '', slug: '', description: '' } }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const convert = () => {
    setIsLoading(true);
    try {
      const obj = JSON.parse(input);
      const encoded = new URLSearchParams(obj).toString();
      setOutput(encoded);
    } catch {
      setOutput('Invalid JSON');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool?.name || 'JSON to URL Encoded V2'}</h1>
        <p className="text-gray-600 dark:text-gray-400">{tool?.description || 'Convert JSON to URL encoded format'}</p>
      </div>
      <textarea className="w-full p-3 border rounded dark:bg-gray-800 mb-3" rows={6} placeholder="Enter JSON..." value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={convert} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {isLoading ? 'Converting...' : 'Convert'}
      </button>
      {output && <textarea className="w-full p-3 border rounded dark:bg-gray-800 mt-3" rows={4} readOnly value={output} />}
    </div>
  );
}
