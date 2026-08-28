'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Mode = 'encode' | 'decode';

function encodeUnicode(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    out += '\\u' + input.charCodeAt(i).toString(16).padStart(4, '0');
  }
  return out;
}

function decodeUnicode(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

const EXAMPLE_TEXT = 'Hello, 世界! 🚀';
const EXAMPLE_ESCAPED = encodeUnicode(EXAMPLE_TEXT);

export default function UnicodeEscapeEncoderClient() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'encode' ? encodeUnicode(input) : decodeUnicode(input);
  }, [input, mode]);

  const loadExample = () => {
    setMode('encode');
    setInput(EXAMPLE_TEXT);
  };

  const clear = () => setInput('');

  const swap = () => {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
    setInput(output || (mode === 'encode' ? EXAMPLE_ESCAPED : EXAMPLE_TEXT));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Text' : 'Escaped String'}</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={input.length > 0} />
      </div>
      <div style={{ padding: '8px 20px 0' }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Mode">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`}
            aria-pressed={mode === 'encode'}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`}
            aria-pressed={mode === 'decode'}
          >
            Decode
          </button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === 'encode'
            ? 'Enter text to encode, e.g. Hello, 世界! 🚀'
            : 'Enter escaped string, e.g. \\u0048\\u0065\\u006c\\u006c\\u006f'
        }
        className="tb-v2-tool-textarea"
        aria-label={mode === 'encode' ? 'Text to encode' : 'Escaped string to decode'}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Escaped Output' : 'Decoded Text'}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={swap}
            className="tb-v2-btn tb-v2-btn-sm"
            disabled={!input}
          >
            Use as {mode === 'encode' ? 'Decode' : 'Encode'} Input
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!output}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {!output ? (
          <p className="tb-v2-empty">
            {mode === 'encode'
              ? 'Enter text above to see its Unicode escape sequences.'
              : 'Enter a \\uXXXX escaped string above to decode it.'}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
