'use client';

import { useState, useCallback } from 'react';

function decimalToBinary(decimal: string): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  return num.toString(2);
}

function decimalToHex(decimal: string): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  return num.toString(16).toUpperCase();
}

function decimalToOctal(decimal: string): string {
  const num = parseInt(decimal, 10);
  if (isNaN(num)) return '';
  return num.toString(8);
}

export default function DecimalToBinaryClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ binary: string; hex: string; octal: string } | null>(null);

  const process = useCallback(() => {
    if (!input.trim()) { setResults(null); return; }
    setResults({
      binary: decimalToBinary(input),
      hex: decimalToHex(input),
      octal: decimalToOctal(input),
    });
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="space-y-2">
        <label className="tb-v2-tool-label">Decimal Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter decimal number (e.g., 42)..."
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
              { label: 'Binary', value: results.binary, prefix: '0b' },
              { label: 'Hexadecimal', value: results.hex, prefix: '0x' },
              { label: 'Octal', value: results.octal, prefix: '0o' },
            ].map(({ label, value, prefix }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                  <button onClick={() => copy(value)} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">
                  {prefix}{value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
