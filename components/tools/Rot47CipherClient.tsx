'use client';

import { useState, useCallback } from 'react';

const ROT47_CHARS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export default function Rot47CipherClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const applyRot47 = useCallback((text: string, encode: boolean) => {
    return text.split('').map(char => {
      const idx = ROT47_CHARS.indexOf(char);
      if (idx === -1) return char;
      const newIdx = encode ? (idx + 47) % 94 : (idx - 47 + 94) % 94;
      return ROT47_CHARS[newIdx];
    }).join('');
  }, []);

  const handleEncode = useCallback(() => {
    setOutput(applyRot47(input, true));
  }, [input, applyRot47]);

  const handleDecode = useCallback(() => {
    setOutput(applyRot47(input, false));
  }, [input, applyRot47]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to encode or decode with ROT47..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="ROT47 input"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12 }}>
        <button type="button" onClick={handleEncode} className="tb-v2-primary-btn" style={{ flex: 1 }}>
          Encode
        </button>
        <button type="button" onClick={handleDecode} className="tb-v2-secondary-btn" style={{ flex: 1 }}>
          Decode
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ fontFamily: 'var(--f-mono)', fontSize: 14, whiteSpace: 'pre-wrap', margin: 0 }}>
          {output || ' - '}
        </pre>
      </div>
    </div>
  );
}
