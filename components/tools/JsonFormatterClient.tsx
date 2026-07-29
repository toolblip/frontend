'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ToolContextControls from '@/components/tools/ToolContextControls';
import { useToolContext } from '@/components/tools/useToolContext';

type Mode = 'format' | 'minify';

type JsonFormatterContext = { mode: Mode; indent: number };

const EXAMPLES = [
  {
    label: 'Simple Object',
    data: '{"name": "John", "age": 30, "city": "New York"}',
  },
  {
    label: 'Nested Object',
    data: '{"user": {"id": 1, "name": "Alice", "address": {"street": "123 Main St", "city": "Boston", "zip": "02101"}, "hobbies": ["reading", "coding", "hiking"]}}',
  },
  {
    label: 'API Response',
    data: '{"status": "success", "data": {"users": [{"id": 1, "name": "Bob", "email": "bob@example.com", "active": true}, {"id": 2, "name": "Carol", "email": "carol@example.com", "active": false}], "total": 2, "page": 1}}',
  },
  {
    label: 'Config File',
    data: '{"server": {"host": "localhost", "port": 8080, "ssl": true}, "database": {"driver": "postgres", "host": "db.example.com", "port": 5432, "name": "myapp"}, "logging": {"level": "info", "file": "/var/log/app.log"}}',
  },
];

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
  const [showExamples, setShowExamples] = useState(false);

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

  const loadExample = (data: string) => {
    setInput(data);
    setShowExamples(false);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            📋 Examples
          </button>
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
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => loadExample(ex.data)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{ "hello": "world", "items": [1, 2, 3] }'
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
