'use client';

import { useState } from 'react';

type NumberBase = 2 | 8 | 10 | 16 | 32;

const baseChars: Record<NumberBase, string> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789ABCDEF',
  32: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

export default function BaseConvertToolClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>(10);
  const [toBase, setToBase] = useState<NumberBase>(16);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAllConversions, setShowAllConversions] = useState(false);

  const isValidForBase = (value: string, base: NumberBase): boolean => {
    const chars = baseChars[base].toUpperCase();
    for (const char of value.toUpperCase()) {
      if (!chars.includes(char)) {
        return false;
      }
    }
    return true;
  };

  const convertBase = (value: string, from: NumberBase, to: NumberBase): string => {
    if (!value.trim()) return '';

    // Parse input as decimal number
    let decimal: bigint;
    try {
      decimal = BigInt(value.replace(/^0x/i, ''));
    } catch {
      throw new Error('Invalid number format');
    }

    if (decimal < BigInt(0)) {
      // Handle negative numbers
      const absDecimal = -decimal;
      const chars = baseChars[to];
      let result = '';
      let div = absDecimal;
      
      if (div === BigInt(0)) {
        result = chars[0];
      }
      
      while (div > BigInt(0)) {
        result = chars[Number(div % BigInt(to))] + result;
        div = div / BigInt(to);
      }
      
      return '-' + result;
    }

    // Handle zero
    if (decimal === BigInt(0)) {
      return '0';
    }

    // Convert to target base
    const chars = baseChars[to];
    let result = '';
    let num = decimal;

    while (num > BigInt(0)) {
      const remainder = Number(num % BigInt(to));
      result = chars[remainder] + result;
      num = num / BigInt(to);
    }

    return result;
  };

  const handleConvert = () => {
    setError(null);
    setResult('');

    if (!input.trim()) {
      return;
    }

    // Check if input is valid for source base
    const cleanInput = input.trim().replace(/^0x/i, '');
    if (!isValidForBase(cleanInput, fromBase)) {
      setError(`Invalid character for base ${fromBase}. Allowed: ${baseChars[fromBase]}`);
      return;
    }

    try {
      const converted = convertBase(cleanInput, fromBase, toBase);
      setResult(converted);
    } catch (err) {
      setError('Invalid number format');
    }
  };

  const handleSwap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setInput(result);
    setResult('');
    setError(null);
  };

  const getAllConversions = () => {
    if (!input.trim()) return null;

    const cleanInput = input.trim().replace(/^0x/i, '');
    if (!isValidForBase(cleanInput, fromBase)) {
      return null;
    }

    try {
      const decimal = BigInt(cleanInput);
      const bases: NumberBase[] = [2, 8, 10, 16, 32];
      
      return bases.map(base => {
        if (base === fromBase) return { base, value: cleanInput.toUpperCase(), current: true };
        try {
          return { base, value: convertBase(cleanInput, fromBase, base), current: false };
        } catch {
          return { base, value: 'Error', current: false };
        }
      });
    } catch {
      return null;
    }
  };

  const conversions = getAllConversions();

  const bases: { id: NumberBase; name: string }[] = [
    { id: 2, name: 'Binary (2)' },
    { id: 8, name: 'Octal (8)' },
    { id: 10, name: 'Decimal (10)' },
    { id: 16, name: 'Hex (16)' },
    { id: 32, name: 'Base 32' },
  ];

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Number Base Converter</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Convert between binary, decimal, hexadecimal, octal, and base-32</p>

      {/* From Base */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-gap-2">
          <div className="tb-v2-flex-1">
            <label className="tb-v2-label">From Base</label>
            <select
              value={fromBase}
              onChange={(e) => { setFromBase(Number(e.target.value) as NumberBase); setResult(''); }}
              className="tb-v2-input"
            >
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="tb-v2-flex-1">
            <label className="tb-v2-label">To Base</label>
            <select
              value={toBase}
              onChange={(e) => { setToBase(Number(e.target.value) as NumberBase); setResult(''); }}
              className="tb-v2-input"
            >
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Number</label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(''); setError(null); }}
          placeholder={fromBase === 16 ? 'e.g., FF, 0x1A' : fromBase === 2 ? 'e.g., 1010' : 'Enter number'}
          className="tb-v2-input"
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
          {fromBase === 16 && 'Hexadecimal: 0-9, A-F'}
          {fromBase === 2 && 'Binary: 0, 1'}
          {fromBase === 8 && 'Octal: 0-7'}
          {fromBase === 10 && 'Decimal: 0-9'}
          {fromBase === 32 && 'Base 32: 0-9, A-V'}
        </p>
      </div>

      {/* Actions */}
      <div className="tb-v2-flex tb-v2-gap-2">
        <button onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
          Convert →
        </button>
        <button onClick={handleSwap} className="tb-v2-btn tb-v2-btn-secondary">
          ⇄ Swap
        </button>
        <button
          onClick={() => setShowAllConversions(!showAllConversions)}
          className="tb-v2-btn tb-v2-btn-secondary"
        >
          {showAllConversions ? 'Hide' : 'Show'} All
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
            <label className="tb-v2-label tb-v2-mb-0">Result (Base {toBase})</label>
            <button onClick={copyResult} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy
            </button>
          </div>
          <div className="tb-v2-p-4 tb-v2-bg-blue-50 tb-v2-rounded-lg">
            <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-blue-800 tb-v2-break-all">
              {result}
            </p>
          </div>
        </div>
      )}

      {/* All Conversions */}
      {showAllConversions && conversions && (
        <div className="tb-v2-card">
          <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">All Conversions</h3>
          <div className="tb-v2-grid tb-v2-grid-cols-1 tb-v2-gap-2">
            {conversions.map(conv => (
              <div
                key={conv.base}
                className={`tb-v2-p-3 tb-v2-rounded-lg ${conv.current ? 'tb-v2-bg-blue-100' : 'tb-v2-bg-gray-50'}`}
              >
                <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
                  <span className="tb-v2-text-sm tb-v2-text-gray-500">
                    Base {conv.base}
                  </span>
                  <span className={`tb-v2-font-bold ${conv.current ? 'tb-v2-text-blue-800' : 'tb-v2-text-gray-800'}`}>
                    {conv.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Reference</h3>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
          <div><strong>Binary:</strong> Base 2 (0, 1)</div>
          <div><strong>Octal:</strong> Base 8 (0-7)</div>
          <div><strong>Decimal:</strong> Base 10 (0-9)</div>
          <div><strong>Hex:</strong> Base 16 (0-9, A-F)</div>
          <div><strong>Base 32:</strong> Base 32 (0-9, A-V)</div>
        </div>
        <div className="tb-v2-mt-3 tb-v2-text-sm">
          <strong>Common conversions:</strong>
          <div className="tb-v2-mt-1">FF (hex) = 255 (dec) = 11111111 (bin)</div>
          <div>10 (dec) = A (hex) = 1010 (bin)</div>
        </div>
      </div>
    </div>
  );
}
