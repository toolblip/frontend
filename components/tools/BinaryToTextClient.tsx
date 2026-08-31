'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_BINARY = '01001000 01100101 01101100 01101100 01101111';

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) {
    throw new Error('Binary input must contain only 0s and 1s');
  }
  const bytes = cleaned.match(/.{1,8}/g) || [];
  return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join('');
}

function textToBinary(text: string): string {
  return text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export default function BinaryToTextClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toText' | 'toBinary'>('toText');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = useCallback(
    (raw: string, activeMode: 'toText' | 'toBinary') => {
      setError('');
      if (!raw.trim()) {
        setOutput('');
        return;
      }
      try {
        setOutput(activeMode === 'toText' ? binaryToText(raw) : textToBinary(raw));
      } catch (err) {
        setOutput('');
        setError(err instanceof Error ? err.message : 'Conversion failed');
      }
    },
    []
  );

  const loadExample = useCallback(() => {
    setMode('toText');
    setInput(EXAMPLE_BINARY);
    process(EXAMPLE_BINARY, 'toText');
  }, [process]);

  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setMode('toText');
  }, []);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'toText' ? 'toBinary' : 'toText');
  }, [output, mode]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Binary ↔ Text</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={input.length > 0 || output.length > 0}
        />
      </div>
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div className="tb-v2-mode-tabs">
          {(['toText', 'toBinary'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setOutput('');
                setError('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'toText' ? 'Binary → Text' : 'Text → Binary'}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <span className="tb-v2-tool-label">
            {mode === 'toText' ? 'Binary input' : 'Text input'}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'toText'
                ? 'Enter binary (e.g. 01001000 01100101)...'
                : 'Enter text to convert...'
            }
            className="tb-v2-tool-textarea"
          />
        </div>

        <button
          type="button"
          onClick={() => process(input, mode)}
          disabled={!input.trim()}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        >
          Convert
        </button>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!output && !error && (
          <p className="tb-v2-empty">Enter binary or text above, or use Example.</p>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="tb-v2-tool-label">Output</span>
              <div className="tb-v2-mode-tabs">
                <button
                  type="button"
                  onClick={swap}
                  className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
                  style={{ color: 'var(--red)', fontSize: 12 }}
                >
                  Swap ↕
                </button>
                <button
                  type="button"
                  onClick={() => copy(output)}
                  className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
                  style={{ color: 'var(--red)', fontSize: 12 }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="tb-v2-tool-pre">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
}
