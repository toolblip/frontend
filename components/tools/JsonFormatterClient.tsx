'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ToolContextControls from '@/components/tools/ToolContextControls';
import { useToolContext } from '@/components/tools/useToolContext';

type Mode = 'format' | 'minify';

type JsonFormatterContext = { mode: Mode; indent: number };

function process(input: string, mode: Mode, indent: number): { result: string; error: string } {
  if (!input.trim()) return { result: '', error: '' };
  try {
    const parsed = JSON.parse(input);
    return {
      result: mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent),
      error: '',
    };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  // Paid-gated saved defaults — only the formatting settings are stored, never input.
  const toolContext = useToolContext<JsonFormatterContext>('json-formatter');
  const appliedSavedRef = useRef(false);

  useEffect(() => {
    if (appliedSavedRef.current || !toolContext.saved) return;
    const { mode: savedMode, indent: savedIndent } = toolContext.saved;
    if (savedMode === 'format' || savedMode === 'minify') setMode(savedMode);
    if (savedIndent === 2 || savedIndent === 4) setIndent(savedIndent);
    appliedSavedRef.current = true;
  }, [toolContext.saved]);

  const { result, error } = useMemo(() => process(input, mode, indent), [input, mode, indent]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <ToolContextControls
        isPaid={toolContext.isPaid}
        hasSaved={toolContext.hasSaved}
        description="formatting mode and indent"
        onSave={() => toolContext.save({ mode, indent })}
        onClear={toolContext.clear}
      />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="JSON mode">
          {(['format', 'minify'] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"hello": "world", "items": [1, 2, 3]}'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'format' ? 'Formatted' : 'Minified'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {mode === 'format' && (
            <div className="tb-v2-mode-tabs" role="group" aria-label="Indent size">
              {[2, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIndent(n)}
                  className={`tb-v2-mode-tab ${indent === n ? 'on' : ''}`}
                  aria-pressed={indent === n}
                >
                  {n}-space
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={copy}
            disabled={!result}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">
            <strong>Syntax error:</strong> {error}
          </p>
        ) : (
          <pre className="tb-v2-tool-pre">{result || ' - '}</pre>
        )}
      </div>
    </div>
  );
}
