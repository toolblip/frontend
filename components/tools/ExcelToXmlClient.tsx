'use client';

import { useState, useRef } from 'react';

interface ZipEntry { offset: number; compSize: number; compMethod: number; }

function readUint16LE(b: Uint8Array, o: number): number { return b[o] | (b[o + 1] << 8); }
function readUint32LE(b: Uint8Array, o: number): number {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] * 0x1000000)) >>> 0;
}

function parseZip(bytes: Uint8Array): Map<string, ZipEntry> {
  const entries = new Map<string, ZipEntry>();
  const EOCD_SIG = 0x06054b50;
  let eocdOffset = -1;
  const minOffset = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minOffset; i--) {
    if (readUint32LE(bytes, i) === EOCD_SIG) { eocdOffset = i; break; }
  }
  if (eocdOffset === -1) throw new Error('No end-of-central-directory record found. This is not a valid .xlsx file.');

  const cdEntries = readUint16LE(bytes, eocdOffset + 10);
  const cdOffset = readUint32LE(bytes, eocdOffset + 16);
  const CD_SIG = 0x02014b50;

  let ptr = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (readUint32LE(bytes, ptr) !== CD_SIG) break;
    const compMethod = readUint16LE(bytes, ptr + 10);
    const compSize = readUint32LE(bytes, ptr + 20);
    const nameLen = readUint16LE(bytes, ptr + 28);
    const extraLen = readUint16LE(bytes, ptr + 30);
    const commentLen = readUint16LE(bytes, ptr + 32);
    const localHeaderOffset = readUint32LE(bytes, ptr + 42);
    const name = new TextDecoder('utf-8').decode(bytes.slice(ptr + 46, ptr + 46 + nameLen));
    entries.set(name, { offset: localHeaderOffset, compSize, compMethod });
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function extractZipEntry(bytes: Uint8Array, entry: ZipEntry): Promise<Uint8Array> {
  const LFH_SIG = 0x04034b50;
  const o = entry.offset;
  if (readUint32LE(bytes, o) !== LFH_SIG) throw new Error('Corrupt local file header in archive.');
  const nameLen = readUint16LE(bytes, o + 26);
  const extraLen = readUint16LE(bytes, o + 28);
  const dataStart = o + 30 + nameLen + extraLen;
  const compressed = bytes.slice(dataStart, dataStart + entry.compSize);
  if (entry.compMethod === 0) return compressed;
  if (entry.compMethod === 8) {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(compressed as BufferSource);
    writer.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  throw new Error(`Unsupported ZIP compression method (${entry.compMethod}).`);
}

function colToIndex(colLetters: string): number {
  let idx = 0;
  for (const ch of colLetters) idx = idx * 26 + (ch.charCodeAt(0) - 64);
  return idx - 1;
}

function parseCellRef(ref: string): { col: number; row: number } {
  const m = ref.match(/^([A-Z]+)(\d+)$/);
  if (!m) return { col: 0, row: 0 };
  return { col: colToIndex(m[1]), row: parseInt(m[2], 10) - 1 };
}

interface SheetData { name: string; grid: string[][]; }

async function parseXlsx(bytes: Uint8Array): Promise<SheetData[]> {
  const entries = parseZip(bytes);

  const workbookEntry = entries.get('xl/workbook.xml');
  if (!workbookEntry) throw new Error('Not a valid .xlsx file (missing xl/workbook.xml).');
  const workbookXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, workbookEntry));
  const workbookDoc = new DOMParser().parseFromString(workbookXml, 'application/xml');
  const sheetEls = Array.from(workbookDoc.getElementsByTagName('sheet'));

  const relsEntry = entries.get('xl/_rels/workbook.xml.rels');
  const relsMap = new Map<string, string>();
  if (relsEntry) {
    const relsXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, relsEntry));
    const relsDoc = new DOMParser().parseFromString(relsXml, 'application/xml');
    Array.from(relsDoc.getElementsByTagName('Relationship')).forEach(rel => {
      const id = rel.getAttribute('Id');
      const target = rel.getAttribute('Target');
      if (id && target) relsMap.set(id, target.startsWith('/') ? target.slice(1) : `xl/${target}`);
    });
  }

  let sharedStrings: string[] = [];
  const sstEntry = entries.get('xl/sharedStrings.xml');
  if (sstEntry) {
    const sstXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, sstEntry));
    const sstDoc = new DOMParser().parseFromString(sstXml, 'application/xml');
    sharedStrings = Array.from(sstDoc.getElementsByTagName('si')).map(si =>
      Array.from(si.getElementsByTagName('t')).map(t => t.textContent || '').join('')
    );
  }

  const sheets: SheetData[] = [];
  for (const sheetEl of sheetEls) {
    const name = sheetEl.getAttribute('name') || 'Sheet';
    const rId = sheetEl.getAttribute('r:id');
    const target = rId ? relsMap.get(rId) : null;
    if (!target) continue;
    const sheetEntry = entries.get(target);
    if (!sheetEntry) continue;
    const sheetXml = new TextDecoder('utf-8').decode(await extractZipEntry(bytes, sheetEntry));
    const sheetDoc = new DOMParser().parseFromString(sheetXml, 'application/xml');

    let maxRow = 0, maxCol = 0;
    const cells: { row: number; col: number; value: string }[] = [];
    Array.from(sheetDoc.getElementsByTagName('row')).forEach(rowEl => {
      Array.from(rowEl.getElementsByTagName('c')).forEach(cellEl => {
        const ref = cellEl.getAttribute('r');
        if (!ref) return;
        const { row, col } = parseCellRef(ref);
        const type = cellEl.getAttribute('t');
        let value = '';
        if (type === 'inlineStr') {
          value = cellEl.getElementsByTagName('t')[0]?.textContent || '';
        } else {
          const vEl = cellEl.getElementsByTagName('v')[0];
          const raw = vEl?.textContent || '';
          if (type === 's') {
            const idx = parseInt(raw, 10);
            value = sharedStrings[idx] || '';
          } else if (type === 'b') {
            value = raw === '1' ? 'TRUE' : 'FALSE';
          } else {
            value = raw;
          }
        }
        cells.push({ row, col, value });
        if (row > maxRow) maxRow = row;
        if (col > maxCol) maxCol = col;
      });
    });

    const grid: string[][] = Array.from({ length: maxRow + 1 }, () => Array(maxCol + 1).fill(''));
    cells.forEach(({ row, col, value }) => { grid[row][col] = value; });
    sheets.push({ name, grid });
  }

  if (sheets.length === 0) throw new Error('No worksheets found in this file.');
  return sheets;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function gridToXml(grid: string[][], sheetName: string): string {
  const rows = grid.map((row, ri) => {
    const cells = row.map((cell, ci) => `    <Cell column="${ci + 1}">${escapeXml(cell)}</Cell>`).join('\n');
    return `  <Row index="${ri + 1}">\n${cells}\n  </Row>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Worksheet name="${escapeXml(sheetName)}">\n${rows}\n</Worksheet>`;
}

export default function ExcelToXmlClient() {
  const [sheets, setSheets] = useState<SheetData[] | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setSheets(null);
    if (!/\.xlsx$/i.test(file.name)) {
      setError('Please choose a file with an .xlsx extension.');
      return;
    }
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = await parseXlsx(new Uint8Array(buffer));
      setFileName(file.name);
      setSheets(parsed);
      setSheetIndex(0);
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

  const currentXml = sheets ? gridToXml(sheets[sheetIndex].grid, sheets[sheetIndex].name) : '';

  const downloadXml = () => {
    if (!sheets) return;
    const blob = new Blob([currentXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName.replace(/\.xlsx$/i, '') || 'sheet')}-${sheets[sheetIndex].name}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyXml = async () => {
    await navigator.clipboard.writeText(currentXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {sheets && (
        <div style={{ padding: '0 20px 20px' }}>
          {sheets.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {sheets.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSheetIndex(i)}
                  className={`tb-v2-mode-tab ${i === sheetIndex ? 'on' : ''}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          <div className="tb-v2-tool-pre" style={{ maxHeight: 300, overflow: 'auto' }}>
            <pre style={{ margin: 0, fontSize: 12 }}>{currentXml.slice(0, 8000)}{currentXml.length > 8000 ? '\n...' : ''}</pre>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" onClick={downloadXml} className="tb-v2-btn tb-v2-btn-primary">Download XML</button>
            <button type="button" onClick={copyXml} className="tb-v2-btn-sm">{copied ? 'Copied' : 'Copy XML'}</button>
          </div>
        </div>
      )}

      {!sheets && !error && !loading && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an .xlsx file to convert it to XML.</p>}
    </div>
  );
}
