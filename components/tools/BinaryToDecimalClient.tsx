'use client';

import { useState, useCallback } from 'react';

function binaryToDecimal(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 2).toString(10);
}

function binaryToHex(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 2).toString(16).toUpperCase();
}

function binaryToOctal(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 2).toString(8);
}

export default function BinaryToDecimalClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ decimal: string; hex: string; octal: string } | null>(null);

  const process = useCallback(() => {
    if (!input.trim()) { setResults(null); return; }
    const decimal = binaryToDecimal(input);
    if (!decimal) { setResults(null); return; }
    setResults({
      decimal,
      hex: binaryToHex(input),
      octal: binaryToOctal(input),
    });
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Binary Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter binary (e.g., 101010)..."
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500"
        />
      </div>

      <button
        onClick={process}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        Convert
      </button>

      {results && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Decimal', value: results.decimal },
              { label: 'Hexadecimal', value: results.hex, prefix: '0x' },
              { label: 'Octal', value: results.octal, prefix: '0o' },
            ].map(({ label, value, prefix }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                  <button onClick={() => copy(prefix ? prefix + value : value)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">
                  {prefix ? prefix + value : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!results && input.length > 0 && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Invalid binary. Use only 0 and 1.
        </p>
      )}
    </div>
  );
}
