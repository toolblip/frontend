'use client';

import { useCallback, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type WatermarkMode = 'text' | 'image';

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

const isImageFile = (file: File) =>
  file.type === 'image/png' || file.type === 'image/jpeg' || /\.(png|jpe?g)$/i.test(file.name);

const unsupportedTextMessage =
  'Watermark text contains characters unsupported by the built-in WinAnsi font. Use basic Latin text or an image watermark.';

type WatermarkLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

function getRotatedBounds(width: number, height: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const corners = [
    [0, 0],
    [width * cos, width * sin],
    [-height * sin, height * cos],
    [width * cos - height * sin, width * sin + height * cos],
  ];
  const xValues = corners.map(([x]) => x);
  const yValues = corners.map(([, y]) => y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

function fitRotatedWatermark(
  contentWidth: number,
  contentHeight: number,
  pageWidth: number,
  pageHeight: number,
  angle: number,
): WatermarkLayout {
  const bounds = getRotatedBounds(contentWidth, contentHeight, angle);
  const scale = Math.min(1, pageWidth / bounds.width, pageHeight / bounds.height);
  const width = contentWidth * scale;
  const height = contentHeight * scale;
  const fittedBounds = getRotatedBounds(width, height, angle);
  return {
    width,
    height,
    scale,
    x: pageWidth / 2 - (fittedBounds.minX + fittedBounds.maxX) / 2,
    y: pageHeight / 2 - (fittedBounds.minY + fittedBounds.maxY) / 2,
  };
}

export default function AddWatermarkToPDFClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [mode, setMode] = useState<WatermarkMode>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
  const [imageKind, setImageKind] = useState<'png' | 'jpg'>('png');
  const [opacity, setOpacity] = useState(0.35);
  const [rotation, setRotation] = useState(45);
  const [imageScale, setImageScale] = useState(42);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const loadVersionRef = useRef(0);
  const isProcessing = status === 'processing';

  const invalidateResult = () => {
    loadVersionRef.current += 1;
    setResultBlob(null);
    setMessage('');
    setStatus('idle');
  };

  const clearAll = () => {
    loadVersionRef.current += 1;
    setFile(null);
    setFileBytes(null);
    setWatermarkText('CONFIDENTIAL');
    setMode('text');
    setImageFile(null);
    setImageBytes(null);
    setImageKind('png');
    setOpacity(0.35);
    setRotation(45);
    setImageScale(42);
    setStatus('idle');
    setMessage('');
    setResultBlob(null);
    setIsDragging(false);
    if (fileRef.current) fileRef.current.value = '';
    if (imageRef.current) imageRef.current.value = '';
  };

  const loadFile = useCallback(async (selected: File | undefined, requestId?: number) => {
    if (!selected || status === 'processing') return;
    const currentRequestId = requestId ?? ++loadVersionRef.current;
    if (currentRequestId !== loadVersionRef.current) return;
    setFile(null);
    setFileBytes(null);
    setResultBlob(null);
    setMessage('');
    if (!isPdfFile(selected)) {
      setStatus('error');
      setMessage('Please choose a PDF file.');
      return;
    }
    const sizeError = checkFileSize(selected, tier);
    if (sizeError) {
      setStatus('error');
      setMessage(sizeError);
      return;
    }
    setStatus('loading');
    try {
      const bytes = new Uint8Array(await selected.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      if (doc.getPageCount() === 0) throw new Error('The PDF has no pages.');
      if (currentRequestId !== loadVersionRef.current) return;
      setFile(selected);
      setFileBytes(bytes);
      setStatus('idle');
    } catch {
      if (currentRequestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not read this file as a valid PDF.');
      }
    }
  }, [status, tier]);

  const loadExample = useCallback(async () => {
    if (status === 'processing') return;
    const requestId = ++loadVersionRef.current;
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      ['Watermark sample', 'Second sample page'].forEach((title, index) => {
        const page = doc.addPage([500, 320]);
        page.drawRectangle({ x: 0, y: 0, width: 500, height: 320, color: rgb(0.98, 0.98, 1) });
        page.drawText(title, { x: 60, y: 220, size: 26, font, color: rgb(0.1, 0.2, 0.45) });
        page.drawText(`Example page ${index + 1}`, { x: 60, y: 180, size: 16, font });
      });
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      setMode('text');
      setWatermarkText('CONFIDENTIAL');
      await loadFile(new File([bytes as BlobPart], 'watermark-sample.pdf', { type: 'application/pdf' }), requestId);
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not create the sample PDF.');
      }
    }
  }, [loadFile, status]);

  const handleImageFile = async (selected: File | undefined) => {
    if (!selected || status === 'processing') return;
    const requestId = ++loadVersionRef.current;
    setImageFile(null);
    setImageBytes(null);
    setResultBlob(null);
    setMessage('');
    setStatus('loading');
    if (!isImageFile(selected)) {
      setStatus('error');
      setMessage('Watermark images must be PNG or JPG files.');
      return;
    }
    try {
      const bytes = new Uint8Array(await selected.arrayBuffer());
      if (requestId !== loadVersionRef.current) return;
      setImageFile(selected);
      setImageBytes(bytes);
      setImageKind(selected.type === 'image/png' || /\.png$/i.test(selected.name) ? 'png' : 'jpg');
      setStatus('idle');
    } catch {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage('Could not read the watermark image.');
      }
    }
  };

  const process = async () => {
    if (!fileBytes || !file || status === 'processing') return;
    if (mode === 'text' && !watermarkText.trim()) {
      setStatus('error');
      setMessage('Enter watermark text first.');
      return;
    }
    if (mode === 'image' && !imageBytes) {
      setStatus('error');
      setMessage('Choose a PNG or JPG watermark image first.');
      return;
    }
    const requestId = ++loadVersionRef.current;
    setStatus('processing');
    setMessage('');
    try {
      const doc = await PDFDocument.load(fileBytes);
      const safeOpacity = Math.max(0.05, Math.min(1, opacity));
      const safeRotation = Math.max(-180, Math.min(180, rotation));
      if (mode === 'text') {
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const text = watermarkText.trim();
        try {
          font.encodeText(text);
        } catch {
          throw new Error(unsupportedTextMessage);
        }
        for (const page of doc.getPages()) {
          const { width, height } = page.getSize();
          const maxTextWidth = Math.min(width, height) * 0.72;
          const fontSize = Math.max(1, Math.min(
            120,
            Math.min(width, height) / 7,
            maxTextWidth / Math.max(1, font.widthOfTextAtSize(text, 1)),
          ));
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const layout = fitRotatedWatermark(textWidth, fontSize, width, height, safeRotation);
          const fittedFontSize = fontSize * layout.scale;
          const fittedTextWidth = font.widthOfTextAtSize(text, fittedFontSize);
          const fittedLayout = fitRotatedWatermark(fittedTextWidth, fittedFontSize, width, height, safeRotation);
          page.drawText(text, {
            x: fittedLayout.x,
            y: fittedLayout.y,
            size: fittedFontSize,
            font,
            color: rgb(0.55, 0.55, 0.55),
            opacity: safeOpacity,
            rotate: degrees(safeRotation),
          });
        }
      } else if (imageBytes) {
        const image = imageKind === 'png' ? await doc.embedPng(imageBytes) : await doc.embedJpg(imageBytes);
        for (const page of doc.getPages()) {
          const { width, height } = page.getSize();
          const drawWidth = Math.min(width * 0.8, width * (Math.max(10, Math.min(80, imageScale)) / 100));
          const drawHeight = drawWidth * (image.height / image.width);
          const boundedHeight = Math.min(drawHeight, height * 0.8);
          const boundedWidth = boundedHeight < drawHeight ? boundedHeight * (image.width / image.height) : drawWidth;
          const layout = fitRotatedWatermark(boundedWidth, boundedHeight, width, height, safeRotation);
          page.drawImage(image, {
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height,
            opacity: safeOpacity,
            rotate: degrees(safeRotation),
          });
        }
      }
      const bytes = await doc.save();
      if (requestId !== loadVersionRef.current) return;
      setResultBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      setStatus('done');
      setMessage(`Watermark added to all ${doc.getPageCount()} pages.`);
    } catch (caught) {
      if (requestId === loadVersionRef.current) {
        setStatus('error');
        setMessage(caught instanceof Error && caught.message === unsupportedTextMessage
          ? unsupportedTextMessage
          : 'Could not add the watermark.');
      }
    }
  };

  const downloadResult = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `watermarked-${file.name}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={() => void loadExample()}
          onClear={clearAll}
          canClear={Boolean(file || imageFile || resultBlob || message)}
          exampleDisabled={status === 'processing'}
          exampleCount={1}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className="tb-v2-dropzone"
          onDragOver={(event) => { if (!isProcessing) { event.preventDefault(); setIsDragging(true); } }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            if (isProcessing) return;
            setIsDragging(false);
            void loadFile(event.dataTransfer.files?.[0]);
          }}
          onClick={() => { if (!isProcessing) fileRef.current?.click(); }}
          aria-disabled={isProcessing}
          style={isDragging ? { borderColor: 'var(--accent)' } : undefined}
        >
          <span style={{ fontSize: 28 }}>PDF</span>
          <span className="tb-v2-dropzone-text">{file?.name || 'Click or drag a PDF to watermark'}</span>
          <span className="tb-v2-dropzone-hint">Add a text or image watermark to every page locally</span>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => void loadFile(event.target.files?.[0])}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
        </div>
        {status === 'loading' && <p className="tb-v2-empty">Reading PDF...</p>}
        {status === 'error' && <div className="tb-v2-banner tb-v2-banner-err" role="alert">{message}</div>}
      </div>

      {file && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{file.name}</span>
          </div>
          <div className="tb-v2-option-group" style={{ marginTop: 14 }}>
            <span className="tb-v2-tool-label">Watermark type</span>
            <div className="tb-v2-mode-tabs" style={{ marginTop: 8 }}>
              <button type="button" onClick={() => { if (!isProcessing) { invalidateResult(); setMode('text'); } }} disabled={isProcessing} className={`tb-v2-mode-tab ${mode === 'text' ? 'on' : ''}`}>Text</button>
              <button type="button" onClick={() => { if (!isProcessing) { invalidateResult(); setMode('image'); } }} disabled={isProcessing} className={`tb-v2-mode-tab ${mode === 'image' ? 'on' : ''}`}>Image</button>
            </div>
          </div>
          {mode === 'text' ? (
            <label className="tb-v2-tool-label" style={{ display: 'block', marginTop: 14 }}>
              Watermark text
              <input type="text" value={watermarkText} maxLength={120} disabled={isProcessing} onChange={(event) => { if (!isProcessing) { invalidateResult(); setWatermarkText(event.target.value); } }} className="tb-v2-input" style={{ marginTop: 8 }} placeholder="CONFIDENTIAL" />
            </label>
          ) : (
            <div style={{ marginTop: 14 }}>
              <span className="tb-v2-tool-label">Watermark image</span>
              <button type="button" onClick={() => { if (!isProcessing) imageRef.current?.click(); }} disabled={isProcessing} className="tb-v2-btn-sm" style={{ display: 'block', marginTop: 8 }}>{imageFile?.name || 'Choose PNG or JPG'}</button>
              <input ref={imageRef} type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" onChange={(event) => void handleImageFile(event.target.files?.[0])} disabled={isProcessing} style={{ display: 'none' }} />
            </div>
          )}
          <div className="tb-v2-grid-2" style={{ marginTop: 14 }}>
            <label className="tb-v2-tool-label">Opacity
              <input type="number" min={0.05} max={1} step={0.05} value={opacity} disabled={isProcessing} onChange={(event) => { if (!isProcessing) { invalidateResult(); setOpacity(Math.max(0.05, Math.min(1, Number(event.target.value) || 0.35))); } }} className="tb-v2-input" style={{ marginTop: 8 }} />
            </label>
            <label className="tb-v2-tool-label">Rotation (degrees)
              <input type="number" min={-180} max={180} value={rotation} disabled={isProcessing} onChange={(event) => { if (!isProcessing) { invalidateResult(); setRotation(Math.max(-180, Math.min(180, Number(event.target.value) || 0))); } }} className="tb-v2-input" style={{ marginTop: 8 }} />
            </label>
          </div>
          {mode === 'image' && (
            <label className="tb-v2-tool-label" style={{ display: 'block', marginTop: 14 }}>Image width (% of page)
              <input type="number" min={10} max={80} value={imageScale} disabled={isProcessing} onChange={(event) => { if (!isProcessing) { invalidateResult(); setImageScale(Math.max(10, Math.min(80, Number(event.target.value) || 42))); } }} className="tb-v2-input" style={{ marginTop: 8 }} />
            </label>
          )}
          <button type="button" onClick={() => void process()} disabled={status === 'processing'} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ width: '100%', marginTop: 16 }}>
            {status === 'processing' ? 'Processing...' : 'Add Watermark'}
          </button>
          {status === 'done' && resultBlob && (
            <div className="tb-v2-banner" style={{ marginTop: 12 }}>
              {message} <button type="button" onClick={downloadResult} className="tb-v2-btn-sm" style={{ marginLeft: 8 }}>Download PDF</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
