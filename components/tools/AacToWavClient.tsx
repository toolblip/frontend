'use client';

import { useState } from 'react';

export default function AacToWavClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setStatus('idle');
      setMessage('');
    }
  };

  const convertToWav = async () => {
    if (!file) return;
    setStatus('processing');
    setMessage('');

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert to proper WAV format (16-bit PCM)
      const numChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const bitsPerSample = 16;
      const bytesPerSample = bitsPerSample / 8;
      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = audioBuffer.length * blockAlign;
      
      // WAV header is 44 bytes
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);
      
      // Helper to write strings
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };
      
      // RIFF chunk descriptor
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, 'WAVE');
      
      // fmt sub-chunk
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true); // Sub-chunk size
      view.setUint16(20, 1, true); // Audio format (1 = PCM)
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitsPerSample, true);
      
      // data sub-chunk
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);
      
      // Interleave audio data and convert to 16-bit PCM
      let offset = 44;
      for (let i = 0; i < audioBuffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const sample = audioBuffer.getChannelData(ch)[i];
          // Convert float [-1, 1] to 16-bit integer
          const clampedSample = Math.max(-1, Math.min(1, sample));
          const intSample = clampedSample < 0 
            ? clampedSample * 0x8000 
            : clampedSample * 0x7FFF;
          view.setInt16(offset, intSample, true);
          offset += 2;
        }
      }
      
      // Create download
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, '') + '.wav';
      a.click();
      URL.revokeObjectURL(url);
      
      setStatus('done');
      setMessage('Successfully converted to WAV!');
    } catch (err) {
      setStatus('error');
      setMessage('Error processing audio file. Please ensure it is a valid audio file.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="tb-v2-tool-label">Select AAC File</label>
        <input
          type="file"
          accept=".aac,.m4a,.mp4,.aac"
          onChange={handleFileChange}
          className="tb-v2-input"
        />
      </div>

      {file && (
        <div className="tb-v2-box p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={convertToWav}
        disabled={!file || status === 'processing'}
        className="tb-v2-btn disabled:opacity-50"
      >
        {status === 'processing' ? 'Converting...' : 'Convert to WAV'}
      </button>

      {message && status === 'done' && (
        <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p className="text-sm text-green-700 dark:text-green-300">
          ✓ This tool performs a TRUE conversion: decodes AAC to PCM audio data and wraps it in a proper 16-bit WAV container.
        </p>
      </div>
    </div>
  );
}
