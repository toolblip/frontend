'use client';

import { useState } from 'react';

function convertBase(value: string, fromBase: number): { decimal: bigint; bin: string; oct: string; hex: string } | null {
  try {
    // Handle negative numbers
    const isNegative = value.startsWith('-');
    const absValue = isNegative ? value.slice(1) : value;
    // Parse digit by digit to support arbitrary precision
    let decimal = BigInt(0);
    for (const char of absValue) {
      const digit = parseInt(char, fromBase);
      if (isNaN(digit) || digit >= fromBase) throw new Error('Invalid digit');
      decimal = decimal * BigInt(fromBase) + BigInt(digit);
    }
    if (isNegative) decimal = -decimal;
    return {
      decimal,
      bin: (isNegative ? '-' : '') + decimal.toString(2),
      oct: (isNegative ? '-' : '') + decimal.toString(8),
      hex: (isNegative ? '-' : '') + decimal.toString(16).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default function NumberBaseConverterClient() {
  const [value, setValue] = useState('255');
  const [fromBase, setFromBase] = useState(10);

  const result = convertBase(value.trim(), fromBase);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Number</label>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="e.g. 255"
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Base</label>
          <select
            value={fromBase}
            onChange={e => setFromBase(parseInt(e.target.value))}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
          >
            <option value={2}>Binary (base 2)</option>
            <option value={8}>Octal (base 8)</option>
            <option value={10}>Decimal (base 10)</option>
            <option value={16}>Hexadecimal (base 16)</option>
          </select>
        </div>
      </div>
      {result ? (
        <div className="space-y-3">
          {[
            { label: 'Decimal (10)', value: result.decimal.toString(), base: 10 },
            { label: 'Binary (2)', value: result.bin, base: 2 },
            { label: 'Octal (8)', value: result.oct, base: 8 },
            { label: 'Hexadecimal (16)', value: result.hex, base: 16 },
          ].map(({ label, value: v }) => (
            <div key={label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-32 flex-shrink-0 font-medium">{label}</span>
              <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-mono break-all">{v}</code>
              <button
                onClick={() => navigator.clipboard.writeText(v)}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium flex-shrink-0"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
          Invalid number for base {fromBase}
        </div>
      )}
    </div>
  );
}
