'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { applyImageEffect, encodeEffectPreview, validateEffectDimensions, type ImageEffectKind } from '@/lib/image-effects';
import {
  ACCEPTED_IMAGE_GEOMETRY_TYPES, MAX_IMAGE_GEOMETRY_BYTES, detectGeometryMimeType,
  formatGeometryBytesExact, getGeometryDownloadName, getGeometryMimeLabel,
  validateGeometryFile,
} from '@/lib/image-geometry';
import { getImageTransformOutputFormat } from '@/lib/image-transform';
import styles from './ImageEffectsTool.module.css';

type Source = { file: File; url: string; previewUrl: string; pixels: ImageData; mimeType: string; width: number; height: number };
type Result = { url: string; blob: Blob; fileName: string; label: string };
const COPY = {
  grayscale: { title: 'Grayscale', label: '', initial: 0, min: 0, max: 0, step: 1, unit: '', hint: 'Convert the whole image to grayscale with weighted RGB luma.' },
  pixelate: { title: 'Pixelated', label: 'Block size', initial: 12, min: 1, max: 64, step: 1, unit: ' px', hint: 'Averages square blocks across the whole image. This isn’t a region editor.' },
  sharpen: { title: 'Sharpened', label: 'Sharpen amount', initial: 1, min: 0, max: 3, step: 0.1, unit: '×', hint: 'Boost edge contrast. Start low to avoid harsh edges and amplified noise.' },
  unblur: { title: 'Unblur', label: 'Unblur strength', initial: 50, min: 0, max: 100, step: 1, unit: '%', hint: 'A gentle unsharp mask improves mildly soft edges. It can’t recover lost detail or severe motion blur.' },
} satisfies Record<ImageEffectKind, { title: string; label: string; initial: number; min: number; max: number; step: number; unit: string; hint: string }>;

export default function ImageEffectsTool({ kind }: { kind: ImageEffectKind }) {
  const copy = COPY[kind];
  const sliderId = useId();
  const [source, setSource] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [value, setValue] = useState<number>(copy.initial);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [exportFailed, setExportFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const loadGeneration = useRef(0);
  const renderGeneration = useRef(0);
  const sourceUrl = useRef('');
  const resultUrl = useRef('');
  const exampleFetch = useRef<AbortController | null>(null);
  const cancelDecode = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    loadGeneration.current++;
    renderGeneration.current++;
    exampleFetch.current?.abort();
    cancelDecode.current?.();
    if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
  }, []);

  function discardResult() {
    renderGeneration.current++;
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = '';
    setResult(null);
    setExportFailed(false);
  }

  function clear() {
    loadGeneration.current++;
    exampleFetch.current?.abort();
    exampleFetch.current = null;
    cancelDecode.current?.();
    cancelDecode.current = null;
    discardResult();
    if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
    sourceUrl.current = '';
    setSource(null);
    setValue(copy.initial);
    setLoading(false);
    setProcessing(false);
    setError('');
    setDragging(false);
    if (input.current) input.current.value = '';
  }

  function beginLoad() {
    clear();
    setLoading(true);
    return loadGeneration.current;
  }

  async function decodeFile(file: File, generation: number) {
    const cancelled = () => generation !== loadGeneration.current;
    let bitmap: ImageBitmap | null = null;
    let canvas: HTMLCanvasElement | null = null;
    try {
      // Check bytes before any file read or decode.
      if (file.size > MAX_IMAGE_GEOMETRY_BYTES) throw new Error('Choose an image up to 20 MiB.');
      const mimeType = await detectGeometryMimeType(file);
      if (cancelled()) return;
      const fileError = validateGeometryFile(file, mimeType);
      if (fileError) throw new Error(fileError);
      const url = URL.createObjectURL(file);
      sourceUrl.current = url;
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        const cleanup = () => { image.onload = null; image.onerror = null; cancelDecode.current = null; };
        cancelDecode.current = () => { cleanup(); image.src = ''; reject(new Error('Cancelled')); };
        image.onload = () => { cleanup(); resolve(image); };
        image.onerror = () => { cleanup(); reject(new Error('This image could not be decoded. Try another file.')); };
        image.src = url;
      });
      if (cancelled()) return;
      const { naturalWidth: width, naturalHeight: height } = img;
      const validation = validateEffectDimensions(width, height);
      if (!validation.valid) throw new Error(validation.error);
      // A bitmap decoded from a GIF blob is its first frame, independent of animation time.
      if (mimeType === 'image/gif') {
        bitmap = await createImageBitmap(file);
        if (cancelled()) return;
      }
      canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('This browser could not open an image canvas.');
      ctx.drawImage(bitmap ?? img, 0, 0, width, height);
      const pixels = ctx.getImageData(0, 0, width, height);
      let previewUrl = url;
      if (bitmap) {
        // Freeze the original preview too; cap this display-only thumbnail's allocation.
        const thumb = document.createElement('canvas');
        const scale = Math.min(1, 1000 / Math.max(width, height));
        thumb.width = Math.max(1, Math.round(width * scale));
        thumb.height = Math.max(1, Math.round(height * scale));
        const thumbCtx = thumb.getContext('2d');
        if (!thumbCtx) throw new Error('This browser could not prepare the first GIF frame.');
        thumbCtx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
        previewUrl = thumb.toDataURL('image/png');
        thumb.width = 0; thumb.height = 0;
      }
      if (cancelled()) return;
      setSource({ file, url, previewUrl, pixels, mimeType, width, height });
      setLoading(false);
      setProcessing(true);
    } catch (err) {
      if (cancelled()) return;
      if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
      sourceUrl.current = '';
      setLoading(false);
      setProcessing(false);
      setError(err instanceof Error ? err.message : 'This file could not be read. Try another image.');
    } finally {
      bitmap?.close();
      if (canvas) { canvas.width = 0; canvas.height = 0; }
    }
  }

  function loadFile(file: File) {
    const generation = beginLoad();
    void decodeFile(file, generation);
  }

  async function loadExample() {
    const generation = beginLoad();
    const controller = new AbortController();
    exampleFetch.current = controller;
    try {
      const response = await fetch('/samples/image-resizer-mountain.jpg', { signal: controller.signal });
      if (!response.ok) throw new Error('Example unavailable');
      const blob = await response.blob();
      if (generation !== loadGeneration.current) return;
      await decodeFile(new File([blob], `${kind}-example.jpg`, { type: 'image/jpeg' }), generation);
    } catch {
      if (generation !== loadGeneration.current) return;
      setLoading(false);
      setError('The example couldn’t be loaded. Try again or upload an image.');
    } finally {
      if (exampleFetch.current === controller) exampleFetch.current = null;
    }
  }

  useEffect(() => {
    if (!source) return;
    const generation = ++renderGeneration.current;
    const sourceGeneration = loadGeneration.current;
    let disposed = false;
    const cancelled = () => disposed || generation !== renderGeneration.current || sourceGeneration !== loadGeneration.current;
    const format = getImageTransformOutputFormat(source.mimeType);
    setProcessing(true);
    setExportFailed(false);
    setError('');
    const timer = window.setTimeout(async () => {
      let canvas: HTMLCanvasElement | null = null;
      try {
        const data = await applyImageEffect(source.pixels, { kind, value }, {
          isCancelled: cancelled,
          yieldControl: () => new Promise((resolve) => setTimeout(resolve, 0)),
        });
        if (!data || cancelled()) return;
        canvas = document.createElement('canvas');
        canvas.width = source.width; canvas.height = source.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Couldn’t prepare the preview. Try again.');
        ctx.putImageData(new ImageData(data, source.width, source.height), 0, 0);
        const blob = await encodeEffectPreview(() => new Promise<Blob | null>((resolve, reject) => {
          try { canvas!.toBlob(resolve, format.mimeType, format.quality); } catch (err) { reject(err); }
        }), format.mimeType, cancelled);
        if (!blob || cancelled()) return;
        const url = URL.createObjectURL(blob);
        if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
        resultUrl.current = url;
        setResult({ url, blob, label: format.label, fileName: getGeometryDownloadName(source.file.name, kind, format.mimeType, source) });
        setProcessing(false);
      } catch (err) {
        if (cancelled()) return;
        setProcessing(false);
        setExportFailed(true);
        setError(err instanceof Error ? err.message : 'Couldn’t encode this image. Retry the preview or choose another image.');
      } finally {
        if (canvas) { canvas.width = 0; canvas.height = 0; }
      }
    }, 125);
    // Error and busy states deliberately aren't dependencies: encoding retries are explicit.
    return () => { disposed = true; window.clearTimeout(timer); };
  }, [source, kind, value, retry]);

  function changeValue(next: number) {
    if (next === value) return;
    discardResult();
    setError('');
    setProcessing(Boolean(source));
    setValue(next);
  }

  function download() {
    if (!result || loading || processing || exportFailed) return;
    const link = document.createElement('a');
    link.href = result.url; link.download = result.fileName; link.click();
  }

  const dimensions = source ? `${source.width} × ${source.height} px` : '';
  return (
    <div className={`tb-image-tool ${styles.tool}`}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={Boolean(source || error || loading || processing)} />
      </div>
      <div className={`tb-image-tool-body ${styles.body}`}>
        <input ref={input} type="file" accept={ACCEPTED_IMAGE_GEOMETRY_TYPES} aria-label="Select image" hidden onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) loadFile(file);
        }} />
        <button type="button" className={`tb-v2-dropzone ${styles.upload} ${dragging ? 'dragging' : ''}`}
          onClick={() => input.current?.click()} aria-label={source ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) loadFile(file); }}>
          <Upload size={24} aria-hidden="true" className={styles.uploadIcon} />
          <span className={styles.uploadCopy}>
            <span className={`tb-v2-dropzone-text ${styles.fileName}`}>{source ? source.file.name : loading ? 'Loading image...' : 'Choose an image or drop it here'}</span>
            <span className="tb-v2-dropzone-hint">{source ? `${getGeometryMimeLabel(source.mimeType)} · ${dimensions} · ${formatGeometryBytesExact(source.file.size)}` : 'PNG, JPEG, WebP, GIF or SVG · Up to 20 MiB'}</span>
            <span className="tb-v2-dropzone-hint">{source ? 'Click or drop another image to replace.' : 'Up to 8192 px per side and 16 megapixels.'}</span>
          </span>
        </button>
        <div className={styles.status}>
          {error ? <p role="alert">{error}</p> : <p role="status">{loading ? 'Checking image...' : processing ? 'Updating preview...' : result ? 'Preview ready. Download saves this image.' : 'Choose an image or try Examples to start.'}</p>}
        </div>
        <div className={`tb-v2-card ${styles.settings}`}>
          {copy.label && <>
            <div className={styles.sliderHead}><label htmlFor={sliderId}>{copy.label}</label><output htmlFor={sliderId}>{value}{copy.unit}</output></div>
            <input id={sliderId} type="range" min={copy.min} max={copy.max} step={copy.step} value={value}
              aria-valuetext={`${value}${copy.unit}`} disabled={!source} onChange={(event) => changeValue(Number(event.target.value))} />
          </>}
          <p className="tb-image-hint">{copy.hint}</p>
        </div>
        <div className={styles.previews}>
          <section className={styles.previewCard} aria-label="Original preview">
            <h3>Original</h3>
            <div className={styles.preview}>
              {source ? /* eslint-disable-next-line @next/next/no-img-element */
                <img src={source.previewUrl} alt="Original image preview" /> : <span>Your source image</span>}
            </div>
            <p className={styles.meta}>{source ? `${dimensions} · ${formatGeometryBytesExact(source.file.size)}` : 'Source dimensions and file size'}</p>
          </section>
          <section className={styles.previewCard} aria-label="Result preview" aria-busy={processing}>
            <h3>{copy.title}</h3>
            <div className={styles.preview}>
              {result ? /* eslint-disable-next-line @next/next/no-img-element */
                <img src={result.url} alt={`${copy.title} image preview`} /> : <span>{loading || processing ? 'Preparing preview...' : error ? 'No output available' : 'Your result appears here'}</span>}
            </div>
            <p className={styles.meta}>{result ? `${dimensions} · ${formatGeometryBytesExact(result.blob.size)} · ${result.label}` : 'Output dimensions and file size'}</p>
          </section>
        </div>
        <div className={styles.download}>
          <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary" disabled={!result || loading || processing}>Download current image</button>
          {exportFailed && <button type="button" className="tb-v2-btn tb-v2-btn-sm" onClick={() => {
            discardResult(); setError(''); setProcessing(true); setRetry((current) => current + 1);
          }}>Retry preview</button>}
        </div>
        <p className="tb-image-hint">JPEG inputs export as JPEG at quality 90%. Other formats export as PNG with transparency preserved. File size may increase. Dimensions stay the same.</p>
        <p className="tb-image-hint">GIF uses its first frame. SVG is rasterized. Images are processed in your browser.</p>
      </div>
    </div>
  );
}
