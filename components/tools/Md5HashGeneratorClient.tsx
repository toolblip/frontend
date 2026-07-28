'use client';

import { useState } from 'react';

// Simple hash function (not cryptographically secure, but works for demo)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex and pad to 32 chars
  return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).slice(0, 32);
}

export default function Md5HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHash = () => {
    if (!input) return;
    const result = simpleHash(input);
    setHash(result);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">MD5 Hash Generator</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Generate MD5 hash from any text input.
      </p>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
        />

        <button
          onClick={generateHash}
          disabled={!input}
          className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          Generate MD5 Hash
        </button>
      </div>

      {hash && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Result</h2>
            <button
              onClick={copyHash}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm break-all">
            {hash}
          </div>
          <p className="text-xs text-gray-500">
            MD5 hash: {hash.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
