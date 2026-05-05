'use client';

import { useState } from 'react';

export default function BinaryConverterClient() {
  const [mode, setMode] = useState<'textToBinary' | 'binaryToText'>('textToBinary');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const textToBinary = (text: string): string => {
    return text.split('').map(char => {
      const bin = char.charCodeAt(0).toString(2);
      return bin.padStart(8, '0');
    }).join(' ');
  };

  const binaryToText = (binary: string): string => {
    const cleanedBinary = binary.replace(/\s+/g, '');
    if (!/^[01]+$/.test(cleanedBinary)) {
      throw new Error('Invalid binary string');
    }

    const bytes = cleanedBinary.match(/.{1,8}/g) || [];
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const handleConvert = () => {
    setError(null);
    setResult('');

    if (!input.trim()) return;

    try {
      if (mode === 'textToBinary') {
        setResult(textToBinary(input));
      } else {
        setResult(binaryToText(input));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'textToBinary' ? 'binaryToText' : 'textToBinary');
    setInput(result);
    setResult('');
    setError(null);
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

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Binary Converter</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Convert text to binary and vice versa</p>

      {/* Mode Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Conversion Mode</label>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2">
          <button
            onClick={() => { setMode('textToBinary'); setResult(''); setError(null); }}
            className={`tb-v2-btn ${mode === 'textToBinary' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Text → Binary
          </button>
          <button
            onClick={() => { setMode('binaryToText'); setResult(''); setError(null); }}
            className={`tb-v2-btn ${mode === 'binaryToText' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Binary → Text
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">
            {mode === 'textToBinary' ? 'Text Input' : 'Binary Input'}
          </label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(''); setError(null); }}
          placeholder={mode === 'textToBinary' ? 'Enter text to convert...' : 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)...'}
          className="tb-v2-input tb-v2-min-h-[100px]"
          rows={4}
        />
        {mode === 'textToBinary' && (
          <p className="tb-v2-text-xs tb-v2-text-gray-400 tb-v2-mt-1">
            {input.length} characters
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="tb-v2-flex tb-v2-gap-2">
        <button onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
          Convert
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
            <p className="tb-v2-text-lg tb-v2-font-mono tb-v2-break-all tb-v2-text-green-800">
              {result}
            </p>
          </div>
          {mode === 'textToBinary' && (
            <p className="tb-v2-text-xs tb-v2-text-gray-400 tb-v2-mt-1">
              {result.split(' ').length} bytes
            </p>
          )}
        </div>
      )}

      {/* Examples */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Examples</h3>
        <div className="tb-v2-text-sm tb-v2-space-y-2">
          <div>
            <span className="tb-v2-text-gray-500">Hello:</span>
            <span className="tb-v2-font-mono tb-v2-ml-2">01001000 01100101 01101100 01101100 01101111</span>
          </div>
          <div>
            <span className="tb-v2-text-gray-500">World:</span>
            <span className="tb-v2-font-mono tb-v2-ml-2">01010111 01101111 01110010 01101100 01100100</span>
          </div>
          <div>
            <span className="tb-v2-text-gray-500">ASCII 65 =:</span>
            <span className="tb-v2-font-mono tb-v2-ml-2">01000001 = A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
