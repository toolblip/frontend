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
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="tb-v2-mode-tabs">
        <select
          value={mode}
          onChange={e => setMode(e.target.value as SortMode)}
          className="tb-v2-select"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="length-asc">Shortest first</option>
          <option value="length-desc">Longest first</option>
          <option value="reverse">Reverse order</option>
          <option value="random">Random order</option>
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
      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:6}}>Input (one item per line)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="apple&#10;Banana&#10;cherry&#10;Apple"
            rows={8}
            className="tb-v2-tool-textarea"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Output</label>
            <button onClick={handleCopy} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}>Copy output</button>
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
