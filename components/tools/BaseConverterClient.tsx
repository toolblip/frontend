'use client';

import { useState } from 'react';

type NumberBase = 2 | 8 | 10 | 16;

export default function BaseConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>(10);
  const [toBase, setToBase] = useState<NumberBase>(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (value: string, from: NumberBase, to: NumberBase): string => {
    if (!value.trim()) return '';

    let decimal: number;
    if (from === 16) {
      decimal = parseInt(value.replace(/^0x/i, ''), 16);
    } else {
      decimal = parseInt(value, from);
    }

    if (isNaN(decimal)) {
      throw new Error('Invalid number');
    }

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
    } catch {
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
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const bases: { id: NumberBase; name: string; prefix: string }[] = [
    { id: 2, name: 'Binary', prefix: '0b' },
    { id: 8, name: 'Octal', prefix: '0o' },
    { id: 10, name: 'Decimal', prefix: '' },
    { id: 16, name: 'Hex', prefix: '0x' },
  ];

  const resultPrefix = toBase === 16 ? '0x' : toBase === 8 ? '0o' : toBase === 2 ? '0b' : '';

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>From</label>
          <select
            value={fromBase}
            onChange={(e) => { setFromBase(Number(e.target.value) as NumberBase); setResult(''); }}
            className="tb-v2-select"
          >
            {bases.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>To</label>
          <select
            value={toBase}
            onChange={(e) => { setToBase(Number(e.target.value) as NumberBase); setResult(''); }}
            className="tb-v2-select"
          >
            {bases.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.prefix || '0-9'})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setInput('255'); setFromBase(10); }} className="tb-v2-btn-sm">
            Load Example
          </button>
          <button type="button" onClick={handleClear} className="tb-v2-btn-sm">
            Clear
          </button>
        </div>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); setResult(''); setError(null); }}
        placeholder={`Enter ${bases.find(b => b.id === fromBase)?.name.toLowerCase()} number...`}
        className="tb-v2-input"
      />

      <div className="flex gap-2">
        <button type="button" onClick={handleConvert} disabled={!input.trim()} className="tb-v2-btn tb-v2-btn-primary" style={{ flex: 1 }}>
          Convert
        </button>
        <button type="button" onClick={handleSwap} className="tb-v2-btn">
          Swap
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!result && !error && (
        <p className="tb-v2-empty">
          Enter a number above and convert it between binary, octal, decimal, and hex.
        </p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
            <button type="button" onClick={copyResult} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <p className="text-2xl font-bold break-all text-gray-800 dark:text-gray-100">
              {resultPrefix}{result}
            </p>
          </div>
        </>
      )}

      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Quick Reference</h3>
        <div className="text-sm space-y-1">
          <div className="grid grid-cols-4 gap-2 text-gray-500 dark:text-gray-400">
            <span>Decimal</span>
            <span>Binary</span>
            <span>Octal</span>
            <span>Hex</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
            <span>0</span><span>0</span><span>0</span><span>0</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
            <span>1</span><span>1</span><span>1</span><span>1</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
            <span>10</span><span>1010</span><span>12</span><span>A</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
            <span>16</span><span>10000</span><span>20</span><span>10</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-gray-700 dark:text-gray-300">
            <span>255</span><span>11111111</span><span>377</span><span>FF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
