'use client';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { readImage, exampleFile, imageBounds, positive, canvasBlob, pngDpi, saveBlob } from '@/lib/images-qa';
export default function ImageDpiResizerClient() {
    const [source, setSource] = useState<Awaited<ReturnType<typeof readImage>> | null>(null);
    const [from, setFrom] = useState('72'), [to, setTo] = useState('300'), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    const request = useRef(0), input = useRef<HTMLInputElement>(null);
    useEffect(() => () => { request.current++; }, []);
    const clear = () => { request.current++; setSource(null); setError(''); setBusy(false); if (input.current)
        input.current.value = ''; };
    const load = async (file?: File) => { if (!file)
        return; clear(); const id = request.current; setBusy(true); try {
        const s = await readImage(file);
        if (id === request.current)
            setSource(s);
    }
    catch (e) {
        if (id === request.current)
            setError((e as Error).message);
    }
    finally {
        if (id === request.current)
            setBusy(false);
    } };
    const f = positive(from), t = positive(to);
    let width = 0, height = 0, validation = '';
    if (source) {
        try {
            if (!f || !t || f > 10000 || t > 10000)
                throw Error('Enter DPI values from 1 to 10000.');
            width = Math.round(source.img.naturalWidth * t / f);
            height = Math.round(source.img.naturalHeight * t / f);
            imageBounds(width, height);
        }
        catch (e) {
            validation = (e as Error).message;
        }
    }
    const download = async () => { if (!source || validation || !t)
        return; const id = ++request.current; setBusy(true); setError(''); try {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        c.getContext('2d')!.drawImage(source.img, 0, 0, width, height);
        const blob = await canvasBlob(c);
        const bytes = pngDpi(new Uint8Array(await blob.arrayBuffer()), t);
        if (id === request.current)
            saveBlob(new Blob([bytes], { type: 'image/png' }), `dpi-${t}-${width}x${height}.png`);
    }
    catch (e) {
        if (id === request.current)
            setError((e as Error).message);
    }
    finally {
        if (id === request.current)
            setBusy(false);
    } };
    return <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style><div className="tb-v2-tool-input-head"><span>Print resolution</span><ToolExampleClearActions onExample={() => { setFrom('100'); setTo('200'); load(exampleFile()); }} onClear={clear}/></div><div className="tb-v2-tool-output-body" style={{ display: 'grid', gap: 12 }}>
 <input ref={input} aria-label="Upload image" type="file" accept="image/*" onChange={e => load(e.target.files?.[0])}/>
 <p>Resamples pixels to preserve the print size you specify. The PNG download includes the target DPI metadata. Current DPI is your assumption; it isn’t read from the file. Upscaling cannot recover missing detail.</p>
 <label>Current DPI<input className="tb-v2-input" type="number" value={from} onChange={e => { request.current++; setBusy(false); setFrom(e.target.value); }}/></label><label>Target DPI<input className="tb-v2-input" type="number" value={to} onChange={e => { request.current++; setBusy(false); setTo(e.target.value); }}/></label>
 {(error || validation) && <p role="alert">{error || validation}</p>}{busy && <p role="status">Processing…</p>}
 {source && !validation && <><p role="status">{width} × {height} pixels · {t} DPI</p><button className="tb-v2-btn tb-v2-btn-primary" disabled={busy} onClick={download}>Download PNG</button></>}
 </div></div>;
}
