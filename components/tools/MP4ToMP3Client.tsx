'use client';

import { useState, useRef } from 'react';

export default function MP4ToMP3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setDownloadUrl('');
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
    if (dropped && (dropped.name.toLowerCase().endsWith('.mp4') || dropped.type === 'video/mp4')) {
      handleFile(dropped);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');
    setDownloadUrl('');

    try {
      // Browsers cannot encode MP3. We attempt a real decode of the MP4's
      // audio track via Web Audio and bail out with a clear error rather
      // than shipping a fake "audio.mp3" file.
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const numChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const bytesPerSample = 2;
      const blockAlign = numChannels * bytesPerSample;
      const dataSize = audioBuffer.length * blockAlign;
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);

      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);

      let offset = 44;
      for (let i = 0; i < audioBuffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
          offset += 2;
        }
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError('This MP4 file\'s audio codec could not be decoded in-browser. Use FFmpeg (ffmpeg -i video.mp4 -vn -acodec pcm_s16le output.wav) instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-800 dark:text-red-200">
        <strong>MP3 encoding not supported:</strong> Browser-based audio extraction from MP4 to MP3 is not possible. This tool can extract audio as WAV format or you can use FFmpeg.
      </div>

      <div className="tb-v2-tool-label mb-2">Video File (MP4)</div>
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
          {isDragging ? 'Drop MP4 file here' : 'Click or drag an MP4 file to extract audio'}
        </p>
        <p className="text-xs text-gray-500 mt-1">MP4</p>
      </div>
      <input ref={fileRef} type="file" accept="video/mp4,.mp4" onChange={handleFileChange} className="hidden" />
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
          onClick={handleExtract}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Extracting...' : 'Extract Audio (WAV)'}
        </button>
      )}

      {!file && (
        <p className="tb-v2-empty">
          Upload an MP4 file above to extract its audio track as a WAV file.
        </p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Audio extracted as WAV. Use a converter to get MP3.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.mp4$/i, '.wav') || 'audio.wav'}
              className="tb-v2-btn w-full text-center block"
            >
              Download WAV
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            For MP3: Use an online converter or FFmpeg (ffmpeg -i video.mp4 -vn -acodec mp3 output.mp3)
          </p>
        </div>
      )}
    </div>
  );
}
