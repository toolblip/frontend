'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
export function DataShell({ children }: {
    children: ReactNode;
}) { return <div style={{ minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>; }
export function Actions({ example, clear }: {
    example: () => void;
    clear: () => void;
}) { return <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 12 }}><span className="tb-v2-tool-label">Input</span><ToolExampleClearActions onExample={example} onClear={clear}/></div>; }
export function TextInput({ label, value, onChange }: {
    label: string;
    value: string;
    onChange: (s: string) => void;
}) { return <label className="tb-v2-tool-label">{label}<textarea aria-label={label} value={value} onChange={e => onChange(e.target.value)} className="tb-v2-tool-textarea" style={{ width: '100%', minWidth: 0, fontFamily: 'var(--f-mono)', minHeight: 140 }} spellCheck={false}/></label>; }
export function Result({ output, error }: {
    output: string;
    error: string;
}) {
    const [status, setStatus] = useState('');
    const version = useRef(0);
    useEffect(() => { version.current++; setStatus(''); }, [output, error]);
    async function copy() { const v = version.current; try {
        await navigator.clipboard.writeText(output);
        if (v === version.current)
            setStatus('Copied');
    }
    catch {
        if (v === version.current)
            setStatus('Copy failed. Select the output to copy it.');
    } }
    return <>{error && <p role="alert" className="tb-v2-error">{error}</p>}<div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Output</span><button className="tb-v2-copy-btn" onClick={copy} disabled={!output || !!error}>Copy</button><span role="status">{status}</span></div><pre aria-label="Output" className="tb-v2-tool-pre" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 500, overflow: 'auto', minWidth: 0 }}>{error ? '' : output}</pre></>;
}
export function attempt(run: () => string): {
    output: string;
    error: string;
} { try {
    return { output: run(), error: '' };
}
catch (e) {
    return { output: '', error: e instanceof Error ? e.message : String(e) };
} }
export function downloadText(text: string, name: string, type = 'text/plain') { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
