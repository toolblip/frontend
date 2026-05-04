'use client';

import { useState, useMemo } from 'react';

const romanNumerals: Record<string, number> = {
  'M': 1000,
  'CM': 900,
  'D': 500,
  'CD': 400,
  'C': 100,
  'XC': 90,
  'L': 50,
  'XL': 40,
  'X': 10,
  'IX': 9,
  'V': 5,
  'IV': 4,
  'I': 1,
};

const reverseRomanNumerals: Array<{ value: number; numeral: string }> = [
  { value: 1000, numeral: 'M' },
  { value: 900, numeral: 'CM' },
  { value: 500, numeral: 'D' },
  { value: 400, numeral: 'CD' },
  { value: 100, numeral: 'C' },
  { value: 90, numeral: 'XC' },
  { value: 50, numeral: 'L' },
  { value: 40, numeral: 'XL' },
  { value: 10, numeral: 'X' },
  { value: 9, numeral: 'IX' },
  { value: 5, numeral: 'V' },
  { value: 4, numeral: 'IV' },
  { value: 1, numeral: 'I' },
];

export default function RomanNumeralConverterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');

  const result = useMemo(() => {
    if (!input.trim()) return null;

    if (mode === 'toRoman') {
      const num = parseInt(input);
      if (isNaN(num) || num < 1 || num > 3999) {
        return { error: 'Enter a number between 1 and 3999' };
      }

      let roman = '';
      let remaining = num;

      for (const { value, numeral } of reverseRomanNumerals) {
        while (remaining >= value) {
          roman += numeral;
          remaining -= value;
        }
      }

      return { value: roman };
    } else {
      const roman = input.toUpperCase().trim();
      
      if (!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(roman)) {
        return { error: 'Invalid Roman numeral format' };
      }

      let num = 0;
      let prev = 0;

      for (let i = roman.length - 1; i >= 0; i--) {
        const current = romanNumerals[roman[i]];
        if (current === undefined) {
          return { error: 'Invalid character in Roman numeral' };
        }
        if (current < prev) {
          num -= current;
        } else {
          num += current;
        }
        prev = current;
      }

      if (num < 1 || num > 3999) {
        return { error: 'Roman numeral out of range (1-3999)' };
      }

      return { value: num.toString() };
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (result && 'value' in result) {
      navigator.clipboard.writeText(result.value);
    }
  };

  const examples = [
    { input: '1', mode: 'toRoman' as const, output: 'I' },
    { input: '4', mode: 'toRoman' as const, output: 'IV' },
    { input: '9', mode: 'toRoman' as const, output: 'IX' },
    { input: '58', mode: 'toRoman' as const, output: 'LVIII' },
    { input: '1994', mode: 'toRoman' as const, output: 'MCMXCIV' },
    { input: 'I', mode: 'toNumber' as const, output: '1' },
    { input: 'XIV', mode: 'toNumber' as const, output: '14' },
    { input: 'MMXXIV', mode: 'toNumber' as const, output: '2024' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Roman Numeral Converter</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setMode('toRoman'); setInput(''); }}
          className={`px-4 py-2 rounded-lg transition ${
            mode === 'toRoman'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Number → Roman
        </button>
        <button
          onClick={() => { setMode('toNumber'); setInput(''); }}
          className={`px-4 py-2 rounded-lg transition ${
            mode === 'toNumber'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Roman → Number
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {mode === 'toRoman' ? 'Enter a number (1-3999)' : 'Enter a Roman numeral'}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xl font-mono"
          placeholder={mode === 'toRoman' ? 'e.g., 2024' : 'e.g., MMXXIV'}
        />
      </div>

      {result && 'error' in result && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{result.error}</p>
        </div>
      )}

      {result && 'value' in result && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Result</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy
            </button>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
            <div className="text-4xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {result.value}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium mb-3">Quick Examples:</h3>
        <div className="grid grid-cols-2 gap-2">
          {examples
            .filter(ex => ex.mode === mode)
            .map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex.input)}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <span className="font-mono">{ex.input}</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="font-mono font-bold">{ex.output}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Roman Numeral Reference:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {[
            ['I', '1'], ['IV', '4'], ['V', '5'], ['IX', '9'],
            ['X', '10'], ['XL', '40'], ['L', '50'], ['XC', '90'],
            ['C', '100'], ['CD', '400'], ['D', '500'], ['CM', '900'],
            ['M', '1000'],
          ].map(([numeral, value]) => (
            <div key={numeral} className="flex justify-between p-2 bg-white dark:bg-gray-700 rounded">
              <span className="font-mono font-bold">{numeral}</span>
              <span className="text-gray-500">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
