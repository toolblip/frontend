'use client';

import { useState } from 'react';

type EscapeMode = 'escape' | 'unescape';
type EscapeContext = 'json' | 'javascript' | 'regex' | 'html' | 'general';

export default function BackslashEscapeUnescapeClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EscapeMode>('escape');
  const [context, setContext] = useState<EscapeContext>('json');
  const [output, setOutput] = useState('');

  const escapeString = (str: string, ctx: EscapeContext): string => {
    switch (ctx) {
      case 'json':
        return str
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
      case 'javascript':
        return str
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/</g, '\\x3C')
          .replace(/>/g, '\\x3E');
      case 'regex':
        return str
          .replace(/\\/g, '\\\\')
          .replace(/[.*+?^${}()|[\]]/g, '\\$&')
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t');
      case 'html':
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      case 'general':
      default:
        return str
          .replace(/\\/g, '\\\\')
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t');
    }
  };

  const unescapeString = (str: string, ctx: EscapeContext): string => {
    switch (ctx) {
      case 'json':
        return str
          .replace(/\\\\/g, '\\')
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t');
      case 'javascript':
        return str
          .replace(/\\\\/g, '\\')
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\x3C/g, '<')
          .replace(/\\x3E/g, '>');
      case 'regex':
        return str
          .replace(/\\\\/g, '\\')
          .replace(/\\([.*+?^${}()|[\]])/g, '$1')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t');
      case 'html':
        return str
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      case 'general':
      default:
        return str
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t');
    }
  };

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'escape') {
        setOutput(escapeString(input, context));
      } else {
        setOutput(unescapeString(input, context));
      }
    } catch (err) {
      setOutput('Error processing string');
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const getContextDescription = (ctx: EscapeContext): string => {
    switch (ctx) {
      case 'json': return 'Escape for JSON strings';
      case 'javascript': return 'Escape for JavaScript strings';
      case 'regex': return 'Escape special regex characters';
      case 'html': return 'Escape HTML entities';
      case 'general': return 'General backslash escaping';
    }
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Backslash Escape/Unescape</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Escape and unescape backslash characters for various contexts</p>

      {/* Mode Selection */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-gap-2">
          <button
            onClick={() => setMode('escape')}
            className={`tb-v2-btn ${mode === 'escape' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Escape
          </button>
          <button
            onClick={() => setMode('unescape')}
            className={`tb-v2-btn ${mode === 'unescape' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            Unescape
          </button>
        </div>
      </div>

      {/* Context Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Context</label>
        <div className="tb-v2-flex tb-v2-flex-wrap tb-v2-gap-2">
          {(['json', 'javascript', 'regex', 'html', 'general'] as const).map(ctx => (
            <button
              key={ctx}
              onClick={() => setContext(ctx)}
              className={`tb-v2-btn tb-v2-text-sm ${context === ctx ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              title={getContextDescription(ctx)}
            >
              {ctx === 'json' && '📄 '}
              {ctx === 'javascript' && '🟨 '}
              {ctx === 'regex' && '🔍 '}
              {ctx === 'html' && '🌐 '}
              {ctx === 'general' && '⚙️ '}
              {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
            </button>
          ))}
        </div>
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-2">
          {getContextDescription(context)}
        </p>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Input</label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'escape' ? 'Enter text to escape...' : 'Enter escaped text to unescape...'}
          className="tb-v2-textarea tb-v2-min-h-[120px]"
        />
      </div>

      {/* Process Button */}
      <div className="tb-v2-flex tb-v2-gap-2">
        <button
          onClick={handleProcess}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {mode === 'escape' ? 'Escape' : 'Unescape'} →
        </button>
        <button
          onClick={handleSwap}
          className="tb-v2-btn tb-v2-btn-secondary"
          disabled={!output}
        >
          ⇄ Swap
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
            <label className="tb-v2-label tb-v2-mb-0">Output</label>
            <button onClick={copyToClipboard} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="tb-v2-textarea tb-v2-min-h-[120px] tb-v2-bg-gray-50"
          />
          <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-2">
            {output.length} characters
          </p>
        </div>
      )}

      {/* Quick Reference */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Quick Reference</h3>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
          <div>\\n → Newline</div>
          <div>\\t → Tab</div>
          <div>\\r → Carriage return</div>
          <div>\\\\ → Backslash</div>
          <div>\\" → Double quote</div>
          <div>\\' → Single quote</div>
        </div>
      </div>
    </div>
  );
}
