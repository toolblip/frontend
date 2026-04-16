'use client';

import { useState } from 'react';

type SortMode = 'az' | 'za' | 'length-asc' | 'length-desc' | 'reverse' | 'random' | 'unique';

export default function TextSorterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('az');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const sort = (text: string): string => {
    const lines = text.split('\n').filter(l => l.trim());
    let sorted: string[];
    switch (mode) {
      case 'az':
        sorted = [...lines].sort((a, b) => caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase()));
        break;
      case 'za':
        sorted = [...lines].sort((a, b) => caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase()));
        break;
      case 'length-asc':
        sorted = [...lines].sort((a, b) => a.length - b.length);
        break;
      case 'length-desc':
        sorted = [...lines].sort((a, b) => b.length - a.length);
        break;
      case 'reverse':
        sorted = [...lines].reverse();
        break;
      case 'random':
        sorted = [...lines].sort(() => Math.random() - 0.5);
        break;
      case 'unique':
        sorted = caseSensitive
          ? [...new Set(lines)]
          : [...new Set(lines.map(l => l.toLowerCase()))].map(l => lines.find(x => x.toLowerCase() === l) ?? l);
        break;
      default:
        sorted = lines;
    }
    return sorted.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sort(input));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={mode}
          onChange={e => setMode(e.target.value as SortMode)}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="length-asc">Shortest first</option>
          <option value="length-desc">Longest first</option>
          <option value="reverse">Reverse order</option>
          <option value="unique">Remove duplicates</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            className="rounded"
          />
          Case sensitive
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Input (one item per line)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="apple&#10;Banana&#10;cherry&#10;Apple"
            rows={8}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-green-500 resize-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Output</label>
            <button onClick={handleCopy} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium">Copy output</button>
          </div>
          <textarea
            value={sort(input)}
            readOnly
            rows={8}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
