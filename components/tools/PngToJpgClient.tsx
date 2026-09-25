'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import {
  encodePngToJpegWithSizeAwareness,
  formatImageBytes,
  getPngToJpegSourceValidation,
  getSizeChangeLabel,
  safeImageBaseName,
  validateCanvasDimensions,
  verifyOutputSignature,
} from './ImageConversionClient';
import styles from './ImageConversionClient.module.css';

type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type ConversionResult = {
  blob: Blob;
  url: string;
  fileName: string;
  width: number;
  height: number;
  quality: number;
  autoReduced: boolean;
  couldMakeSmaller: boolean;
};

const ACCEPTED_TYPES = '.png,image/png';
const SAMPLE_URL = '/samples/png-to-jpg-photo.png';
const SAMPLE_NAME = 'png-to-jpg-photo.png';
const DEFAULT_QUALITY = 85;
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export default function PngToJpgClient() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const loadIdRef = useRef(0);
  const convertIdRef = useRef(0);

  useEffect(() => () => {
    loadIdRef.current += 1;
    convertIdRef.current += 1;
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
    convertIdRef.current += 1;
    setConverting(false);
    revokeResult();
    setResult(null);
  };

  const clear = () => {
    loadIdRef.current += 1;
    clearResult();
    revokeSource();
    setSource(null);
    setQuality(DEFAULT_QUALITY);
    setBackgroundColor('#ffffff');
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

  const loadFile = async (file: File, options: { autoConvert?: boolean; quality?: number; backgroundColor?: string } = {}) => {
    const id = ++loadIdRef.current;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(true);
    setDragging(false);

    let header: Uint8Array;
    try {
      header = new Uint8Array(await file.slice(0, 512).arrayBuffer());
    } catch {
      failLoad(id, 'This file could not be read. Try another PNG.');
      return;
    }

    if (id !== loadIdRef.current) return;
    const validation = getPngToJpegSourceValidation({
      fileName: file.name,
      declaredMimeType: file.type,
      header,
      fileSize: file.size,
    });
    if (!validation.valid) {
      failLoad(id, validation.error);
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
      const nextSource = { file: new File([file], file.name, { type: 'image/png', lastModified: file.lastModified }), url, width: image.naturalWidth, height: image.naturalHeight };
      setSource(nextSource);
      setLoading(false);
      setError('');
      if (options.autoConvert) void convert(nextSource, options.quality ?? quality, options.backgroundColor ?? backgroundColor, { ignoreBusy: true });
    };
    image.onerror = () => failLoad(id, 'This PNG could not be decoded in the browser.');
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
      await loadFile(new File([blob], SAMPLE_NAME, { type: blob.type || 'image/png' }), { autoConvert: true, quality: DEFAULT_QUALITY, backgroundColor: '#ffffff' });
    } catch {
      if (id !== loadIdRef.current) return;
      setLoading(false);
      setError('The example PNG could not be loaded. Try again or upload your own PNG.');
    }
  };

  const convert = async (
    activeSource = source,
    activeQuality = quality,
    activeBackground = backgroundColor,
    options: { ignoreBusy?: boolean } = {},
  ) => {
    if (!activeSource || loading || (!options.ignoreBusy && converting)) return;
    clearResult();
    const id = ++convertIdRef.current;
    const sourceLoadId = loadIdRef.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Could not create the export canvas in this browser.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not start the JPEG export in this browser.');
      return;
    }

    const cancelled = () => id !== convertIdRef.current || sourceLoadId !== loadIdRef.current;
    setConverting(true);
    setError('');

    const image = new Image();
    image.onload = async () => {
      if (cancelled()) return;
      try {
        canvas.width = activeSource.width;
        canvas.height = activeSource.height;
        const nextCtx = canvas.getContext('2d');
        if (!nextCtx) throw new Error('Could not finish the JPEG export in this browser.');
        nextCtx.fillStyle = activeBackground;
        nextCtx.fillRect(0, 0, activeSource.width, activeSource.height);
        nextCtx.drawImage(image, 0, 0);

        const encoded = await encodePngToJpegWithSizeAwareness({
          originalBytes: activeSource.file.size,
          maxQuality: activeQuality,
          encode: (mimeType, encodeQuality) => new Promise((resolve, reject) => {
            try {
              canvas.toBlob(resolve, mimeType, encodeQuality);
            } catch (err) {
              reject(err);
            }
          }),
          isCancelled: cancelled,
        });

        if (encoded.cancelled || cancelled()) return;
        if (encoded.failed || !encoded.blob) {
          setConverting(false);
          setError(encoded.mimeMismatch ? 'Your browser did not return a JPEG file. Try a different browser or another PNG.' : encoded.error || 'This PNG could not be converted. Try a smaller file.');
          return;
        }

        const outputHeader = new Uint8Array(await encoded.blob.slice(0, 16).arrayBuffer());
        if (cancelled()) return;
        if (!verifyOutputSignature(outputHeader, 'image/jpeg')) {
          setConverting(false);
          setError('The browser export did not produce valid JPEG bytes. No download was created.');
          return;
        }

        const resultUrl = URL.createObjectURL(encoded.blob);
        if (cancelled()) {
          URL.revokeObjectURL(resultUrl);
          return;
        }
        revokeResult();
        resultUrlRef.current = resultUrl;
        setResult({
          blob: encoded.blob,
          url: resultUrl,
          fileName: `${safeImageBaseName(activeSource.file.name)}.jpg`,
          width: activeSource.width,
          height: activeSource.height,
          quality: encoded.actualQuality ?? activeQuality,
          autoReduced: encoded.qualityAutoReduced,
          couldMakeSmaller: encoded.couldMakeSmaller,
        });
        setConverting(false);
      } catch (err) {
        if (cancelled()) return;
        setConverting(false);
        setError(err instanceof Error && err.message ? err.message : 'This PNG could not be converted.');
      }
    };
    image.onerror = () => {
      if (cancelled()) return;
      setConverting(false);
      setError('This PNG could not be decoded for export.');
    };
    image.src = activeSource.url;
  };

  const download = () => {
    if (!result) return;
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
  const canClear = Boolean(source || result || error || loading || converting);
  const sourceMeta = source ? `${formatImageBytes(source.file.size)} · ${source.width} x ${source.height} px` : '';
  const resultSummary = result && source ? getSizeChangeLabel(source.file.size, result.blob.size) : '';
  const statusText = loading ? 'Checking PNG...' : converting ? 'Converting PNG to JPEG...' : '';

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PNG image</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={canClear} exampleDisabled={loading || converting} />
      </div>

      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFile} hidden aria-label="Select PNG image" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${source ? `tb-image-upload-compact ${styles.uploadCompact}` : ''} ${dragging ? 'dragging' : ''}`}
          onClick={openFilePicker}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}
          aria-label={source ? 'Replace PNG image. Click or drop a PNG' : 'Choose PNG image or drag and drop'}
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
                <span className={`tb-v2-dropzone-hint ${styles.replaceHint}`}>Drop another PNG to replace.</span>
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
                <span className="tb-v2-dropzone-text">{loading ? 'Loading PNG...' : 'Click to upload or drag a PNG here'}</span>
                <span className="tb-v2-dropzone-hint">PNG only. 20 MiB max.</span>
              </span>
            </>
          )}
        </button>

        {statusText && <p className="tb-image-hint" role="status">{statusText}</p>}
        {error && <p className="tb-image-hint" role="alert">{error}</p>}

        {source && (
          <>
            <div className={`tb-v2-card tb-image-settings ${styles.settingsGrid}`}>
              <div className="tb-image-field">
                <label className="tb-image-card-head" htmlFor="png-jpg-quality">
                  <span className="tb-v2-tool-label">Maximum JPEG quality</span>
                  <span className="tb-v2-range-val">{quality}%</span>
                </label>
                <input
                  id="png-jpg-quality"
                  type="range"
                  min="35"
                  max="100"
                  value={quality}
                  onChange={(event) => { setQuality(Number(event.target.value)); clearResult(); setError(''); }}
                  className="tb-image-quality"
                />
                <p className="tb-image-hint">Quality is a maximum. The converter may try lower JPEG quality to find a smaller file.</p>
              </div>

              <div className="tb-image-field">
                <label className="tb-v2-tool-label" htmlFor="png-jpg-bg">Background</label>
                <div className={styles.colorRow}>
                  <input
                    id="png-jpg-bg"
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => { setBackgroundColor(event.target.value); clearResult(); setError(''); }}
                    className={`tb-v2-input ${styles.colorInput}`}
                    aria-label="JPEG background color for transparent pixels"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    readOnly
                    className="tb-v2-input"
                    aria-label="Selected background color hex value"
                  />
                </div>
                <p className="tb-image-hint">Transparent pixels are flattened onto this color. White is the default.</p>
              </div>

              <div className="tb-image-actions">
                <button type="button" onClick={() => void convert()} disabled={loading || converting} className="tb-v2-btn tb-v2-btn-primary">
                  {converting ? 'Converting...' : 'Convert to JPEG'}
                </button>
              </div>
            </div>

            <div className="tb-image-workspace">
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitleGroup}>
                    <span className="tb-v2-tool-label">Original PNG</span>
                    <span className="tb-image-hint">{formatImageBytes(source.file.size)}</span>
                  </span>
                  <button type="button" onClick={openFilePicker} disabled={loading} className={`tb-v2-btn tb-v2-btn-sm ${styles.previewReplaceButton}`} aria-label="Replace original PNG">
                    <Upload size={14} aria-hidden="true" />
                    <span>Replace image</span>
                  </button>
                </figcaption>
                <div className="tb-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt="Original PNG preview" />
                </div>
                <p className="tb-image-hint">{source.width} x {source.height} px</p>
              </figure>

              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className="tb-v2-tool-label">JPEG result</span>
                  {result && <span className="tb-image-hint">{formatImageBytes(result.blob.size)} · JPEG</span>}
                </figcaption>
                <div className="tb-image-preview" aria-busy={converting}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.url} alt="Converted JPEG preview" />
                  ) : <p className="tb-image-hint">{converting ? 'Converting...' : 'Convert to preview the JPEG output.'}</p>}
                </div>
                <p className="tb-image-hint">{result ? `${result.width} x ${result.height} px` : 'Dimensions stay the same as the PNG.'}</p>
              </figure>
            </div>

            {result && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div className={styles.notes}>
                  <strong>{resultSummary}</strong>
                  <p className="tb-image-hint">{formatImageBytes(source.file.size)} original to {formatImageBytes(result.blob.size)} JPEG output.</p>
                  <p className="tb-image-hint">Encoding quality: {result.quality}%{result.autoReduced ? ' after automatic retry' : ''}.</p>
                  {!result.couldMakeSmaller && <p className="tb-image-hint">This JPEG is larger because the original PNG compressed better.</p>}
                  <p className="tb-image-hint">Output verified as JPEG bytes with a .jpg download name.</p>
                </div>
                <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">
                  <Download size={16} aria-hidden="true" />
                  Download JPG
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
