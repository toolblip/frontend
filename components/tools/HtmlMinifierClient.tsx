'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useMemo, useState } from 'react';

import { minifyHtml } from '@/lib/developer-general/code';

export default function HtmlMinifierClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      return { result: minifyHtml(input), error: '' };
    } catch (e) {
      return { result: '', error: (e as Error).message };
    }
  }, [input]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const orig = new TextEncoder().encode(input).length;
  const min = new TextEncoder().encode(result).length;
  const saved = orig > 0 ? Math.round(((orig - min) / orig) * 100) : 0;

  return (
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {setInput('<p>Hello</p><!-- remove -->');}} onClear={() => {setInput('');setCopied(false);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">HTML</span>
        {input && !error && (
          <span className="tb-v2-hash-stats">
            {orig.toLocaleString()} → {min.toLocaleString()} bytes ({saved}% smaller)
          </span>
        )}
      </div>
      <textarea maxLength={100000}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`<!DOCTYPE html>\n<html>\n  <!-- comment -->\n  <head>\n    <title>Page</title>\n  </head>\n  <body>\n    <p>Hello World</p>\n  </body>\n</html>`}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="HTML input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Minified</span>
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
    </div></DeveloperGeneralFrame>
  );
}
