'use client';

import { useState } from 'react';

interface Props {
  tool: {
    name: string;
    slug: string;
    description: string;
  };
}

export default function ImageToBase64Client({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement ImageToBase64Client logic
      setOutput(`Processed: ${input}`);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <textarea
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
            placeholder="Enter your text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Process'}
        </button>
        
        {output && (
          <div>
            <label className="block text-sm font-medium mb-2">Output</label>
            <pre className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
