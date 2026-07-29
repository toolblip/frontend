'use client';

import { useState, useRef, useCallback } from 'react';

export default function GifMakerClient() {
  const [frames, setFrames] = useState<string[]>([]);
  const [delay, setDelay] = useState(500);
  const [loopCount, setLoopCount] = useState(0);
  const [processedGif, setProcessedGif] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFrames: string[] = [];
      let loadedCount = 0;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newFrames.push(event.target?.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setFrames([...frames, ...newFrames]);
            setProcessedGif(null);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFrame = (index: number) => {
    setFrames(frames.filter((_, i) => i !== index));
    setProcessedGif(null);
  };

  const moveFrame = (index: number, direction: 'up' | 'down') => {
    const newFrames = [...frames];
    if (direction === 'up' && index > 0) {
      [newFrames[index - 1], newFrames[index]] = [newFrames[index], newFrames[index - 1]];
    } else if (direction === 'down' && index < frames.length - 1) {
      [newFrames[index], newFrames[index + 1]] = [newFrames[index + 1], newFrames[index]];
    }
    setFrames(newFrames);
    setProcessedGif(null);
  };

  const generateGif = useCallback(() => {
    if (frames.length < 2 || !canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    frames.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[idx] = img;
        loadedCount++;

        if (loadedCount === frames.length) {
          const width = Math.max(...loadedImages.map((i) => i.width));
          const height = Math.max(...loadedImages.map((i) => i.height));
          canvas.width = width;
          canvas.height = height;

          let currentFrame = 0;
          const totalFrames = loadedImages.length;

          const gifFrames: { image: string; delay: number }[] = loadedImages.map((_, i) => ({
            image: canvas.toDataURL('image/png'),
            delay: delay,
          }));

          let frameIndex = 0;
          const processFrame = () => {
            if (frameIndex >= totalFrames) {
              createAnimatedGif(loadedImages, width, height);
              return;
            }

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(loadedImages[frameIndex], 0, 0);
            gifFrames[frameIndex].image = canvas.toDataURL('image/png');
            frameIndex++;
            setTimeout(processFrame, 10);
          };

          processFrame();
        }
      };
      img.src = src;
    });

    const createAnimatedGif = (imgs: HTMLImageElement[], width: number, height: number) => {
      const gifDataUrl = canvas.toDataURL('image/gif');
      setProcessedGif(gifDataUrl);
      setIsGenerating(false);
    };
  }, [frames, delay]);

  const handleDownload = () => {
    if (!processedGif) return;
    const link = document.createElement('a');
    link.download = 'animation.gif';
    link.href = processedGif;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">GIF Maker</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFrameUpload}
        className="tb-v2-file-input"
      />

      {frames.length > 0 && (
        <>
          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Frame Delay: {delay}ms</label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Loop: {loopCount === 0 ? 'Infinite' : loopCount}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={loopCount}
              onChange={(e) => setLoopCount(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-gap-2 tb-v2-flex-wrap">
            {frames.map((frame, idx) => (
              <div key={idx} className="tb-v2-relative tb-v2-group">
                <img src={frame} alt={`Frame ${idx + 1}`} className="tb-v2-w-20 tb-v2-h-20 tb-v2-object-cover tb-v2-rounded" />
                <div className="tb-v2-absolute tb-v2-inset-0 tb-v2-bg-black/50 tb-v2-opacity-0 group-hover:tb-v2-opacity-100 tb-v2-transition-opacity tb-v2-rounded">
                  <div className="tb-v2-flex tb-v2-items-center tb-v2-justify-center tb-v2-h-full tb-v2-gap-1">
                    <button
                      onClick={() => moveFrame(idx, 'up')}
                      disabled={idx === 0}
                      className="tb-v2-bg-white tb-v2-text-black tb-v2-rounded tb-v2-px-1 tb-v2-text-xs tb-v2-disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFrame(idx, 'down')}
                      disabled={idx === frames.length - 1}
                      className="tb-v2-bg-white tb-v2-text-black tb-v2-rounded tb-v2-px-1 tb-v2-text-xs tb-v2-disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFrame(idx)}
                      className="tb-v2-bg-red-500 tb-v2-text-white tb-v2-rounded tb-v2-px-1 tb-v2-text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <span className="tb-v2-absolute tb-v2-bottom-0 tb-v2-left-0 tb-v2-bg-black/70 tb-v2-text-white tb-v2-text-xs tb-v2-px-1 tb-v2-rounded-bl">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>

          <p className="tb-v2-text-sm tb-v2-text-gray-500">{frames.length} frames selected</p>

          <button
            onClick={generateGif}
            disabled={frames.length < 2 || isGenerating}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate GIF'}
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {processedGif && (
        <div>
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>GIF Preview</p>
          <img src={processedGif} alt="Generated GIF" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download GIF
          </button>
        </div>
      )}
    </div>
  );
}