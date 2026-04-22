'use client';

import { useState } from 'react';

interface GenericToolUIProps {
  inputLabel?: string;
  inputPlaceholder?: string;
  outputLabel?: string;
  process: (input: string) => string;
  actionLabel?: string;
  tools?: { inputLabel: string; description: string }[];
}

export default function GenericToolUI({
  inputLabel = 'Input',
  inputPlaceholder = 'Enter text...',
  outputLabel = 'Output',
  process,
  actionLabel = 'Process',
}: GenericToolUIProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setOutput(process(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={inputPlaceholder}
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-lg font-medium transition-colors"
        >
          Clear
        </button>
        {output && (
          <button
            onClick={handleCopy}
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {outputLabel}
          </label>
          <textarea
            value={output}
            readOnly
            rows={6}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
