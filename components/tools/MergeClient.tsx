'use client';

import { useState, useRef, useCallback } from 'react';

type MergeType = 'text' | 'image';

export default function MergeClient() {
  const [mergeType, setMergeType] = useState<MergeType>('text');
  const [textFiles, setTextFiles] = useState<string[]>([]);
  const [textContents, setTextContents] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageLayout, setImageLayout] = useState<'horizontal' | 'vertical' | 'grid'>('vertical');
  const [imageSpacing, setImageSpacing] = useState(10);
  const [mergedText, setMergedText] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newContents: string[] = [];
      let processed = 0;

      Array.from(files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newContents[idx] = event.target?.result as string;
          processed++;
          if (processed === files.length) {
            setTextFiles([...textFiles, ...Array.from(files).map(f => f.name)]);
            setTextContents([...textContents, ...newContents]);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const removeTextFile = (index: number) => {
    setTextFiles(textFiles.filter((_, i) => i !== index));
    setTextContents(textContents.filter((_, i) => i !== index));
    setMergedText(null);
  };

  const mergeTextFiles = useCallback(() => {
    if (textContents.length === 0) return;
    
    const separator = '\n\n---\n\n';
    const merged = textContents.join(separator);
    setMergedText(merged);
  }, [textContents]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
            setMergedImage(null);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setMergedImage(null);
  };

  const mergeImages = useCallback(() => {
    if (images.length < 2 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[idx] = img;
        loadedCount++;

        if (loadedCount === images.length) {
          let width = 0;
          let height = 0;
          const gap = imageSpacing;

          if (imageLayout === 'horizontal') {
            width = loadedImages.reduce((sum, img) => sum + img.width, 0) + gap * (loadedImages.length - 1);
            height = Math.max(...loadedImages.map((img) => img.height));
          } else if (imageLayout === 'vertical') {
            width = Math.max(...loadedImages.map((img) => img.width));
            height = loadedImages.reduce((sum, img) => sum + img.height, 0) + gap * (loadedImages.length - 1);
          } else {
            const cols = Math.ceil(Math.sqrt(loadedImages.length));
            const rows = Math.ceil(loadedImages.length / cols);
            const maxWidths: number[] = [];
            const maxHeights: number[] = [];
            for (let r = 0; r < rows; r++) {
              const rowImages = loadedImages.slice(r * cols, r * cols + cols);
              maxWidths.push(Math.max(...rowImages.map((img) => img.width)));
              maxHeights.push(Math.max(...rowImages.map((img) => img.height)));
            }
            width = maxWidths.reduce((sum, w) => sum + w, 0) + gap * (cols - 1);
            height = maxHeights.reduce((sum, h) => sum + h, 0) + gap * (rows - 1);
          }

          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          let offsetX = 0;
          let offsetY = 0;

          if (imageLayout === 'grid') {
            const cols = Math.ceil(Math.sqrt(loadedImages.length));
            const maxWidths: number[] = [];
            const maxHeights: number[] = [];

            for (let r = 0; r < Math.ceil(loadedImages.length / cols); r++) {
              const rowImages = loadedImages.slice(r * cols, r * cols + cols);
              maxWidths.push(Math.max(...rowImages.map((img) => img.width)));
              maxHeights.push(Math.max(...rowImages.map((img) => img.height)));
            }

            let row = 0;
            let col = 0;
            loadedImages.forEach((img) => {
              const maxWidthInRow = maxWidths[row];
              const x = col * (maxWidthInRow + gap);
              ctx.drawImage(img, x, offsetY);
              col++;
              if (col >= cols) {
                col = 0;
                offsetY += maxHeights[row] + gap;
                row++;
              }
            });
          } else if (imageLayout === 'horizontal') {
            loadedImages.forEach((img) => {
              ctx.drawImage(img, offsetX, (height - img.height) / 2);
              offsetX += img.width + gap;
            });
          } else {
            loadedImages.forEach((img) => {
              ctx.drawImage(img, (width - img.width) / 2, offsetY);
              offsetY += img.height + gap;
            });
          }

          setMergedImage(canvas.toDataURL('image/png'));
        }
      };
      img.src = src;
    });
  }, [images, imageLayout, imageSpacing]);

  const downloadMergedText = () => {
    if (!mergedText) return;
    const blob = new Blob([mergedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'merged-text.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadMergedImage = () => {
    if (!mergedImage) return;
    const link = document.createElement('a');
    link.download = 'merged-image.png';
    link.href = mergedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Merge Files</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Merge multiple text files or images into one</p>

      <div className="tb-v2-flex tb-v2-gap-2">
        <button
          onClick={() => { setMergeType('text'); setMergedImage(null); }}
          className={`tb-v2-btn ${mergeType === 'text' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
        >
          Text Files
        </button>
        <button
          onClick={() => { setMergeType('image'); setMergedText(null); }}
          className={`tb-v2-btn ${mergeType === 'image' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
        >
          Images
        </button>
      </div>

      {mergeType === 'text' && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv"
            multiple
            onChange={handleTextFileUpload}
            className="tb-v2-file-input"
          />

          {textFiles.length > 0 && (
            <>
              <div className="tb-v2-flex tb-v2-gap-2 tb-v2-flex-wrap">
                {textFiles.map((file, idx) => (
                  <div key={idx} className="tb-v2-flex tb-v2-items-center tb-v2-gap-2 tb-v2-bg-gray-100 tb-v2-px-3 tb-v2-py-1 tb-v2-rounded">
                    <span className="tb-v2-text-sm">{file}</span>
                    <button onClick={() => removeTextFile(idx)} className="tb-v2-text-red-500 tb-v2-font-bold">×</button>
                  </div>
                ))}
              </div>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">{textFiles.length} files selected</p>

              <button onClick={mergeTextFiles} className="tb-v2-btn tb-v2-btn-primary">
                Merge Text Files
              </button>
            </>
          )}

          {mergedText && (
            <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
              <p className="tb-v2-text-sm tb-v2-font-medium">Merged Result</p>
              <textarea
                readOnly
                value={mergedText}
                className="tb-v2-textarea tb-v2-min-h-[200px] tb-v2-bg-gray-50"
              />
              <button onClick={downloadMergedText} className="tb-v2-btn tb-v2-btn-secondary">
                Download Merged Text
              </button>
            </div>
          )}
        </div>
      )}

      {mergeType === 'image' && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="tb-v2-file-input"
          />

          {images.length > 0 && (
            <>
              <div className="tb-v2-flex tb-v2-gap-2 tb-v2-flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="tb-v2-relative">
                    <img src={img} alt={`Image ${idx + 1}`} className="tb-v2-w-20 tb-v2-h-20 tb-v2-object-cover tb-v2-rounded" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="tb-v2-absolute tb-v2-top-0 tb-v2-right-0 tb-v2-bg-red-500 tb-v2-text-white tb-v2-rounded-full tb-v2-w-5 tb-v2-h-5 tb-v2-flex tb-v2-items-center tb-v2-justify-center tb-v2-text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <p className="tb-v2-text-sm tb-v2-text-gray-500">{images.length} images selected</p>

              <div className="tb-v2-flex tb-v2-gap-2">
                <button
                  onClick={() => setImageLayout('horizontal')}
                  className={`tb-v2-btn ${imageLayout === 'horizontal' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
                >
                  Horizontal
                </button>
                <button
                  onClick={() => setImageLayout('vertical')}
                  className={`tb-v2-btn ${imageLayout === 'vertical' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
                >
                  Vertical
                </button>
                <button
                  onClick={() => setImageLayout('grid')}
                  className={`tb-v2-btn ${imageLayout === 'grid' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
                >
                  Grid
                </button>
              </div>

              <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
                <label className="tb-v2-text-sm tb-v2-font-medium">Spacing: {imageSpacing}px</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={imageSpacing}
                  onChange={(e) => setImageSpacing(Number(e.target.value))}
                  className="tb-v2-range"
                />
              </div>

              <button onClick={mergeImages} className="tb-v2-btn tb-v2-btn-primary">
                Merge Images
              </button>
            </>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {mergedImage && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
          <p className="tb-v2-text-sm tb-v2-font-medium">Merged Result</p>
          <img src={mergedImage} alt="Merged" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={downloadMergedImage} className="tb-v2-btn tb-v2-btn-secondary">
            Download Merged Image
          </button>
        </div>
      )}
    </div>
  );
}
