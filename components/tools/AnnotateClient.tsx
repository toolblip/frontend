'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Annotation {
  id: string;
  type: 'rectangle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
}

export default function AnnotateClient() {
  const [image, setImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [tool, setTool] = useState<'select' | 'rectangle' | 'text'>('select');
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempRect, setTempRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [textDraft, setTextDraft] = useState<{ x: number; y: number; left: number; top: number; value: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'];

  const loadImage = (imgSrc: string) => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImage(imgSrc);
    };
    img.src = imgSrc;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(URL.createObjectURL(file));
      setAnnotations([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(URL.createObjectURL(file));
      setAnnotations([]);
    }
  };

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    if (!canvas || !ctx || !img) return;

    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    
    // Draw annotations
    for (const ann of annotations) {
      ctx.strokeStyle = ann.color;
      ctx.fillStyle = ann.color;
      ctx.lineWidth = 3;
      if (ann.type === 'rectangle' && ann.width && ann.height) {
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
      } else if (ann.type === 'text' && ann.text) {
        ctx.font = 'bold 24px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(ann.text, ann.x, ann.y);
      }
    }
    
    // Draw temp rect
    if (tempRect) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(tempRect.x, tempRect.y, tempRect.w, tempRect.h);
      ctx.setLineDash([]);
    }
  }, [annotations, tempRect, currentColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'select') return;
    const pos = getCanvasCoords(e);

    if (tool === 'text') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setTextDraft({ x: pos.x, y: pos.y, left: e.clientX - rect.left, top: e.clientY - rect.top, value: '' });
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);

    if (tool === 'rectangle') {
      setTempRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
  };

  const commitTextDraft = () => {
    if (textDraft && textDraft.value.trim()) {
      setAnnotations(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        type: 'text',
        x: textDraft.x,
        y: textDraft.y,
        text: textDraft.value.trim(),
        color: currentColor,
      }]);
    }
    setTextDraft(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool !== 'rectangle') return;
    const pos = getCanvasCoords(e);
    setTempRect({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      w: Math.abs(pos.x - startPos.x),
      h: Math.abs(pos.y - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (tool === 'rectangle' && tempRect && tempRect.w > 5 && tempRect.h > 5) {
      setAnnotations([...annotations, {
        id: Math.random().toString(36).substring(2, 9),
        type: 'rectangle',
        x: tempRect.x,
        y: tempRect.y,
        width: tempRect.w,
        height: tempRect.h,
        color: currentColor,
      }]);
    }
    setTempRect(null);
  };

  const undo = () => {
    setAnnotations(annotations.slice(0, -1));
  };

  const clearAll = () => {
    setAnnotations([]);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="tb-v2-btn-sm">
          Upload Image
        </button>
        
        <div className="tb-v2-mode-tabs">
          <button
            type="button"
            onClick={() => setTool('select')}
            className={`tb-v2-mode-tab ${tool === 'select' ? 'on' : ''}`}
          >
            Select
          </button>
          <button
            type="button"
            onClick={() => setTool('rectangle')}
            className={`tb-v2-mode-tab ${tool === 'rectangle' ? 'on' : ''}`}
          >
            Rectangle
          </button>
          <button
            type="button"
            onClick={() => setTool('text')}
            className={`tb-v2-mode-tab ${tool === 'text' ? 'on' : ''}`}
          >
            Text
          </button>
        </div>

        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrentColor(c)}
              className={`w-6 h-6 rounded border-2 ${currentColor === c ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={undo} className="tb-v2-btn-sm" disabled={annotations.length === 0}>
          Undo
        </button>
        <button type="button" onClick={clearAll} className="tb-v2-btn-sm" disabled={annotations.length === 0}>
          Clear All
        </button>
        <button type="button" onClick={exportImage} className="tb-v2-btn flex-1" disabled={!image}>
          Export PNG
        </button>
      </div>

      <div
        className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <canvas
          ref={canvasRef}
          className={`w-full ${image ? '' : 'hidden'} ${tool === 'text' ? 'cursor-text' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {textDraft && (
          <input
            ref={textInputRef}
            type="text"
            autoFocus
            value={textDraft.value}
            onChange={(e) => setTextDraft({ ...textDraft, value: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') commitTextDraft(); if (e.key === 'Escape') setTextDraft(null); }}
            onBlur={commitTextDraft}
            placeholder="Type text, Enter to place"
            className="absolute z-10 px-2 py-1 text-sm rounded border shadow-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            style={{ left: textDraft.left, top: textDraft.top, color: currentColor }}
          />
        )}
        {!image && (
          <div
            className={`tb-v2-dropzone ${isDragOver ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="tb-v2-dropzone-text">Drop an image here or click to upload</p>
            <p className="tb-v2-dropzone-hint">PNG, JPG, WebP</p>
          </div>
        )}
      </div>

      {annotations.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {annotations.length} annotation(s) • Click canvas to draw
        </p>
      )}
    </div>
  );
}
