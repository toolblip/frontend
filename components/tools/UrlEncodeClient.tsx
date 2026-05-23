'use client';

import { useMemo, useState } from 'react';

type Mode = 'encode' | 'decode';

function process(input: string, mode: Mode): { result: string; error: string } {
  if (!input) return { result: '', error: '' };
  try {
    return {
      result: mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input),
      error: '',
    };
  } catch {
    return {
      result: '',
      error: mode === 'decode' ? 'Invalid URL-encoded string.' : 'Could not encode this input.',
    };
  }
}

export default function UrlEncodeClient() {
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
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'URL or text' : 'Encoded URL'}</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="URL encode mode">
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
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Paste encoded URL to decode...'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label={`${mode} input`}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Encoded' : 'Decoded'}</span>
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
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
