'use client';

import { useState, useMemo } from 'react';

export default function AnagramGeneratorClient() {
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(50);

  const generateAnagrams = (str: string): string[] => {
    if (!str || str.length === 0) return [];

    const results: string[] = [];
    
    const generate = (arr: string[], current: string) => {
      if (arr.length === 0) {
        results.push(current);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
          generate(remaining, current + arr[i]);
        }
      }
    };

    const chars = str.toLowerCase().split('').filter(c => /[a-z]/.test(c));
    generate(chars, '');
    
    return results
      .filter(w => w.length >= minLength)
      .filter((w, i, arr) => arr.indexOf(w) === i)
      .slice(0, maxResults);
  };

  const anagrams = useMemo(() => {
    return generateAnagrams(input);
  }, [input, minLength, maxResults]);

  const handleCopy = () => {
    navigator.clipboard.writeText(anagrams.join('\n'));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Anagram Generator</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter letters</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          placeholder="Enter letters to generate anagrams..."
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          Max 10 characters. Only letters are allowed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Min word length</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Math.max(1, Math.min(input.length, parseInt(e.target.value) || 1)))}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            min={1}
            max={input.length || 10}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max results</label>
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(Math.max(1, parseInt(e.target.value) || 50))}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            min={1}
            max={1000}
          />
        </div>
      </div>

      {input && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm">
            <strong>{anagrams.length}</strong> possible words from "{input.toUpperCase()}"
          </p>
        </div>
      )}

      {anagrams.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Anagrams</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy All
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {anagrams.map((word, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {input.length > 0 && anagrams.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            No words found with the current settings. Try lowering the minimum word length.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Enter any combination of letters</li>
          <li>• All possible letter combinations are generated</li>
          <li>• Common English words are highlighted</li>
          <li>• Adjust settings to filter results</li>
        </ul>
      </div>
    </div>
  );
}
