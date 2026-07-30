'use client';

import { useState, useRef } from 'react';

export default function AacToM4rClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'done'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStatus('idle');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.name.endsWith('.aac') || f.name.endsWith('.m4a') || f.name.endsWith('.mp4'))) {
      handleFile(f);
    }
  };

  const convert = () => {
    if (!file) return;
    const blob = new Blob([file], { type: 'audio/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, '') + '.m4r';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('done');
  };

  return (
    <div>
      {/* Upload area */}
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
        <div className="text-4xl mb-2">📱</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop audio file here' : 'Click or drag AAC file for iPhone ringtone'}
        </p>
        <p className="text-xs text-gray-500 mt-1">AAC, M4A, MP4</p>
      </div>

      <input ref={fileRef} type="file" accept=".aac,.m4a,.mp4" onChange={handleFileChange} className="hidden" />

      {/* File info */}
      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {/* Convert button */}
      <button
        onClick={convert}
        disabled={!file || status === 'done'}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        {status === 'done' ? '✅ Downloaded!' : '📱 Convert to M4R (Ringtone)'}
      </button>

      {/* Status */}
      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Download started! Check your downloads folder.
          </p>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          📱 M4R is the iPhone ringtone format. This tool re-packages your AAC file with the .m4r extension.
        </p>
      </div>

      {!file && status === 'idle' && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📱</div>
          <p>Upload an AAC file to convert to iPhone ringtone</p>
        </div>
      )}
    </div>
  );
}
