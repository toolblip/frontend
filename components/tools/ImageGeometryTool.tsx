'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import {
  ACCEPTED_IMAGE_GEOMETRY_TYPES,
  MAX_GEOMETRY_JPEG_QUALITY,
  MAX_IMAGE_GEOMETRY_SIDE,
  calculateBorderGeometry,
  calculateContainGeometry,
  calculateCoverGeometry,
  calculateStretchGeometry,
  detectGeometryMimeType,
  encodeGeometryBlobWithJpegRetry,
  formatGeometryBytes,
  formatGeometryBytesExact,
  getDefaultGeometryFormat,
  getGeometryDownloadName,
  getGeometryMimeLabel,
  getGeometrySourceNotes,
  parseGeometryInteger,
  validateGeometryDimensions,
  validateGeometryFile,
  verifyGeometryOutputSignature,
  type GeometryOutputMime,
  type GeometryRect,
} from '@/lib/image-geometry';
import styles from './ImageGeometryTool.module.css';

type GeometryToolKind = 'resize' | 'square' | 'border';
type FitMode = 'cover' | 'stretch' | 'contain';
type Preset = { label: string; width: number; height: number };
type SourceImage = { file: File; url: string; width: number; height: number; mimeType: string; notes: string[] };
type GeometryResult = {
  url: string;
  fileName: string;
  blob: Blob;
  width: number;
  height: number;
  mimeType: GeometryOutputMime;
  actualQuality: number | null;
  qualityAutoReduced: boolean;
  notes: string[];
};

const PHOTO_PRESETS: Preset[] = [
  { label: 'Instagram Post (1080x1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080x1920)', width: 1080, height: 1920 },
  { label: 'Facebook Cover (820x312)', width: 820, height: 312 },
  { label: 'Twitter/X Post (1200x675)', width: 1200, height: 675 },
  { label: 'LinkedIn Banner (1584x396)', width: 1584, height: 396 },
  { label: 'YouTube Thumbnail (1280x720)', width: 1280, height: 720 },
];
const SAMPLE_URL = '/samples/image-resizer-mountain.jpg';
const SAMPLE_NAME = 'image-resizer-mountain.jpg';
const SAMPLE_MIME = 'image/jpeg';

const TOOL_COPY: Record<GeometryToolKind, {
  outputLabel: string;
  empty: string;
  action: string;
  busy: string;
  sampleName: string;
}> = {
  resize: {
    outputLabel: 'Resized',
    empty: 'Choose an image, set the size, then resize it.',
    action: 'Resize image',
    busy: 'Resizing image...',
    sampleName: 'photo-resize-example.jpg',
  },
  square: {
    outputLabel: 'Square fit',
    empty: 'Choose an image, set the square size, then fit it.',
    action: 'Fit square',
    busy: 'Fitting image...',
    sampleName: 'square-fit-example.jpg',
  },
  border: {
    outputLabel: 'With border',
    empty: 'Choose an image, set the border, then add it.',
    action: 'Add border',
    busy: 'Adding border...',
    sampleName: 'border-example.jpg',
  },
};

function getSizeChange(originalBytes: number, outputBytes: number) {
  const delta = outputBytes - originalBytes;
  if (delta === 0) return 'Same size';
  const percent = originalBytes > 0 ? Math.abs(delta / originalBytes * 100) : 0;
  return delta < 0 ? `${percent.toFixed(1)}% smaller` : `${percent.toFixed(1)}% larger`;
}

function firstError(...messages: string[]) {
  return messages.find(Boolean) || '';
}

export default function ImageGeometryTool({ kind, live = false }: { kind: GeometryToolKind; live?: boolean }) {
  const liveBorder = kind === 'border' && live;
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<GeometryResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [retryPreview, setRetryPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [customSize, setCustomSize] = useState(false);
  const [widthInput, setWidthInput] = useState('1200');
  const [heightInput, setHeightInput] = useState('800');
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [padColor, setPadColor] = useState('#ffffff');
  const [format, setFormat] = useState<GeometryOutputMime>('image/png');
  const [squareSize, setSquareSize] = useState('1000');
  const [squareColor, setSquareColor] = useState('#ffffff');
  const [borderWidth, setBorderWidth] = useState('10');
  const [borderColor, setBorderColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const loadId = useRef(0);
  const processId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const processImageRef = useRef<() => void>(() => {});

  useEffect(() => () => {
    loadId.current++;
    processId.current++;
    abortRef.current?.abort();
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  const clearResult = () => {
    processId.current++;
    abortRef.current?.abort();
    abortRef.current = null;
    setProcessing(false);
    setRetryPreview(false);
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

  const invalidate = () => {
    clearResult();
    setError('');
  };

  const clear = () => {
    loadId.current++;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(false);
    setProcessing(false);
    setRetryPreview(false);
    setIsDragging(false);
    setPresetIndex(0);
    setCustomSize(false);
    setWidthInput('1200');
    setHeightInput('800');
    setFitMode('cover');
    setPadColor('#ffffff');
    setFormat('image/png');
    setSquareSize('1000');
    setSquareColor('#ffffff');
    setBorderWidth('10');
    setBorderColor('#000000');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFile = async (file: File, options: { example?: boolean } = {}) => {
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
    const fileError = validateGeometryFile(file, detectedMimeType);
    if (fileError) {
      fail(fileError);
      return;
    }

    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current) return;
      const sourceValidation = validateGeometryDimensions(img.naturalWidth, img.naturalHeight);
      if (!sourceValidation.valid) {
        fail(sourceValidation.error);
        return;
      }
      const loaded = {
        file: file.type === detectedMimeType ? file : new File([file], file.name, { type: detectedMimeType, lastModified: file.lastModified }),
        url,
        width: sourceValidation.width,
        height: sourceValidation.height,
        mimeType: detectedMimeType,
        notes: getGeometrySourceNotes(detectedMimeType),
      };
      setSource(loaded);
      setLoading(false);
      setError('');
      if (kind === 'resize') {
        setFormat(options.example ? 'image/jpeg' : getDefaultGeometryFormat(detectedMimeType));
        if (options.example) {
          setCustomSize(true);
          setWidthInput('640');
          setHeightInput('427');
          setFitMode('cover');
        }
      }
      if (kind === 'square' && options.example) {
        setSquareSize('1000');
        setSquareColor('#ffffff');
      }
      if (kind === 'border' && options.example) {
        setBorderWidth('10');
        setBorderColor('#000000');
      }
    };
    img.onerror = () => fail('This image could not be decoded in the browser. Try another file.');
    img.src = url;
  };

  const loadExample = async () => {
    clear();
    const id = ++loadId.current;
    setLoading(true);
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error('sample unavailable');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      await loadFile(new File([blob], TOOL_COPY[kind].sampleName || SAMPLE_NAME, { type: blob.type || SAMPLE_MIME }), { example: true });
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

  const getPlan = () => {
    if (!source) return { valid: false as const, error: 'Choose an image first.' };

    if (kind === 'resize') {
      const preset = PHOTO_PRESETS[presetIndex];
      const widthParsed = customSize ? parseGeometryInteger(widthInput, 'Width') : { valid: true as const, value: preset.width, error: '' };
      const heightParsed = customSize ? parseGeometryInteger(heightInput, 'Height') : { valid: true as const, value: preset.height, error: '' };
      if (!widthParsed.valid || !heightParsed.valid) return { valid: false as const, error: firstError(widthParsed.error, heightParsed.error) };
      const validation = validateGeometryDimensions(widthParsed.value, heightParsed.value);
      if (!validation.valid) return { valid: false as const, error: validation.error };
      return {
        valid: true as const,
        width: validation.width,
        height: validation.height,
        mimeType: format,
        operation: 'resized',
        border: 0,
      };
    }

    if (kind === 'square') {
      const sizeParsed = parseGeometryInteger(squareSize, 'Square size');
      if (!sizeParsed.valid) return { valid: false as const, error: sizeParsed.error };
      const validation = validateGeometryDimensions(sizeParsed.value, sizeParsed.value);
      if (!validation.valid) return { valid: false as const, error: validation.error };
      return { valid: true as const, width: validation.width, height: validation.height, mimeType: 'image/png' as const, operation: 'square', border: 0 };
    }

    const borderParsed = parseGeometryInteger(borderWidth, 'Border width');
    if (!borderParsed.valid) return { valid: false as const, error: borderParsed.error };
    if (borderParsed.value > 100) return { valid: false as const, error: 'Border width must be 100 px or less.' };
    const width = source.width + borderParsed.value * 2;
    const height = source.height + borderParsed.value * 2;
    const validation = validateGeometryDimensions(width, height);
    if (!validation.valid) return { valid: false as const, error: validation.error };
    return { valid: true as const, width, height, mimeType: liveBorder ? getDefaultGeometryFormat(source.mimeType) : 'image/png' as const, operation: `border-${borderParsed.value}px`, border: borderParsed.value };
  };

  const plan = getPlan();
  const canProcess = Boolean(source && plan.valid && !loading && !processing);

  const drawGeometry = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, rect: GeometryRect, mimeType: GeometryOutputMime) => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, rect.canvasWidth, rect.canvasHeight);
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.canvasWidth, rect.canvasHeight);
    }
    if (kind === 'resize' && fitMode === 'contain') {
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, rect.canvasWidth, rect.canvasHeight);
    }
    if (kind === 'square') {
      ctx.fillStyle = squareColor;
      ctx.fillRect(0, 0, rect.canvasWidth, rect.canvasHeight);
    }
    ctx.drawImage(img, rect.drawX, rect.drawY, rect.drawWidth, rect.drawHeight);
    if (kind === 'border' && plan.valid) {
      const border = plan.border;
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, rect.canvasWidth, border);
      ctx.fillRect(0, rect.canvasHeight - border, rect.canvasWidth, border);
      ctx.fillRect(0, border, border, rect.canvasHeight - border * 2);
      ctx.fillRect(rect.canvasWidth - border, border, border, rect.canvasHeight - border * 2);
    }
  };

  const processImage = () => {
    if (!source || !plan.valid || loading || processing) return;
    clearResult();
    const id = ++processId.current;
    const sourceLoadId = loadId.current;
    const abortController = new AbortController();
    abortRef.current = abortController;
    const canvas = liveBorder ? document.createElement('canvas') : canvasRef.current;
    if (!canvas) {
      setError('Could not create the export canvas in this browser.');
      setRetryPreview(liveBorder);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not start the image export in this browser.');
      setRetryPreview(liveBorder);
      return;
    }

    setProcessing(true);
    setError('');
    setRetryPreview(false);
    const isCancelled = () => id !== processId.current || sourceLoadId !== loadId.current || abortController.signal.aborted;
    const fail = (message: string, canRetry = liveBorder) => {
      if (isCancelled()) return;
      if (abortRef.current === abortController) abortRef.current = null;
      setProcessing(false);
      setError(message);
      setRetryPreview(liveBorder && canRetry);
    };

    const img = new Image();
    img.onload = async () => {
      if (isCancelled()) return;
      try {
        const rect = kind === 'resize'
          ? fitMode === 'cover'
            ? calculateCoverGeometry({ sourceWidth: source.width, sourceHeight: source.height, targetWidth: plan.width, targetHeight: plan.height })
            : fitMode === 'contain'
              ? calculateContainGeometry({ sourceWidth: source.width, sourceHeight: source.height, targetWidth: plan.width, targetHeight: plan.height })
              : calculateStretchGeometry({ targetWidth: plan.width, targetHeight: plan.height })
          : kind === 'square'
            ? calculateContainGeometry({ sourceWidth: source.width, sourceHeight: source.height, targetWidth: plan.width, targetHeight: plan.height })
            : calculateBorderGeometry({ sourceWidth: source.width, sourceHeight: source.height, borderWidth: plan.border });

        canvas.width = rect.canvasWidth;
        canvas.height = rect.canvasHeight;
        const nextCtx = canvas.getContext('2d');
        if (!nextCtx) {
          fail('Could not finish the image export in this browser.', true);
          return;
        }
        drawGeometry(nextCtx, img, rect, plan.mimeType);

        const encode = (mimeType: GeometryOutputMime, encodeQuality?: number) => new Promise<Blob | null>((resolve, reject) => {
          if (isCancelled()) {
            resolve(null);
            return;
          }
          try {
            canvas.toBlob((blob) => {
              if (isCancelled()) {
                resolve(null);
                return;
              }
              resolve(blob);
            }, mimeType, encodeQuality);
          } catch (toBlobError) {
            reject(toBlobError);
          }
        });
        const sameDimensions = source.width === plan.width && source.height === plan.height;
        const encoded = liveBorder && plan.mimeType === 'image/jpeg'
          ? await encode(plan.mimeType, 0.9).then((blob) => ({
            blob,
            actualQuality: blob ? 90 : null,
            qualityAutoReduced: false,
            failed: !blob,
            cancelled: isCancelled(),
            mimeMismatch: Boolean(blob && blob.type !== plan.mimeType),
            error: undefined,
          }))
          : await encodeGeometryBlobWithJpegRetry({
            originalBytes: source.file.size,
            requestedMimeType: plan.mimeType,
            maxQuality: MAX_GEOMETRY_JPEG_QUALITY,
            allowRetryWhenLarger: kind === 'resize' && plan.mimeType === 'image/jpeg' && sameDimensions,
            encode,
            isCancelled,
          });

        if (encoded.cancelled || isCancelled()) return;
        if (encoded.failed || !encoded.blob) {
          fail(encoded.mimeMismatch ? `Your browser did not return ${getGeometryMimeLabel(plan.mimeType)}. Try another format.` : encoded.error || 'This image could not be exported. Try smaller dimensions or another image.', true);
          return;
        }

        if (liveBorder && encoded.blob.type !== plan.mimeType) {
          fail(`Your browser did not return ${getGeometryMimeLabel(plan.mimeType)}. Try another format.`, true);
          return;
        }

        const outputHeader = new Uint8Array(await encoded.blob.slice(0, 16).arrayBuffer());
        if (isCancelled()) return;
        if (!verifyGeometryOutputSignature(outputHeader, plan.mimeType)) {
          fail(`The browser export did not produce valid ${getGeometryMimeLabel(plan.mimeType)} bytes. No download was created.`, true);
          return;
        }

        const resultUrl = URL.createObjectURL(encoded.blob);
        if (isCancelled()) {
          URL.revokeObjectURL(resultUrl);
          return;
        }
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = resultUrl;
        const notes = [
          ...source.notes,
          ...(plan.mimeType === 'image/jpeg' ? ['JPEG uses a white background for transparent pixels.'] : []),
          ...(encoded.qualityAutoReduced && encoded.actualQuality != null ? [`JPEG quality was reduced to ${encoded.actualQuality}% after checking the output size.`] : []),
        ];
        setResult({
          url: resultUrl,
          fileName: getGeometryDownloadName(source.file.name, plan.operation, plan.mimeType, { width: plan.width, height: plan.height }),
          blob: encoded.blob,
          width: plan.width,
          height: plan.height,
          mimeType: plan.mimeType,
          actualQuality: encoded.actualQuality,
          qualityAutoReduced: encoded.qualityAutoReduced,
          notes,
        });
        if (abortRef.current === abortController) abortRef.current = null;
        setProcessing(false);
      } catch (err) {
        fail(err instanceof Error && err.message ? err.message : 'This image could not be exported. Try another image.', true);
      }
    };
    img.onerror = () => fail('This image could not be decoded for export.');
    img.src = source.url;
  };

  processImageRef.current = processImage;

  useEffect(() => {
    if (!liveBorder || !source || loading) return;
    const timeout = window.setTimeout(() => processImageRef.current(), 150);
    return () => window.clearTimeout(timeout);
  }, [liveBorder, source, borderWidth, borderColor, loading]);

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.fileName;
    link.click();
  };

  const copy = liveBorder
    ? { ...TOOL_COPY.border, empty: 'Choose an image to preview its border.', action: 'Preview border', busy: 'Updating preview...' }
    : TOOL_COPY[kind];
  const sourceMeta = source ? `${formatGeometryBytes(source.file.size)} · ${source.width} x ${source.height} px · ${getGeometryMimeLabel(source.mimeType)}` : '';
  const resizePlanHint = plan.valid ? `${plan.width} x ${plan.height} px output` : plan.error;
  const fitChoices: Array<{ value: FitMode; label: string; hint: string; hintId: string }> = [
    { value: 'cover', label: 'Crop to fit', hint: 'Fill the target size and trim overflow.', hintId: 'image-geometry-fit-cover-hint' },
    { value: 'stretch', label: 'Stretch', hint: 'Force the image into the exact size.', hintId: 'image-geometry-fit-stretch-hint' },
    { value: 'contain', label: 'Pad', hint: 'Keep the full image and add background.', hintId: 'image-geometry-fit-contain-hint' },
  ];

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={Boolean(source || result || error || loading || processing)} exampleDisabled={loading || processing} />
      </div>

      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_GEOMETRY_TYPES} onChange={handleFile} hidden aria-label="Select image" />
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

        {source && kind === 'resize' && (
          <div className={styles.resizeWorkspace}>
            <aside className={`tb-v2-card tb-image-settings ${styles.resizeSettings}`}>
              <section className={styles.resizeSection}>
                <div className={styles.sectionHead}>
                  <h3>Size</h3>
                  <span>{resizePlanHint}</span>
                </div>
                <div className={styles.field}>
                  <label className="tb-v2-tool-label" htmlFor="image-geometry-preset">Target size</label>
                  <select
                    id="image-geometry-preset"
                    className="tb-v2-select"
                    value={customSize ? 'custom' : String(presetIndex)}
                    onChange={(event) => {
                      invalidate();
                      if (event.target.value === 'custom') setCustomSize(true);
                      else {
                        setCustomSize(false);
                        setPresetIndex(Number(event.target.value));
                      }
                    }}
                  >
                    {PHOTO_PRESETS.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {customSize && (
                  <div className={styles.resizeDimensions}>
                    <div className={styles.field}>
                      <label className="tb-v2-tool-label" htmlFor="image-geometry-width">Width</label>
                      <input id="image-geometry-width" type="number" min="1" max={MAX_IMAGE_GEOMETRY_SIDE} step="1" className="tb-v2-input" value={widthInput} onChange={(event) => { setWidthInput(event.target.value); invalidate(); }} />
                    </div>
                    <div className={styles.field}>
                      <label className="tb-v2-tool-label" htmlFor="image-geometry-height">Height</label>
                      <input id="image-geometry-height" type="number" min="1" max={MAX_IMAGE_GEOMETRY_SIDE} step="1" className="tb-v2-input" value={heightInput} onChange={(event) => { setHeightInput(event.target.value); invalidate(); }} />
                    </div>
                  </div>
                )}
              </section>

              <section className={styles.resizeSection}>
                <div className={styles.sectionHead}>
                  <h3>Fit</h3>
                  <span>Choose how the photo fills the frame.</span>
                </div>
                <div className={styles.fitCards} role="group" aria-label="Fit mode">
                  {fitChoices.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      className={`${styles.fitCard} ${fitMode === choice.value ? styles.fitCardOn : ''}`}
                      aria-pressed={fitMode === choice.value}
                      aria-label={choice.label}
                      aria-describedby={choice.hintId}
                      onClick={() => { setFitMode(choice.value); invalidate(); }}
                    >
                      <span className={`${styles.fitIcon} ${styles[`fitIcon${choice.value[0].toUpperCase()}${choice.value.slice(1)}`]}`} aria-hidden="true" />
                      <span>
                        <strong>{choice.label}</strong>
                        <small id={choice.hintId}>{choice.hint}</small>
                      </span>
                    </button>
                  ))}
                </div>
                {fitMode === 'contain' && (
                  <label className={`${styles.field} ${styles.padColorField}`} htmlFor="image-geometry-pad-color">
                    <span className="tb-v2-tool-label">Padding color</span>
                    <span className={styles.swatchRow}>
                      <input id="image-geometry-pad-color" type="color" value={padColor} onChange={(event) => { setPadColor(event.target.value); invalidate(); }} className={styles.swatch} />
                      <span className="tb-image-hint">{padColor}</span>
                    </span>
                  </label>
                )}
              </section>

              <section className={styles.resizeSection}>
                <div className={styles.sectionHead}>
                  <h3>Export</h3>
                  <span>Limit: {MAX_IMAGE_GEOMETRY_SIDE} px per side and 32 megapixels.</span>
                </div>
                <div className={styles.field}>
                  <span className="tb-v2-tool-label">Output format</span>
                  <div className={`${styles.formatTabs} tb-v2-mode-tabs`} role="group" aria-label="Output format">
                    <button type="button" className={`tb-v2-mode-tab ${format === 'image/png' ? 'on' : ''}`} aria-pressed={format === 'image/png'} onClick={() => { setFormat('image/png'); invalidate(); }}>PNG</button>
                    <button type="button" className={`tb-v2-mode-tab ${format === 'image/jpeg' ? 'on' : ''}`} aria-pressed={format === 'image/jpeg'} onClick={() => { setFormat('image/jpeg'); invalidate(); }}>JPEG</button>
                  </div>
                </div>
                <p className="tb-image-hint">{plan.valid ? `Ready to create ${plan.width} x ${plan.height} px.` : plan.error}</p>
                <div className="tb-image-actions">
                  <button type="button" onClick={processImage} disabled={!canProcess} className="tb-v2-btn tb-v2-btn-primary">{processing ? copy.busy : copy.action}</button>
                </div>
              </section>
            </aside>

            <section className={styles.resizePreviewArea}>
              <div className={styles.resizePreviewGrid}>
                <figure className={`tb-v2-card tb-image-preview-card ${styles.resizePreviewCard}`}>
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
                  <div className={`tb-image-preview ${styles.previewPane} ${styles.resizePreviewPane}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={source.url} alt="Original image" />
                  </div>
                  <p className="tb-image-hint">{source.width} x {source.height} px · {getGeometryMimeLabel(source.mimeType)}</p>
                </figure>

                <figure className={`tb-v2-card tb-image-preview-card ${styles.resizePreviewCard}`}>
                  <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                    <span className={styles.previewTitle}>
                      <span className="tb-v2-tool-label">{copy.outputLabel}</span>
                      {result ? (
                        <span className="tb-image-hint">{formatGeometryBytesExact(result.blob.size)} · {getGeometryMimeLabel(result.mimeType)}</span>
                      ) : (
                        <span className="tb-image-hint">{plan.valid ? `${plan.width} x ${plan.height} px` : 'Waiting for valid settings'}</span>
                      )}
                    </span>
                  </figcaption>
                  <div className={`tb-image-preview ${styles.previewPane} ${styles.resizePreviewPane}`} aria-busy={processing}>
                    {result ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={result.url} alt={`${copy.outputLabel} image`} />
                    ) : <p className="tb-image-hint">{processing ? copy.busy : 'Resize to preview the current settings.'}</p>}
                  </div>
                  {result ? (
                    <div className={styles.resizeResultBar} aria-live="polite">
                      <div className={styles.notes}>
                        <strong>{getSizeChange(source.file.size, result.blob.size)}</strong>
                        <p className="tb-image-hint">{result.width} x {result.height} px · {formatGeometryBytesExact(source.file.size)} to {formatGeometryBytesExact(result.blob.size)}</p>
                        {result.actualQuality != null && <p className="tb-image-hint">JPEG quality: {result.actualQuality}%{result.qualityAutoReduced ? ' after retry' : ''}</p>}
                        {result.notes.map((note) => <p key={note} className="tb-image-hint">{note}</p>)}
                      </div>
                      <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">Download current image</button>
                    </div>
                  ) : (
                    <p className="tb-image-hint">No current output.</p>
                  )}
                </figure>
              </div>
            </section>
          </div>
        )}

        {source && kind !== 'resize' && (
          <>
            <div className={`tb-v2-card tb-image-settings ${styles.panel}`}>
              {kind === 'square' && (
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className="tb-v2-tool-label" htmlFor="image-geometry-square-size">Square size</label>
                    <input id="image-geometry-square-size" type="number" min="1" max={MAX_IMAGE_GEOMETRY_SIDE} step="1" className="tb-v2-input" value={squareSize} onChange={(event) => { setSquareSize(event.target.value); invalidate(); }} />
                  </div>
                  <label className={styles.field} htmlFor="image-geometry-square-color">
                    <span className="tb-v2-tool-label">Background color</span>
                    <span className={styles.swatchRow}>
                      <input id="image-geometry-square-color" type="color" value={squareColor} onChange={(event) => { setSquareColor(event.target.value); invalidate(); }} className={styles.swatch} />
                      <span className="tb-image-hint">{squareColor}</span>
                    </span>
                  </label>
                </div>
              )}

              {kind === 'border' && (
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className="tb-image-card-head" htmlFor="image-geometry-border-width"><span className="tb-v2-tool-label">Border width</span><span className="tb-v2-range-val">{borderWidth || '0'} px</span></label>
                    <input id="image-geometry-border-width" type="range" min="1" max="100" step="1" value={borderWidth || '1'} onChange={(event) => { setBorderWidth(event.target.value); invalidate(); }} className="tb-image-quality" />
                  </div>
                  <label className={styles.field} htmlFor="image-geometry-border-color">
                    <span className="tb-v2-tool-label">Border color</span>
                    <span className={styles.swatchRow}>
                      <input id="image-geometry-border-color" type="color" value={borderColor} onChange={(event) => { setBorderColor(event.target.value); invalidate(); }} className={styles.swatch} />
                      <span className="tb-image-hint">{borderColor}</span>
                    </span>
                  </label>
                </div>
              )}

              <p className="tb-image-hint">
                {plan.valid ? `Output size: ${plan.width} x ${plan.height} px. Limit: ${MAX_IMAGE_GEOMETRY_SIDE} px per side and 32 megapixels.` : plan.error}
              </p>
              {liveBorder && source.mimeType === 'image/jpeg' && <p className="tb-image-hint">JPEG is re-encoded at 90% quality; file size can vary.</p>}
              {kind === 'border' && !liveBorder && (
                <div className="tb-image-actions">
                  <button type="button" onClick={processImage} disabled={!canProcess} className="tb-v2-btn tb-v2-btn-primary">{processing ? copy.busy : copy.action}</button>
                </div>
              )}
              {kind === 'square' && (
                <div className="tb-image-actions">
                  <button type="button" onClick={processImage} disabled={!canProcess} className="tb-v2-btn tb-v2-btn-primary">{processing ? copy.busy : copy.action}</button>
                </div>
              )}
              {liveBorder && retryPreview && (
                <div className="tb-image-actions">
                  <button type="button" onClick={processImage} disabled={!canProcess} className="tb-v2-btn tb-v2-btn-primary">Retry preview</button>
                </div>
              )}
            </div>

            <div className={styles.workspace}>
              <figure className="tb-v2-card tb-image-preview-card">
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

              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitle}>
                    <span className="tb-v2-tool-label">{copy.outputLabel}</span>
                    {result && <span className="tb-image-hint">{formatGeometryBytesExact(result.blob.size)} · {getGeometryMimeLabel(result.mimeType)}</span>}
                  </span>
                </figcaption>
                <div className={`tb-image-preview ${styles.previewPane}`} aria-busy={processing}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.url} alt={`${copy.outputLabel} image`} />
                  ) : <p className="tb-image-hint">{processing ? copy.busy : copy.empty}</p>}
                </div>
                <p className="tb-image-hint">{result ? `${result.width} x ${result.height} px` : 'No current output.'}</p>
              </figure>
            </div>

            {result && (
              <div className={`tb-v2-card tb-image-result ${styles.resultBox}`} aria-live="polite">
                <div className={styles.notes}>
                  <strong>{getSizeChange(source.file.size, result.blob.size)}</strong>
                  <p className="tb-image-hint">{formatGeometryBytesExact(source.file.size)} original to {formatGeometryBytesExact(result.blob.size)} output.</p>
                  {result.actualQuality != null && <p className="tb-image-hint">JPEG quality: {result.actualQuality}%{result.qualityAutoReduced ? ' after retry' : ''}</p>}
                  {result.notes.map((note) => <p key={note} className="tb-image-hint">{note}</p>)}
                </div>
                <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">Download current image</button>
              </div>
            )}
          </>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
