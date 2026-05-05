'use client';

import { useState } from 'react';

interface Props {
  tool?: {
    name: string;
    slug: string;
    description: string;
  };
}

export default function CreateZipFileClient({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // ZIP compression logic here
    setOutput(input);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool?.name ?? 'Create ZIP File'}</h1>
        <p className="text-gray-600 dark:text-gray-400">{tool?.description ?? 'Create ZIP archives from multiple files directly in your browser.'}</p>
      </div>

      <textarea
        className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-4"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="{Select files to compress into ZIP...}"
      />

      <button
        onClick={handleProcess}
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Process'}
      </button>

      {output && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Result:</h3>
          <textarea
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            rows={4}
            value={output}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
