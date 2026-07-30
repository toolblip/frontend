'use client';

import { useState, useRef } from 'react';

export default function AacToFlacClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStatus('idle');
    setMessage('');
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

  const process = async () => {
    if (!file) return;
    setStatus('processing');
    setMessage('');

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const numChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const bitsPerSample = 16;
      const bytesPerSample = bitsPerSample / 8;
      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = audioBuffer.length * blockAlign;
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);
      
      const writeString = (offset: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitsPerSample, true);
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);
      
      let offset = 44;
      for (let i = 0; i < audioBuffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          offset += 2;
        }
      }
      
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, '') + '.wav';
      a.click();
      URL.revokeObjectURL(url);
      
      setStatus('done');
      setMessage('Converted to WAV successfully!');
    } catch {
      setStatus('error');
      setMessage('Error processing audio file. Please ensure it is a valid AAC file.');
    }
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
        <div className="text-4xl mb-2">🎵</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop audio file here' : 'Click or drag AAC file to convert'}
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
        onClick={process}
        disabled={!file || status === 'processing'}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        {status === 'processing' ? '⏳ Converting...' : '🔄 Convert to WAV'}
      </button>

      {/* Status messages */}
      {status === 'done' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400">✅ {message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {message}</p>
        </div>
      )}

      {/* Note */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          ⚠️ FLAC encoding is not supported in browsers. This tool converts AAC to WAV instead.
        </p>
      </div>

      {!file && status === 'idle' && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎵</div>
          <p>Upload an AAC file to convert to WAV</p>
        </div>
      )}
    </div>
  );
}
