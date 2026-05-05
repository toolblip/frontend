'use client';

import { useState } from 'react';

function validate(input: string): { valid: boolean; error?: string; line?: number; col?: number } {
  if (!input.trim()) return { valid: true };
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const err = e as SyntaxError;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = input.substring(0, pos).split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      return { valid: false, error: err.message, line, col };
    }
    return { valid: false, error: err.message };
  }
}

export default function JsonValidatorClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const result = validate(input);

  const copy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JSON Input</span>
        <button
          type="button"
          onClick={copy}
          disabled={!input}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Validation Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!input.trim() ? (
          <p className="tb-v2-tool-pre text-gray-500">Enter JSON to validate</p>
        ) : result.valid ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-600 dark:text-green-400">Valid JSON</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">No syntax errors found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Invalid JSON</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Syntax error detected</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3">
              <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">{result.error}</p>
              {result.line && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Error at line {result.line}, column {result.col}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
