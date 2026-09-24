'use client';

import { Copy, Download, FileImage, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const SAMPLE_IMAGE_PATH = '/samples/tool-sample.png';

type Mode = 'encode' | 'decode';

export type ImageFormat = {
  mime: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' | 'image/svg+xml';
  extension: 'png' | 'jpg' | 'gif' | 'webp' | 'svg';
  label: 'PNG' | 'JPEG' | 'GIF' | 'WebP' | 'SVG';
};

type DecodeOk = {
  ok: true;
  bytes: Uint8Array;
  mime: ImageFormat['mime'];
  extension: ImageFormat['extension'];
  dataUrl: string;
};

type DecodeResult = DecodeOk | { ok: false; error: string };
type FileValidation = { ok: true; format: ImageFormat } | { ok: false; error: string };

type ToolResult = DecodeOk & {
  dimensions: { width: number; height: number };
  fileName: string;
  source: 'Encoded image' | 'Decoded image';
};

const FORMATS: ImageFormat[] = [
  { mime: 'image/png', extension: 'png', label: 'PNG' },
  { mime: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
  { mime: 'image/gif', extension: 'gif', label: 'GIF' },
  { mime: 'image/webp', extension: 'webp', label: 'WebP' },
  { mime: 'image/svg+xml', extension: 'svg', label: 'SVG' },
];

const formatByMime = (mime: string) => FORMATS.find((format) => format.mime === mime.toLowerCase());
const stripWhitespace = (value: string) => value.replace(/\s+/g, '');

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  return `${bytes.toLocaleString()} bytes (${(bytes / 1024).toFixed(1)} KB)`;
};

const labelForMime = (mime: string) => formatByMime(mime)?.label ?? mime;

export function detectImageFormat(bytes: Uint8Array): ImageFormat | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) return FORMATS[0];

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return FORMATS[1];

  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) return FORMATS[2];

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) return FORMATS[3];

  const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 512)));
  const normalized = head.replace(/^\uFEFF/, '').trimStart().toLowerCase();
  if (normalized.startsWith('<svg') || (normalized.startsWith('<?xml') && normalized.includes('<svg'))) return FORMATS[4];

  return null;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }
  return btoa(binary);
}

export function bytesToBase64ImageDataUrl(bytes: Uint8Array, mime: ImageFormat['mime']): string {
  return `data:${mime};base64,${bytesToBase64(bytes)}`;
}

function base64ToBytes(base64: string): Uint8Array | null {
  const clean = stripWhitespace(base64);
  if (!clean || clean.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) return null;
  const padded = clean.padEnd(Math.ceil(clean.length / 4) * 4, '=');
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function parseBase64ImageInput(value: string): { base64: string; declaredMime: string | null } | { error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: 'Paste a Base64 image string first.' };

  const dataUrl = trimmed.match(/^data:([^,]*),(.*)$/is);
  if (!dataUrl) return { base64: trimmed, declaredMime: null };

  const meta = dataUrl[1].split(';').map((part) => part.trim()).filter(Boolean);
  const mime = meta.shift()?.toLowerCase() ?? '';
  if (!mime.startsWith('image/')) return { error: 'Data URL MIME must be an image type.' };
  if (!meta.some((part) => part.toLowerCase() === 'base64')) return { error: 'Data URL must use Base64 image data.' };
  if (!formatByMime(mime)) return { error: 'Only PNG, JPEG, GIF, WebP, and SVG image data URLs are supported.' };

  return { base64: dataUrl[2], declaredMime: mime };
}

export function decodeBase64ImageInput(value: string): DecodeResult {
  const parsed = parseBase64ImageInput(value);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const clean = stripWhitespace(parsed.base64);
  const trailingPadding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const approxBytes = Math.floor((clean.length * 3) / 4) - trailingPadding;
  if (approxBytes > MAX_IMAGE_BYTES) return { ok: false, error: 'Images are limited to 10 MiB before Base64 encoding.' };

  const bytes = base64ToBytes(clean);
  if (!bytes) return { ok: false, error: 'Invalid Base64 image data.' };
  if (bytes.length > MAX_IMAGE_BYTES) return { ok: false, error: 'Images are limited to 10 MiB.' };

  const format = detectImageFormat(bytes);
  if (!format) return { ok: false, error: 'Decoded bytes are not a supported image.' };
  if (parsed.declaredMime && parsed.declaredMime !== format.mime) {
    return {
      ok: false,
      error: `The data URL says ${labelForMime(parsed.declaredMime)}, but the bytes are ${format.label}.`,
    };
  }

  return {
    ok: true,
    bytes,
    mime: format.mime,
    extension: format.extension,
    dataUrl: bytesToBase64ImageDataUrl(bytes, format.mime),
  };
}

export function normalizeBase64ImageDataUrl(value: string): string {
  const decoded = decodeBase64ImageInput(value);
  return decoded.ok ? decoded.dataUrl : '';
}

export function validateImageFileBytes(bytes: Uint8Array, declaredMime: string): FileValidation {
  if (bytes.length > MAX_IMAGE_BYTES) return { ok: false, error: 'Images are limited to 10 MiB.' };

  const format = detectImageFormat(bytes);
  if (!format) return { ok: false, error: 'Upload a PNG, JPEG, GIF, WebP, or browser-decodable SVG image.' };

  const mime = declaredMime.toLowerCase();
  if (mime && !mime.startsWith('image/')) return { ok: false, error: 'Upload a PNG, JPEG, GIF, WebP, or browser-decodable SVG image.' };
  if (mime && formatByMime(mime) && mime !== format.mime) {
    return { ok: false, error: `The uploaded file is labeled ${labelForMime(mime)}, but the bytes are ${format.label}.` };
  }

  return { ok: true, format };
}

function loadImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      } else {
        reject(new Error('zero-size image'));
      }
    };
    image.onerror = () => reject(new Error('broken image'));
    image.src = src;
  });
}

const fileStem = (name: string) => name.replace(/\.[^.]*$/, '') || 'image';

export default function Base64ImageConverterClient() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const decodeFileRef = useRef<HTMLInputElement>(null);
  const opRef = useRef(0);
  const copyOpRef = useRef(0);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const downloadUrlRef = useRef('');

  const clearCopyTimer = useCallback(() => {
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }
  }, []);

  const replaceDownloadUrl = useCallback((url: string) => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = url;
    setDownloadUrl(url);
  }, []);

  const clearResult = useCallback(() => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = '';
    setDownloadUrl('');
    setResult(null);
  }, []);

  const cancelPending = useCallback(() => {
    opRef.current += 1;
    copyOpRef.current += 1;
    if (decodeTimerRef.current) {
      clearTimeout(decodeTimerRef.current);
      decodeTimerRef.current = null;
    }
    clearCopyTimer();
    setCopied(false);
    setLoading(false);
  }, [clearCopyTimer]);

  const clearAll = useCallback(() => {
    cancelPending();
    setInput('');
    setError('');
    setFileName('');
    setIsDragging(false);
    clearResult();
    if (fileRef.current) fileRef.current.value = '';
    if (decodeFileRef.current) decodeFileRef.current.value = '';
  }, [cancelPending, clearResult]);

  useEffect(() => () => {
    opRef.current += 1;
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
  }, []);

  const finishResult = useCallback((next: ToolResult) => {
    clearResult();
    replaceDownloadUrl(URL.createObjectURL(new Blob([next.bytes], { type: next.mime })));
    setResult(next);
    setError('');
  }, [clearResult, replaceDownloadUrl]);

  const showDecodeResult = useCallback(async (value: string, source: 'Decoded image', opId: number) => {
    const decoded = decodeBase64ImageInput(value);
    if (opId !== opRef.current) return;
    if (!decoded.ok) {
      clearResult();
      setError(decoded.error);
      setLoading(false);
      return;
    }

    try {
      const dimensions = await loadImageDimensions(decoded.dataUrl);
      if (opId !== opRef.current) return;
      finishResult({
        ...decoded,
        dimensions,
        fileName: `decoded-image.${decoded.extension}`,
        source,
      });
    } catch {
      if (opId !== opRef.current) return;
      clearResult();
      setError('Decoded bytes look like an image file, but the browser could not render it.');
    } finally {
      if (opId === opRef.current) setLoading(false);
    }
  }, [clearResult, finishResult]);

  const decodeNow = useCallback((value: string) => {
    cancelPending();
    const opId = opRef.current;
    clearResult();
    setError('');
    if (!value.trim()) return;
    setLoading(true);
    void showDecodeResult(value, 'Decoded image', opId);
  }, [cancelPending, clearResult, showDecodeResult]);

  const scheduleDecode = useCallback((value: string) => {
    cancelPending();
    clearResult();
    setError('');
    if (!value.trim()) return;
    const opId = opRef.current;
    setLoading(true);
    decodeTimerRef.current = setTimeout(() => {
      decodeTimerRef.current = null;
      void showDecodeResult(value, 'Decoded image', opId);
    }, 250);
  }, [cancelPending, clearResult, showDecodeResult]);

  const encodeBytes = useCallback(async (bytes: Uint8Array, declaredMime: string, name: string, opId: number) => {
    const validation = validateImageFileBytes(bytes, declaredMime);
    if (opId !== opRef.current) return;
    if (!validation.ok) {
      clearResult();
      setError(validation.error);
      setLoading(false);
      return;
    }

    const dataUrl = bytesToBase64ImageDataUrl(bytes, validation.format.mime);
    try {
      const dimensions = await loadImageDimensions(dataUrl);
      if (opId !== opRef.current) return;
      finishResult({
        ok: true,
        bytes,
        mime: validation.format.mime,
        extension: validation.format.extension,
        dataUrl,
        dimensions,
        fileName: `${fileStem(name)}.${validation.format.extension}`,
        source: 'Encoded image',
      });
      setInput(dataUrl);
    } catch {
      if (opId !== opRef.current) return;
      clearResult();
      setError('The uploaded bytes match an image format, but the browser could not decode the image.');
    } finally {
      if (opId === opRef.current) setLoading(false);
    }
  }, [clearResult, finishResult]);

  const loadFileForEncode = useCallback((file: File) => {
    cancelPending();
    clearResult();
    setInput('');
    setError('');
    setFileName(file.name);
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Images are limited to 10 MiB.');
      return;
    }

    const opId = opRef.current;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (opId !== opRef.current) return;
      void encodeBytes(new Uint8Array(reader.result as ArrayBuffer), file.type, file.name, opId);
    };
    reader.onerror = () => {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Could not read that image file.');
    };
    reader.onabort = () => {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Image file reading was cancelled.');
    };
    try {
      reader.readAsArrayBuffer(file);
    } catch {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Could not start reading that image file.');
    }
  }, [cancelPending, clearResult, encodeBytes]);

  const loadDecodeTextFile = useCallback((file: File) => {
    cancelPending();
    clearResult();
    setError('');
    setFileName('');
    setInput('');
    if (file.size > Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 256) {
      setError('Base64 files are limited to about 13.4 MiB of text.');
      return;
    }

    const opId = opRef.current;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (opId !== opRef.current) return;
      const text = String(reader.result ?? '');
      setInput(text);
      void showDecodeResult(text, 'Decoded image', opId);
    };
    reader.onerror = () => {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Could not read that Base64 file.');
    };
    reader.onabort = () => {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Base64 file reading was cancelled.');
    };
    try {
      reader.readAsText(file);
    } catch {
      if (opId !== opRef.current) return;
      setLoading(false);
      setError('Could not start reading that Base64 file.');
    }
  }, [cancelPending, clearResult, showDecodeResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = '';
    if (!file) return;
    if (mode === 'encode') loadFileForEncode(file);
    else loadDecodeTextFile(file);
  };

  const loadExample = async () => {
    cancelPending();
    clearResult();
    setInput('');
    setError('');
    const currentMode = mode;
    const opId = opRef.current;
    setLoading(true);
    try {
      const response = await fetch(SAMPLE_IMAGE_PATH);
      if (opId !== opRef.current) return;
      if (!response.ok) throw new Error('sample failed');
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (opId !== opRef.current) return;
      if (currentMode === 'encode') {
        setFileName('tool-sample.png');
        const sampleMime = response.headers.get('content-type')?.split(';')[0].trim() || 'image/png';
        void encodeBytes(bytes, sampleMime, 'tool-sample.png', opId);
      } else {
        setFileName('');
        const dataUrl = bytesToBase64ImageDataUrl(bytes, 'image/png');
        setInput(dataUrl);
        void showDecodeResult(dataUrl, 'Decoded image', opId);
      }
    } catch {
      if (opId !== opRef.current) return;
      clearResult();
      setLoading(false);
      setError('Could not load the sample image. Try uploading or pasting your own image.');
    }
  };

  const copy = async () => {
    if (!result) return;
    clearCopyTimer();
    const opId = opRef.current;
    const copyOpId = copyOpRef.current;
    try {
      await navigator.clipboard.writeText(result.dataUrl);
      if (opId !== opRef.current || copyOpId !== copyOpRef.current) return;
      setError('');
      setCopied(true);
      copyTimerRef.current = setTimeout(() => {
        if (opId === opRef.current && copyOpId === copyOpRef.current) setCopied(false);
      }, 1500);
    } catch {
      if (opId !== opRef.current || copyOpId !== copyOpRef.current) return;
      setCopied(false);
      setError('Could not copy to the clipboard. Select the output text and copy it manually.');
    }
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    clearAll();
  };

  const canClear = Boolean(input || result || error || loading || fileName || copied);
  const base64Length = result ? result.dataUrl.split(',')[1].length : 0;

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Image' : 'Base64 image'}</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clearAll} canClear={canClear} exampleDisabled={loading} />
      </div>

      <div className="tb-image-tool-body">
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Base64 image converter mode">
          {(['encode', 'decode'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              className={`tb-v2-mode-tab ${mode === tab ? 'on' : ''}`}
              onClick={() => changeMode(tab)}
            >
              {tab === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>

        {mode === 'encode' ? (
          <div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/*" onChange={handleFileChange} hidden aria-label="Select image to encode" />
          <button
            type="button"
            className={`tb-v2-dropzone tb-image-upload ${fileName ? 'tb-image-upload-compact' : ''} ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) loadFileForEncode(dropped);
            }}
            aria-label={fileName ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          >
            {fileName ? <FileImage size={22} aria-hidden="true" /> : <Upload size={28} aria-hidden="true" />}
            <span className="tb-image-upload-copy">
              <span className="tb-v2-dropzone-text">{loading ? 'Loading image...' : fileName || 'Click to upload or drag an image here'}</span>
              <span className="tb-v2-dropzone-hint">PNG, JPEG, GIF, WebP, and browser-decodable SVG. 10 MiB max.</span>
            </span>
          </button>
          </div>
        ) : (
          <div>
          <label className="tb-v2-tool-label" htmlFor="base64-image-input">Base64 image input</label>
          <textarea
            id="base64-image-input"
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setFileName('');
              setInput(value);
              scheduleDecode(value);
            }}
            placeholder="Paste a data:image/...;base64,... URL or raw Base64 image bytes"
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 140 }}
            rows={6}
            aria-invalid={Boolean(error)}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => decodeNow(input)} disabled={!input.trim() || loading} className="tb-v2-btn tb-v2-btn-primary">
              {loading ? 'Decoding...' : 'Decode Base64'}
            </button>
            <input ref={decodeFileRef} type="file" accept=".txt,.b64,text/plain" onChange={handleFileChange} hidden aria-label="Load Base64 text file" />
            <button type="button" onClick={() => decodeFileRef.current?.click()} disabled={loading} className="tb-v2-btn tb-v2-btn-ghost">
              Load Base64 file
            </button>
          </div>
          </div>
        )}

        {loading && <div className="tb-v2-banner" role="status">Checking bytes and verifying the image preview...</div>}
        {error && <div className="tb-v2-error" role="alert">{error}</div>}

        {result ? (
          <div className="tb-image-workspace">
          <figure className="tb-v2-card tb-image-preview-card">
            <figcaption className="tb-image-card-head">
              <span className="tb-v2-tool-label">Preview</span>
              <span className="tb-image-hint">{result.dimensions.width} x {result.dimensions.height} px</span>
            </figcaption>
            <div className="tb-image-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.dataUrl} alt={`${result.source} preview`} />
            </div>
            {downloadUrl && (
              <a href={downloadUrl} download={result.fileName} className="tb-v2-btn tb-v2-btn-primary">
                <Download size={16} aria-hidden="true" />
                Download image
              </a>
            )}
          </figure>

          <div className="tb-v2-card tb-image-settings">
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">Base64 data URL</span>
              <button type="button" onClick={copy} className="tb-v2-copy-btn">
                <Copy size={14} aria-hidden="true" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={result.dataUrl}
              readOnly
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)', minHeight: 180 }}
              aria-label="Canonical Base64 image data URL"
              onFocus={(e) => e.currentTarget.select()}
            />
            <div className="tb-v2-banner" style={{ display: 'block' }}>
              <p style={{ margin: 0 }}>
                <strong>{result.source}</strong>: {result.mime} ({result.extension.toUpperCase()}) · {result.dimensions.width} x {result.dimensions.height} px · image bytes {formatBytes(result.bytes.length)} · Base64 text {base64Length.toLocaleString()} characters.
              </p>
              <p style={{ margin: '6px 0 0' }}>
                Base64 is encoding, not compression, and is usually about one third larger than the image bytes.
              </p>
            </div>
          </div>
          </div>
        ) : !error && !loading ? (
          <div className="tb-v2-empty">
            {mode === 'encode' ? 'Upload an image or load Examples to create a Base64 data URL.' : 'Paste Base64 image data, load a text file, or use Examples to decode an image.'}
          </div>
        ) : null}
      </div>
    </div>
  );
}
