'use client';

import { useState, useMemo } from 'react';

const EXAMPLES = ['LISTEN', 'SILENT', 'EARTH', 'HEART', 'DUST'];

export default function AnagramGeneratorClient() {
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(50);
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

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

  const anagrams = useMemo(() => generateAnagrams(input), [input, minLength, maxResults]);

  const copy = () => {
    navigator.clipboard.writeText(anagrams.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = (word: string) => {
    setInput(word);
    setShowExamples(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Letters</span>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
        >
          📋 Examples
        </button>
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Try a word:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => loadExample(word)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-mono"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
        className="tb-v2-tool-textarea"
        placeholder="Enter letters (e.g., LISTEN)"
        maxLength={10}
        style={{ minHeight: 48, fontFamily: 'var(--f-mono)', textTransform: 'uppercase' }}
      />
      <p className="text-xs text-gray-500 mt-1">Max 10 characters. Only letters allowed.</p>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label">Min word length: {minLength}</label>
          <input
            type="range"
            min={1}
            max={input.length || 10}
            value={minLength}
            onChange={(e) => setMinLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="tb-v2-tool-label">Max results: {maxResults}</label>
          <input
            type="range"
            min={10}
            max={500}
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Results */}
      {input && anagrams.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{anagrams.length} anagrams found</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {anagrams.map((word, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg font-mono text-sm border border-indigo-200 dark:border-indigo-800"
              >
                {word}
              </span>
            ))}
          </div>
        </>
      )}

      {input.length > 0 && anagrams.length === 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            No words found. Try lowering the minimum word length.
          </p>
        </div>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔤</div>
          <p>Enter letters above to generate anagrams</p>
        </div>
      )}
    </div>
  );
}
