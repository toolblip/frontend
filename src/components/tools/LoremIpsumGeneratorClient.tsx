'use client';

import { useState } from 'react';

function generateLorem(words: number, type: 'words' | 'sentences' | 'paragraphs'): string {
  const pool = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
  if (type === 'words') return Array.from({ length: words }, () => pool[Math.floor(Math.random() * pool.length)]).join(' ');
  if (type === 'sentences') {
    let result = '';
    let wordCount = 0;
    while (wordCount < words) {
      const sentenceLen = Math.floor(Math.random() * 10) + 8;
      const sentence = Array.from({ length: sentenceLen }, () => pool[Math.floor(Math.random() * pool.length)]).join(' ');
      result += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
      wordCount += sentenceLen;
    }
    return result.trim();
  }
  // paragraphs
  return Array.from({ length: words }, (_, i) => {
    const paraLen = Math.floor(Math.random() * 40) + 20;
    const para = Array.from({ length: paraLen }, () => pool[Math.floor(Math.random() * pool.length)]).join(' ');
    return para.charAt(0).toUpperCase() + para.slice(1) + '.';
  }).join('\n\n');
}

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateLorem(count, type));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Count:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Type:</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as typeof type)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          Generate
        </button>
        {output && (
          <button
            onClick={handleCopy}
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Copy
          </button>
        )}
      </div>
      {output && (
        <div>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
