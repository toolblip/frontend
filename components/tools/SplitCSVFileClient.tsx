'use client';
import { readBrowserFile } from '@/lib/utility-design/core';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useRef, useState, useEffect } from 'react';

import { csvRows as splitCsvRows } from '@/lib/utility-design/core';

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SplitCSVFileClient() {
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const [fileName, setFileName] = useState('');
  const [header, setHeader] = useState<string | null>(null);
  const [dataRows, setDataRows] = useState<string[]>([]);
  const [rowsPerFile, setRowsPerFile] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    const id = ++generation.current;
    setDownloading(false);
    if (file.size > 10 * 1024 * 1024) { setError('Maximum file size is 10 MiB.'); setHeader(null); setDataRows([]); return; }
    setError('');
    setHeader(null);
    setDataRows([]);
    if (!/\.csv$/i.test(file.name)) {
      setError('Please choose a file with a .csv extension.');
      return;
    }
    try {
      const text = new TextDecoder('utf-8', {fatal:true}).decode(await readBrowserFile(file));
      if (id !== generation.current) return;
      const rows = splitCsvRows(text);
      if(rows.length > 100001) throw new Error('Maximum 100000 data rows.');
      if (rows.length === 0) {
        setError('This CSV file appears to be empty.');
        return;
      }
      setFileName(file.name);
      setHeader(rows[0]);
      setDataRows(rows.slice(1));
    } catch {
      if (id === generation.current) setError('Could not read this file or CSV is malformed.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const chunks = header !== null ? chunk(dataRows, Math.max(1, rowsPerFile)) : [];

  const downloadAll = async () => {
    if (header === null || chunks.length === 0) return;
    const id = generation.current;
    setDownloading(true);
    const base = fileName.replace(/\.csv$/i, '') || 'split';
    for (let i = 0; i < chunks.length; i++) {
      if (id !== generation.current) break;
      const csvText = [header, ...chunks[i]].join('\n');
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${base}-part${i + 1}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      // Small delay between downloads so the browser doesn't block them as a popup flood.
      await sleep(250);
    }
    setDownloading(false);
  };

  return (<UtilityDesignLayout>
    <div className="tb-v2-tool-card">
      <ToolExampleClearActions onExample={() => { void loadFile(new File(['name,note\nAda,hello\nLin,world\n'], 'example.csv', {type:'text/csv'})); }} onClear={() => { generation.current++; setFileName(''); setHeader(null); setDataRows([]); setError(''); setDownloading(false); if(fileInputRef.current) fileInputRef.current.value=''; }}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload CSV File</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>📄</span>
          <span className="tb-v2-dropzone-text">Click or drag a .csv file here</span>
          <span className="tb-v2-dropzone-hint">Parsed entirely in your browser</span>
          <input ref={fileInputRef} aria-label="Upload file" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {header !== null && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
            Loaded <strong>{fileName}</strong> — {dataRows.length.toLocaleString()} data rows (plus header). Files will download individually, one after another.
          </div>

          <div className="tb-v2-grid-2">
            <div>
              <span className="tb-v2-tool-label">Rows per output file</span>
              <input aria-label="Rows Per File"
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
            {downloading ? `Downloading ${chunks.length} files...` : `Download ${chunks.length} CSV Files`}
          </button>
        </div>
      )}

      {header === null && !error && (
        <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload a .csv file to split it into smaller files.</p>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
