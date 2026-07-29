'use client';

import { useState } from 'react';

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export default function HashFromTextClient() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('sha256');
  const [output, setOutput] = useState('');

  const hashText = async (text: string, algo: HashAlgorithm): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo.toUpperCase().replace('SHA', 'SHA-'), data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleHash = async () => {
    if (!input) {
      setOutput('');
      return;
    }
    const hash = await hashText(input, algorithm);
    setOutput(hash);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => {
            setAlgorithm(e.target.value as HashAlgorithm);
            setOutput('');
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="md5">MD5</option>
          <option value="sha1">SHA-1</option>
          <option value="sha256">SHA-256</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>

      <button
        onClick={handleHash}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate Hash
      </button>

      {output && (
        <div className="flex-1">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Hash Output ({algorithm.toUpperCase()})
          </label>
          <pre className="w-full h-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm break-all">
            {output}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-2 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
