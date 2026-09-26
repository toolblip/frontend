'use client';
import { useRef, useState } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { csvString, rowsToXml } from '@/lib/media-conversion/data';
import type { Sheet } from '@/lib/media-conversion/spreadsheet';
import { useMediaJob } from './useMediaJob';
import Result from './Result';
export default function SpreadsheetConverter({ format }: { format: 'csv' | 'xml' | 'pdf' }) {
  const [sheets, setSheets] = useState<Sheet[]>([]), [index, setIndex] = useState(0), [name, setName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null); const job = useMediaJob();
  const clear = () => { job.cancel(); setSheets([]); setIndex(0); setName(''); if (fileInput.current) fileInput.current.value = ''; };
  const load = (file?: File, example = false) => {
    clear();
    void job.run(async signal => {
      if (!example && (!file || !/\.xlsx$/i.test(file.name) || file.size > 5 * 1024 * 1024)) throw new Error('Choose an XLSX file, maximum 5 MB. Legacy XLS is unsupported.');
      const { readSheets, exampleWorkbook } = await import('@/lib/media-conversion/spreadsheet');
      const bytes = example ? exampleWorkbook() : new Uint8Array(await file!.arrayBuffer()); signal.throwIfAborted();
      const data = readSheets(bytes); signal.throwIfAborted();
      setSheets(data); setName(example ? 'example.xlsx' : file!.name); return null;
    });
  };
  const sheet = sheets[index];
  const text = sheet && format !== 'pdf' ? (() => { try { return format === 'csv' ? csvString(sheet.rows) : rowsToXml(sheet.rows); } catch { return ''; } })() : '';
  const convert = () => job.run(async signal => {
    if (!sheet?.rows.length) throw new Error('Selected sheet is empty.');
    let blob: Blob;
    if (format === 'pdf') { const { sheetPdf } = await import('@/lib/media-conversion/spreadsheet'); const bytes = await sheetPdf(sheet); signal.throwIfAborted(); blob = new Blob([bytes as BlobPart], { type: 'application/pdf' }); }
    else blob = new Blob([format === 'csv' ? csvString(sheet.rows) : rowsToXml(sheet.rows)], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/xml' });
    return { blob, name: `${name.replace(/\.xlsx$/i, '')}-${sheet.name.replace(/[^\w-]/g, '_')}.${format}`, detail: `${sheet.rows.length} rows` };
  });
  return <div className="tb-v2-section" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">Excel workbook</span><ToolExampleClearActions onExample={() => load(undefined, true)} onClear={clear} /></div>
    <input ref={fileInput} type="file" accept=".xlsx" aria-label="Workbook file" style={{ maxWidth: '100%' }} onChange={e => { if (e.target.files?.[0]) load(e.target.files[0]); }} />
    <p>XLSX only, up to 5 MB. Exports cell values from the selected sheet; formulas aren't recalculated. {format === 'pdf' ? 'PDF is a wrapped, paginated text export, without Excel formatting or charts. The PDF font supports Western European text.' : format === 'xml' ? 'The first row supplies field name attributes.' : 'CSV preserves cell text, including formula-like strings. Review untrusted data before opening it in a spreadsheet.'}</p>
    {!!sheets.length && <label>Sheet<select aria-label="Sheet" className="tb-v2-select" value={index} onChange={e => { job.cancel(); setIndex(Number(e.target.value)); }}>{sheets.map((s, i) => <option key={i} value={i}>{s.name}</option>)}</select></label>}
    {text && <pre aria-label="Result" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 300, overflow: 'auto' }}>{text}</pre>}
    {format !== 'pdf' && <button className="tb-v2-btn" disabled={!text} onClick={async () => { const id = job.generation.current; try { await navigator.clipboard.writeText(text); } catch { if (id === job.generation.current) job.setError('Clipboard unavailable. Select and copy the result.'); } }}>Copy</button>}
    {job.error && <p role="alert">{job.error}</p>}
    {job.busy && <p role="status">Processing…</p>}
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={!sheet || job.busy} onClick={convert}>Convert</button>
    {job.busy && <button className="tb-v2-btn" onClick={clear}>Cancel</button>}
    {job.result && <Result result={job.result} />}
  </div>;
}
