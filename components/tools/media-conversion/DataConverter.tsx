'use client';
import { useMemo, useState } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { markdownTable, parseCsv, rowsToXml, sqlToJson } from '@/lib/media-conversion/data';
import { useMediaJob } from './useMediaJob';
import Result from './Result';
const examples = {
  sql: "INSERT INTO users (id, name, active) VALUES (1, 'Ada', TRUE), (2, 'O''Brien', FALSE);",
  markdown: '[{"name":"Ada","role":"Engineer"},{"name":"Alan","role":"Scientist"}]',
  xml: 'name,note\r\nAda,"Hello, world"\r\nGrace,"A & B"',
  xlsx: 'name,note\r\nAda,"Hello, world"\r\nGrace,"A & B"',
};
export default function DataConverter({ mode }: { mode: keyof typeof examples }) {
  const [input, setInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const job = useMediaJob();
  const change = (s: string) => { job.cancel(); setInput(s); setCopyStatus(''); };
  const parsed = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const output = mode === 'sql' ? sqlToJson(input) : mode === 'markdown' ? markdownTable(input) : mode === 'xml' ? rowsToXml(parseCsv(input)) : JSON.stringify(parseCsv(input), null, 2);
      return { output, error: '' };
    } catch (e) { return { output: '', error: (e as Error).message }; }
  }, [input, mode]);
  const exportFile = () => job.run(async signal => {
    if (!parsed.output) throw new Error('Enter valid input first.');
    if (mode === 'xlsx') {
      const XLSX = await import('xlsx'); signal.throwIfAborted();
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(parseCsv(input)), 'Sheet1');
      return { blob: new Blob([XLSX.write(book, { type: 'array', bookType: 'xlsx' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), name: 'converted.xlsx' };
    }
    const [ext, type] = mode === 'sql' ? ['json', 'application/json'] : mode === 'markdown' ? ['md', 'text/markdown'] : ['xml', 'application/xml'];
    return { blob: new Blob([parsed.output], { type }), name: `converted.${ext}` };
  });
  return <div className="tb-v2-section" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">{mode === 'sql' ? 'SQL INSERT statements' : mode === 'markdown' ? 'JSON' : 'CSV'}</span><ToolExampleClearActions onExample={() => change(examples[mode])} onClear={() => change('')} /></div>
    {mode === 'sql' && <p>INSERT VALUES literals only. Expressions and unsafe numeric integers are rejected. Quote large identifiers to preserve their digits.</p>}
    {mode === 'xml' && <p>Column names are preserved in field name attributes, including duplicate headers.</p>}
    <textarea aria-label="Input" className="tb-v2-tool-textarea" value={input} maxLength={1000001} onChange={e => change(e.target.value)} />
    {(parsed.error || job.error) && <p role="alert" className="tb-v2-banner-err">{parsed.error || job.error}</p>}
    <pre aria-label="Result" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 400, overflow: 'auto' }}>{parsed.output}</pre>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <button className="tb-v2-btn" disabled={!parsed.output || job.busy} onClick={exportFile}>{job.busy ? 'Preparing…' : 'Prepare download'}</button>
      <button className="tb-v2-btn" disabled={!parsed.output} onClick={async () => { const id = job.generation.current; try { await navigator.clipboard.writeText(parsed.output); if (id === job.generation.current) setCopyStatus('Copied'); } catch { if (id === job.generation.current) setCopyStatus('Clipboard unavailable. Select and copy the result.'); } }}>Copy</button>
    </div>
    {copyStatus && <p role="status">{copyStatus}</p>}
    {job.result && <Result result={job.result} />}
  </div>;
}
