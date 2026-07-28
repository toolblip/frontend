'use client';

import { useState } from 'react';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.',
];

export default function ParagraphGeneratorClient() {
  const [count, setCount] = useState(3);
  const [text, setText] = useState('');

  const generate = () => {
    const paragraphs = Array.from({ length: count }, (_, i) => LOREM[i % LOREM.length]);
    setText(paragraphs.join('\n\n'));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paragraph Generator</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Generate placeholder paragraphs for testing and design.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Paragraphs: {count}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            className="w-full"
          />
        </div>

        <button
          onClick={generate}
          className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Generate
        </button>
      </div>

      {text && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Result</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(text).catch(() => {});
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap text-sm">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}
