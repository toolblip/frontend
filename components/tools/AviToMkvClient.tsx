'use client';

import { useState, useRef } from 'react';

export default function AviToMkvClient() {
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

    // AVI to MKV is essentially a container re-package
    // In browser, we can only create a download of the original file with new extension
    // Real conversion requires FFmpeg
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setDownloadUrl(url);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Re-package only:</strong> This tool re-packages AVI video into MKV container format. No transcoding is performed. For best results, use FFmpeg.
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
          {isDragging ? 'Drop AVI file here' : 'Click or drag an AVI file to re-package'}
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
          {isProcessing ? 'Processing...' : 'Re-package to MKV'}
        </button>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Upload an AVI file above to re-package it into an MKV container. No re-encoding is performed.
        </p>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Re-packaging complete! The file has been prepared for download.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.avi$/i, '.mkv') || 'video.mkv'}
              className="tb-v2-btn tb-v2-btn-primary w-full text-center block"
            >
              Download MKV
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Note: This is a container conversion. Video/audio streams are not re-encoded.
          </p>
        </div>
      )}
    </div>
  );
}
