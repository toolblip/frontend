'use client';
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { encodeCanvas, checkedImage, dimensions, gifFrames, IMAGE_BYTES, imageKind, preflightImage, sanitizeSvg, type ImageKind } from '@/lib/media-conversion/image';
import { useMediaJob } from './useMediaJob';
import Result from './Result';
type Mode = 'png' | 'jpeg' | 'webp' | 'apng' | 'trace';
export default function ImageConverter({ output, source }: { output?: Mode; source?: ImageKind }) {
  const path = usePathname(); const slug = path.split('/').pop() || '';
  const [routeFrom, routeTo] = slug.split('-to-');
  const target = output || ({ jpg: 'jpeg', png: 'png', webp: 'webp' }[routeTo] as Mode | undefined) || 'png';
  const expected = source || ({ jpg: 'jpeg', webp: 'webp', png: 'png', svg: 'svg' }[routeFrom] as ImageKind | undefined);
  const [file, setFile] = useState<File | null>(null), [quality, setQuality] = useState(90), [frame, setFrame] = useState(1), [preset, setPreset] = useState('default');
  const [background, setBackground] = useState('#ffffff');
  const inputRef = useRef<HTMLInputElement>(null); const job = useMediaJob();
  const clear = () => { job.cancel(); setFile(null); setFrame(1); if (inputRef.current) inputRef.current.value = ''; };
  const choose = (f: File) => { clear(); if (!f.size || f.size > IMAGE_BYTES) { job.setError('Choose a nonempty image up to 10 MB.'); return; } setFile(f); };
  const example = () => {
    clear(); void job.run(async signal => {
      let f: File;
      if (expected === 'gif' || expected === 'heic') {
        const response = await fetch(`/samples/media-conversion/example.${expected}`, { signal });
        if (!response.ok) throw new Error('Example could not be loaded.');
        f = new File([await response.blob()], `example.${expected}`, { type: `image/${expected}` });
      } else if (expected === 'svg') {
        f = new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path fill="red" d="M0 0h8v12H0z"/></svg>'], 'example.svg', { type: 'image/svg+xml' });
      } else {
        const canvas = document.createElement('canvas'); canvas.width = 16; canvas.height = 12;
        const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#ff0000'; ctx.fillRect(0, 0, 8, 12);
        const kind = expected || 'png'; const blob = await encodeCanvas(canvas, `image/${kind}`, 0.9, signal);
        f = new File([blob], `example.${kind === 'jpeg' ? 'jpg' : kind}`, { type: blob.type });
      }
      signal.throwIfAborted(); setFile(f); return null;
    });
  };
  const convert = () => job.run(async signal => {
    if (!file) throw new Error('Choose an image first.');
    const bytes = new Uint8Array(await file.arrayBuffer()); signal.throwIfAborted();
    const kind = imageKind(bytes); if (expected && kind !== expected) throw new Error(`This route requires ${expected.toUpperCase()} image bytes.`);
    preflightImage(bytes, kind);
    let decoded: Blob = file;
    let gif: Awaited<ReturnType<typeof gifFrames>> | undefined;
    if (kind === 'gif') { gif = await gifFrames(bytes.buffer as ArrayBuffer); signal.throwIfAborted(); }
    if (target === 'apng') {
      if (!gif) throw new Error('Choose a GIF file.');
      // upng-js has no declarations. Keep its untyped surface local to this group.
      // @ts-expect-error untyped dependency
      const UPNG = (await import('upng-js')).default as { encode: (frames: ArrayBuffer[], w: number, h: number, colors: number, delays: number[]) => ArrayBuffer };
      const buffer = UPNG.encode(gif.frames, gif.width, gif.height, 0, gif.delays);
      signal.throwIfAborted(); const blob = new Blob([buffer], { type: 'image/png' });
      if (imageKind(new Uint8Array(buffer)) !== 'png') throw new Error('Invalid APNG encoder output.');
      return { blob, name: `${file.name.replace(/\.[^.]+$/, '')}.png`, detail: `${gif.width} × ${gif.height} · ${gif.frames.length} frame(s) · input ${file.size} bytes`, preview: 'image' };
    }
    if (kind === 'heic') {
      const heic2any = (await import('heic2any')).default;
      const value = await heic2any({ blob: file, toType: 'image/png' }); signal.throwIfAborted();
      decoded = Array.isArray(value) ? value[0] : value;
    }
    if (kind === 'svg') decoded = await sanitizeSvg(bytes);
    const canvas = document.createElement('canvas');
    if (gif) {
      if (!Number.isInteger(frame) || frame < 1 || frame > gif.frames.length) throw new Error(`Frame must be between 1 and ${gif.frames.length}.`);
      canvas.width = gif.width; canvas.height = gif.height;
      canvas.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(gif.frames[frame - 1]), gif.width, gif.height), 0, 0);
    } else {
      const img = await checkedImage(decoded, signal);
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; canvas.getContext('2d')!.drawImage(img, 0, 0);
    }
    signal.throwIfAborted();
    if (target === 'trace') {
      dimensions(canvas.width, canvas.height, 1_000_000);
      // @ts-expect-error untyped dependency
      const tracer = (await import('imagetracerjs')).default as { imagedataToSVG: (data: ImageData, preset: string) => string };
      signal.throwIfAborted();
      const svg = tracer.imagedataToSVG(canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height), preset);
      if (!svg.includes('<path')) throw new Error('No vector paths were produced.');
      return { blob: new Blob([svg], { type: 'image/svg+xml' }), name: `${file.name.replace(/\.[^.]+$/, '')}.svg`, detail: `${canvas.width} × ${canvas.height} · vector paths`, preview: 'image' };
    }
    if (target === 'jpeg') {
      const ctx = canvas.getContext('2d')!; ctx.globalCompositeOperation = 'destination-over'; ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const blob = await encodeCanvas(canvas, `image/${target}`, quality / 100, signal); signal.throwIfAborted();
    const verification = await checkedImage(blob, signal);
    if (verification.naturalWidth !== canvas.width || verification.naturalHeight !== canvas.height) throw new Error('Output dimensions changed unexpectedly.');
    return { blob, name: `${file.name.replace(/\.[^.]+$/, '')}.${target === 'jpeg' ? 'jpg' : target}`, detail: `${canvas.width} × ${canvas.height} · input ${file.size} bytes · ${blob.size > file.size ? 'larger' : blob.size < file.size ? 'smaller' : 'same size'} output`, preview: 'image' };
  });
  return <div className="tb-v2-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, minWidth: 0, overflowWrap: 'anywhere' }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">Image to {target.toUpperCase()}</span><ToolExampleClearActions exampleDisabled={!job.ready} onExample={example} onClear={clear} /></div>
    <p>Maximum 10 MB and 16 megapixels. {expected ? `${expected.toUpperCase()} input required.` : 'PNG, JPEG, WebP, GIF, HEIC and self-contained static SVG inputs.'} {target === 'jpeg' ? 'Transparency is flattened onto the chosen background.' : 'Transparency is preserved where the source supports it.'} {expected === 'heic' ? 'Uses the bundled HEIC decoder; unsupported HEIF variants fail explicitly. Only the first image is exported.' : ''} {target === 'trace' ? 'Tracing is limited to 1 megapixel.' : ''}</p>
    {expected === 'gif' && <p>{target === 'apng' ? 'Animation is composited with disposal rules. Maximum 200 frames and 16 million total frame pixels. A one-frame GIF exports a static PNG.' : 'Exports one composited GIF frame as a static image.'}</p>}
    <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) choose(e.dataTransfer.files[0]); }}>
      <input ref={inputRef} type="file" aria-label="Image file" accept={expected ? expected === 'heic' ? '.heic,.heif' : `image/${expected}` : 'image/*'} style={{ maxWidth: '100%' }} onChange={e => { if (e.target.files?.[0]) choose(e.target.files[0]); }} />
    </div>
    {file && <p>{file.name} · {file.size} bytes</p>}
    {(target === 'jpeg' || target === 'webp') && <label>Quality {quality}%<input aria-label="Quality" type="range" min={1} max={100} value={quality} onChange={e => { job.cancel(); setQuality(Number(e.target.value)); }} /></label>}
    {target === 'jpeg' && <label>Background<input aria-label="Background" type="color" value={background} onChange={e => { job.cancel(); setBackground(e.target.value); }} /></label>}
    {expected === 'gif' && target !== 'apng' && <label>Frame number<input className="tb-v2-input" aria-label="Frame number" type="number" min={1} value={frame} onChange={e => { job.cancel(); setFrame(Number(e.target.value)); }} /></label>}
    {target === 'trace' && <label>Trace preset<select className="tb-v2-select" aria-label="Trace preset" value={preset} onChange={e => { job.cancel(); setPreset(e.target.value); }}><option value="default">Default</option><option value="posterized2">Posterized</option><option value="detailed">Detailed</option></select></label>}
    <button className="tb-v2-btn tb-v2-btn-primary" onClick={convert} disabled={!file || job.busy}>{job.busy ? 'Converting…' : 'Convert'}</button>
    {job.busy && <button className="tb-v2-btn" onClick={job.cancel}>Cancel</button>}
    {job.error && <p role="alert">{job.error}</p>}
    {job.result && <Result result={job.result} />}
  </div>;
}
