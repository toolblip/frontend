'use client';

import { useState, useCallback, useMemo } from 'react';

import { useDataClipboard } from './developer-data/useDataClipboard';
import ToolExampleClearActions from './ToolExampleClearActions';
import { buildCsv } from '@/lib/developer-data/core';

const EXAMPLE_COLUMNS = ['Name', 'Email', 'Role'];
const EXAMPLE_ROWS = [
  ['Ada Lovelace', 'ada@example.com', 'Engineer'],
  ['Grace Hopper', 'grace@example.com', 'Admiral'],
];

export default function CsvGeneratorClient() {
  const [columns, setColumns] = useState<string[]>(EXAMPLE_COLUMNS);
  const [rows, setRows] = useState<string[][]>(EXAMPLE_ROWS);

  const csv = useMemo(() => columns.every(c => !c) && rows.length === 0 ? '' : buildCsv(columns, rows), [columns, rows]);

  const renameColumn = useCallback((index: number, name: string) => {
    setColumns(prev => prev.map((c, i) => (i === index ? name : c)));
  }, []);

  const addColumn = useCallback(() => {
    setColumns(prev => [...prev, `Column ${prev.length + 1}`]);
    setRows(prev => prev.map(r => [...r, '']));
  }, []);

  const removeColumn = useCallback((index: number) => {
    setColumns(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    setRows(prev => (columns.length > 1 ? prev.map(r => r.filter((_, i) => i !== index)) : prev));
  }, [columns.length]);

  const updateCell = useCallback((rowIndex: number, colIndex: number, value: string) => {
    setRows(prev => prev.map((r, i) => (i === rowIndex ? r.map((c, j) => (j === colIndex ? value : c)) : r)));
  }, []);

  const addRow = useCallback(() => {
    setRows(prev => [...prev, columns.map(() => '')]);
  }, [columns]);

  const removeRow = useCallback((index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  }, []);

  const loadExample = () => {
    setColumns(EXAMPLE_COLUMNS);
    setRows(EXAMPLE_ROWS);
  };

  const { copied, copy, reset: setCopied, copyError } = useDataClipboard(csv);

  const download = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col gap-4" style={{minWidth:0,maxWidth:"100%"}}>
      {copyError && <p role="alert" className="tb-v2-error">{copyError}</p>}
      <div className="tb-v2-tool-input-head" style={{flexWrap:"wrap",gap:12}}>
        <span className="tb-v2-tool-label">CSV Table Builder</span>
        <div className="flex flex-wrap gap-2">
          <ToolExampleClearActions onExample={loadExample} onClear={() => {setColumns(['']);setRows([]);setCopied(false);}}/>
          <button type="button" disabled={columns.length >= 30} onClick={addColumn} className="tb-v2-btn-sm">+ Column</button>
          <button type="button" disabled={rows.length >= 500} onClick={addRow} className="tb-v2-btn-sm">+ Row</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ padding: 4 }}>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      aria-label={`Column ${i + 1}`} maxLength={1000} value={col}
                      onChange={e => renameColumn(i, e.target.value)}
                      className="tb-v2-input"
                      style={{ fontWeight: 600 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeColumn(i)}
                      disabled={columns.length <= 1}
                      className="text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none shrink-0"
                      aria-label="Remove column"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {columns.map((_, ci) => (
                  <td key={ci} style={{ padding: 4 }}>
                    <input
                      type="text"
                      aria-label={`Row ${ri + 1} column ${ci + 1}`} maxLength={1000} value={row[ci] ?? ''}
                      onChange={e => updateCell(ri, ci, e.target.value)}
                      className="tb-v2-input"
                    />
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(ri)}
                    className="text-gray-500 hover:text-red-500 text-lg leading-none"
                    aria-label="Remove row"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && <p className="tb-v2-empty">Add a row above to start building your CSV.</p>}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSV Output</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={!csv} onClick={download} className="tb-v2-btn-sm">Download</button>
          <button type="button" disabled={!csv} onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{csv}</pre>
      </div>
    </div>
  );
}
