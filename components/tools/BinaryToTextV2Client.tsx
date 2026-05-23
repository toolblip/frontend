'use client';

import { useState } from 'react';

export default function BinaryToTextV2Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'binary-to-text' | 'text-to-binary'>('binary-to-text');

  const binaryToText = (binary: string): string => {
    const cleaned = binary.replace(/\s+/g, '');
    if (!/^[01]+$/.test(cleaned)) {
      throw new Error('Invalid binary input');
    }
    let result = '';
    for (let i = 0; i < cleaned.length; i += 8) {
      const byte = cleaned.slice(i, i + 8);
      result += String.fromCharCode(parseInt(byte, 2));
    }
    return result;
  };

  const textToBinary = (text: string): string => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  };

  const handleConvert = () => {
    try {
      if (mode === 'binary-to-text') {
        setOutput(binaryToText(input));
      } else {
        setOutput(textToBinary(input));
      }
    } catch {
      setOutput('Error: Invalid input');
    }
  };

  const swapMode = () => {
    setMode(prev => prev === 'binary-to-text' ? 'text-to-binary' : 'binary-to-text');
    setInput('');
    setOutput('');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Binary ↔ Text Converter</span>
        <button type="button" onClick={swapMode} className="tb-v2-btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
          Switch to {mode === 'binary-to-text' ? 'Text→Binary' : 'Binary→Text'}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'binary-to-text' ? 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)' : 'Enter text to convert to binary'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: '100px' }}
        aria-label="Input"
      />
      <div style={{ margin: '0.75rem 0' }}>
        <button type="button" onClick={handleConvert} className="tb-v2-btn tb-v2-btn-primary">
          Convert
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{output || ' - '}</pre>
      </div>
    </div>
  );
}
