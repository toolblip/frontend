'use client';
import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { readImage, exampleFile, imageBounds, canvasBlob } from '@/lib/images-qa';
const presets = [[1280, 720], [1920, 1080], [1080, 1080], [1080, 1920], [300, 300], [854, 480]];
type Result = {
    url: string;
    name: string;
    width: number;
    height: number;
    size: number;
};
export default function BatchImageResizerClient() {
    const [files, setFiles] = useState<File[]>([]), [width, setWidth] = useState('1280'), [height, setHeight] = useState('720'), [lock, setLock] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [results, setResults] = useState<Result[]>([]);
    const ratio = useRef(1280 / 720), request = useRef(0), input = useRef<HTMLInputElement>(null), urls = useRef<string[]>([]);
    const invalidate = () => { request.current++; urls.current.forEach(URL.revokeObjectURL); urls.current = []; setResults([]); setBusy(false); setError(''); };
    useEffect(() => () => { request.current++; urls.current.forEach(URL.revokeObjectURL); }, []);
    const clear = () => { invalidate(); setFiles([]); if (input.current)
        input.current.value = ''; };
    const choose = (next: File[]) => { invalidate(); setFiles([]); if (next.length > 20 || next.reduce((n, f) => n + f.size, 0) > 100 * 1024 * 1024) {
        setError('Choose at most 20 images and 100 MB total.');
        return;
    } setFiles(next); };
    const resize = async () => { invalidate(); const id = request.current; setBusy(true); const out: Result[] = []; try {
        const w = Number(width), h = Number(height);
        imageBounds(w, h);
        if (w * h * files.length > 100000000)
            throw Error('Batch output exceeds 100 megapixels. Use fewer images or smaller dimensions.');
        for (const file of files) {
            const { img, mime } = await readImage(file);
            if (id !== request.current)
                return;
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const x = c.getContext('2d')!;
            const jpeg = mime === 'image/jpeg';
            if (jpeg) {
                x.fillStyle = '#ffffff';
                x.fillRect(0, 0, w, h);
            }
            const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
            x.drawImage(img, (w - img.naturalWidth * scale) / 2, (h - img.naturalHeight * scale) / 2, img.naturalWidth * scale, img.naturalHeight * scale);
            const blob = await canvasBlob(c, jpeg ? 'image/jpeg' : 'image/png');
            if (id !== request.current)
                return;
            const url = URL.createObjectURL(blob);
            urls.current.push(url);
            out.push({ url, name: file.name.replace(/\.[^.]+$/, '') + '-resized.' + (jpeg ? 'jpg' : 'png'), width: w, height: h, size: blob.size });
        }
        setResults(out);
    }
    catch (e) {
        if (id === request.current) {
            urls.current.forEach(URL.revokeObjectURL);
            urls.current = [];
            setError((e as Error).message);
        }
    }
    finally {
        if (id === request.current)
            setBusy(false);
    } };
    return <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style><div className="tb-v2-tool-input-head"><span>Batch resize</span><ToolExampleClearActions onExample={() => choose([exampleFile(), new File([exampleFile()], 'second.png', { type: 'image/png' })])} onClear={clear}/></div><div className="tb-v2-tool-output-body" style={{ display: 'grid', gap: 12 }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(Array.from(e.dataTransfer.files)); }}>
 <label>Select images to resize<input ref={input} type="file" multiple accept="image/*" onChange={e => choose(Array.from(e.target.files || []))}/></label><p>{files.length} images selected. Fits each image inside the target size. JPEG stays JPEG with white padding; other formats export PNG with transparent padding.</p>
 <label>Size preset<select className="tb-v2-input" onChange={e => { invalidate(); const [w, h] = e.target.value.split('x').map(Number); setWidth(String(w)); setHeight(String(h)); ratio.current = w / h; }} defaultValue="1280x720">{presets.map(([w, h]) => <option key={`${w}x${h}`} value={`${w}x${h}`}>{w} × {h}</option>)}</select></label>
 <label>Width<input className="tb-v2-input" type="number" value={width} onChange={e => { invalidate(); setWidth(e.target.value); if (lock)
        setHeight(String(Math.round(Number(e.target.value) / ratio.current))); }}/></label>
 <label>Height<input className="tb-v2-input" type="number" value={height} onChange={e => { invalidate(); setHeight(e.target.value); if (lock)
        setWidth(String(Math.round(Number(e.target.value) * ratio.current))); }}/></label>
 <label><input type="checkbox" checked={lock} onChange={e => { setLock(e.target.checked); if (Number(width) > 0 && Number(height) > 0)
        ratio.current = Number(width) / Number(height); }}/>Lock target aspect ratio</label>
 {error && <p role="alert">{error}</p>}<button className="tb-v2-btn tb-v2-btn-primary" onClick={resize} disabled={!files.length || busy}>{busy ? 'Processing…' : 'Resize Images'}</button>{busy && <button className="tb-v2-btn" onClick={invalidate}>Cancel</button>}
 {results.length>1&&<button className="tb-v2-btn" onClick={()=>{for(const r of results){const a=document.createElement('a');a.href=r.url;a.download=r.name;a.click();}}}>Download All</button>}
 {results.length>1&&<p>If your browser blocks multiple downloads, use each image’s Download button.</p>}
 {results.map((r, i) => <div key={r.url}><img src={r.url} alt={`Resized ${i + 1}`} style={{ maxWidth: '100%', maxHeight: 200 }}/><p>{r.width} × {r.height} · {r.size} bytes</p><a className="tb-v2-btn" href={r.url} download={r.name}>Download {i + 1}</a></div>)}
 </div></div>;
}
