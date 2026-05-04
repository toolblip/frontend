'use client';

import { useState, useCallback } from 'react';

function octalToDecimal(octal: string): string {
  const cleaned = octal.replace(/^0o/i, '').replace(/\s+/g, '');
  if (!/^[0-7]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 8).toString(10);
}

function octalToBinary(octal: string): string {
  const cleaned = octal.replace(/^0o/i, '').replace(/\s+/g, '');
  if (!/^[0-7]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 8).toString(2);
}

function octalToHex(octal: string): string {
  const cleaned = octal.replace(/^0o/i, '').replace(/\s+/g, '');
  if (!/^[0-7]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 8).toString(16).toUpperCase();
}

export default function OctalToDecimalClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ decimal: string; binary: string; hex: string } | null>(null);

  const process = useCallback(() => {
    if (!input.trim()) { setResults(null); return; }
    const decimal = octalToDecimal(input);
    if (!decimal) { setResults(null); return; }
    setResults({
      decimal,
      binary: octalToBinary(input),
      hex: octalToHex(input),
    });
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Octal Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter octal (e.g., 77, 0o77)..."
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
              { label: 'Binary', value: results.binary, prefix: '0b' },
              { label: 'Hexadecimal', value: results.hex, prefix: '0x' },
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
          Invalid octal. Use digits 0-7 (optional 0o prefix).
        </p>
      )}
    </div>
  );
}
