'use client';

import { useState } from 'react';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'constant';

const CASES: { label: string; value: CaseType }[] = [
  { label: 'UPPERCASE', value: 'upper' },
  { label: 'lowercase', value: 'lower' },
  { label: 'Title Case', value: 'title' },
  { label: 'Sentence case', value: 'sentence' },
  { label: 'camelCase', value: 'camel' },
  { label: 'snake_case', value: 'snake' },
  { label: 'kebab-case', value: 'kebab' },
  { label: 'CONSTANT_CASE', value: 'constant' },
];

function toCase(text: string, type: CaseType): string {
  if (!text) return '';
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel': {
      const words = text.trim().split(/[\s_-]+/);
      return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }
    case 'snake': return text.trim().split(/[\s-]+/).map(w => w.toLowerCase()).join('_');
    case 'kebab': return text.trim().split(/[\s_]+/).map(w => w.toLowerCase()).join('-');
    case 'constant': return text.trim().split(/[\s-]+/).map(w => w.toUpperCase()).join('_');
    default: return text;
  }
}

export default function CaseConverterClient() {
  const [text, setText] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('upper');
  const [copied, setCopied] = useState(false);

  const result = toCase(text, selectedCase);

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500"
        aria-label="Text input"
      />

      <div className="flex flex-wrap gap-2">
        {CASES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedCase(value)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              selectedCase === value
                ? 'bg-red-600 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm min-h-[80px]">
        <span className="text-gray-300">{result || '-'}</span>
      </div>

      <button
        onClick={copy}
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy result'}
      </button>
    </div>
  );
}
