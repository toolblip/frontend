'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import {
  ACCEPTED_IMAGE_TRANSFORM_TYPES,
  getImageTransformOutputFormat,
  getImageTransformPlan,
  validateImageTransformDimensions,
  validateImageTransformFile,
  verifyImageTransformOutputSignature,
  type ImageFlipDirection,
  type ImageRotationAngle,
  type ImageTransformOperation,
} from '@/lib/image-transform';
import {
  detectGeometryMimeType,
  formatGeometryBytesExact,
  getGeometryMimeLabel,
  getGeometrySourceNotes,
  normalizeGeometryMime,
} from '@/lib/image-geometry';
import styles from './ImageTransformTool.module.css';

type TransformKind = 'rotate' | 'flip';
type SourceImage = { file: File; url: string; width: number; height: number; mimeType: string; notes: string[] };
type TransformResult = { url: string; blob: Blob; width: number; height: number; fileName: string; formatLabel: string; notes: string[] };

const SAMPLE_URL = '/samples/image-resizer-mountain.jpg';
const SAMPLE_MIME = 'image/jpeg';
const EXPORT_DEBOUNCE_MS = 125;

const TOOL_COPY: Record<TransformKind, {
  controlLabel: string;
  hint: string;
  busy: string;
  outputLabel: string;
  empty: string;
  sampleName: string;
  operationName: string;
}> = {
  rotate: {
    controlLabel: 'Clockwise rotation',
    hint: 'The preview updates when you choose a turn.',
    busy: 'Updating preview...',
    outputLabel: 'Rotated',
    empty: 'Choose an image to see the rotated preview.',
    sampleName: 'rotate-example.jpg',
    operationName: 'rotated',
  },
  flip: {
    controlLabel: 'Flip direction',
    hint: 'The preview updates when you choose a direction.',
    busy: 'Updating preview...',
    outputLabel: 'Flipped',
    empty: 'Choose an image to see the flipped preview.',
    sampleName: 'flip-example.jpg',
    operationName: 'flipped',
  },
};

const ROTATION_CHOICES: Array<{ value: ImageRotationAngle; label: string; aria: string }> = [
  { value: 90, label: '90 degrees', aria: 'Rotate 90 degrees clockwise' },
  { value: 180, label: '180 degrees', aria: 'Rotate 180 degrees clockwise' },
  { value: 270, label: '270 degrees', aria: 'Rotate 270 degrees clockwise' },
];

const FLIP_CHOICES: Array<{ value: ImageFlipDirection; label: string; aria: string }> = [
  { value: 'horizontal', label: 'Horizontal', aria: 'Flip horizontal' },
  { value: 'vertical', label: 'Vertical', aria: 'Flip vertical' },
  { value: 'both', label: 'Both', aria: 'Flip horizontal and vertical' },
];

function getSizeChange(originalBytes: number, outputBytes: number, formatLabel: string) {
  const delta = outputBytes - originalBytes;
  if (delta === 0) return 'Same file size';
  const percent = originalBytes > 0 ? Math.abs(delta / originalBytes * 100) : 0;
  return delta < 0 ? `${percent.toFixed(1)}% smaller as ${formatLabel}` : `${percent.toFixed(1)}% larger as ${formatLabel}`;
}

function getOutputNotes(source: SourceImage, formatLabel: string) {
  const formatNote = formatLabel === 'JPEG'
    ? 'JPEG is re-encoded at quality 90; file size may change.'
    : 'PNG preserves transparent pixels; file size may change.';
  return [...source.notes, formatNote];
}

export default function ImageTransformToolClient({ kind }: { kind: TransformKind }) {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [rotation, setRotation] = useState<ImageRotationAngle>(90);
  const [flipDirection, setFlipDirection] = useState<ImageFlipDirection>('horizontal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const loadId = useRef(0);
  const processId = useRef(0);

  useEffect(() => () => {
    loadId.current++;
    processId.current++;
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  const copy = TOOL_COPY[kind];

  const clearResult = () => {
    processId.current++;
    setProcessing(false);
    setExportFailed(false);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
  };

  const revokeSource = () => {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = '';
    }
  };

  const resetDefaults = () => {
    setRotation(90);
    setFlipDirection('horizontal');
  };

  const clear = () => {
    loadId.current++;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(false);
    setProcessing(false);
    setIsDragging(false);
    resetDefaults();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = async (file: File) => {
    const id = ++loadId.current;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(true);
    setIsDragging(false);

    const fail = (message: string) => {
      if (id !== loadId.current) return;
      revokeSource();
      setSource(null);
      setLoading(false);
      setProcessing(false);
      setExportFailed(false);
      setError(message);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    let detectedMimeType = '';
    try {
      detectedMimeType = await detectGeometryMimeType(file);
    } catch {
      fail('This file could not be read. Try another image.');
      return;
    }

    if (id !== loadId.current) return;
    const fileError = validateImageTransformFile(file, detectedMimeType);
    if (fileError) {
      fail(fileError);
      return;
    }

    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current) return;
      const sourceValidation = validateImageTransformDimensions(img.naturalWidth, img.naturalHeight);
      if (!sourceValidation.valid) {
        fail(sourceValidation.error);
        return;
      }
      setSource({
        file: file.type === detectedMimeType ? file : new File([file], file.name, { type: detectedMimeType, lastModified: file.lastModified }),
        url,
        width: sourceValidation.width,
        height: sourceValidation.height,
        mimeType: detectedMimeType,
        notes: getGeometrySourceNotes(detectedMimeType),
      });
      setLoading(false);
      setError('');
    };
    img.onerror = () => fail('This image could not be decoded in the browser. Try another file.');
    img.src = url;
  };

  const loadExample = async () => {
    clear();
    resetDefaults();
    const id = ++loadId.current;
    setLoading(true);
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error('sample unavailable');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      await loadFile(new File([blob], copy.sampleName, { type: blob.type || SAMPLE_MIME }));
    } catch {
      if (id !== loadId.current) return;
      setLoading(false);
      setError('The example image could not be loaded. Try again or upload your own image.');
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
    event.target.value = '';
  };

  const invalidateForSetting = (next: () => void) => {
    next();
    clearResult();
    setError('');
  };

  const retryExport = () => {
    if (!exportFailed || !source) return;
    setRetryVersion((version) => version + 1);
  };

  useEffect(() => {
    if (!source || loading) return;

    const id = ++processId.current;
    const sourceLoadId = loadId.current;
    let cancelled = false;
    const isCancelled = () => cancelled || id !== processId.current || sourceLoadId !== loadId.current;
    const fail = (message: string) => {
      if (isCancelled()) return;
      setProcessing(false);
      setExportFailed(true);
      setError(message);
    };
    const operation: ImageTransformOperation = kind === 'rotate'
      ? { type: 'rotate', angle: rotation }
      : { type: 'flip', direction: flipDirection };
    const format = getImageTransformOutputFormat(source.mimeType);

    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
    setError('');
    setExportFailed(false);
    setProcessing(true);

    const timer = window.setTimeout(() => {
      const img = new Image();
      img.onload = async () => {
        if (isCancelled()) return;
        try {
          const plan = getImageTransformPlan(source.width, source.height, operation);
          const outputValidation = validateImageTransformDimensions(plan.width, plan.height);
          if (!outputValidation.valid) {
            fail(outputValidation.error);
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = plan.width;
          canvas.height = plan.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            fail(`Could not start the ${format.label} export in this browser. Try again.`);
            return;
          }
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, plan.width, plan.height);
          ctx.translate(plan.translateX, plan.translateY);
          if (plan.rotateRadians) ctx.rotate(plan.rotateRadians);
          if (plan.scaleX !== 1 || plan.scaleY !== 1) ctx.scale(plan.scaleX, plan.scaleY);
          ctx.drawImage(img, 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);

          const blob = await new Promise<Blob | null>((resolve, reject) => {
            if (isCancelled()) {
              resolve(null);
              return;
            }
            try {
              canvas.toBlob((nextBlob) => resolve(nextBlob), format.mimeType, format.quality);
            } catch (toBlobError) {
              reject(toBlobError);
            }
          });
          if (isCancelled()) return;
          if (!blob) {
            fail(`This image could not be exported as ${format.label}. Try a smaller image or another file.`);
            return;
          }
          if (normalizeGeometryMime(blob.type || '') !== format.mimeType) {
            fail(`Your browser did not return ${format.label} bytes. No download was created.`);
            return;
          }

          const outputHeader = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
          if (isCancelled()) return;
          if (!verifyImageTransformOutputSignature(outputHeader, format.mimeType)) {
            fail(`The browser export did not produce a valid ${format.label}. No download was created.`);
            return;
          }

          const resultUrl = URL.createObjectURL(blob);
          if (isCancelled()) {
            URL.revokeObjectURL(resultUrl);
            return;
          }
          if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
          resultUrlRef.current = resultUrl;
          setResult({
            url: resultUrl,
            blob,
            width: plan.width,
            height: plan.height,
            fileName: `${source.file.name.replace(/\.[^.]+$/, '') || 'image'}-${copy.operationName}.${format.extension}`,
            formatLabel: format.label,
            notes: getOutputNotes(source, format.label),
          });
          setProcessing(false);
        } catch (err) {
          fail(err instanceof Error && err.message ? err.message : `This image could not be exported as ${format.label}. Try another image.`);
        }
      };
      img.onerror = () => fail('This image could not be decoded for export. Try another file.');
      img.src = source.url;
    }, EXPORT_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (id === processId.current) processId.current++;
    };
  }, [source, loading, kind, rotation, flipDirection, retryVersion, copy.operationName]);

  const download = () => {
    if (!result || processing) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.fileName;
    link.click();
  };

  const sourceMeta = source ? `${formatGeometryBytesExact(source.file.size)} · ${source.width} x ${source.height} px · ${getGeometryMimeLabel(source.mimeType)}` : '';
  const resultMeta = result ? `${formatGeometryBytesExact(result.blob.size)} · ${result.formatLabel}` : 'Preparing preview';

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={Boolean(source || result || error || loading || processing)} exampleDisabled={loading} />
      </div>

      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TRANSFORM_TYPES} onChange={handleFile} hidden aria-label="Select image" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${source ? `tb-image-upload-compact ${styles.uploadCompact}` : ''} ${isDragging ? 'dragging' : ''}`}
          onClick={openFilePicker}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const dropped = event.dataTransfer.files[0];
            if (dropped) void loadFile(dropped);
          }}
          aria-label={source ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={loading}
        >
          {source ? (
            <>
              <span className={styles.dropThumb} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={source.url} alt="" />
              </span>
              <span className={styles.dropCopy}>
                <span className={`tb-v2-dropzone-text ${styles.fileName}`} title={source.file.name}>{loading ? 'Loading image...' : source.file.name}</span>
                <span className="tb-v2-dropzone-hint">{sourceMeta}</span>
                <span className="tb-v2-dropzone-hint">Drop another image to replace.</span>
              </span>
              <span className={`tb-v2-btn tb-v2-btn-sm ${styles.replaceAffordance}`}>
                <Upload size={15} aria-hidden="true" />
                <span>Replace image</span>
              </span>
            </>
          ) : (
            <>
              <Upload size={28} aria-hidden="true" />
              <span className={styles.dropCopy}>
                <span className="tb-v2-dropzone-text">{loading ? 'Loading image...' : 'Click to upload or drag an image here'}</span>
                <span className="tb-v2-dropzone-hint">PNG, JPEG, WebP, GIF, or SVG. 20 MiB max.</span>
              </span>
            </>
          )}
        </button>

        {(loading || processing) && <p className="tb-image-hint" role="status">{loading ? 'Checking image...' : copy.busy}</p>}
        {error && <p className="tb-image-hint" role="alert">{error}</p>}

        {source && (
          <>
            <div className={`tb-v2-card tb-image-settings ${styles.settings}`}>
              <div className={styles.settingHead}>
                <h3>{copy.controlLabel}</h3>
                <p>{copy.hint}</p>
              </div>
              {kind === 'rotate' ? (
                <div className={`${styles.modeTabs} tb-v2-mode-tabs`} role="group" aria-label="Clockwise rotation">
                  {ROTATION_CHOICES.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      className={`tb-v2-mode-tab ${rotation === choice.value ? 'on' : ''}`}
                      aria-pressed={rotation === choice.value}
                      aria-label={choice.aria}
                      onClick={() => { if (rotation !== choice.value) invalidateForSetting(() => setRotation(choice.value)); }}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`${styles.modeTabs} tb-v2-mode-tabs`} role="group" aria-label="Flip direction">
                  {FLIP_CHOICES.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      className={`tb-v2-mode-tab ${flipDirection === choice.value ? 'on' : ''}`}
                      aria-pressed={flipDirection === choice.value}
                      aria-label={choice.aria}
                      onClick={() => { if (flipDirection !== choice.value) invalidateForSetting(() => setFlipDirection(choice.value)); }}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="tb-image-hint">JPEG is re-encoded at quality 90. PNG keeps transparency. GIF uses its first frame; SVG is rasterized.</p>
            </div>

            <div className={styles.workspace}>
              <figure className={`tb-v2-card tb-image-preview-card ${styles.previewCard}`}>
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitle}>
                    <span className="tb-v2-tool-label">Original</span>
                    <span className="tb-image-hint">{formatGeometryBytesExact(source.file.size)}</span>
                  </span>
                  <button type="button" onClick={openFilePicker} disabled={loading} className={`tb-v2-btn tb-v2-btn-sm ${styles.replaceButton}`} aria-label="Replace original image">
                    <Upload size={14} aria-hidden="true" />
                    <span>Replace image</span>
                  </button>
                </figcaption>
                <div className={`tb-image-preview ${styles.previewPane}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt="Original image" />
                </div>
                <p className="tb-image-hint">{source.width} x {source.height} px · {getGeometryMimeLabel(source.mimeType)}</p>
              </figure>

              <figure className={`tb-v2-card tb-image-preview-card ${styles.previewCard}`}>
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitle}>
                    <span className="tb-v2-tool-label">{copy.outputLabel}</span>
                    <span className="tb-image-hint">{resultMeta}</span>
                  </span>
                </figcaption>
                <div className={`tb-image-preview ${styles.previewPane}`} aria-busy={processing}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.url} alt={`${copy.outputLabel} image`} />
                  ) : <p className="tb-image-hint">{processing ? copy.busy : copy.empty}</p>}
                </div>
                {result ? (
                  <div className={styles.resultBar} aria-live="polite">
                    <div className={styles.notes}>
                      <strong>{getSizeChange(source.file.size, result.blob.size, result.formatLabel)}</strong>
                      <p className="tb-image-hint">{result.width} x {result.height} px · {formatGeometryBytesExact(source.file.size)} original to {formatGeometryBytesExact(result.blob.size)} output.</p>
                      {result.notes.map((note) => <p key={note} className="tb-image-hint">{note}</p>)}
                    </div>
                    <button type="button" onClick={download} disabled={processing} className="tb-v2-btn tb-v2-btn-primary">Download {result.formatLabel}</button>
                  </div>
                ) : (
                  <div className={styles.resultBar}>
                    <p className="tb-image-hint">{exportFailed ? 'Preview export failed.' : processing ? 'Updating the preview…' : 'Preview will appear here.'}</p>
                    {exportFailed && <button type="button" onClick={retryExport} className="tb-v2-btn tb-v2-btn-sm">Retry preview</button>}
                  </div>
                )}
              </figure>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
