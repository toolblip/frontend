'use client';

import { useState } from 'react';

export default function BinaryConverterClient() {
  const [mode, setMode] = useState<'textToBinary' | 'binaryToText'>('textToBinary');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const loadExample = () => {
    setMode('textToBinary');
    setInput('Hello World');
    setResult('');
    setError(null);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Conversion Mode</span>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
            Load Example
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2" style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => { setMode('textToBinary'); setResult(''); setError(null); }}
            className={`tb-v2-btn ${mode === 'textToBinary' ? 'tb-v2-btn-primary' : ''}`}
          >
            Text to Binary
          </button>
          <button
            type="button"
            onClick={() => { setMode('binaryToText'); setResult(''); setError(null); }}
            className={`tb-v2-btn ${mode === 'binaryToText' ? 'tb-v2-btn-primary' : ''}`}
          >
            Binary to Text
          </button>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">
            {mode === 'textToBinary' ? 'Text Input' : 'Binary Input'}
          </span>
          <button type="button" onClick={handleClear} className="tb-v2-btn-sm">
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(''); setError(null); }}
          placeholder={mode === 'textToBinary' ? 'Enter text to convert...' : 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)...'}
          className="tb-v2-tool-textarea"
          rows={4}
        />
        {mode === 'textToBinary' && input && (
          <p className="text-xs text-gray-400 mt-1">{input.length} characters</p>
        )}
      </div>

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
          Enter text or binary above to convert between the two, byte by byte.
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
            <p className="font-mono break-all text-gray-800 dark:text-gray-100">{result}</p>
          </div>
          {mode === 'textToBinary' && (
            <p className="text-xs text-gray-400 mt-1">{result.split(' ').length} bytes</p>
          )}
        </>
      )}

      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Examples</h3>
        <div className="text-sm space-y-2">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Hello:</span>
            <span className="font-mono ml-2 text-gray-700 dark:text-gray-300">01001000 01100101 01101100 01101100 01101111</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">World:</span>
            <span className="font-mono ml-2 text-gray-700 dark:text-gray-300">01010111 01101111 01110010 01101100 01100100</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">ASCII 65:</span>
            <span className="font-mono ml-2 text-gray-700 dark:text-gray-300">01000001 = A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
