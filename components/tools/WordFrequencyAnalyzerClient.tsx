'use client';

import { useState, useMemo } from 'react';

interface WordCount {
  word: string;
  count: number;
  percentage: number;
}

export default function WordFrequencyAnalyzerClient() {
  const [text, setText] = useState('');
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [minLength, setMinLength] = useState(0);
  const [sortBy, setSortBy] = useState<'count' | 'alphabetical'>('count');

  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  ]);

  const wordCounts = useMemo<WordCount[]>(() => {
    if (!text.trim()) return [];

    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length >= minLength)
      .filter(w => !excludeCommon || !commonWords.has(w));

    const counts: Record<string, number> = {};
    words.forEach(word => {
      counts[word] = (counts[word] || 0) + 1;
    });

    const total = words.length;
    const result: WordCount[] = Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10,
      }))
      .sort((a, b) => sortBy === 'count' ? b.count - a.count : a.word.localeCompare(b.word));

    return result;
  }, [text, excludeCommon, minLength, sortBy]);

  const handleCopy = () => {
    const output = wordCounts
      .map(w => `${w.word}: ${w.count} (${w.percentage}%)`)
      .join('\n');
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Word Frequency Analyzer</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-lg h-40 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or type your text here..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Min word length</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            min={0}
            max={20}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'count' | 'alphabetical')}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="count">Frequency</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={excludeCommon}
              onChange={(e) => setExcludeCommon(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Exclude common words</span>
          </label>
        </div>
      </div>

      {wordCounts.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm">
            <strong>{wordCounts.length}</strong> unique words found
          </p>
        </div>
      )}

      {wordCounts.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Word Frequencies</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-2 px-2">Word</th>
                  <th className="text-right py-2 px-2">Count</th>
                  <th className="text-right py-2 px-2">%</th>
                </tr>
              </thead>
              <tbody>
                {wordCounts.map((item, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-gray-600">
                    <td className="py-2 px-2 font-mono">{item.word}</td>
                    <td className="py-2 px-2 text-right">{item.count}</td>
                    <td className="py-2 px-2 text-right text-gray-500">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {text && wordCounts.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            No words match the current filters. Try adjusting the minimum word length or disabling "exclude common words".
          </p>
        </div>
      )}
    </div>
  );
}
