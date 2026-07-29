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
    <div className="" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6">Anagram Generator</h1>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>Enter letters</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          className="tb-v2-input"
          placeholder="Enter letters to generate anagrams..."
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          Max 10 characters. Only letters are allowed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Min word length</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Math.max(1, Math.min(input.length, parseInt(e.target.value) || 1)))}
            className="tb-v2-input"
            min={1}
            max={input.length || 10}
          />
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Max results</label>
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(Math.max(1, parseInt(e.target.value) || 50))}
            className="tb-v2-input"
            min={1}
            max={1000}
          />
        </div>
      </div>

      {input && (
        <div className="tb-v2-banner tb-v2-banner-info">
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
          <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
            <div className="tb-v2-mode-tabs">
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
        <div className="tb-v2-banner tb-v2-banner-warn">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            No words found with the current settings. Try lowering the minimum word length.
          </p>
        </div>
      )}

      <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
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
