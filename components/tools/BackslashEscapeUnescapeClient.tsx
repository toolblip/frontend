'use client';

import { useState, useMemo } from 'react';

type EscapeMode = 'escape' | 'unescape';
type EscapeContext = 'json' | 'javascript' | 'regex' | 'html' | 'general';

const EXAMPLES: Record<EscapeContext, string> = {
  json: '{"name": "John", "message": "Hello\\nWorld"}',
  javascript: "const str = 'Hello\\nWorld';",
  regex: '^\\d{3}-\\d{4}$',
  html: '<div class="container">Hello & goodbye</div>',
  general: 'C:\\Users\\Documents\\file.txt',
};

export default function BackslashEscapeUnescapeClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EscapeMode>('escape');
  const [context, setContext] = useState<EscapeContext>('json');
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const escapeString = (str: string, ctx: EscapeContext): string => {
    switch (ctx) {
      case 'json':
        return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      case 'javascript':
        return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/</g, '\\x3C').replace(/>/g, '\\x3E');
      case 'regex':
        return str.replace(/\\/g, '\\\\').replace(/[.*+?^${}()|[\]]/g, '\\$&').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
      case 'html':
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      default:
        return str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    }
  };

  const unescapeString = (str: string, ctx: EscapeContext): string => {
    switch (ctx) {
      case 'json':
        return str.replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
      case 'javascript':
        return str.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\x3C/g, '<').replace(/\\x3E/g, '>');
      case 'regex':
        return str.replace(/\\\\/g, '\\').replace(/\\([.*+?^${}()|[\]])/g, '$1').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      case 'html':
        return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      default:
        return str.replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }
  };

  const output = useMemo(() => {
    if (!input.trim()) return '';
    try {
      return mode === 'escape' ? escapeString(input, context) : unescapeString(input, context);
    } catch {
      return 'Error processing string';
    }
  }, [input, mode, context]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setMode(mode === 'escape' ? 'unescape' : 'escape');
  };

  const loadExample = (text: string) => {
    setInput(text);
    setShowExamples(false);
  };

  return (
    <div>
      {/* Mode tabs */}
      <div className="tb-v2-mode-tabs" role="tablist">
        {(['escape', 'unescape'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
          >
            {m === 'escape' ? '🔒 Escape' : '🔓 Unescape'}
          </button>
        ))}
      </div>

      {/* Context selector */}
      <div>
        <label className="tb-v2-tool-label">Context</label>
        <div className="flex flex-wrap gap-2">
          {(['json', 'javascript', 'regex', 'html', 'general'] as const).map((ctx) => (
            <button
              key={ctx}
              onClick={() => setContext(ctx)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                context === ctx
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Input</span>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            📋 Examples
          </button>
        </div>

        {showExamples && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Try an example:</div>
            <button
              onClick={() => loadExample(EXAMPLES[context])}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-mono"
            >
              {context.charAt(0).toUpperCase() + context.slice(1)} Example
            </button>
          </div>
        )}

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'escape' ? 'Enter text to escape...' : 'Enter escaped text to unescape...'}
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', minHeight: 100 }}
          rows={4}
        />
      </div>

      {/* Output */}
      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Output ({output.length} chars)</span>
            <div className="flex gap-2">
              <button onClick={swap} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                ↕ Swap
              </button>
              <button onClick={copy} className="tb-v2-copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-sm break-all" style={{ fontFamily: 'var(--f-mono)' }}>{output}</pre>
          </div>
        </>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔤</div>
          <p>Enter text above to {mode} for {context} context</p>
        </div>
      )}
    </div>
  );
}
