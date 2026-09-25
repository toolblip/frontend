'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { stripImageMetadata } from '@/lib/image-metadata-strip';
import {
  analyzeExifMetadata,
  detectImageMimeFromHeader,
  formatImageBytes,
  hasPersonalMetadataSignature,
  inferImageMimeFromName,
  normalizeImageMime,
  safeImageBaseName,
  validateCanvasDimensions,
  verifyOutputSignature,
  type ExifMetadataReport,
} from './ImageConversionClient';
import styles from './ImageConversionClient.module.css';

type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
  detectedMimeType: string;
  report: ExifMetadataReport;
  notes: string[];
};

type CleanResult = {
  blob: Blob;
  url: string;
  fileName: string;
  width: number;
  height: number;
  outputMimeType: 'image/jpeg' | 'image/png';
  metadataScanPassed: boolean;
  notes: string[];
};

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml';
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const SAMPLE_URL = '/samples/exif-remover-example.jpg';
const SAMPLE_NAME = 'exif-remover-example.jpg';

export default function ExifRemoverClient() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const loadIdRef = useRef(0);
  const cleanIdRef = useRef(0);

  useEffect(() => () => {
    loadIdRef.current += 1;
    cleanIdRef.current += 1;
    revokeSource();
    revokeResult();
  }, []);

  const revokeSource = () => {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = '';
    }
  };

  const revokeResult = () => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
  };

  const clearResult = () => {
    cleanIdRef.current += 1;
    setCleaning(false);
    revokeResult();
    setResult(null);
  };

  const clear = () => {
    loadIdRef.current += 1;
    clearResult();
    revokeSource();
    setSource(null);
    setLoading(false);
    setDragging(false);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const failLoad = (id: number, message: string) => {
    if (id !== loadIdRef.current) return;
    revokeSource();
    clearResult();
    setSource(null);
    setLoading(false);
    setError(message);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = async (file: File, options: { autoClean?: boolean } = {}) => {
    const id = ++loadIdRef.current;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(true);
    setDragging(false);

    if (file.size > MAX_UPLOAD_BYTES) {
      failLoad(id, 'Choose an image up to 20 MiB.');
      return;
    }

    let bytes: Uint8Array;
    try {
      bytes = new Uint8Array(await file.arrayBuffer());
    } catch {
      failLoad(id, 'This file could not be read. Try another image.');
      return;
    }

    if (id !== loadIdRef.current) return;
    const detectedMimeType = detectImageMimeFromHeader(bytes);
    const declared = normalizeImageMime(file.type);
    const named = inferImageMimeFromName(file.name);
    const knownType = declared.startsWith('image/') ? declared : named;
    const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

    if (!detectedMimeType || !supported.includes(detectedMimeType)) {
      failLoad(id, 'Choose a JPEG, PNG, WebP, GIF, or SVG image.');
      return;
    }

    if (knownType && knownType !== detectedMimeType) {
      failLoad(id, `This file looks like ${formatMime(detectedMimeType)}, but its name or MIME type says ${formatMime(knownType)}.`);
      return;
    }

    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    const image = new Image();
    image.onload = () => {
      if (id !== loadIdRef.current) return;
      const dimensions = validateCanvasDimensions(image.naturalWidth, image.naturalHeight);
      if (!dimensions.valid) {
        failLoad(id, dimensions.error);
        return;
      }
      const nextSource: SourceImage = {
        file,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
        detectedMimeType,
        report: analyzeExifMetadata(bytes, detectedMimeType),
        notes: getSourceNotes(detectedMimeType),
      };
      setSource(nextSource);
      setLoading(false);
      setError('');
      if (options.autoClean) void clean(nextSource, { ignoreBusy: true });
    };
    image.onerror = () => failLoad(id, 'This image could not be decoded in the browser.');
    image.src = url;
  };

  const loadExample = async () => {
    clear();
    const id = ++loadIdRef.current;
    setLoading(true);
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error('sample unavailable');
      const blob = await response.blob();
      if (id !== loadIdRef.current) return;
      await loadFile(new File([blob], SAMPLE_NAME, { type: blob.type || 'image/jpeg' }), { autoClean: true });
    } catch {
      if (id !== loadIdRef.current) return;
      setLoading(false);
      setError('The example image could not be loaded. Try again or upload your own image.');
    }
  };

  const clean = async (activeSource = source, options: { ignoreBusy?: boolean } = {}) => {
    if (!activeSource || loading || (!options.ignoreBusy && cleaning)) return;
    clearResult();
    const id = ++cleanIdRef.current;
    const sourceLoadId = loadIdRef.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Could not create the cleanup canvas in this browser.');
      return;
    }
    const cancelled = () => id !== cleanIdRef.current || sourceLoadId !== loadIdRef.current;
    setCleaning(true);
    setError('');

    const image = new Image();
    image.onload = async () => {
      if (cancelled()) return;
      try {
        canvas.width = activeSource.width;
        canvas.height = activeSource.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not start image cleanup in this browser.');
        ctx.clearRect(0, 0, activeSource.width, activeSource.height);
        if (activeSource.detectedMimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, activeSource.width, activeSource.height);
        }
        ctx.drawImage(image, 0, 0);

        const outputMimeType: 'image/jpeg' | 'image/png' = activeSource.detectedMimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
        const blob = await new Promise<Blob | null>((resolve, reject) => {
          try {
            canvas.toBlob(resolve, outputMimeType, outputMimeType === 'image/jpeg' ? 0.95 : undefined);
          } catch (err) {
            reject(err);
          }
        });
        if (cancelled()) return;
        if (!blob) {
          setCleaning(false);
          setError('This image could not be re-encoded.');
          return;
        }

        const outputBytes = new Uint8Array(await blob.arrayBuffer());
        if (cancelled()) return;
        const strippedBytes = stripImageMetadata(outputBytes, outputMimeType);
        if (!verifyOutputSignature(strippedBytes.slice(0, 16), outputMimeType)) {
          setCleaning(false);
          setError(`The browser export did not produce valid ${formatMime(outputMimeType)} bytes. No download was created.`);
          return;
        }

        const metadataScanPassed = !hasPersonalMetadataSignature(strippedBytes);
        const cleanBlob = new Blob([strippedBytes], { type: outputMimeType });
        if (cleanBlob.type !== outputMimeType) {
          setCleaning(false);
          setError(`The cleaned output did not keep a valid ${formatMime(outputMimeType)} MIME type. No download was created.`);
          return;
        }
        const resultUrl = URL.createObjectURL(cleanBlob);
        if (cancelled()) {
          URL.revokeObjectURL(resultUrl);
          return;
        }
        revokeResult();
        resultUrlRef.current = resultUrl;
        setResult({
          blob: cleanBlob,
          url: resultUrl,
          fileName: `${safeImageBaseName(activeSource.file.name)}-clean.${outputMimeType === 'image/jpeg' ? 'jpg' : 'png'}`,
          width: activeSource.width,
          height: activeSource.height,
          outputMimeType,
          metadataScanPassed,
          notes: [
            'Canvas re-encoding redraws the pixels, then this tool strips EXIF, XMP, IPTC/Photoshop, comments, and PNG text metadata from the final encoded file.',
            ...(outputMimeType === 'image/jpeg' ? ['JPEG output is re-encoded at quality 95 and may be slightly lossy.'] : ['PNG output preserves transparency where the browser decoder provides it.']),
            ...activeSource.notes,
            ...(!metadataScanPassed ? ['The final cleaned output still contains a personal-metadata signature, so review before sharing.'] : []),
          ],
        });
        setCleaning(false);
      } catch (err) {
        if (cancelled()) return;
        setCleaning(false);
        setError(err instanceof Error && err.message ? err.message : 'This image could not be cleaned.');
      }
    };
    image.onerror = () => {
      if (cancelled()) return;
      setCleaning(false);
      setError('This image could not be decoded for cleanup.');
    };
    image.src = activeSource.url;
  };

  const download = () => {
    if (!result || !result.metadataScanPassed) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.fileName;
    link.click();
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
    event.target.value = '';
  };
  const canClear = Boolean(source || result || error || loading || cleaning);
  const sourceMeta = source ? `${formatMime(source.detectedMimeType)} · ${formatImageBytes(source.file.size)} · ${source.width} x ${source.height} px` : '';
  const statusText = loading ? 'Checking image...' : cleaning ? 'Cleaning metadata...' : '';

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image metadata</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={canClear} exampleDisabled={loading || cleaning} />
      </div>

      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFile} hidden aria-label="Select image to remove metadata" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${source ? `tb-image-upload-compact ${styles.uploadCompact}` : ''} ${dragging ? 'dragging' : ''}`}
          onClick={openFilePicker}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}
          aria-label={source ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={loading}
        >
          {source ? (
            <>
              <span className={styles.uploadThumbnail} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={source.url} alt="" />
              </span>
              <span className={`tb-image-upload-copy ${styles.uploadCopy}`}>
                <span className={`tb-v2-dropzone-text ${styles.fileName}`} title={source.file.name}>{source.file.name}</span>
                <span className={`tb-v2-dropzone-hint ${styles.fileMeta}`}>{sourceMeta}</span>
                <span className={`tb-v2-dropzone-hint ${styles.replaceHint}`}>Drop another image to replace.</span>
              </span>
              <span className={`tb-v2-btn tb-v2-btn-sm ${styles.replaceAffordance}`}>
                <Upload size={15} aria-hidden="true" />
                <span>Replace image</span>
              </span>
            </>
          ) : (
            <>
              <Upload size={28} aria-hidden="true" />
              <span className="tb-image-upload-copy">
                <span className="tb-v2-dropzone-text">{loading ? 'Loading image...' : 'Click to upload or drag an image here'}</span>
                <span className="tb-v2-dropzone-hint">JPEG, PNG, WebP, GIF, or SVG. 20 MiB max.</span>
              </span>
            </>
          )}
        </button>

        {statusText && <p className="tb-image-hint" role="status">{statusText}</p>}
        {error && <p className="tb-image-hint" role="alert">{error}</p>}

        {source && (
          <>
            <div className="tb-v2-card tb-image-settings">
              <div className="tb-v2-stats-grid">
                <div className="tb-v2-stat-pill">
                  <div className="tb-image-hint">Recognized fields</div>
                  <div>{source.report.recognizedTagCount}</div>
                </div>
                <div className="tb-v2-stat-pill">
                  <div className="tb-image-hint">GPS data</div>
                  <div>{source.report.hasGps ? 'Present' : 'Not detected'}</div>
                </div>
                <div className="tb-v2-stat-pill">
                  <div className="tb-image-hint">Raw metadata</div>
                  <div>{metadataLabels(source.report).join(', ') || 'Not detected'}</div>
                </div>
              </div>
              <p className="tb-image-hint">
                A zero recognized-field count does not prove the file is metadata-free. It only means this browser-side parser did not identify named fields.
              </p>
              {source.report.tags.length > 0 && (
                <div className={`tb-v2-tool-pre ${styles.tagList}`}>
                  {source.report.tags.map((tag, index) => (
                    <div key={`${tag.name}-${index}`} className={styles.tagRow}>
                      <span className={styles.tagName}>{tag.name}</span>
                      <span className={styles.tagValue}>{tag.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="tb-image-actions">
                <button type="button" onClick={() => void clean()} disabled={loading || cleaning} className="tb-v2-btn tb-v2-btn-primary">
                  {cleaning ? 'Cleaning...' : 'Remove Metadata'}
                </button>
              </div>
            </div>

            <div className="tb-image-workspace">
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitleGroup}>
                    <span className="tb-v2-tool-label">Original</span>
                    <span className="tb-image-hint">{formatImageBytes(source.file.size)}</span>
                  </span>
                  <button type="button" onClick={openFilePicker} disabled={loading} className={`tb-v2-btn tb-v2-btn-sm ${styles.previewReplaceButton}`} aria-label="Replace original image">
                    <Upload size={14} aria-hidden="true" />
                    <span>Replace image</span>
                  </button>
                </figcaption>
                <div className="tb-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt="Original image preview" />
                </div>
                <p className="tb-image-hint">{source.width} x {source.height} px. Browser decoding applies EXIF orientation to the pixels it draws.</p>
              </figure>

              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className="tb-v2-tool-label">Cleaned</span>
                  {result && <span className="tb-image-hint">{formatImageBytes(result.blob.size)} · {formatMime(result.outputMimeType)}</span>}
                </figcaption>
                <div className="tb-image-preview" aria-busy={cleaning}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.url} alt="Cleaned image preview" />
                  ) : <p className="tb-image-hint">{cleaning ? 'Cleaning...' : 'Remove metadata to preview the cleaned file.'}</p>}
                </div>
                <p className="tb-image-hint">{result ? `${result.width} x ${result.height} px` : 'Output keeps the decoded pixel dimensions.'}</p>
              </figure>
            </div>

            {result && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div className={styles.notes}>
                  <strong>{result.metadataScanPassed ? 'Cleaned output scan passed' : 'Cleaned output needs review'}</strong>
                  <p className="tb-image-hint">
                    {formatImageBytes(source.file.size)} source to {formatImageBytes(result.blob.size)} cleaned {formatMime(result.outputMimeType)}.
                  </p>
                  {result.notes.map((note) => <p key={note} className="tb-image-hint">{note}</p>)}
                  <p className="tb-image-hint">The final encoded file is stripped before preview and download, including metadata a browser encoder may add.</p>
                </div>
                <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary" disabled={!result.metadataScanPassed}>
                  <Download size={16} aria-hidden="true" />
                  Download cleaned image
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <canvas ref={canvasRef} hidden />
    </div>
  );
}

function formatMime(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'JPEG';
  if (mimeType === 'image/png') return 'PNG';
  if (mimeType === 'image/webp') return 'WebP';
  if (mimeType === 'image/gif') return 'GIF';
  if (mimeType === 'image/svg+xml') return 'SVG';
  return mimeType.replace('image/', '').toUpperCase();
}

function getSourceNotes(mimeType: string) {
  if (mimeType === 'image/webp') return ['WebP input is decoded and exported as PNG so transparency is not silently flattened into JPEG.'];
  if (mimeType === 'image/gif') return ['GIF input is cleaned as a still PNG frame. Animation is not kept.'];
  if (mimeType === 'image/svg+xml') return ['SVG input is rasterized and exported as PNG.'];
  if (mimeType === 'image/png') return ['PNG output keeps transparency where the browser decoder provides it.'];
  return [];
}

function metadataLabels(report: ExifMetadataReport) {
  return [
    report.hasExif ? 'EXIF' : '',
    report.hasXmp ? 'XMP' : '',
    report.hasIptc ? 'IPTC' : '',
  ].filter(Boolean);
}
