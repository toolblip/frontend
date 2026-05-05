'use client';

import { useState, useMemo } from 'react';
import { marked } from 'marked';

interface Cell {
  cell_type: 'markdown' | 'code' | 'raw';
  source: string | string[];
  output?: unknown[];
  execution_count?: number | null;
  outputs?: unknown[];
  metadata?: Record<string, unknown>;
}

interface Notebook {
  cells: Cell[];
  metadata?: Record<string, unknown>;
  nbformat?: number;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCode(source: string): string {
  // Very basic syntax highlighting via simple token replacement
  const keywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'async', 'await', 'yield', 'lambda', 'pass', 'break', 'continue', 'raise', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'print', 'function', 'const', 'let', 'var', 'export', 'default', 'new', 'this', 'self', 'public', 'private'];
  const stringDouble = /"(?:[^"\\]|\\.)*"/g;
  const stringSingle = /'(?:[^'\\]|\\.)*'/g;
  const stringBacktick = /`(?:[^`\\]|\\.)*`/g;
  const comment = /#.*$/gm;
  const number = /\b\d+\.?\d*\b/g;
  const funcCall = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let result = escapeHtml(source);

  // Strings first
  result = result.replace(stringDouble, (m) => `<span class="nb-str">${m}</span>`);
  result = result.replace(stringSingle, (m) => `<span class="nb-str">${m}</span>`);
  result = result.replace(stringBacktick, (m) => `<span class="nb-str">${m}</span>`);

  // Comments
  result = result.replace(comment, (m) => `<span class="nb-comment">${m}</span>`);

  // Numbers
  result = result.replace(number, (m) => `<span class="nb-num">${m}</span>`);

  // Keywords
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g');
    result = result.replace(re, `<span class="nb-kw">$1</span>`);
  });

  // Function calls
  result = result.replace(funcCall, (m, fn) => {
    return `<span class="nb-func">${fn}</span>(`;
  });

  return result;
}

const SAMPLE_NB: Notebook = {
  nbformat: 4,
  metadata: { kernelspec: { display_name: 'Python 3', language: 'python' } },
  cells: [
    {
      cell_type: 'markdown',
      source: '# Welcome to Jupyter\n\nThis is a **markdown** cell with _formatting_.',
    },
    {
      cell_type: 'code',
      execution_count: 1,
      source: "print('Hello, Jupyter!')",
      outputs: [{ output_type: 'stream', name: 'stdout', text: 'Hello, Jupyter!\n' }],
    },
    {
      cell_type: 'markdown',
      source: '## Code cells also support multiple lines',
    },
    {
      cell_type: 'code',
      execution_count: 2,
      source: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\n[fib(i) for i in range(8)]',
      outputs: [{ output_type: 'execute_result', execution_count: 2, data: { 'text/plain': '[0, 1, 1, 2, 3, 5, 8, 13]' } }],
    },
  ],
};

function renderCell(cell: Cell): { html: string; type: string } {
  if (cell.cell_type === 'markdown') {
    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
    try {
      const html = marked.parse(source, { async: false }) as string;
      return { html, type: 'markdown' };
    } catch {
      return { html: `<p>${escapeHtml(source)}</p>`, type: 'markdown' };
    }
  }

  if (cell.cell_type === 'code') {
    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
    const rendered = renderCode(source);

    let outputsHtml = '';
    const outputs = (cell as { outputs?: unknown[] }).outputs || cell.output ? (cell as { outputs?: unknown[] }).outputs || [] : [];

    for (const out of outputs) {
      const o = out as { output_type: string; data?: Record<string, string | string[]>; text?: string | string[]; name?: string };
      if (o.output_type === 'stream') {
        const text = Array.isArray(o.text) ? o.text.join('') : (o.text || '');
        outputsHtml += `<pre class="nb-output nb-stream">${escapeHtml(text)}</pre>`;
      } else if (o.output_type === 'execute_result' && o.data) {
        const raw = o.data['text/plain'];
        const text = Array.isArray(raw) ? raw.join('') : (typeof raw === 'string' ? raw : '');
        outputsHtml += `<pre class="nb-output nb-result">${escapeHtml(text)}</pre>`;
      } else if (o.output_type === 'error') {
        const en = out as { ename?: string; evalue?: string; traceback?: string[] };
        const tb = (en.traceback || []).join('\n');
        outputsHtml += `<pre class="nb-output nb-error">${escapeHtml(`${en.ename}: ${en.evalue}\n${tb}`)}</pre>`;
      }
    }

    return {
      html: `<div class="nb-code-cell"><div class="nb-code-source"><pre><code>${rendered}</code></pre></div>${outputsHtml ? `<div class="nb-code-outputs">${outputsHtml}</div>` : ''}</div>`,
      type: 'code',
    };
  }

  return { html: '', type: 'raw' };
}

export default function NotebookToHtmlClient() {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_NB, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  const notebook = useMemo((): Notebook | null => {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed.cells)) {
        setError('Invalid notebook: missing cells array');
        return null;
      }
      setError(null);
      return parsed as Notebook;
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      return null;
    }
  }, [input]);

  const renderedCells = useMemo(() => {
    if (!notebook) return [];
    return notebook.cells.map((cell, i) => ({ ...renderCell(cell), index: i }));
  }, [notebook]);

  const copyHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Notebook Preview</title>
<style>
body{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:2rem;background:#fafafa}
.nb-cell{margin:1.5rem 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
.nb-markdown{background:#fff;padding:1rem 1.25rem}
.nb-markdown h1,.nb-markdown h2,.nb-markdown h3{font-weight:600;margin:.5rem 0}
.nb-markdown p{margin:.5rem 0;line-height:1.6}
.nb-markdown code{background:#f3f4f6;padding:.15rem .35rem;border-radius:3px;font-size:.875em}
.nb-markdown pre{background:#1e1e1e;color:#d4d4d4;padding:1rem;border-radius:6px;overflow-x:auto}
.nb-markdown pre code{background:none;padding:0}
.nb-code-cell{border-top:1px solid #e5e7eb}
.nb-code-source{background:#1e1e1e;padding:.75rem 1rem;overflow-x:auto}
.nb-code-source pre{margin:0;white-space:pre}
.nb-code-source code{font-family:'Fira Code','Cascadia Code',monospace;font-size:.875rem;line-height:1.5}
.nb-output{background:#f9fafb;padding:.5rem 1rem;margin:0;border-top:1px solid #e5e7eb;font-family:monospace;font-size:.85rem}
.nb-stream{color:#111}
.nb-result{color:#006400}
.nb-error{color:#dc2626;background:#fef2f2}
.nb-kw{color:#c586c0}
.nb-str{color:#ce9178}
.nb-comment{color:#6a9955}
.nb-num{color:#b5cea8}
.nb-func{color:#dcdcaa}
</style>
</head>
<body>
${renderedCells.map(c => `<div class="nb-cell">${c.html}</div>`).join('\n')}
</body>
</html>`;
    navigator.clipboard.writeText(fullHtml).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Notebook JSON</span>
        <div className="tb-v2-mode-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'preview'} onClick={() => setView('preview')} className={`tb-v2-mode-tab ${view === 'preview' ? 'on' : ''}`}>Preview</button>
          <button type="button" role="tab" aria-selected={view === 'html'} onClick={() => setView('html')} className={`tb-v2-mode-tab ${view === 'html' ? 'on' : ''}`}>HTML</button>
        </div>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        placeholder='{"cells": [...], "metadata": {...}}'
        rows={10}
        aria-label="Notebook JSON input"
      />

      {error && (
        <div className="mt-2 text-red-600 dark:text-red-400 text-sm font-mono">{error}</div>
      )}

      {/* Output */}
      <div className="tb-v2-tool-output-head mt-4">
        <span className="tb-v2-tool-label">{view === 'preview' ? 'Rendered Preview' : 'HTML source'}</span>
        {notebook && (
          <button type="button" onClick={copyHtml} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
        )}
      </div>

      {view === 'preview' ? (
        <div className="nb-preview mt-3">
          {renderedCells.map(cell => (
            <div key={cell.index} className="nb-cell">
              {cell.type === 'markdown' ? (
                <div className="nb-markdown" dangerouslySetInnerHTML={{ __html: cell.html }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: cell.html }} />
              )}
            </div>
          ))}
          {renderedCells.length === 0 && !error && (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">Paste a notebook JSON above to see a preview</p>
          )}
        </div>
      ) : (
        <pre className="tb-v2-md-html-pane mt-3">{notebook ? renderedCells.map(c => c.html).join('\n') : '—'}</pre>
      )}
    </div>
  );
}
