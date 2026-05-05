'use client';

import { useState } from 'react';

type NumberBase = 2 | 8 | 10 | 16;

export default function BaseConverterQuickClient() {
  const [value, setValue] = useState('');

  const bases: { id: NumberBase; name: string; short: string }[] = [
    { id: 2, name: 'Binary', short: 'BIN' },
    { id: 8, name: 'Octal', short: 'OCT' },
    { id: 10, name: 'Decimal', short: 'DEC' },
    { id: 16, name: 'Hex', short: 'HEX' },
  ];

  const convertValue = (input: string): Record<NumberBase, string> => {
    if (!input.trim()) {
      return { 2: '', 8: '', 10: '', 16: '' };
    }

    // Parse input - try to detect format
    let decimal: number;
    
    // Check for hex prefix
    if (input.startsWith('0x') || input.startsWith('0X')) {
      decimal = parseInt(input, 16);
    }
    // Check for binary prefix
    else if (input.startsWith('0b') || input.startsWith('0B')) {
      decimal = parseInt(input.slice(2), 2);
    }
    // Check for octal prefix
    else if (input.startsWith('0o') || input.startsWith('0O')) {
      decimal = parseInt(input.slice(2), 8);
    }
    // Otherwise assume decimal
    else {
      decimal = parseInt(input, 10);
    }

    if (isNaN(decimal)) {
      return { 2: 'Error', 8: 'Error', 10: 'Error', 16: 'Error' };
    }

    // Convert to all bases
    const chars = '0123456789ABCDEF';
    const result: Record<NumberBase, string> = { 2: '', 8: '', 10: '', 16: '' };

    // Decimal
    result[10] = decimal.toString(10);

    // Binary
    if (decimal === 0) {
      result[2] = '0';
    } else {
      let bin = '';
      let num = Math.abs(decimal);
      while (num > 0) {
        bin = (num % 2).toString() + bin;
        num = Math.floor(num / 2);
      }
      result[2] = decimal < 0 ? '-' + bin : bin;
    }

    // Octal
    result[8] = decimal.toString(8);

    // Hex
    result[16] = decimal.toString(16).toUpperCase();

    return result;
  };

  const conversions = convertValue(value);

  const copyValue = (val: string) => {
    if (val && val !== 'Error') {
      navigator.clipboard.writeText(val);
    }
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Base Converter Quick</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Instant conversion between number bases</p>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Enter any number</label>
          {value && (
            <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              Clear
            </button>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter decimal, 0x hex, 0b binary, or 0o octal..."
          className="tb-v2-input"
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
          Auto-detects: decimal, 0x hex, 0b binary, 0o octal
        </p>
      </div>

      {/* Results Grid */}
      <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-3">
        {bases.map(base => (
          <div
            key={base.id}
            className={`tb-v2-card ${value ? 'tb-v2-bg-blue-50' : 'tb-v2-bg-gray-50'}`}
          >
            <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-1">
              <span className="tb-v2-text-sm tb-v2-text-gray-500">{base.name}</span>
              <button
                onClick={() => copyValue(conversions[base.id])}
                disabled={!conversions[base.id] || conversions[base.id] === 'Error'}
                className="tb-v2-btn tb-v2-btn-secondary tb-v2-px-2 tb-v2-py-1 tb-v2-text-xs"
              >
                📋
              </button>
            </div>
            <p className={`tb-v2-text-xl tb-v2-font-bold ${conversions[base.id] === 'Error' ? 'tb-v2-text-red-500' : 'tb-v2-text-blue-800'}`}>
              {conversions[base.id] || '-'}
            </p>
            <p className="tb-v2-text-xs tb-v2-text-gray-400">{base.short}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      {value && conversions[10] && conversions[10] !== 'Error' && (
        <div className="tb-v2-card tb-v2-bg-green-50">
          <p className="tb-v2-text-sm tb-v2-text-green-800">
            <strong>Decimal value:</strong> {conversions[10]}
          </p>
          <p className="tb-v2-text-xs tb-v2-text-green-600 tb-v2-mt-1">
            {parseInt(conversions[10]) === 0 && 'Zero'}
            {parseInt(conversions[10]) > 0 && parseInt(conversions[10]) < 256 && 'Byte value (8-bit)'}
            {parseInt(conversions[10]) >= 256 && 'Larger than a byte'}
            {parseInt(conversions[10]) < 0 && 'Negative number'}
          </p>
        </div>
      )}

      {/* Quick Examples */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Examples</h3>
        <div className="tb-v2-flex tb-v2-flex-wrap tb-v2-gap-2">
          {['255', '128', '64', '16', '10', '0', '0xFF', '0b1010'].map(example => (
            <button
              key={example}
              onClick={() => setValue(example)}
              className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
