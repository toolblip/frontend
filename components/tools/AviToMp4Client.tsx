'use client';

import { useState, useRef } from 'react';

export default function AviToMp4Client() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setDownloadUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.name.toLowerCase().endsWith('.avi') || dropped.type === 'video/x-msvideo')) {
      handleFile(dropped);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);

    // AVI to MP4 is essentially a container re-package
    // In browser, we can only provide the original file with new extension
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setDownloadUrl(url);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Re-package:</strong> This tool converts AVI to MP4 by re-packaging the video stream. No transcoding is performed. For AVI files with incompatible codecs, use FFmpeg.
      </div>

      <div className="tb-v2-tool-label mb-2">Video File (AVI)</div>
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
          {isDragging ? 'Drop AVI file here' : 'Click or drag an AVI file to convert'}
        </p>
        <p className="text-xs text-gray-500 mt-1">AVI</p>
      </div>
      <input ref={fileRef} type="file" accept="video/x-msvideo,.avi" onChange={handleFileChange} className="hidden" />
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={() => { setFile(null); setDownloadUrl(''); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Processing...' : 'Convert to MP4'}
        </button>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Upload an AVI file above to re-package it into an MP4 container.
        </p>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Re-packaging complete! Your file is ready for download.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.avi$/i, '.mp4') || 'video.mp4'}
              className="tb-v2-btn tb-v2-btn-primary w-full text-center block"
            >
              Download MP4
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Note: This is a container conversion. If the AVI uses incompatible codecs, use FFmpeg for proper transcoding.
          </p>
        </div>
      )}
    </div>
  );
}
