'use client';

import { useState, useCallback } from 'react';

function hexToDecimal(hex: string): string {
  const cleaned = hex.replace(/^0x/i, '').replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 16).toString(10);
}

function hexToBinary(hex: string): string {
  const cleaned = hex.replace(/^0x/i, '').replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 16).toString(2);
}

function hexToOctal(hex: string): string {
  const cleaned = hex.replace(/^0x/i, '').replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) return '';
  return parseInt(cleaned, 16).toString(8);
}

export default function HexToDecimalClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ decimal: string; binary: string; octal: string } | null>(null);

  const process = useCallback(() => {
    if (!input.trim()) { setResults(null); return; }
    const decimal = hexToDecimal(input);
    if (!decimal) { setResults(null); return; }
    setResults({
      decimal,
      binary: hexToBinary(input),
      octal: hexToOctal(input),
    });
  }, [input]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="space-y-2">
        <label className="tb-v2-tool-label">Hexadecimal Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter hex (e.g., FF, 0xFF)..."
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
              { label: 'Decimal', value: results.decimal },
              { label: 'Binary', value: results.binary, prefix: '0b' },
              { label: 'Octal', value: results.octal, prefix: '0o' },
            ].map(({ label, value, prefix }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                  <button onClick={() => copy(prefix ? prefix + value : value)} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
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
          Invalid hexadecimal. Use 0-9 and A-F (optional 0x prefix).
        </p>
      )}
    </div>
  );
}
