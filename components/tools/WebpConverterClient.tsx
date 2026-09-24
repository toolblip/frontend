'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FileImage, Upload } from 'lucide-react';
import ToolExampleClearActions from './ToolExampleClearActions';

type QualityLevel = 'low' | 'medium' | 'high' | 'maximum';

type ImageFormat = {
  mime: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/svg+xml';
  extension: 'png' | 'jpg' | 'webp' | 'gif' | 'svg';
  label: string;
};

type SelectedImage = {
  file: Blob;
  name: string;
  format: ImageFormat;
  previewUrl: string;
  width: number;
  height: number;
  bytes: number;
};

type ConvertedImage = {
  url: string;
  blob: Blob;
  name: string;
  width: number;
  height: number;
  quality: QualityLevel;
};

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_SIDE = 8192;
const MAX_PIXELS = 32_000_000;
const SAMPLE_URL = '/samples/image-resizer-mountain.jpg';

const QUALITY_OPTIONS: Array<{ key: QualityLevel; label: string; value: number; note: string }> = [
  { key: 'low', label: 'Low', value: 0.3, note: '30% quality' },
  { key: 'medium', label: 'Medium', value: 0.5, note: '50% quality' },
  { key: 'high', label: 'High', value: 0.8, note: '80% quality' },
  { key: 'maximum', label: 'Maximum', value: 1, note: '100% quality' },
];

const ACCEPTED_UPLOAD_MIMES = new Map<string, string>([
  ['image/png', 'PNG'],
  ['image/jpeg', 'JPEG'],
  ['image/webp', 'WebP'],
  ['image/gif', 'GIF'],
  ['image/svg+xml', 'SVG'],
]);

function hasBytes(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function normalizeMime(mime: string) {
  return mime.toLowerCase().split(';')[0].trim();
}

export function detectWebpConverterFormat(bytes: Uint8Array): ImageFormat | null {
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: 'image/png', extension: 'png', label: 'PNG' };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', extension: 'jpg', label: 'JPEG' };
  }
  if (bytes.length >= 6) {
    const header = new TextDecoder().decode(bytes.slice(0, 6));
    if (header === 'GIF87a' || header === 'GIF89a') return { mime: 'image/gif', extension: 'gif', label: 'GIF' };
  }
  if (bytes.length >= 12) {
    const riff = new TextDecoder().decode(bytes.slice(0, 4));
    const webp = new TextDecoder().decode(bytes.slice(8, 12));
    if (riff === 'RIFF' && webp === 'WEBP') return { mime: 'image/webp', extension: 'webp', label: 'WebP' };
  }

  const prefix = new TextDecoder().decode(bytes.slice(0, Math.min(bytes.length, 512))).trimStart().toLowerCase();
  if (prefix.startsWith('<svg') || prefix.includes('<svg')) {
    return { mime: 'image/svg+xml', extension: 'svg', label: 'SVG' };
  }

  return null;
}

export async function validateWebpConverterBlob(blob: Blob):
  Promise<{ ok: true; format: ImageFormat } | { ok: false; error: string }> {
  if (blob.size > MAX_SOURCE_BYTES) return { ok: false, error: 'Images are limited to 20 MiB.' };

  const bytes = new Uint8Array(await blob.slice(0, 512).arrayBuffer());
  const format = detectWebpConverterFormat(bytes);
  if (!format) return { ok: false, error: 'Upload a PNG, JPEG, WebP, GIF, or browser-decodable SVG image.' };

  const declaredMime = normalizeMime(blob.type);
  if (declaredMime && ACCEPTED_UPLOAD_MIMES.has(declaredMime) && declaredMime !== format.mime) {
    return { ok: false, error: `The file is labeled ${ACCEPTED_UPLOAD_MIMES.get(declaredMime)}, but the bytes are ${format.label}.` };
  }
  if (declaredMime && !ACCEPTED_UPLOAD_MIMES.has(declaredMime)) {
    return { ok: false, error: 'Upload a PNG, JPEG, WebP, GIF, or browser-decodable SVG image.' };
  }

  return { ok: true, format };
}

export function createWebpConverterDecodeBlob(blob: Blob, format: ImageFormat) {
  if (normalizeMime(blob.type) === format.mime) return blob;
  return new Blob([blob], { type: format.mime });
}

export function validateWebpConverterDimensions(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { ok: false, error: 'The image dimensions could not be read.' };
  }
  if (width > MAX_SIDE || height > MAX_SIDE) {
    return { ok: false, error: 'Images are limited to 8192 px on either side for browser conversion.' };
  }
  if (width * height > MAX_PIXELS) {
    return { ok: false, error: 'Images are limited to 32 megapixels for browser conversion.' };
  }
  return { ok: true, error: '' };
}

export function validateWebpConverterOutputBlob(blob: Blob | null):
  | { ok: true; blob: Blob }
  | { ok: false; error: string } {
  if (!blob) return { ok: false, error: 'The browser could not encode a WebP image.' };
  if (normalizeMime(blob.type) !== 'image/webp') {
    return { ok: false, error: `The browser returned ${blob.type ? blob.type.replace('image/', '').toUpperCase() : 'another format'} instead of WebP.` };
  }
  return { ok: true, blob };
}

export function getWebpConverterOutputName(sourceName: string) {
  const clean = sourceName.trim() || 'converted';
  const withoutPath = clean.split(/[\\/]/).pop() || 'converted';
  const base = withoutPath.replace(/\.[^.]+$/, '') || 'converted';
  return `${base}.webp`;
}

export function getWebpConverterSizeChange(originalBytes: number, convertedBytes: number) {
  const delta = originalBytes - convertedBytes;
  const percent = originalBytes > 0 ? Math.abs((delta / originalBytes) * 100).toFixed(1) : '0.0';
  const bytes = Math.abs(delta).toLocaleString();
  if (delta > 0) return `${bytes} bytes smaller (${percent}%)`;
  if (delta < 0) return `${bytes} bytes larger (${percent}%)`;
  return 'Same size';
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${bytes.toLocaleString()} bytes (${kb.toFixed(1)} KB)`;
  return `${bytes.toLocaleString()} bytes (${(kb / 1024).toFixed(2)} MB)`;
}

function getQualityValue(quality: QualityLevel) {
  return QUALITY_OPTIONS.find((option) => option.key === quality)?.value ?? 0.8;
}

function loadImage(url: string, isCancelled: () => boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (isCancelled()) return reject(new Error('cancelled'));
      resolve(image);
    };
    image.onerror = () => reject(new Error('The browser could not decode that image.'));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

export default function WebpConverterClient() {
  const [selected, setSelected] = useState<SelectedImage | null>(null);
  const [converted, setConverted] = useState<ConvertedImage | null>(null);
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const opIdRef = useRef(0);
  const urlsRef = useRef<Set<string>>(new Set());

  const rememberUrl = useCallback((url: string) => {
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeUrl = useCallback((url: string | null | undefined) => {
    if (!url) return;
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  }, []);

  const revokeAllUrls = useCallback(() => {
    for (const url of urlsRef.current) URL.revokeObjectURL(url);
    urlsRef.current.clear();
  }, []);

  const cancelOperation = useCallback(() => {
    opIdRef.current += 1;
    setIsConverting(false);
    setIsLoading(false);
  }, []);

  const clearConverted = useCallback(() => {
    setConverted((current) => {
      revokeUrl(current?.url);
      return null;
    });
  }, [revokeUrl]);

  const clearAll = useCallback(() => {
    cancelOperation();
    revokeAllUrls();
    setSelected(null);
    setConverted(null);
    setError('');
    setNotice('');
    setQuality('high');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [cancelOperation, revokeAllUrls]);

  useEffect(() => () => {
    opIdRef.current += 1;
    revokeAllUrls();
  }, [revokeAllUrls]);

  const convertSelectedToWebp = useCallback(async (source: SelectedImage, requestedQuality: QualityLevel) => {
    if (!canvasRef.current || isLoading) return;

    cancelOperation();
    const opId = opIdRef.current;
    clearConverted();
    setError('');
    setIsConverting(true);

    try {
      const image = await loadImage(source.previewUrl, () => opId !== opIdRef.current);
      const dimensions = validateWebpConverterDimensions(image.naturalWidth, image.naturalHeight);
      if (!dimensions.ok) throw new Error(dimensions.error);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas export is not available in this browser.');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const blob = await canvasToBlob(canvas, 'image/webp', getQualityValue(requestedQuality));
      if (opId !== opIdRef.current) return;
      const encoded = validateWebpConverterOutputBlob(blob);
      if (!encoded.ok) throw new Error(encoded.error);
      if (opId !== opIdRef.current) return;

      const url = rememberUrl(URL.createObjectURL(encoded.blob));
      setConverted({
        url,
        blob: encoded.blob,
        name: getWebpConverterOutputName(source.name),
        width: canvas.width,
        height: canvas.height,
        quality: requestedQuality,
      });
    } catch (err) {
      if (opId !== opIdRef.current) return;
      if (err instanceof Error && err.message === 'cancelled') return;
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      if (opId === opIdRef.current) setIsConverting(false);
    }
  }, [cancelOperation, clearConverted, isLoading, rememberUrl]);

  const prepareBlob = useCallback(async (blob: Blob, name: string): Promise<SelectedImage | null> => {
    cancelOperation();
    const opId = opIdRef.current;
    revokeAllUrls();
    setSelected(null);
    setConverted(null);
    setError('');
    setNotice('');
    setIsLoading(true);

    let previewUrl: string | null = null;

    try {
      const validation = await validateWebpConverterBlob(blob);
      if (opId !== opIdRef.current) return null;
      if (!validation.ok) {
        setError(validation.error);
        return null;
      }

      const decodeBlob = createWebpConverterDecodeBlob(blob, validation.format);
      previewUrl = rememberUrl(URL.createObjectURL(decodeBlob));
      const image = await loadImage(previewUrl, () => opId !== opIdRef.current);
      const dimensions = validateWebpConverterDimensions(image.naturalWidth, image.naturalHeight);
      if (!dimensions.ok) throw new Error(dimensions.error);
      if (opId !== opIdRef.current) return null;

      const nextSelected: SelectedImage = {
        file: blob,
        name,
        format: validation.format,
        previewUrl,
        width: image.naturalWidth,
        height: image.naturalHeight,
        bytes: blob.size,
      };

      setSelected(nextSelected);
      setNotice(validation.format.mime === 'image/gif'
        ? 'Animated GIFs convert as a still image from the first decoded frame.'
        : validation.format.mime === 'image/svg+xml'
          ? 'SVG files are rasterized to the preview dimensions before WebP export.'
          : '');
      return nextSelected;
    } catch (err) {
      if (opId !== opIdRef.current) return null;
      if (err instanceof Error && err.message === 'cancelled') return null;
      revokeUrl(previewUrl);
      previewUrl = null;
      setError(err instanceof Error ? err.message : 'The browser could not decode that image.');
      return null;
    } finally {
      if (opId === opIdRef.current) setIsLoading(false);
    }
  }, [cancelOperation, rememberUrl, revokeAllUrls, revokeUrl]);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';
    prepareBlob(file, file.name);
  }, [prepareBlob]);

  const loadExample = useCallback(async () => {
    clearAll();
    const opId = opIdRef.current;
    setQuality('high');
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(SAMPLE_URL);
      if (opId !== opIdRef.current) return;
      if (!response.ok) throw new Error('Could not load the sample image.');
      const blob = await response.blob();
      if (opId !== opIdRef.current) return;
      const source = await prepareBlob(blob, 'mountain.jpg');
      if (source) await convertSelectedToWebp(source, 'high');
    } catch (err) {
      if (opId !== opIdRef.current) return;
      setError(err instanceof Error ? err.message : 'Could not load the sample image.');
    } finally {
      if (opId === opIdRef.current) setIsLoading(false);
    }
  }, [clearAll, convertSelectedToWebp, prepareBlob]);

  const convertToWebp = useCallback(async () => {
    if (!selected) return;
    await convertSelectedToWebp(selected, quality);
  }, [convertSelectedToWebp, quality, selected]);

  const handleDownload = useCallback(() => {
    if (!converted) return;
    const link = document.createElement('a');
    link.download = converted.name;
    link.href = converted.url;
    link.click();
  }, [converted]);

  const qualityNote = QUALITY_OPTIONS.find((option) => option.key === quality)?.note ?? '80% quality';
  const hasAnyState = Boolean(selected) || Boolean(converted) || Boolean(error) || Boolean(notice) || isConverting || isLoading;

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clearAll} canClear={hasAnyState} exampleCount={1} exampleDisabled={isLoading || isConverting} />
      </div>
      <div className="tb-image-tool-body">
        <input
          id="webp-file-input"
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          hidden
          aria-label="Select image to convert to WebP"
        />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${selected ? 'tb-image-upload-compact' : ''} ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files?.[0] ?? null);
          }}
          aria-label={selected ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={isConverting}
        >
          {selected ? <FileImage size={22} aria-hidden="true" /> : <Upload size={28} aria-hidden="true" />}
          <span className="tb-image-upload-copy">
            <span className="tb-v2-dropzone-text">{isLoading ? 'Loading image...' : selected ? selected.name : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">{isLoading ? 'You can clear this while it loads.' : selected ? `${formatBytes(selected.bytes)} · Click or drop to replace` : 'PNG, JPEG, WebP, GIF, or SVG. Max 20 MiB.'}</span>
          </span>
        </button>

        {isLoading && <div className="tb-v2-banner" role="status">Checking bytes and decoding the image...</div>}
        {isConverting && <div className="tb-v2-banner" role="status">Encoding WebP in your browser...</div>}
        {error && <div className="tb-v2-error" role="alert">{error}</div>}
        {notice && <div className="tb-v2-banner tb-v2-banner-warn">{notice}</div>}

        {selected && (
          <>
            <div className="tb-v2-card tb-image-settings">
              <div className="tb-image-field">
                <span className="tb-v2-tool-label">Quality</span>
                <div className="tb-v2-mode-tabs" role="group" aria-label="WebP quality">
                  {QUALITY_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        if (quality !== option.key) {
                          cancelOperation();
                          clearConverted();
                          setError('');
                          setQuality(option.key);
                        }
                      }}
                      className={`tb-v2-mode-tab ${quality === option.key ? 'on' : ''}`}
                      aria-pressed={quality === option.key}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="tb-image-hint">{qualityNote}. A higher setting can produce a larger file.</p>
              </div>
              <div className="tb-image-actions">
                <button type="button" onClick={convertToWebp} disabled={isLoading || isConverting} className="tb-v2-btn tb-v2-btn-primary">
                  {isConverting ? 'Converting...' : 'Convert to WebP'}
                </button>
              </div>
            </div>

            <div className="tb-image-workspace">
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className="tb-image-card-head">
                  <span className="tb-v2-tool-label">Source</span>
                  <span className="tb-image-hint">{selected.format.label} · {selected.width} × {selected.height} px</span>
                </figcaption>
                <div className="tb-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.previewUrl} alt="Selected source" />
                </div>
                <p className="tb-image-hint">{selected.name} · {formatBytes(selected.bytes)}</p>
              </figure>

              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className="tb-image-card-head">
                  <span className="tb-v2-tool-label">WebP preview</span>
                  {converted && <span className="tb-image-hint">{formatBytes(converted.blob.size)} · WebP</span>}
                </figcaption>
                <div className="tb-image-preview" aria-busy={isConverting}>
                  {converted ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={converted.url} alt="Converted WebP result" />
                  ) : (
                    <p className="tb-image-hint">{isConverting ? 'Converting...' : 'Convert to preview the real WebP output and exact file size.'}</p>
                  )}
                </div>
                <p className="tb-image-hint">
                  {converted
                    ? `${converted.name} · ${converted.width} × ${converted.height} px · ${getWebpConverterSizeChange(selected.bytes, converted.blob.size)}`
                    : 'Your WebP image will appear here.'}
                </p>
              </figure>
            </div>

            {converted && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div>
                  <strong>WebP output ready</strong>
                  <p className="tb-image-hint">{formatBytes(selected.bytes)} source → {formatBytes(converted.blob.size)} WebP</p>
                  <p className="tb-image-hint">Encoding quality: {Math.round(getQualityValue(converted.quality) * 100)}%</p>
                </div>
                <button type="button" onClick={handleDownload} className="tb-v2-btn tb-v2-btn-primary">
                  Download WebP
                </button>
              </div>
            )}
          </>
        )}

        {!selected && !isLoading && !error && (
          <p className="tb-v2-empty">
            Choose an image to encode a real WebP file in your browser. The tool verifies the source bytes, checks the decoded dimensions, and never falls back to the original format.
          </p>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
