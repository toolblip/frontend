'use client';

import { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const MARGIN = 30;
const FONT_SIZE = 8;
const ROW_HEIGHT = 16;

async function gridToPdfBytes(grid: string[][], sheetName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const numCols = grid.reduce((max, row) => Math.max(max, row.length), 0);
  const colWidths = Array.from({ length: numCols }, (_, c) => {
    let maxLen = 3;
    grid.forEach(row => { maxLen = Math.max(maxLen, (row[c] || '').length); });
    return Math.min(150, Math.max(40, maxLen * (FONT_SIZE * 0.6) + 8));
  });

  const usableWidth = PAGE_WIDTH - MARGIN * 2;
  const colGroups: number[][] = [];
  let current: number[] = [];
  let currentWidth = 0;
  colWidths.forEach((w, i) => {
    if (currentWidth + w > usableWidth && current.length > 0) {
      colGroups.push(current);
      current = [];
      currentWidth = 0;
    }
    current.push(i);
    currentWidth += w;
  });
  if (current.length) colGroups.push(current);

  const rowsPerPage = Math.max(1, Math.floor((PAGE_HEIGHT - MARGIN * 2 - ROW_HEIGHT) / ROW_HEIGHT));

  for (const colGroup of colGroups) {
    for (let rowStart = 0; rowStart < grid.length; rowStart += rowsPerPage) {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = PAGE_HEIGHT - MARGIN;
      page.drawText(sheetName, { x: MARGIN, y, size: 11, font: boldFont });
      y -= ROW_HEIGHT;

      const rowsSlice = grid.slice(rowStart, rowStart + rowsPerPage);
      rowsSlice.forEach((row, ri) => {
        let x = MARGIN;
        const isHeaderRow = rowStart === 0 && ri === 0;
        colGroup.forEach(c => {
          const text = (row[c] || '').slice(0, 40);
          page.drawRectangle({ x, y: y - ROW_HEIGHT, width: colWidths[c], height: ROW_HEIGHT, borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.5 });
          page.drawText(text, { x: x + 4, y: y - ROW_HEIGHT + 5, size: FONT_SIZE, font: isHeaderRow ? boldFont : font });
          x += colWidths[c];
        });
        y -= ROW_HEIGHT;
      });
    }
  }

  return doc.save();
}

export default function ExcelToPdfClient() {
  const [sheets, setSheets] = useState<SheetData[] | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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

  const downloadPdf = async () => {
    if (!sheets) return;
    setGenerating(true);
    try {
      const sheet = sheets[sheetIndex];
      const pdfBytes = await gridToPdfBytes(sheet.grid, sheet.name);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(fileName.replace(/\.xlsx$/i, '') || 'sheet')}-${sheet.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
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
          <div className="tb-v2-banner" style={{ marginBottom: 16 }}>
            Cell values are laid out into a real, paginated PDF table. Original Excel styling such as cell colors,
            merged cells, and number formats are not preserved, only the text content of each cell.
          </div>

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
            <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                {sheets[sheetIndex].grid.slice(0, 200).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ border: '1px solid var(--line)', padding: '2px 6px', whiteSpace: 'nowrap' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={downloadPdf} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 12 }} disabled={generating}>
            {generating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      )}

      {!sheets && !error && !loading && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an .xlsx file to convert it to PDF.</p>}
    </div>
  );
}
