'use client';

import { useState, useCallback } from 'react';

function generateRandomString(length: number, charset: string): string {
  let result = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

const CHARSETS = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  hex: '0123456789ABCDEF',
  ascii: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
  alphaNumericNoAmbiguous: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789',
};

export default function RandomStringClient() {
  const [length, setLength] = useState(16);
  const [charsetKey, setCharsetKey] = useState<keyof typeof CHARSETS>('alphanumeric');
  const [count, setCount] = useState(1);
  const [strings, setStrings] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const charset = CHARSETS[charsetKey];

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateRandomString(length, charset));
    }
    setStrings(results);
  }, [length, charset, count]);

  const copyString = useCallback((str: string, index: number) => {
    navigator.clipboard.writeText(str).catch(() => {});
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const presets = [
    { label: 'UUID', length: 36, charset: 'hex', count: 1, format: (s: string) => `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}` },
    { label: 'API Key', length: 32, charset: 'alphanumeric', count: 1, format: (s: string) => s },
    { label: 'Token (64-char)', length: 64, charset: 'alphanumeric', count: 1, format: (s: string) => s },
    { label: 'Salt', length: 32, charset: 'ascii', count: 1, format: (s: string) => s },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLength(preset.length);
              setCharsetKey(preset.charset as keyof typeof CHARSETS);
              setCount(preset.count);
              setTimeout(() => {
                const results: string[] = [];
                for (let i = 0; i < preset.count; i++) {
                  results.push(preset.format(generateRandomString(preset.length, CHARSETS[preset.charset as keyof typeof CHARSETS])));
                }
                setStrings(results);
              }, 0);
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
          <input
            type="number"
            min={1}
            max={1024}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Character Set</label>
          <select
            value={charsetKey}
            onChange={(e) => setCharsetKey(e.target.value as keyof typeof CHARSETS)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500"
          >
            <option value="alphanumeric">Alphanumeric (A-Z, a-z, 0-9)</option>
            <option value="alphaNumericNoAmbiguous">No Ambiguous (no 0, O, l, 1)</option>
            <option value="uppercase">Uppercase Only (A-Z)</option>
            <option value="lowercase">Lowercase Only (a-z)</option>
            <option value="numbers">Numbers Only (0-9)</option>
            <option value="hex">Hexadecimal (0-9, A-F)</option>
            <option value="ascii">Full ASCII (punctuation + symbols)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        Generate
      </button>

      {/* Results */}
      {strings.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {count > 1 ? `${count} Generated Strings` : 'Generated String'}
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {strings.map((str, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex justify-between items-center gap-3"
              >
                <div className="font-mono text-sm text-gray-900 dark:text-white break-all flex-1">{str}</div>
                <button
                  onClick={() => copyString(str, i)}
                  className="flex-shrink-0 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                >
                  {copied === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
