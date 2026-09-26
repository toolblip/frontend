'use client';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { readImage, exampleFile } from '@/lib/images-qa';
export default function Base64ImageViewerClient() {
    const [text, setText] = useState(''), [url, setUrl] = useState(''), [error, setError] = useState(''), [dimensions, setDimensions] = useState('');
    const request = useRef(0), input = useRef<HTMLInputElement>(null);
    useEffect(() => () => { request.current++; }, []);
    useEffect(() => () => { if (url)
        URL.revokeObjectURL(url); }, [url]);
    const validate = async (value: string) => { const id = ++request.current; setText(value); setUrl(''); setError(''); setDimensions(''); if (!value.trim())
        return; try {
        if (value.length > 28000000)
            throw Error('Use a data URL up to 28 MB.');
        const match = value.trim().match(/^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/\s]*={0,2})$/);
        if (!match)
            throw Error('Enter an image Base64 data URL.');
        const bytes = Uint8Array.from(atob(match[2].replace(/\s/g, '')), c => c.charCodeAt(0));
        const { img, mime } = await readImage(new Blob([bytes]));
        if (id !== request.current)
            return;
        if (match[1] !== mime)
            throw Error('Declared image type does not match the file bytes.');
        setDimensions(`${img.naturalWidth} × ${img.naturalHeight}`);
        setUrl(URL.createObjectURL(new Blob([bytes], { type: mime })));
    }
    catch (e) {
        if (id === request.current)
            setError((e as Error).message);
    } };
    return <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style><div className="tb-v2-tool-input-head"><span>Base64 image</span><ToolExampleClearActions onExample={() => { const r = new FileReader(); const id = ++request.current; r.onload = () => { if (id === request.current)
        validate(String(r.result)); }; r.readAsDataURL(exampleFile()); }} onClear={() => { validate(''); if (input.current)
        input.current.value = ''; }}/></div><textarea aria-label="Base64 image data URL" className="tb-v2-tool-textarea" value={text} onChange={e => validate(e.target.value)}/><input ref={input} aria-label="Load from text file" type="file" accept=".txt,.b64" onChange={async (e) => { const f = e.target.files?.[0]; if (!f)
        return; const id = ++request.current; if (f.size > 28000000) {
        validate('');
        setError('Text file exceeds 28 MB.');
        return;
    } const t = await f.text(); if (id === request.current)
        validate(t); }}/><div className="tb-v2-tool-output-body">{error && <p role="alert">{error}</p>}{url && <><p>{dimensions}</p><img src={url} alt="Base64" style={{ maxWidth: '100%', maxHeight: 400 }}/><button className="tb-v2-btn" onClick={() => navigator.clipboard.writeText(text).catch(() => setError('Could not copy. Select and copy the data URL manually.'))}>Copy Data URL</button></>}</div></div>;
}
