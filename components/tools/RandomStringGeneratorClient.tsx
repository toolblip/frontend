'use client';

import { useState } from 'react';

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  customChars: string;
}

export default function RandomStringGeneratorClient() {
  const [options, setOptions] = useState<Options>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
    customChars: '',
  });
  const [output, setOutput] = useState('');

  const charsets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'O0Il1',
  };

  const generate = () => {
    let charset = '';
    
    if (options.uppercase) charset += charsets.uppercase;
    if (options.lowercase) charset += charsets.lowercase;
    if (options.numbers) charset += charsets.numbers;
    if (options.symbols) charset += charsets.symbols;
    if (options.customChars) charset += options.customChars;

    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(c => !charsets.ambiguous.includes(c)).join('');
    }

    if (!charset) {
      setOutput('Please select at least one character type');
      return;
    }

    let result = '';
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length];
    }
    
    setOutput(result);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          String Length: {options.length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={options.length}
          onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
          <input
            type="checkbox"
            checked={options.uppercase}
            onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Lowercase (a-z)</span>
          <input
            type="checkbox"
            checked={options.lowercase}
            onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Numbers (0-9)</span>
          <input
            type="checkbox"
            checked={options.numbers}
            onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Symbols (!@#$%...)</span>
          <input
            type="checkbox"
            checked={options.symbols}
            onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Exclude ambiguous (O0Il1)</span>
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          Custom Characters (optional)
        </label>
        <input
          type="text"
          value={options.customChars}
          onChange={(e) => setOptions({ ...options, customChars: e.target.value })}
          placeholder="Additional characters to include..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <button
        onClick={generate}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate String
      </button>

      {output && (
        <div className="flex-1">
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>
            Generated String
          </label>
          <div className="p-3 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm break-all mb-3">
            {output}
          </div>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
