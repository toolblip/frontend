'use client';

import { useState } from 'react';

type NumberBase = 2 | 8 | 10 | 16;

export default function BaseConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>(10);
  const [toBase, setToBase] = useState<NumberBase>(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = (value: string, from: NumberBase, to: NumberBase): string => {
    if (!value.trim()) return '';

    // Parse to decimal
    let decimal: number;
    if (from === 16) {
      decimal = parseInt(value.replace(/^0x/i, ''), 16);
    } else {
      decimal = parseInt(value, from);
    }

    if (isNaN(decimal)) {
      throw new Error('Invalid number');
    }

    // Convert from decimal to target base
    if (decimal === 0) return '0';

    const chars = '0123456789ABCDEF';
    let result = '';
    let num = Math.abs(decimal);

    while (num > 0) {
      result = chars[num % to] + result;
      num = Math.floor(num / to);
    }

    return decimal < 0 ? '-' + result : result;
  };

  const handleConvert = () => {
    setError(null);
    setResult('');

    if (!input.trim()) return;

    try {
      const converted = convert(input, fromBase, toBase);
      setResult(converted);
    } catch (err) {
      setError('Invalid number format for the selected base');
    }
  };

  const handleSwap = () => {
    const temp = fromBase;
    setFromBase(toBase);
    setToBase(temp);
    setInput(result);
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

  const bases: { id: NumberBase; name: string; prefix: string }[] = [
    { id: 2, name: 'Binary', prefix: '0b' },
    { id: 8, name: 'Octal', prefix: '0o' },
    { id: 10, name: 'Decimal', prefix: '' },
    { id: 16, name: 'Hex', prefix: '0x' },
  ];

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Base Converter</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Convert between binary, decimal, hexadecimal, and octal</p>

      {/* Base Selection */}
      <div className="tb-v2-card">
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
          <div>
            <label className="tb-v2-label">From</label>
            <select
              value={fromBase}
              onChange={(e) => { setFromBase(Number(e.target.value) as NumberBase); setResult(''); }}
              className="tb-v2-input"
            >
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="tb-v2-label">To</label>
            <select
              value={toBase}
              onChange={(e) => { setToBase(Number(e.target.value) as NumberBase); setResult(''); }}
              className="tb-v2-input"
            >
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Input</label>
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
          Convert →
        </button>
        <button onClick={handleSwap} className="tb-v2-btn tb-v2-btn-secondary">
          ⇄ Swap
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
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
            <label className="tb-v2-label tb-v2-mb-0">Result</label>
            <button onClick={copyResult} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy
            </button>
          </div>
          <div className="tb-v2-p-4 tb-v2-bg-green-50 tb-v2-rounded-lg">
            <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-green-800 tb-v2-break-all">
              {toBase === 16 ? '0x' : toBase === 8 ? '0o' : toBase === 2 ? '0b' : ''}{result}
            </p>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Reference</h3>
        <div className="tb-v2-text-sm tb-v2-space-y-1">
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span className="tb-v2-text-gray-500">Decimal</span>
            <span className="tb-v2-text-gray-500">Binary</span>
            <span className="tb-v2-text-gray-500">Octal</span>
            <span className="tb-v2-text-gray-500">Hex</span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span>0</span><span>0</span><span>0</span><span>0</span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span>1</span><span>1</span><span>1</span><span>1</span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span>10</span><span>1010</span><span>12</span><span>A</span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span>16</span><span>10000</span><span>20</span><span>10</span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-4 tb-v2-gap-2">
            <span>255</span><span>11111111</span><span>377</span><span>FF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
