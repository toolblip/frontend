'use client';

import { useState, useMemo } from 'react';
import yaml from 'js-yaml';

type PrintMode = 'pretty' | 'compact';
type IndentSize = 2 | 4;

function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-blue-400';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-purple-400' : 'text-red-400';
      } else if (/true|false/.test(match)) {
        cls = 'text-yellow-400';
      } else if (/null/.test(match)) {
        cls = 'text-gray-500';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function YamlToJsonClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<PrintMode>('pretty');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    try {
      const parsed = yaml.load(input);
      const json =
        mode === 'compact'
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, indent);
      return { result: json ?? '', error: '' };
    } catch (e) {
      return { result: '', error: (e as Error).message };
    }
  }, [input, mode, indent]);

  const highlighted = useMemo(() => {
    if (!result) return '';
    return syntaxHighlight(result);
  }, [result]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => setInput('');

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(['pretty', 'compact'] as PrintMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                mode === m
                  ? 'bg-red-600 text-black font-medium'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {m === 'pretty' ? 'Pretty Print' : 'Compact'}
            </button>
          ))}
        </div>

        {mode === 'pretty' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Indent:</span>
            {([2, 4] as IndentSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setIndent(s)}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  indent === s
                    ? 'bg-red-600 text-black font-medium'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {s} spaces
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            YAML Input
          </label>
          {input && (
            <button
              onClick={clear}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`name: Toolblip\nversion: 1.0\nfeatures:\n  - fast\n  - client-side\nconfig:\n  debug: false\n  maxRetries: 3`}
          className="w-full h-52 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-red-500 placeholder-gray-500 font-mono"
          aria-label="YAML input"
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
          <strong>Parse error:</strong> {error}
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            JSON Output
          </label>
          {result && (
            <button
              onClick={copy}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-52 overflow-auto">
          {result ? (
            <pre
              className="text-sm font-mono whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            <p className="text-gray-600 text-sm font-mono">
              {error ? '-' : 'JSON output will appear here…'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
