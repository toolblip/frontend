'use client';

import React, { useState } from 'react';

type CaseType = 'UPPERCASE' | 'lowercase' | 'Title Case' | 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase';

const CASES: CaseType[] = ['UPPERCASE', 'lowercase', 'Title Case', 'camelCase', 'snake_case', 'kebab-case', 'PascalCase'];

function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
function toCamelCase(s: string) {
  const w = s.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean);
  return w[0].toLowerCase() + w.slice(1).map(toTitleCase).join('');
}
function toSnakeCase(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean).join('_').toLowerCase();
}
function toKebabCase(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean).join('-').toLowerCase();
}
function toPascalCase(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean).map(toTitleCase).join('');
}

function convert(text: string, type: CaseType): string {
  if (!text.trim()) return '';
  switch (type) {
    case 'UPPERCASE': return text.toUpperCase();
    case 'lowercase': return text.toLowerCase();
    case 'Title Case': return toTitleCase(text);
    case 'camelCase': return toCamelCase(text);
    case 'snake_case': return toSnakeCase(text);
    case 'kebab-case': return toKebabCase(text);
    case 'PascalCase': return toPascalCase(text);
  }
}

export default function CaseConverterClient() {
  const [input, setInput] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType>('camelCase');
  const [copied, setCopied] = useState(false);

  const output = convert(input, activeCase);

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {CASES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCase(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCase === c
                ? 'bg-red-600 text-white dark:bg-red-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Output</label>
            <button
              onClick={copy}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={4}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
