'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, GripVertical, ImagePlus, RotateCw, Trash2, Upload } from 'lucide-react';
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
  canvasToVerifiedImageResult,
  getImageLayoutOutputMimeType,
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
  const [exportError, setExportError] = useState('');
  const [retryPreview, setRetryPreview] = useState(0);
  const [draggedId, setDraggedId] = useState('');
  const [dropTargetId, setDropTargetId] = useState('');
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('before');
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
    moveItemTo,
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
  const canClear = items.length > 0 || errors.length > 0 || Boolean(result) || loading || exampleLoading || exporting;
  const canPreview = items.length > 0 && !actionError && !loading;
  const outputActionsRef = useRef({ beginOutputAttempt, isCurrentAttempt, setOutput, clearResult });
  outputActionsRef.current = { beginOutputAttempt, isCurrentAttempt, setOutput, clearResult };

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
    setExportError('');
    void addFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadExample = async () => {
    cancelExampleLoad();
    setExportError('');
    const controller = new AbortController();
    const generation = exampleGenerationRef.current;
    exampleControllerRef.current = controller;
    setExampleLoading(true);
    clearResult();
    setErrors([]);
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
    setExportError('');
    setDraggedId('');
    setDropTargetId('');
    setDropPosition('before');
    clearAll();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => () => {
    cancelExampleLoad();
  }, []);

  useEffect(() => {
    if (!canPreview || exampleLoading) {
      setExporting(false);
      return;
    }

    const actions = outputActionsRef.current;
    const attemptId = actions.beginOutputAttempt();
    setExportError('');
    setExporting(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not start the collage preview in this browser. Try again.');
        canvas.width = collagePlan.width;
        canvas.height = collagePlan.height;
        context.fillStyle = bgColor;
        context.fillRect(0, 0, collagePlan.width, collagePlan.height);
        await Promise.all(items.map((item, index) => new Promise<void>((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            if (!outputActionsRef.current.isCurrentAttempt(attemptId)) {
              reject(new DOMException('The preview was superseded.', 'AbortError'));
              return;
            }
            try {
              const placement = collagePlan.placements[index];
              context.drawImage(image, placement.x, placement.y, placement.width, placement.height);
              resolve();
            } catch (err) { reject(err); }
          };
          image.onerror = () => reject(new Error(`${item.name}: The source image could not be decoded for preview.`));
          image.src = item.url;
        })));
        if (!outputActionsRef.current.isCurrentAttempt(attemptId)) return;
        const mimeType = getImageLayoutOutputMimeType(items.map((item) => item.mimeType));
        const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png';
        const output = await canvasToVerifiedImageResult(
          canvas,
          `collage-${layout}-${collagePlan.width}x${collagePlan.height}.${extension}`,
          mimeType,
        );
        if (!outputActionsRef.current.isCurrentAttempt(attemptId)) {
          URL.revokeObjectURL(output.url);
          return;
        }
        outputActionsRef.current.setOutput(output);
      })().catch((err: unknown) => {
        if (isAbortError(err) || !outputActionsRef.current.isCurrentAttempt(attemptId)) return;
        setExportError(err instanceof Error ? err.message : 'The collage preview could not be exported. Try again.');
      }).finally(() => {
        if (outputActionsRef.current.isCurrentAttempt(attemptId)) setExporting(false);
      });
    }, 175);

    return () => {
      window.clearTimeout(timer);
      if (outputActionsRef.current.isCurrentAttempt(attemptId)) outputActionsRef.current.clearResult();
    };
  }, [canPreview, exampleLoading, items, collagePlan, layout, bgColor, retryPreview]);

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
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes('application/x-image-layout-item')) return;
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            if (event.dataTransfer.types.includes('application/x-image-layout-item')) {
              event.preventDefault();
              setDragActive(false);
              return;
            }
            event.preventDefault();
            setDragActive(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <Upload size={28} aria-hidden="true" />
          <span className="tb-v2-dropzone-text">Add images</span>
          <span className="tb-v2-dropzone-hint">Add up to 9 images</span>
        </button>

        {errors.map((error) => <div key={error} className="tb-v2-banner tb-v2-banner-err" role="alert">{error}</div>)}
        {loading && <div className="tb-v2-banner tb-v2-banner-info" role="status">Loading images...</div>}

        <div className="tb-v2-mode-tabs" role="group" aria-label="Collage layout">
          {(Object.keys(COLLAGE_LAYOUTS) as CollageLayoutType[]).map((nextLayout) => (
            <button
              key={nextLayout}
              type="button"
              onClick={() => { if (layout === nextLayout) return; setExportError(''); clearResult(); setLayout(nextLayout); }}
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
              onChange={(event) => { const nextSpacing = Number(event.target.value); if (spacing === nextSpacing) return; setExportError(''); clearResult(); setSpacing(nextSpacing); }}
              className="tb-v2-range"
            />
          </label>
          <label className={`tb-v2-tool-label ${styles.controlLabel}`} htmlFor="collage-bg">Background
            <input
              id="collage-bg"
              type="color"
              value={bgColor}
              onChange={(event) => { const nextColor = event.target.value; if (bgColor === nextColor) return; setExportError(''); clearResult(); setBgColor(nextColor); }}
              className={styles.colorInput}
            />
          </label>
        </div>

        {items.length > 0 && <p className="tb-v2-dropzone-hint">Drag images to change their order.</p>}
        <div className={styles.statsGrid}>
          <div className={`tb-v2-stat-pill ${styles.statPill}`}><span className={`tb-v2-stat-pill-val ${styles.statValue}`}>{items.length} / {collagePlan.capacity}</span><span className={`tb-v2-stat-pill-lbl ${styles.statLabel}`}>Images</span></div>
          <div className={`tb-v2-stat-pill ${styles.statPill}`}><span className={`tb-v2-stat-pill-val ${styles.statValue}`}>300 px</span><span className={`tb-v2-stat-pill-lbl ${styles.statLabel}`}>Cell size</span></div>
        </div>
        <details className={styles.advancedHelp}>
          <summary>Image limits and layout details</summary>
          <p>{sourceLimitText} {boundsText} Empty slots use the background. Images fit inside each cell.</p>
        </details>

        {result && (
          <div aria-live="polite" className={styles.resultSection}>
            <div className={styles.resultHead}>
              <span className="tb-v2-tool-label">Live preview</span>
              <span className={`tb-v2-dropzone-hint ${styles.resultMeta}`}>{result.width} x {result.height} px · {result.blob.type === 'image/jpeg' ? 'JPEG' : 'PNG'} · {result.blob.size.toLocaleString()} bytes</span>
            </div>
            <div className={styles.resultFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Collage preview" className={styles.resultImage} />
            </div>
            <a href={result.url} download={result.filename} className={`tb-v2-btn tb-v2-btn-primary ${styles.resultDownload}`}>
              <Download size={16} aria-hidden="true" /> Download {result.blob.type === 'image/jpeg' ? 'JPEG' : 'PNG'}
            </a>
          </div>
        )}
        {items.length > 0 && exporting && <div className="tb-v2-banner tb-v2-banner-info" role="status">Updating preview…</div>}
        {exportError && <div className="tb-v2-banner tb-v2-banner-err" role="alert">{exportError}</div>}
        {exportError && canPreview && <button type="button" className="tb-v2-btn" onClick={() => { setExportError(''); clearResult(); setRetryPreview((value) => value + 1); }}><RotateCw size={16} aria-hidden="true" /> Retry preview</button>}

        {items.length > 0 ? (
          <div className={styles.sourceSection}>
            <div className={styles.sourceGrid}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`${styles.sourceCard} ${draggedId === item.id ? styles.draggingCard : ''} ${dropTargetId === item.id ? styles.dropTargetCard : ''} ${dropTargetId === item.id && dropPosition === 'before' ? styles.dropBefore : ''} ${dropTargetId === item.id && dropPosition === 'after' ? styles.dropAfter : ''}`}
                  role="group"
                  aria-label={`Image ${index + 1}: ${item.name}. Drag to reorder.`}
                  title="Drag to reorder"
                  draggable
                  onDragStart={(event) => {
                    event.stopPropagation();
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('application/x-image-layout-item', item.id);
                    setDraggedId(item.id);
                  }}
                  onDragOver={(event) => {
                    if (!event.dataTransfer.types.includes('application/x-image-layout-item')) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setDropTargetId(item.id);
                    const rect = event.currentTarget.getBoundingClientRect();
                    setDropPosition(event.clientX >= rect.left + rect.width / 2 ? 'after' : 'before');
                  }}
                  onDrop={(event) => {
                    if (!event.dataTransfer.types.includes('application/x-image-layout-item')) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const fromId = event.dataTransfer.getData('application/x-image-layout-item');
                    const fromIndex = items.findIndex((source) => source.id === fromId);
                    const targetIndex = items.findIndex((source) => source.id === item.id);
                    const rect = event.currentTarget.getBoundingClientRect();
                    const after = event.clientX >= rect.left + rect.width / 2;
                    const insertionIndex = targetIndex + (after ? 1 : 0);
                    const toIndex = insertionIndex > fromIndex ? insertionIndex - 1 : insertionIndex;
                    if (fromIndex >= 0 && targetIndex >= 0) {
                      setExportError('');
                      moveItemTo(fromId, toIndex);
                    }
                    setDraggedId('');
                    setDropTargetId('');
                    setDropPosition('before');
                  }}
                  onDragEnd={() => { setDraggedId(''); setDropTargetId(''); setDropPosition('before'); }}
                >
                  <div className={styles.sourceMain}>
                    <GripVertical className={styles.dragHandle} size={16} aria-hidden="true" />
                    <div className={styles.sourceThumb}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={`Collage image ${index + 1} preview`} />
                    </div>
                    <div className={styles.sourceText}>
                      <div className={styles.sourceName} title={item.name}>{item.name}</div>
                      <div className={styles.sourceMeta}>{item.width} x {item.height} px</div>
                      <details className={styles.sourceDetails}>
                        <summary>File details</summary>
                        <span>{getImageLayoutItemMeta(item)}</span>
                      {item.notes.map((note) => <div className={styles.sourceMeta} key={note}>{note}</div>)}
                      </details>
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
                      if (file) setExportError('');
                      void replaceFile(item.id, file);
                      event.target.value = '';
                    }}
                  />
                  <div className={styles.sourceActions}>
                    <button type="button" className={`tb-v2-btn ${styles.iconButton}`} onClick={() => { setExportError(''); moveItem(item.id, -1); }} disabled={index === 0} aria-label={`Move ${item.name} earlier`}><ChevronLeft size={16} aria-hidden="true" /></button>
                    <button type="button" className={`tb-v2-btn ${styles.iconButton}`} onClick={() => { setExportError(''); moveItem(item.id, 1); }} disabled={index === items.length - 1} aria-label={`Move ${item.name} later`}><ChevronRight size={16} aria-hidden="true" /></button>
                    <button type="button" className={`tb-v2-btn ${styles.actionButton}`} onClick={() => replaceInputRefs.current[item.id]?.click()} aria-label={`Replace ${item.name}`}><ImagePlus size={16} aria-hidden="true" /> Replace</button>
                    <button type="button" className={`tb-v2-btn ${styles.actionButton}`} onClick={() => { cancelExampleLoad(); setExportError(''); removeItem(item.id); }} aria-label={`Remove ${item.name}`}><Trash2 size={16} aria-hidden="true" /> Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {actionError && <div className="tb-v2-banner tb-v2-banner-warn" role="alert">{actionError}</div>}
          </div>
        ) : (
          <p className="tb-v2-empty">Add images to see your collage.</p>
        )}

      </div>
    </div>
  );
}
