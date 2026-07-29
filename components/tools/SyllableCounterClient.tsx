'use client';

import { useState, useMemo } from 'react';

interface WordSyllable {
  word: string;
  syllables: number;
}

export default function SyllableCounterClient() {
  const [input, setInput] = useState('');

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    // Remove silent e at end
    word = word.replace(/e$/, '');
    
    // Count vowel groups
    const vowelGroups = word.match(/[aeiouy]+/g);
    let count = vowelGroups ? vowelGroups.length : 1;
    
    // Adjust for common patterns
    if (word.match(/[^aeiou]le$/)) count++;
    if (word.match(/[^aeiou]les$/)) count++;
    if (word.match(/[^aeiou]ed$/)) count--;
    if (word.match(/[^aeiou]es$/)) count--;
    if (word.match(/ie$/)) count++;
    if (word.match(/[^aeiou]le$/)) count++;
    
    return Math.max(1, count);
  };

  const { totalSyllables, wordBreakdown, uniqueSyllables } = useMemo(() => {
    if (!input.trim()) {
      return { totalSyllables: 0, wordBreakdown: [], uniqueSyllables: {} };
    }

    const words = input.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
    
    const breakdown: WordSyllable[] = words.map(word => ({
      word,
      syllables: countSyllables(word),
    }));

    const total = breakdown.reduce((sum, w) => sum + w.syllables, 0);

    // Count unique syllables
    const unique: Record<number, number> = {};
    breakdown.forEach(w => {
      unique[w.syllables] = (unique[w.syllables] || 0) + 1;
    });

    return { totalSyllables: total, wordBreakdown: breakdown, uniqueSyllables: unique };
  }, [input]);

  const handleCopy = () => {
    const output = wordBreakdown.map(w => `${w.word}: ${w.syllables}`).join('\n');
    navigator.clipboard.writeText(`Total syllables: ${totalSyllables}\n\n${output}`);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6">Syllable Counter</h1>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>Enter words or text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-input"
          placeholder="Enter words to count syllables..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate words with spaces. Only alphabetic characters are counted.
        </p>
      </div>

      {input && (
        <div className="tb-v2-banner tb-v2-banner-info">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {totalSyllables}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              total syllable{totalSyllables !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {wordBreakdown.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Word Breakdown</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
            <div className="tb-v2-mode-tabs">
              {wordBreakdown.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                >
                  <span className="font-mono">{item.word}</span>
                  <span className="text-gray-400 ml-1">({item.syllables})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {Object.keys(uniqueSyllables).length > 0 && (
        <div className="mb-6">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Syllable Distribution</label>
          <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
            <div className="flex flex-wrap gap-3">
              {Object.entries(uniqueSyllables)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([syllables, count]) => (
                  <div key={syllables} className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 font-bold">
                      {syllables}-syllable
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      × {count} word{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium mb-3">Quick Examples:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['hello', '2'],
            ['beautiful', '3'],
            ['syllable', '3'],
            ['world', '1'],
            ['important', '4'],
            ['extraordinary', '5'],
          ].map(([word, count]) => (
            <button
              key={word}
              onClick={() => setInput(prev => prev ? `${prev} ${word}` : word)}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <span className="font-mono font-bold">{word}</span>
              <span className="text-gray-500 ml-2">= {count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
        <h3 className="font-medium mb-2">How Syllables are Counted:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Each vowel group typically counts as one syllable</li>
          <li>• Silent 'e' at the end of words is not counted</li>
          <li>• Some word endings like '-le' add a syllable</li>
          <li>• This is an estimate - English pronunciation can vary</li>
        </ul>
      </div>
    </div>
  );
}
