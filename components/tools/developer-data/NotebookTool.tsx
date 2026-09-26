'use client';
import { useMemo, useRef, useEffect, useState } from 'react';
import { NOTEBOOK_BUDGET, notebookExample, cleanNotebook, formatNotebook, notebookHtml } from '@/lib/developer-data/notebook';
import { Actions, DataShell, TextInput, Result, attempt, downloadText } from './DataUi';
export default function NotebookTool({ mode }: {
    mode: 'clean' | 'format' | 'html';
}) {
    const [input, setInput] = useState(''), [sort, setSort] = useState(false), [view, setView] = useState<'preview' | 'html'>('preview'), [fileError, setFileError] = useState(''), [loading, setLoading] = useState(false);
    const version = useRef(0), fileRef = useRef<HTMLInputElement>(null);
    useEffect(() => () => { version.current++; }, []);
    function change(s: string) { version.current++; setLoading(false); setFileError(''); setInput(s); }
    const result = useMemo(() => attempt(() => !input.trim() ? '' : mode === 'clean' ? JSON.stringify(cleanNotebook(input), null, 2) : mode === 'format' ? formatNotebook(input, sort) : notebookHtml(input)), [input, mode, sort]);
    async function upload(file: File | undefined) { if (!file)
        return; change(''); const v = version.current; if (!/\.ipynb$/i.test(file.name) || file.size > NOTEBOOK_BUDGET.maxBytes) {
        setFileError('Choose an .ipynb file up to 10 MiB.');
        return;
    } setLoading(true); try {
        const text = await file.text();
        if (v === version.current) {
            setInput(text);
            setLoading(false);
        }
    }
    catch {
        if (v === version.current) {
            setFileError('Could not read this file.');
            setLoading(false);
        }
    } }
    return <DataShell><Actions example={() => change(notebookExample)} clear={() => { change(''); setSort(false); setView('preview'); if (fileRef.current)
        fileRef.current.value = ''; }}/><p>Notebook limit: 10 MiB, 64 nesting levels and 100,000 JSON values.</p><label>Upload notebook<input ref={fileRef} type="file" aria-label="Upload notebook" accept=".ipynb" onChange={e => upload(e.target.files?.[0])} style={{ maxWidth: '100%' }}/></label><TextInput label="Notebook JSON input" value={input} onChange={change}/>{loading && <p role="status">Reading notebook…</p>}{fileError && <p role="alert" className="tb-v2-error">{fileError}</p>}{mode === 'format' && <label><input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)}/> Sort cells by execution count (changes document order)</label>}{mode === 'clean' && <p>Removes outputs, execution counts and execution UI metadata. Removes custom notebook metadata and widget state; retains kernel and language information, source, cell IDs, attachments and other cell metadata.</p>}{mode === 'html' && <><p>Exports Markdown, raw and code cells with text outputs. Rich image/widget outputs are not exported.</p><div role="tablist" aria-label="Notebook view">{(['preview', 'html'] as const).map(v => <button key={v} role="tab" aria-selected={view === v} className="tb-v2-mode-tab" onClick={() => setView(v)}>{v === 'preview' ? 'Preview' : 'HTML'}</button>)}</div>{view === 'preview' && result.output && <iframe title="Notebook preview" sandbox="" srcDoc={result.output} style={{ width: '100%', height: 400, border: 0 }}/>}</>}<Result output={result.output} error={result.error}/><button className="tb-v2-btn" disabled={!result.output || loading || !!fileError} onClick={() => downloadText(result.output, mode === 'html' ? 'notebook.html' : mode === 'clean' ? 'cleaned.ipynb' : 'formatted.ipynb', mode === 'html' ? 'text/html' : 'application/x-ipynb+json')}>Download {mode === 'html' ? 'HTML' : '.ipynb'}</button></DataShell>;
}
