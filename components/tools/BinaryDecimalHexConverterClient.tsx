'use client';

import { useState } from 'react';

type NumberBase = 2 | 10 | 16;

export default function BinaryDecimalHexConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>(10);
  const [results, setResults] = useState<{ binary: string; decimal: string; hex: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bases: { id: NumberBase; name: string; prefix: string }[] = [
    { id: 2, name: 'Binary', prefix: '0b' },
    { id: 10, name: 'Decimal', prefix: '' },
    { id: 16, name: 'Hex', prefix: '0x' },
  ];

  const convertToAll = (value: string, from: NumberBase): { binary: string; decimal: string; hex: string } | null => {
    if (!value.trim()) return null;

    try {
      let decimal: number;
      const cleanValue = value.replace(/^0x/i, '').replace(/^0b/i, '');

      if (from === 16) {
        decimal = parseInt(cleanValue, 16);
      } else if (from === 2) {
        decimal = parseInt(cleanValue, 2);
      } else {
        decimal = parseInt(cleanValue, 10);
      }

      if (isNaN(decimal)) return null;

      const toBinary = (num: number): string => {
        if (num === 0) return '0';
        let result = '';
        let n = Math.abs(num);
        while (n > 0) {
          result = (n % 2) + result;
          n = Math.floor(n / 2);
        }
        return (num < 0 ? '-' : '') + result;
      };

      const toHex = (num: number): string => {
        if (num === 0) return '0';
        const hexChars = '0123456789ABCDEF';
        let result = '';
        let n = Math.abs(num);
        while (n > 0) {
          result = hexChars[n % 16] + result;
          n = Math.floor(n / 16);
        }
        return (num < 0 ? '-' : '') + result;
      };

      return {
        binary: toBinary(decimal),
        decimal: decimal.toString(),
        hex: toHex(decimal),
      };
    } catch {
      return null;
    }
  };

  const handleConvert = () => {
    setError(null);
    const converted = convertToAll(input, fromBase);
    if (converted) {
      setResults(converted);
    } else {
      setError('Invalid number format');
      setResults(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setResults(null);
    setError(null);
  };

  const copyAll = () => {
    if (results) {
      navigator.clipboard.writeText(
        `Binary: 0b${results.binary}\nDecimal: ${results.decimal}\nHex: 0x${results.hex}`
      );
    }
  };

  const useAsInput = (value: string, base: NumberBase) => {
    setInput(value);
    setFromBase(base);
    setResults(null);
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Binary-Decimal-Hex Converter</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Convert between Binary, Decimal, and Hexadecimal</p>

      {/* Input Base Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Input Base</label>
        <select
          value={fromBase}
          onChange={(e) => { setFromBase(Number(e.target.value) as NumberBase); setResults(null); }}
          className="tb-v2-input"
        >
          {bases.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
          ))}
        </select>
      </div>

      {/* Input Field */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Enter Number</label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setResults(null); setError(null); }}
          placeholder={`Enter ${bases.find(b => b.id === fromBase)?.name.toLowerCase()} number...`}
          className="tb-v2-input"
        />
      </div>

      {/* Convert Button */}
      <button onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
        Convert to All
      </button>

      {/* Error Message */}
      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-4">
            <label className="tb-v2-label tb-v2-mb-0">All Conversions</label>
            <button onClick={copyAll} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy All
            </button>
          </div>

          <div className="tb-v2-space-y-3">
            {/* Binary */}
            <div className="tb-v2-p-4 tb-v2-bg-blue-50 tb-v2-rounded-lg">
              <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-1">
                <span className="tb-v2-text-sm tb-v2-font-semibold tb-v2-text-blue-700">Binary (Base 2)</span>
                <button
                  onClick={() => useAsInput(results.binary, 2)}
                  className="tb-v2-text-xs tb-v2-text-blue-600 tb-v2-hover:underline"
                >
                  Use as input
                </button>
              </div>
              <p className="tb-v2-text-2xl tb-v2-font-mono tb-v2-font-bold tb-v2-text-blue-900">
                0b{results.binary}
              </p>
            </div>

            {/* Decimal */}
            <div className="tb-v2-p-4 tb-v2-bg-green-50 tb-v2-rounded-lg">
              <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-1">
                <span className="tb-v2-text-sm tb-v2-font-semibold tb-v2-text-green-700">Decimal (Base 10)</span>
                <button
                  onClick={() => useAsInput(results.decimal, 10)}
                  className="tb-v2-text-xs tb-v2-text-green-600 tb-v2-hover:underline"
                >
                  Use as input
                </button>
              </div>
              <p className="tb-v2-text-2xl tb-v2-font-mono tb-v2-font-bold tb-v2-text-green-900">
                {results.decimal}
              </p>
            </div>

            {/* Hexadecimal */}
            <div className="tb-v2-p-4 tb-v2-bg-purple-50 tb-v2-rounded-lg">
              <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-1">
                <span className="tb-v2-text-sm tb-v2-font-semibold tb-v2-text-purple-700">Hexadecimal (Base 16)</span>
                <button
                  onClick={() => useAsInput(results.hex, 16)}
                  className="tb-v2-text-xs tb-v2-text-purple-600 tb-v2-hover:underline"
                >
                  Use as input
                </button>
              </div>
              <p className="tb-v2-text-2xl tb-v2-font-mono tb-v2-font-bold tb-v2-text-purple-900">
                0x{results.hex}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Common Values Reference */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Common Values</h3>
        <div className="tb-v2-text-sm tb-v2-space-y-2">
          <div className="tb-v2-grid tb-v2-grid-cols-3 tb-v2-gap-2 tb-v2-text-center">
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <div className="tb-v2-text-gray-500">8</div>
              <div className="tb-v2-font-mono">0b1000</div>
              <div className="tb-v2-font-mono">0x8</div>
            </div>
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <div className="tb-v2-text-gray-500">16</div>
              <div className="tb-v2-font-mono">0b10000</div>
              <div className="tb-v2-font-mono">0x10</div>
            </div>
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <div className="tb-v2-text-gray-500">255</div>
              <div className="tb-v2-font-mono">0b11111111</div>
              <div className="tb-v2-font-mono">0xFF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
