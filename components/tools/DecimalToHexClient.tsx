'use client';

import { useState, useCallback } from 'react';

function decimalToHex(decimal: string, withPrefix = false, padZeros = false): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  let result = num.toString(16).toUpperCase();
  if (padZeros) result = result.padStart(Math.ceil(result.length / 2) * 2, '0');
  return withPrefix ? '0x' + result : result;
}

function decimalToBinary(decimal: string, withPrefix = false): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  const result = num.toString(2);
  return withPrefix ? '0b' + result : result;
}

function decimalToOctal(decimal: string, withPrefix = false): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  const result = num.toString(8);
  return withPrefix ? '0o' + result : result;
}

export default function DecimalToHexClient() {
  const [input, setInput] = useState('');
  const [withPrefix, setWithPrefix] = useState(false);
  const [padZeros, setPadZeros] = useState(false);
  const [results, setResults] = useState<{ hex: string; binary: string; octal: string } | null>(null);

  const process = useCallback(() => {
    if (!input.trim()) { setResults(null); return; }
    setResults({
      hex: decimalToHex(input, withPrefix, padZeros),
      binary: decimalToBinary(input, withPrefix),
      octal: decimalToOctal(input, withPrefix),
    });
  }, [input, withPrefix, padZeros]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={withPrefix}
            onChange={(e) => setWithPrefix(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
          />
          0x prefix
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={padZeros}
            onChange={(e) => setPadZeros(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
          />
          Pad zeros
        </label>
      </div>

      <div className="space-y-2">
        <label className="tb-v2-tool-label">Decimal Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter decimal (e.g., 255)..."
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500"
        />
      </div>

      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        Convert
      </button>

      {results && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Hexadecimal', value: results.hex },
              { label: 'Binary', value: results.binary },
              { label: 'Octal', value: results.octal },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                  <button onClick={() => copy(value)} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
