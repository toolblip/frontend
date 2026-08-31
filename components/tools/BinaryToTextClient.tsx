'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_BINARY = '01001000 01100101 01101100 01101100 01101111';
const EXAMPLE_TEXT = 'Hello';

function binaryToText(binary: string): { text: string; error: string } {
  const cleaned = binary.replace(/\s+/g, '');
  if (!cleaned) return { text: '', error: '' };
  if (!/^[01]*$/.test(cleaned)) {
    return { text: '', error: 'Binary must contain only 0s and 1s' };
  }
  const byteLen = Math.floor(cleaned.length / 8) * 8;
  if (byteLen === 0) return { text: '', error: '' };
  const bytes = cleaned.slice(0, byteLen).match(/.{8}/g) ?? [];
  return {
    text: bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join(''),
    error: '',
  };
}

function textToBinary(text: string): string {
  if (!text) return '';
  return text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export default function BinaryToTextClient() {
  const [binary, setBinary] = useState('');
  const [text, setText] = useState('');
  const [binaryError, setBinaryError] = useState('');
  const [copiedBinary, setCopiedBinary] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const applyBinary = useCallback((raw: string) => {
    setBinary(raw);
    if (!raw.trim()) {
      setText('');
      setBinaryError('');
      return;
    }
    const { text: converted, error } = binaryToText(raw);
    if (error) {
      setBinaryError(error);
      return;
    }
    setText(converted);
    setBinaryError('');
  }, []);

  const applyText = useCallback((raw: string) => {
    setText(raw);
    if (!raw) {
      setBinary('');
      setBinaryError('');
      return;
    }
    setBinary(textToBinary(raw));
    setBinaryError('');
  }, []);

  const loadExample = useCallback(() => {
    applyBinary(EXAMPLE_BINARY);
  }, [applyBinary]);

  const clearAll = useCallback(() => {
    setBinary('');
    setText('');
    setBinaryError('');
  }, []);

  const copyBinary = useCallback(() => {
    if (!binary) return;
    navigator.clipboard.writeText(binary).catch(() => {});
    setCopiedBinary(true);
    setTimeout(() => setCopiedBinary(false), 1500);
  }, [binary]);

  const copyText = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  }, [text]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Binary-Text Converter</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={binary.length > 0 || text.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Binary</span>
            <button
              type="button"
              onClick={copyBinary}
              disabled={!binary}
              className={`tb-v2-copy-btn ${copiedBinary ? 'done' : ''}`}
            >
              {copiedBinary ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={binary}
            onChange={(e) => applyBinary(e.target.value)}
            placeholder={EXAMPLE_BINARY}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              fontFamily: 'var(--f-mono)',
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="Binary input"
            spellCheck={false}
          />
          {binaryError ? (
            <p className="tb-v2-error" role="alert" style={{ margin: '0 16px 12px' }}>
              {binaryError}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 280 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Text</span>
            <button
              type="button"
              onClick={copyText}
              disabled={!text}
              className={`tb-v2-copy-btn ${copiedText ? 'done' : ''}`}
            >
              {copiedText ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => applyText(e.target.value)}
            placeholder={EXAMPLE_TEXT}
            className="tb-v2-tool-textarea"
            style={{
              flex: 1,
              minHeight: 220,
              border: 'none',
              borderRadius: 0,
              resize: 'vertical',
            }}
            aria-label="Text input"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
