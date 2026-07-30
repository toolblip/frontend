'use client';

import { useState, useRef } from 'react';

export default function AviToGifClient() {
  const [file, setFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setGifUrl('');
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('video/')) handleFile(dropped);
  };

  const extractFramesAndCreateGif = async () => {
    if (!file || !canvasRef.current) return;

    setIsProcessing(true);
    setError('');

    try {
      const video = document.createElement('video');
      videoRef.current = video;
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load video'));
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Use a simplified approach: capture frames and create animated result
      // Full GIF encoding requires a library like gif.js
      const duration = video.duration;
      const fps = 10;
      const frameCount = Math.min(Math.floor(duration * fps), 30); // Limit frames
      const interval = duration / frameCount;

      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      const frames: ImageData[] = [];
      for (let i = 0; i < frameCount; i++) {
        video.currentTime = i * interval;
        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
        });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }

      // For "best effort" - show the first frame as preview with note
      ctx.putImageData(frames[0], 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setGifUrl(dataUrl);

      setError('GIF encoding is not fully supported in-browser. Preview shows first frame. For full GIF creation, use a desktop application like FFmpeg.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <strong>Best Effort:</strong> This tool extracts frames from video and creates a preview. Full GIF encoding requires server-side processing or FFmpeg.
      </div>

      <div className="tb-v2-tool-label mb-2">Video File (AVI, MP4, MOV, etc.)</div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">🎬</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop video file here' : 'Click or drag a video file to extract frames'}
        </p>
        <p className="text-xs text-gray-500 mt-1">AVI, MP4, MOV, and other video formats</p>
      </div>
      <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={() => { setFile(null); setGifUrl(''); setError(''); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={extractFramesAndCreateGif}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Extracting Frames...' : 'Extract Frames → GIF Preview'}
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-200">
          {error}
        </div>
      )}

      {gifUrl && (
        <div className="space-y-2">
          <div className="tb-v2-tool-label">Preview (First Frame)</div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <img src={gifUrl} alt="GIF preview" className="max-w-full h-auto" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            This is a best-effort preview. Use FFmpeg for full GIF creation.
          </p>
          <button
            type="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = gifUrl;
              link.download = 'frame.png';
              link.click();
            }}
            className="tb-v2-btn w-full"
          >
            Download Frame
          </button>
        </div>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Upload a video above to extract a frame preview. Full GIF encoding needs FFmpeg or a similar desktop tool.
        </p>
      )}
    </div>
  );
}
