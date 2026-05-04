'use client';

import { useState } from 'react';

export default function PunctuationFixerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<'smart' | 'basic'>('smart');

  const fixPunctuation = (text: string) => {
    if (!text.trim()) return '';

    // Fix spacing after punctuation
    let result = text.replace(/([.!?:,;])([A-Za-z])/g, '$1 $2');
    
    // Fix multiple spaces
    result = result.replace(/\s{2,}/g, ' ');
    
    // Fix quotes - convert to smart quotes if smart style
    if (style === 'smart') {
      result = result.replace(/"/g, '"').replace(/"/g, '"');
      result = result.replace(/'/g, ''').replace(/'/g, ''');
    }
    
    // Fix dashes
    result = result.replace(/--/g, '—');
    
    // Add proper spacing around dashes
    result = result.replace(/(\w)—(\w)/g, '$1 — $2');
    
    // Fix ellipsis
    result = result.replace(/\.{3}/g, '…');
    result = result.replace(/\s+\.{3}/g, '…');
    
    // Ensure proper sentence spacing
    result = result.replace(/([.!?])\s*([A-Z])/g, '$1 $2');
    
    // Fix missing punctuation at end
    if (result.length > 0 && !/[.!?]$/.test(result.trim())) {
      result = result.trim() + '.';
    }
    
    return result.trim();
  };

  const handleFix = () => {
    setOutput(fixPunctuation(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Punctuation Fixer</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as 'smart' | 'basic')}
          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="smart">Smart Quotes & Dashes</option>
          <option value="basic">Basic Punctuation</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text with punctuation issues</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-40 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste your text here..."
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleFix}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Fix Punctuation
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); }}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>

      {output && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Fixed text</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
