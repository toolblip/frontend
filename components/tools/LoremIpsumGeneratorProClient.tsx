'use client';

import { useState, useEffect } from 'react';

const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';

function getWords(count: number, startFrom = 0): string {
  const words = LOREM.split(' ');
  return Array.from({ length: count }, (_, i) => words[(startFrom + i) % words.length]).join(' ');
}

export default function LoremIpsumGeneratorProClient() {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [startLorem, setStartLorem] = useState(true);
  const [output, setOutput] = useState('');

  function generate() {
    if (unit === 'words') {
      const w = getWords(count, 0);
      setOutput(startLorem ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    } else if (unit === 'sentences') {
      const words = getWords(count * 10, 0);
      const parts = words.match(/[^.!?]+[.!?]+/g) || [words + '.'];
      setOutput(parts.slice(0, count).map((s, i) => i === 0 && startLorem ? s.charAt(0).toUpperCase() + s.slice(1) : s).join(' '));
    } else {
      let text = '';
      for (let p = 0; p < count; p++) {
        const pw = getWords(80, p * 80);
        const sentences = pw.match(/.{1,80}?(?:\s|$)/g) || [pw];
        text += (p > 0 ? '\n\n' : '') + sentences.map((s, i) => i === 0 && (p > 0 || startLorem) ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : s.trim()).join('. ') + (text && !text.endsWith('.') ? '.' : '');
      }
      setOutput(text.trim());
    }
  }

  useEffect(() => { generate(); }, []);
  useEffect(() => { generate(); }, [unit, count]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lorem Ipsum Generator Pro</h1>
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="number"
          value={count}
          onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 text-center font-mono"
          min={1} max={100}
        />
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          {(['words', 'sentences', 'paragraphs'] as const).map(u => (
            <button key={u} type="button" onClick={() => setUnit(u)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${unit === u ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {u}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={startLorem} onChange={e => setStartLorem(e.target.checked)} />
          Start with Lorem
        </label>
      </div>
      <button onClick={generate}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium">
        Regenerate
      </button>
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{output.split(/\s+/).length} words · {output.length} chars</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-indigo-500 hover:text-indigo-600">Copy</button>
          </div>
          <div className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 text-sm leading-relaxed text-gray-700 dark:text-gray-300 overflow-y-auto whitespace-pre-wrap">{output}</div>
        </div>
      )}
    </div>
  );
}
