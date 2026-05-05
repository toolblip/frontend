'use client';

import { useState } from 'react';

type Base = 2 | 10 | 16;

export default function BinHexDecConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const bases: { id: Base; name: string; prefix: string }[] = [
    { id: 2, name: 'Binary', prefix: '0b' },
    { id: 10, name: 'Decimal', prefix: '' },
    { id: 16, name: 'Hexadecimal', prefix: '0x' },
  ];

  const convert = (value: string, from: Base): { bin: string; dec: string; hex: string } | null => {
    if (!value.trim()) return null;

    try {
      let decimal: number;
      if (from === 16) {
        decimal = parseInt(value.replace(/^0x/i, ''), 16);
      } else if (from === 2) {
        decimal = parseInt(value.replace(/^0b/i, ''), 2);
      } else {
        decimal = parseInt(value, 10);
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
        return num < 0 ? '-' + result : result;
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
        return num < 0 ? '-' + result : result;
      };

      return {
        bin: toBinary(decimal),
        dec: decimal.toString(),
        hex: toHex(decimal),
      };
    } catch {
      return null;
    }
  };

  const handleConvert = () => {
    setError(null);
    const converted = convert(input, fromBase);
    if (converted) {
      setResult(`Binary: 0b${converted.bin}\nDecimal: ${converted.dec}\nHexadecimal: 0x${converted.hex}`);
    } else {
      setError('Invalid number format');
    }
  };

  const handleSwap = () => {
    // Cycle through bases
    const currentIndex = bases.findIndex(b => b.id === fromBase);
    const nextBase = bases[(currentIndex + 1) % bases.length];
    setFromBase(nextBase.id);
    setInput('');
    setResult('');
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError(null);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  const fillFromResult = (baseValue: string, baseType: Base) => {
    setInput(baseValue);
    setFromBase(baseType);
    setResult('');
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Bin-Hex-Dec Converter</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Convert between Binary, Hexadecimal, and Decimal</p>

      {/* Base Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Input Base</label>
        <select
          value={fromBase}
          onChange={(e) => { setFromBase(Number(e.target.value) as Base); setResult(''); }}
          className="tb-v2-input"
        >
          {bases.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Input Value</label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(''); setError(null); }}
          placeholder={`Enter ${bases.find(b => b.id === fromBase)?.name.toLowerCase()} number...`}
          className="tb-v2-input"
        />
      </div>

      {/* Actions */}
      <div className="tb-v2-flex tb-v2-gap-2">
        <button onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
          Convert
        </button>
        <button onClick={handleSwap} className="tb-v2-btn tb-v2-btn-secondary">
          ⇄ Next Base
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-4">
            <label className="tb-v2-label tb-v2-mb-0">All Conversions</label>
            <button onClick={copyResult} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy
            </button>
          </div>

          <div className="tb-v2-space-y-3">
            {result.split('\n').map((line, i) => {
              const [label, value] = line.split(': ');
              const baseType = label.includes('Binary') ? 2 : label.includes('Decimal') ? 10 : 16;
              return (
                <div key={i} className="tb-v2-p-3 tb-v2-bg-gray-50 tb-v2-rounded-lg">
                  <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
                    <span className="tb-v2-text-sm tb-v2-text-gray-500">{label}:</span>
                    <button
                      onClick={() => fillFromResult(value.trim(), baseType as Base)}
                      className="tb-v2-text-xs tb-v2-text-blue-600 tb-v2-hover:underline"
                    >
                      Use as input
                    </button>
                  </div>
                  <p className="tb-v2-text-xl tb-v2-font-mono tb-v2-font-bold">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Reference</h3>
        <div className="tb-v2-text-sm">
          <div className="tb-v2-grid tb-v2-grid-cols-3 tb-v2-gap-2 tb-v2-font-mono">
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <span className="tb-v2-text-gray-500">Dec</span>
              <div>0, 1, 10, 255</div>
            </div>
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <span className="tb-v2-text-gray-500">Bin</span>
              <div>0, 1, 1010, 11111111</div>
            </div>
            <div className="tb-v2-bg-white tb-v2-p-2 tb-v2-rounded">
              <span className="tb-v2-text-gray-500">Hex</span>
              <div>0, 1, A, FF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
