'use client';
import { useState, useMemo } from 'react';

type Mode = 'encode' | 'decode';

export default function UrlEncodeClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return '';
    try {
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return 'Error: Invalid input for decoding';
    }
  }, [input, mode]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div className="tb-v2-mode-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'encode'}
            onClick={() => setMode('encode')}
            className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`}
          >
            Encode
          </button>
          <button
            role="tab"
            aria-selected={mode === 'decode'}
            onClick={() => setMode('decode')}
            className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`}
          >
            Decode
          </button>
        </div>
      </div>
      
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL or text to decode...'}
        rows={4}
      />
      
      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Output</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{output}</pre>
          </div>
        </>
      )}
      
      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔗</div>
          <p>{mode === 'encode' ? 'Enter a URL or text to encode' : 'Enter encoded text to decode'}</p>
        </div>
      )}
    </div>
  );
}
