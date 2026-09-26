'use client';
import { useMemo, useState, useRef, useEffect } from 'react';
import { markdownHtml, previewDocument } from '@/lib/developer-data/browser';
import { textPdf } from '@/lib/developer-data/pdf';
import { Actions, DataShell, TextInput, Result, attempt } from './DataUi';
export default function MarkdownTool({ pdf = false }: {
    pdf?: boolean;
}) {
    const [input, setInput] = useState(''), [view, setView] = useState('preview'), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const version = useRef(0);
    useEffect(() => () => { version.current++; }, []);
    function change(s: string) { version.current++; setInput(s); setBusy(false); setError(''); }
    const result = useMemo(() => attempt(() => input.trim() ? markdownHtml(input) : ''), [input]);
    async function download() {
        const v = version.current;
        setBusy(true);
        setError('');
        try {
            const body = new DOMParser().parseFromString(result.output, 'text/html').body;
            if (body.querySelector('img,table')) throw new Error('Direct PDF supports text only. Use Print / Save PDF for images and tables.');
            body.querySelectorAll('br').forEach(el => el.replaceWith('\n'));
            body.querySelectorAll('li').forEach(el => el.prepend('- '));
            const bytes = await textPdf(Array.from(body.children).map(el => ({ text: el.textContent || '', heading: /^H[1-6]$/.test(el.tagName), code: el.tagName === 'PRE' })));
            if (v === version.current) {
                const url = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
                const a = document.createElement('a'); a.href = url; a.download = 'markdown.pdf'; a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        }
        catch (e) {
            if (v === version.current)
                setError(e instanceof Error ? e.message : String(e));
        }
        finally {
            if (v === version.current)
                setBusy(false);
        }
    }
    function print() { const win = window.open('', '_blank'); if (!win) {
        setError('Popup blocked. Allow popups to print.');
        return;
    } win.opener = null; win.document.write(previewDocument(result.output)); win.document.close(); win.focus(); win.print(); }
    return <DataShell><Actions example={() => change('# Hello\n\nA **bold** statement.\n\n- One\n- Two\n\n```js\nconst answer = 42;\n```')} clear={() => { change(''); setView('preview'); }}/><TextInput label="Markdown input" value={input} onChange={change}/><div role="tablist" aria-label="Output view">{['preview', 'html'].map(v => <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className="tb-v2-mode-tab">{v === 'preview' ? 'Preview' : 'HTML'}</button>)}</div>{view === 'preview' && result.output && <iframe title="Rendered preview" sandbox="" srcDoc={previewDocument(result.output)} style={{ width: '100%', height: 400, border: 0 }}/>}<Result {...result}/>{pdf && <><p>Download a text PDF (ASCII). For Unicode, images, tables and full browser styling, use Print / Save PDF. Raw HTML is sanitized in all modes.</p><button className="tb-v2-btn" onClick={download} disabled={!result.output || busy}>{busy ? 'Creating PDF…' : 'Download PDF'}</button><button className="tb-v2-btn" onClick={print} disabled={!result.output}>Print / Save PDF</button></>}{error && <p role="alert" className="tb-v2-error">{error}</p>}</DataShell>;
}
