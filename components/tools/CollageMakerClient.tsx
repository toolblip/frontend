'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, ImagePlus, Trash2, Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import {
  COLLAGE_LAYOUTS,
  MAX_COLLAGE_IMAGES,
  calculateCollageLayout,
  getImageLayoutCapacityError,
  getImageLayoutOutputError,
  type CollageLayoutType,
} from '@/lib/image-layout';
import {
  canvasToVerifiedPngResult,
  getImageLayoutItemMeta,
  useImageLayoutImages,
} from '@/components/tools/useImageLayoutImages';
import styles from './ImageLayoutTool.module.css';

const COLLAGE_SAMPLE_URLS = [
  '/samples/image-resizer-mountain.jpg',
  '/samples/tool-sample.png',
  '/samples/png-to-jpg-photo.png',
  '/samples/exif-remover-example.jpg',
];

function createCancelledOperationError() {
  return new DOMException('The operation was cancelled.', 'AbortError');
}

function isAbortError(err: unknown) {
  return err instanceof DOMException && err.name === 'AbortError';
}

async function fetchSampleFiles(signal: AbortSignal) {
  return Promise.all(COLLAGE_SAMPLE_URLS.map(async (url) => {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Sample image request failed.');
    const blob = await response.blob();
    const name = url.split('/').pop() || 'sample-image.png';
    return new File([blob], name, { type: blob.type || 'image/png' });
  }));
}

export default function CollageMakerClient() {
  const [layout, setLayout] = useState<CollageLayoutType>('2x2');
  const [spacing, setSpacing] = useState(10);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dragActive, setDragActive] = useState(false);
  const [exampleLoading, setExampleLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const exampleControllerRef = useRef<AbortController | null>(null);
  const exampleGenerationRef = useRef(0);
  const {
    items,
    errors,
    loading,
    result,
    addFiles,
    replaceFile,
    removeItem,
    moveItem,
    clearAll,
    clearResult,
    cancelInputWork,
    beginOutputAttempt,
    isCurrentAttempt,
    setOutput,
    setErrors,
    sourceLimitText,
    boundsText,
  } = useImageLayoutImages(MAX_COLLAGE_IMAGES, () => setExporting(false));

  const collagePlan = useMemo(() => calculateCollageLayout(items, layout, spacing), [items, layout, spacing]);
  const capacityError = getImageLayoutCapacityError(items.length, layout);
  const outputError = getImageLayoutOutputError(collagePlan.width, collagePlan.height);
  const actionError = capacityError || outputError;
  const canCreate = items.length > 0 && !actionError && !loading && !exporting;
  const canClear = items.length > 0 || errors.length > 0 || Boolean(result) || loading || exampleLoading || exporting;

  const cancelExampleLoad = () => {
    exampleGenerationRef.current += 1;
    exampleControllerRef.current?.abort();
    exampleControllerRef.current = null;
    setExampleLoading(false);
  };

  const isCurrentExampleLoad = (generation: number, controller: AbortController) => (
    generation === exampleGenerationRef.current && exampleControllerRef.current === controller && !controller.signal.aborted
  );

  const handleFiles = (files: FileList | File[]) => {
    cancelExampleLoad();
    void addFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadExample = async () => {
    cancelExampleLoad();
    const controller = new AbortController();
    const generation = exampleGenerationRef.current;
    exampleControllerRef.current = controller;
    setExampleLoading(true);
    setErrors([]);
    clearResult();
    try {
      const files = await fetchSampleFiles(controller.signal);
      if (!isCurrentExampleLoad(generation, controller)) return;
      setLayout('2x2');
      setSpacing(10);
      setBgColor('#ffffff');
      await addFiles(files, { replaceAll: true });
    } catch (err) {
      if (!isCurrentExampleLoad(generation, controller) || isAbortError(err)) return;
      setErrors(['The sample images could not be loaded. Try Example again or upload your own images.']);
    } finally {
      if (isCurrentExampleLoad(generation, controller)) {
        exampleControllerRef.current = null;
        setExampleLoading(false);
      }
    }
  };

  const clear = () => {
    cancelExampleLoad();
    cancelInputWork();
    setLayout('2x2');
    setSpacing(10);
    setBgColor('#ffffff');
    setDragActive(false);
    setExampleLoading(false);
    setExporting(false);
    clearAll();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => () => {
    cancelExampleLoad();
  }, []);

  const createCollage = async () => {
    if (!canCreate) return;
    const attemptId = beginOutputAttempt();
    const snapshotItems = [...items];
    const snapshotPlan = collagePlan;
    const snapshotLayout = layout;
    const snapshotBgColor = bgColor;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      setErrors(['Could not start the collage export in this browser. Try again or reload the page.']);
      return;
    }
    setExporting(true);
    setErrors([]);
    try {
      canvas.width = snapshotPlan.width;
      canvas.height = snapshotPlan.height;
      context.fillStyle = snapshotBgColor;
      context.fillRect(0, 0, snapshotPlan.width, snapshotPlan.height);
      await Promise.all(snapshotItems.map((item, index) => new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          if (!isCurrentAttempt(attemptId)) {
            reject(createCancelledOperationError());
            return;
          }
          try {
            const placement = snapshotPlan.placements[index];
            context.drawImage(image, placement.x, placement.y, placement.width, placement.height);
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        image.onerror = () => reject(new Error(`${item.name}: The source image could not be decoded for export.`));
        image.src = item.url;
      })));
      if (!isCurrentAttempt(attemptId)) return;
      const output = await canvasToVerifiedPngResult(canvas, `collage-${snapshotLayout}-${snapshotPlan.width}x${snapshotPlan.height}.png`);
      if (!isCurrentAttempt(attemptId)) {
        URL.revokeObjectURL(output.url);
        return;
      }
      setOutput(output);
    } catch (err) {
      if (!isCurrentAttempt(attemptId)) return;
      setErrors([err instanceof Error ? err.message : 'The collage could not be exported. Try again with fewer or smaller images.']);
    } finally {
      if (isCurrentAttempt(attemptId)) setExporting(false);
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Collage maker</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={canClear} exampleDisabled={loading || exporting || exampleLoading} exampleCount={4} />
      </div>

      <div className={`tb-v2-tool-output-body ${styles.toolBody}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => { if (event.target.files) handleFiles(event.target.files); }}
          hidden
          aria-label="Add images to collage"
        />
        <button
          type="button"
          className={`tb-v2-dropzone ${items.length > 0 ? styles.dropzoneLoaded : ''} ${dragActive ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <Upload size={28} aria-hidden="true" />
          <span className="tb-v2-dropzone-text">Add images</span>
          <span className="tb-v2-dropzone-hint">PNG, JPEG, WebP, GIF, or SVG. Up to 9 images. {sourceLimitText}</span>
        </button>

        {errors.map((error) => <div key={error} className="tb-v2-banner tb-v2-banner-err" role="alert">{error}</div>)}
        {loading && <div className="tb-v2-banner tb-v2-banner-info" role="status">Loading images...</div>}

        <div className="tb-v2-mode-tabs" role="group" aria-label="Collage layout">
          {(Object.keys(COLLAGE_LAYOUTS) as CollageLayoutType[]).map((nextLayout) => (
            <button
              key={nextLayout}
              type="button"
              onClick={() => { clearResult(); setLayout(nextLayout); }}
              className={`tb-v2-mode-tab ${layout === nextLayout ? 'on' : ''}`}
              aria-pressed={layout === nextLayout}
            >
              {nextLayout}
            </button>
          ))}
        </div>

        <div className={styles.controlGrid}>
          <label className={`tb-v2-tool-label ${styles.controlLabel}`} htmlFor="collage-spacing">Spacing: {spacing}px
            <input
              id="collage-spacing"
              type="range"
              min="0"
              max="30"
              value={spacing}
              onChange={(event) => { clearResult(); setSpacing(Number(event.target.value)); }}
              className="tb-v2-range"
            />
          </label>
          <label className={`tb-v2-tool-label ${styles.controlLabel}`} htmlFor="collage-bg">Background
            <input
              id="collage-bg"
              type="color"
              value={bgColor}
              onChange={(event) => { clearResult(); setBgColor(event.target.value); }}
              className={styles.colorInput}
            />
          </label>
        </div>

        <div className={styles.statsGrid}>
          <div className={`tb-v2-stat-pill ${styles.statPill}`}><span className={`tb-v2-stat-pill-val ${styles.statValue}`}>{items.length} / {collagePlan.capacity}</span><span className={`tb-v2-stat-pill-lbl ${styles.statLabel}`}>Slots filled</span></div>
          <div className={`tb-v2-stat-pill ${styles.statPill}`}><span className={`tb-v2-stat-pill-val ${styles.statValue}`}>{collagePlan.width} x {collagePlan.height}</span><span className={`tb-v2-stat-pill-lbl ${styles.statLabel}`}>PNG output</span></div>
          <div className={`tb-v2-stat-pill ${styles.statPill}`}><span className={`tb-v2-stat-pill-val ${styles.statValue}`}>300 x 300</span><span className={`tb-v2-stat-pill-lbl ${styles.statLabel}`}>Cell size</span></div>
        </div>
        <p className="tb-v2-dropzone-hint">{boundsText} Missing slots stay as background. Images are centered and contained without cropping.</p>

        {items.length > 0 ? (
          <div className={styles.sourceSection}>
            <div className={styles.sourceGrid}>
              {items.map((item, index) => (
                <div key={item.id} className={styles.sourceCard}>
                  <div className={styles.sourceMain}>
                    <div className={styles.sourceThumb}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={`Collage image ${index + 1} preview`} />
                    </div>
                    <div className={styles.sourceText}>
                      <div className={styles.sourceName} title={item.name}>{item.name}</div>
                      <div className={styles.sourceMeta}>{getImageLayoutItemMeta(item)}</div>
                      {item.notes.map((note) => <div className={styles.sourceMeta} key={note}>{note}</div>)}
                    </div>
                  </div>
                  <input
                    ref={(node) => { replaceInputRefs.current[item.id] = node; }}
                    type="file"
                    accept="image/*"
                    hidden
                    aria-label={`Choose replacement for image ${index + 1}`}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      cancelExampleLoad();
                      void replaceFile(item.id, file);
                      event.target.value = '';
                    }}
                  />
                  <div className={styles.sourceActions}>
                    <button type="button" className={`tb-v2-btn ${styles.iconButton}`} onClick={() => moveItem(item.id, -1)} disabled={index === 0} aria-label={`Move image ${index + 1} earlier`}><ChevronLeft size={16} aria-hidden="true" /></button>
                    <button type="button" className={`tb-v2-btn ${styles.iconButton}`} onClick={() => moveItem(item.id, 1)} disabled={index === items.length - 1} aria-label={`Move image ${index + 1} later`}><ChevronRight size={16} aria-hidden="true" /></button>
                    <button type="button" className={`tb-v2-btn ${styles.actionButton}`} onClick={() => replaceInputRefs.current[item.id]?.click()} aria-label={`Replace image ${index + 1}`}><ImagePlus size={16} aria-hidden="true" /> Replace</button>
                    <button type="button" className={`tb-v2-btn ${styles.actionButton}`} onClick={() => { cancelExampleLoad(); removeItem(item.id); }} aria-label={`Remove image ${index + 1}`}><Trash2 size={16} aria-hidden="true" /> Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {actionError && <div className="tb-v2-banner tb-v2-banner-warn" role="alert">{actionError}</div>}
            <button type="button" onClick={() => void createCollage()} disabled={!canCreate} className="tb-v2-btn tb-v2-btn-primary" aria-busy={exporting}>
              {exporting ? 'Creating...' : 'Create collage'}
            </button>
          </div>
        ) : (
          <p className="tb-v2-empty">Add images to create a PNG collage. Empty slots are allowed.</p>
        )}

        {result && (
          <div aria-live="polite" className={styles.resultSection}>
            <div className={styles.resultHead}>
              <span className="tb-v2-tool-label">Collage PNG</span>
              <span className={`tb-v2-dropzone-hint ${styles.resultMeta}`}>{result.width} x {result.height} px | {result.blob.type || 'image/png'} | {result.blob.size.toLocaleString()} bytes</span>
            </div>
            <div className={styles.resultFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Collage preview" className={styles.resultImage} />
            </div>
            <a href={result.url} download={result.filename} className={`tb-v2-btn tb-v2-btn-primary ${styles.resultDownload}`}>
              <Download size={16} aria-hidden="true" /> Download PNG
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
