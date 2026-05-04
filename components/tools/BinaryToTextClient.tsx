'use client';

import { useState, useCallback } from 'react';

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) return '';
  const bytes = cleaned.match(/.{1,8}/g) || [];
  return bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

function textToBinary(text: string): string {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export default function BinaryToTextClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toText' | 'toBinary'>('toText');
  const [output, setOutput] = useState('');

  const process = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(mode === 'toText' ? binaryToText(input) : textToBinary(input));
  }, [input, mode]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setMode(mode === 'toText' ? 'toBinary' : 'toText');
  }, [output, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['toText', 'toBinary'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {m === 'toText' ? 'Binary → Text' : 'Text → Binary'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {mode === 'toText' ? 'Binary Input' : 'Text Input'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toText' ? 'Enter binary (e.g., 01001000 01100101)...' : 'Enter text to convert...'}
          className="w-full h-32 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 resize-y"
        />
      </div>

      <button
        onClick={process}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        Convert
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <div className="flex gap-3">
              <button onClick={swap} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                Swap ↕
              </button>
              <button onClick={() => copy(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                Copy
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
