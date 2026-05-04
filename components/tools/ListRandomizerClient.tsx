'use client';

import { useState, useMemo } from 'react';

export default function ListRandomizerClient() {
  const [input, setInput] = useState('');
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  const items = useMemo(() => {
    return input
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }, [input]);

  const randomize = () => {
    if (items.length === 0) return;

    const results: string[] = [];
    const available = [...items];

    if (allowDuplicates) {
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        results.push(available[randomIndex]);
      }
    } else {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        results.push(shuffled[i]);
      }
    }

    setResult(results);
  };

  const shuffleAll = () => {
    if (items.length === 0) return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setResult(shuffled);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.join('\n'));
  };

  const pickOne = () => {
    if (items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    setResult([items[randomIndex]]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">List Randomizer</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter items (one per line or comma separated)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-48 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Enter your items here, one per line or separated by commas..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Items to pick</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(items.length, parseInt(e.target.value) || 1)))}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            min={1}
            max={allowDuplicates ? 1000 : items.length}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Allow duplicates</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={randomize}
          disabled={items.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pick {count} Item{count !== 1 ? 's' : ''}
        </button>
        <button
          onClick={shuffleAll}
          disabled={items.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Shuffle All
        </button>
        <button
          onClick={pickOne}
          disabled={items.length === 0}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pick One
        </button>
        <button
          onClick={() => { setInput(''); setResult([]); }}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>

      {items.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm">
            <strong>{items.length}</strong> item{items.length !== 1 ? 's' : ''} loaded
          </p>
        </div>
      )}

      {result.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Result{result.length !== 1 ? 's' : ''}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {result.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-medium mb-3">Quick Examples:</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Team Selection', items: 'Alice\nBob\nCharlie\nDiana\nEve' },
            { label: 'Decision Maker', items: 'Yes,No,Maybe' },
            { label: 'Random Winner', items: 'John\nJane\nJim\nJill\nJack' },
            { label: 'Rock Paper Scissors', items: 'Rock,Paper,Scissors' },
          ].map((example) => (
            <button
              key={example.label}
              onClick={() => setInput(example.items)}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <div className="font-medium">{example.label}</div>
              <div className="text-xs text-gray-500 truncate">{example.items}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Enter items separated by new lines or commas</li>
          <li>• "Pick" selects random items from your list</li>
          <li>• "Shuffle" randomizes the order of all items</li>
          <li>• "Allow duplicates" lets the same item be picked multiple times</li>
        </ul>
      </div>
    </div>
  );
}
