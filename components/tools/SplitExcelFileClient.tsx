'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SplitExcelFileClient() {
  const [fileName, setFileName] = useState('');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [rows, setRows] = useState<unknown[][]>([]);
  const [rowsPerFile, setRowsPerFile] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const workbookRef = useRef<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRowsForSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
    setRows(aoa);
  };

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setSheetNames([]);
    setRows([]);
    workbookRef.current = null;
    if (!/\.xlsx$/i.test(file.name)) {
      setError('Please choose a file with an .xlsx extension.');
      return;
    }
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      if (wb.SheetNames.length === 0) throw new Error('No worksheets found in this file.');
      workbookRef.current = wb;
      setFileName(file.name);
      setSheetNames(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]);
      loadRowsForSheet(wb, wb.SheetNames[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not parse this .xlsx file.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const changeSheet = (name: string) => {
    setSelectedSheet(name);
    if (workbookRef.current) loadRowsForSheet(workbookRef.current, name);
  };

  const header = rows.length > 0 ? rows[0] : null;
  const dataRows = rows.length > 0 ? rows.slice(1) : [];
  const chunks = header !== null ? chunk(dataRows, Math.max(1, rowsPerFile)) : [];

  const downloadAll = async () => {
    if (header === null || chunks.length === 0) return;
    setDownloading(true);
    const base = fileName.replace(/\.xlsx$/i, '') || 'split';
    for (let i = 0; i < chunks.length; i++) {
      const aoa = [header, ...chunks[i]];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, selectedSheet || 'Sheet1');
      const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
      const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${base}-part${i + 1}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      await sleep(250);
    }
    setDownloading(false);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Excel File</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>📊</span>
          <span className="tb-v2-dropzone-text">{loading ? 'Parsing...' : 'Click or drag an .xlsx file here'}</span>
          <span className="tb-v2-dropzone-hint">Parsed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {header !== null && (
        <div style={{ padding: '0 20px 20px' }}>
          {sheetNames.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {sheetNames.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => changeSheet(name)}
                  className={`tb-v2-mode-tab ${name === selectedSheet ? 'on' : ''}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
            Sheet <strong>{selectedSheet}</strong> — {dataRows.length.toLocaleString()} data rows (plus header). Files will download individually, one after another.
          </div>

          <div className="tb-v2-grid-2">
            <div>
              <span className="tb-v2-tool-label">Rows per output file</span>
              <input
                type="number"
                min={1}
                value={rowsPerFile}
                onChange={e => setRowsPerFile(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="tb-v2-input"
              />
            </div>
            <div>
              <span className="tb-v2-tool-label">Output files</span>
              <div className="tb-v2-input" style={{ display: 'flex', alignItems: 'center', color: 'var(--fg-2)' }}>
                {chunks.length.toLocaleString()} file{chunks.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadAll}
            disabled={downloading || chunks.length === 0}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
            style={{ marginTop: 16 }}
          >
            {downloading ? `Downloading ${chunks.length} files...` : `Download ${chunks.length} Excel Files`}
          </button>
        </div>
      )}

      {header === null && !error && !loading && (
        <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an .xlsx file to split it into smaller files.</p>
      )}
    </div>
  );
}
