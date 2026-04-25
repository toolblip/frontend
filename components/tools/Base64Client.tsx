'use client';

import { useMemo, useState } from 'react';

type Mode = 'encode' | 'decode';

function process(input: string, mode: Mode): { result: string; error: string } {
  if (!input) return { result: '', error: '' };
  try {
    if (mode === 'encode') {
      return { result: btoa(unescape(encodeURIComponent(input))), error: '' };
    }
    return { result: decodeURIComponent(escape(atob(input.trim()))), error: '' };
  } catch {
    return {
      result: '',
      error: mode === 'encode' ? 'Could not encode this text.' : 'Invalid Base64 string.',
    };
  }
}

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => process(input, mode), [input, mode]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Text' : 'Base64'}</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Base64 mode">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${mode} input`}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Base64' : 'Text'}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || '—'}</pre>
        )}
      </div>
    </div>
  );
}
