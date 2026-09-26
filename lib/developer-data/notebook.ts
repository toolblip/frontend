import { parseJson } from './core';
import { markdownHtml, previewDocument } from './browser';
const obj = (v: any) => v !== null && typeof v === 'object' && !Array.isArray(v);
export const notebookExample = JSON.stringify({ nbformat: 4, nbformat_minor: 5, metadata: { kernelspec: { name: 'python3', display_name: 'Python 3' } }, cells: [{ id: 'intro', cell_type: 'markdown', metadata: {}, source: ['# Notebook\n', 'Hello **Ada**.'] }, { id: 'code', cell_type: 'code', metadata: {}, source: ['print(42)'], execution_count: 2, outputs: [{ output_type: 'stream', name: 'stdout', text: ['42\n'] }] }] }, null, 2);
export function notebook(text: string) {
    const n = parseJson(text);
    if (!obj(n) || n.nbformat !== 4 || !Number.isInteger(n.nbformat_minor) || n.nbformat_minor < 0 || !obj(n.metadata) || !Array.isArray(n.cells))
        throw new Error('Expected a v4 notebook with nbformat_minor, metadata and cells.');
    const ids = new Set<string>();
    for (const [i, c] of n.cells.entries()) {
        if (!obj(c) || !['code', 'markdown', 'raw'].includes(c.cell_type) || !obj(c.metadata) || !(typeof c.source === 'string' || Array.isArray(c.source) && c.source.every((x: any) => typeof x === 'string')))
            throw new Error(`Invalid notebook cell ${i}: type, metadata or source.`);
        if (n.nbformat_minor >= 5 && (typeof c.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(c.id) || ids.has(c.id)))
            throw new Error(`Invalid or duplicate cell id at ${i}.`);
        if (c.id)
            ids.add(c.id);
        if (c.cell_type === 'code') {
            if (!(c.execution_count === null || Number.isInteger(c.execution_count) && c.execution_count >= 0) || !Array.isArray(c.outputs))
                throw new Error(`Invalid execution_count or outputs at cell ${i}.`);
            for (const o of c.outputs) {
                if (!obj(o) || !['stream', 'display_data', 'execute_result', 'error'].includes(o.output_type))
                    throw new Error(`Invalid output at cell ${i}.`);
                if (o.output_type === 'stream' && !(typeof o.text === 'string' || Array.isArray(o.text) && o.text.every((x: any) => typeof x === 'string')))
                    throw new Error('Invalid stream text.');
                if (['display_data', 'execute_result'].includes(o.output_type) && !obj(o.data))
                    throw new Error('Invalid output data.');
                if (o.output_type === 'error' && (!Array.isArray(o.traceback) || o.traceback.some((x: any) => typeof x !== 'string')))
                    throw new Error('Invalid traceback.');
            }
        }
    }
    return n;
}
export function cleanNotebook(text: string) { const n = notebook(text); return { ...n, cells: n.cells.map((c: any) => c.cell_type === 'code' ? { ...c, execution_count: null, outputs: [], metadata: Object.fromEntries(Object.entries(c.metadata).filter(([k]) => !['execution', 'collapsed', 'scrolled'].includes(k))) } : c) }; }
export function formatNotebook(text: string, sort = false) { const n = notebook(text); if (sort)
    n.cells = n.cells.map((c: any, i: number) => ({ c, i })).sort((a: any, b: any) => (a.c.execution_count ?? Infinity) - (b.c.execution_count ?? Infinity) || a.i - b.i).map((x: any) => x.c); return JSON.stringify(n, null, 2); }
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const source = (v: any) => Array.isArray(v) ? v.join('') : typeof v === 'string' ? v : '';
export function notebookHtml(text: string) {
    const n = notebook(text);
    return previewDocument(n.cells.map((c: any) => {
        if (c.cell_type === 'markdown')
            return markdownHtml(source(c.source));
        let html = '<pre><code>' + escape(source(c.source)) + '</code></pre>';
        for (const o of c.outputs ?? []) {
            const text = o.output_type === 'stream' ? source(o.text) : o.output_type === 'error' ? source(o.traceback?.join('\n')) : source(o.data?.['text/plain']);
            if (text)
                html += '<pre>' + escape(text) + '</pre>';
            else
                html += '<p>[Rich output omitted; only text outputs are exported.]</p>';
        }
        return html;
    }).join('\n'));
}
