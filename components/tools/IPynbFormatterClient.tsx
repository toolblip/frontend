'use client';

import { useMemo, useState } from 'react';

interface NotebookCell {
  cell_type?: string;
  execution_count?: number | null;
  [key: string]: unknown;
}

interface Notebook {
  cells?: NotebookCell[];
  [key: string]: unknown;
}

function sortCellsByExecutionCount(cells: NotebookCell[]): NotebookCell[] {
  return cells
    .map((cell, index) => ({ cell, index }))
    .sort((a, b) => {
      const ea = typeof a.cell.execution_count === 'number' ? a.cell.execution_count : null;
      const eb = typeof b.cell.execution_count === 'number' ? b.cell.execution_count : null;
      if (ea === null && eb === null) return a.index - b.index;
      if (ea === null) return 1;
      if (eb === null) return -1;
      if (ea !== eb) return ea - eb;
      return a.index - b.index;
    })
    .map((x) => x.cell);
}

export default function IPynbFormatterClient() {
  const [input, setInput] = useState('');
  const [sortCells, setSortCells] = useState(false);
  const [copied, setCopied] = useState(false);

  const { formatted, error, summary } = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null as string | null, summary: null as Record<string, number> | null };
    let nb: Notebook;
    try {
      nb = JSON.parse(input);
    } catch (e) {
      return { formatted: '', error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`, summary: null };
    }
    if (!nb || typeof nb !== 'object' || !Array.isArray(nb.cells)) {
      return { formatted: '', error: 'Not a valid Jupyter notebook: missing a top-level "cells" array.', summary: null };
    }

    const counts: Record<string, number> = { code: 0, markdown: 0, raw: 0, other: 0 };
    for (const cell of nb.cells) {
      const type = cell.cell_type;
      if (type === 'code' || type === 'markdown' || type === 'raw') counts[type]++;
      else counts.other++;
    }

    const outNb: Notebook = sortCells
      ? { ...nb, cells: sortCellsByExecutionCount(nb.cells) }
      : nb;

    return { formatted: JSON.stringify(outNb, null, 2), error: null, summary: counts };
  }, [input, sortCells]);

  const loadExample = () => {
    setInput(
      JSON.stringify(
        {
          cells: [
            { cell_type: 'code', execution_count: 3, source: ['print("c")'], outputs: [], metadata: {} },
            { cell_type: 'markdown', execution_count: null, source: ['# Title'], metadata: {} },
            { cell_type: 'code', execution_count: 1, source: ['print("a")'], outputs: [], metadata: {} },
            { cell_type: 'code', execution_count: null, source: ['# not yet run'], outputs: [], metadata: {} },
          ],
          metadata: {},
          nbformat: 4,
          nbformat_minor: 5,
        },
        null,
        2,
      ),
    );
  };

  const copy = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!formatted) return;
    const blob = new Blob([formatted], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.ipynb';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Notebook JSON (.ipynb)</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="tb-v2-checkbox-row">
            <input type="checkbox" checked={sortCells} onChange={(e) => setSortCells(e.target.checked)} />
            Sort cells by execution count
          </label>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste the contents of a .ipynb file…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5 }}
        aria-label="Notebook JSON input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Formatted Notebook</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={download} disabled={!formatted} className="tb-v2-btn-sm">Download .ipynb</button>
          <button type="button" onClick={copy} disabled={!formatted} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error">{error}</p>
        ) : !formatted ? (
          <p className="tb-v2-empty">Paste a Jupyter notebook JSON file above to format it.</p>
        ) : (
          <>
            {summary && (
              <div className="tb-v2-stats-grid" style={{ padding: 0, marginBottom: 12, border: 'none', background: 'transparent' }}>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val">{summary.code}</span>
                  <span className="tb-v2-stat-pill-lbl">Code</span>
                </div>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val">{summary.markdown}</span>
                  <span className="tb-v2-stat-pill-lbl">Markdown</span>
                </div>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val">{summary.raw}</span>
                  <span className="tb-v2-stat-pill-lbl">Raw</span>
                </div>
                {summary.other > 0 && (
                  <div className="tb-v2-stat-pill">
                    <span className="tb-v2-stat-pill-val">{summary.other}</span>
                    <span className="tb-v2-stat-pill-lbl">Other</span>
                  </div>
                )}
              </div>
            )}
            <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{formatted}</pre>
          </>
        )}
      </div>
    </div>
  );
}
