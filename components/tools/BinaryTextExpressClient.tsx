'use client';

import { useState } from 'react';

export default function BinaryTextExpressClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const textToBinary = (text: string): string => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  };

  const binaryToText = (binary: string): string => {
    const cleanedBinary = binary.replace(/\s+/g, '');
    if (!/^[01]+$/.test(cleanedBinary)) {
      throw new Error('Invalid binary: must contain only 0s and 1s');
    }
    if (cleanedBinary.length % 8 !== 0) {
      throw new Error('Invalid binary: length must be multiple of 8');
    }
    const bytes = cleanedBinary.match(/.{1,8}/g) || [];
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(textToBinary(input));
      } else {
        setOutput(binaryToText(input));
      }
    } catch (err) {
      setOutput(err instanceof Error ? err.message : 'Conversion error');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  // Quick encode helper
  const encodeQuick = (text: string) => {
    setInput(text);
    setMode('encode');
    setOutput('');
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Binary Text Express</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Quickly encode text to binary or decode binary to text</p>

      {/* Mode Toggle */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Mode</label>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2">
          <button
            onClick={() => { setMode('encode'); setOutput(''); }}
            className={`tb-v2-btn ${mode === 'encode' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            🔤 Encode
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); }}
            className={`tb-v2-btn ${mode === 'decode' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            🔄 Decode
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">
            {mode === 'encode' ? 'Text to Encode' : 'Binary to Decode'}
          </label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(''); }}
          placeholder={mode === 'encode' ? 'Type or paste text...' : 'Enter binary (e.g., 01000001)...'}
          className="tb-v2-input tb-v2-min-h-[100px]"
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="tb-v2-flex tb-v2-gap-2">
        <button onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
          {mode === 'encode' ? 'Encode → Binary' : 'Decode → Text'}
        </button>
        <button onClick={handleSwap} className="tb-v2-btn tb-v2-btn-secondary">
          ⇄ Swap
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
            <label className="tb-v2-label tb-v2-mb-0">Output</label>
            <div className="tb-v2-flex tb-v2-gap-2">
              <button onClick={copyOutput} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
                📋 Copy
              </button>
            </div>
          </div>
          <div className="tb-v2-p-4 tb-v2-bg-green-50 tb-v2-rounded-lg">
            {output.startsWith('Invalid') || output.startsWith('Conversion') ? (
              <p className="tb-v2-text-red-600">{output}</p>
            ) : (
              <p className="tb-v2-text-lg tb-v2-font-mono tb-v2-break-all tb-v2-text-green-800">
                {mode === 'encode' ? (
                  // Add spacing for readability when encoding
                  output.match(/.{1,8}/g)?.join(' ')
                ) : (
                  output
                )}
              </p>
            )}
          </div>
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-text-xs tb-v2-text-gray-400 tb-v2-mt-2">
            {mode === 'encode' ? (
              <span>{output.length} bits | {Math.ceil(output.length / 8)} bytes</span>
            ) : (
              <span>{output.length} characters</span>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Encode</h3>
        <div className="tb-v2-flex tb-v2-flex-wrap tb-v2-gap-2">
          <button onClick={() => encodeQuick('Hello, World!')} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Hello
          </button>
          <button onClick={() => encodeQuick('ABC')} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            ABC
          </button>
          <button onClick={() => encodeQuick('123')} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Numbers
          </button>
          <button onClick={() => encodeQuick('AI')} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            AI
          </button>
        </div>
      </div>

      {/* Reference */}
      <div className="tb-v2-card tb-v2-bg-blue-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Reference</h3>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4 tb-v2-text-sm">
          <div>
            <span className="tb-v2-text-gray-600">Common ASCII:</span>
            <div className="tb-v2-mt-1 tb-v2-space-y-1">
              <div><span className="tb-v2-font-mono">01000001</span> = A</div>
              <div><span className="tb-v2-font-mono">01100001</span> = a</div>
              <div><span className="tb-v2-font-mono">00110000</span> = 0</div>
              <div><span className="tb-v2-font-mono">00100000</span> = (space)</div>
            </div>
          </div>
          <div>
            <span className="tb-v2-text-gray-600">Format:</span>
            <div className="tb-v2-mt-1 tb-v2-space-y-1">
              <div>Each character = 8 bits</div>
              <div>8 bits = 1 byte</div>
              <div>Binary uses only 0 and 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
