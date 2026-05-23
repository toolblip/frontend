'use client';

import { useEffect, useState } from 'react';

export default function SassToCssClient() {
  const [input, setInput] = useState('$primary: #333;\nbody { color: $primary; }');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const looksIndentedSass = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 && !/[{};]/.test(trimmed) && /\n\s+\S/.test(trimmed);
  };

  const convert = async (sass: string) => {
    if (!sass.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setError('');

    try {
      const { compileString } = await import('sass');
      const syntax = looksIndentedSass(sass) ? 'indented' : 'scss';
      const result = compileString(sass, { syntax });
      setOutput(result.css);
    } catch (e) {
      const primaryError = e as Error;

      try {
        if (!looksIndentedSass(sass)) {
          throw primaryError;
        }

        const { compileString } = await import('sass');
        const result = compileString(sass, { syntax: 'indented' });
        setOutput(result.css);
        setError('');
        return;
      } catch {
        setError(primaryError.message || 'Conversion error: Invalid SCSS/SASS syntax');
        setOutput('');
      }
    }
  };

  useEffect(() => {
    void convert(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">SCSS / SASS Input</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          void convert(e.target.value);
        }}
        placeholder="Paste your SCSS or SASS here..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="SASS/SCSS input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error ? (
          <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>
        ) : (
          <pre className="tb-v2-hash-val" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {output || '-'}
          </pre>
        )}
        {output && (
          <button
            type="button"
            onClick={copy}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
