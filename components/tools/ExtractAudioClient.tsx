'use client';

import { useState, useRef } from 'react';

function pickMimeType(): string {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg'];
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export default function ExtractAudioClient() {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultExt, setResultExt] = useState('webm');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const extract = (file: File) => {
    setError('');
    setResultUrl(null);
    setProgress(0);

    if (typeof MediaRecorder === 'undefined') {
      setError('This browser does not support MediaRecorder, which this tool needs to capture audio.');
      return;
    }
    const mimeType = pickMimeType();
    if (!mimeType) {
      setError('This browser does not support any audio recording format this tool can use.');
      return;
    }

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      setDuration(video.duration);
      const stream = (video as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream?.();
      if (!stream) {
        setError('This browser does not support capturing a media stream from video playback.');
        URL.revokeObjectURL(objectUrl);
        return;
      }
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        setError('No audio track was found in this video.');
        URL.revokeObjectURL(objectUrl);
        return;
      }
      const audioStream = new MediaStream(audioTracks);
      const recorder = new MediaRecorder(audioStream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setResultUrl(URL.createObjectURL(blob));
        setResultExt(mimeType.includes('ogg') ? 'ogg' : 'webm');
        setExtracting(false);
        URL.revokeObjectURL(objectUrl);
      };

      video.ontimeupdate = () => setProgress(video.duration ? video.currentTime / video.duration : 0);
      video.onended = () => { if (recorder.state !== 'inactive') recorder.stop(); };

      setExtracting(true);
      recorder.start();
      video.play().catch(() => {
        setError('Could not start video playback to capture audio.');
        setExtracting(false);
      });
    };

    video.onerror = () => {
      setError('Could not load this video file.');
      URL.revokeObjectURL(objectUrl);
    };
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file.');
      return;
    }
    setFileName(file.name);
    extract(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const downloadAudio = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'audio')}.${resultExt}`;
    a.click();
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner" style={{ margin: 20 }}>
        Audio is captured in real time as the video plays back in your browser (no server upload), so extraction
        takes roughly as long as the video's duration. Output is a real WebM/Opus (or Ogg) audio file, since
        encoding to MP3 requires a codec library that isn't available in-browser.
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🎵</span>
          <span className="tb-v2-dropzone-text">{extracting ? 'Extracting...' : 'Click or drag a video file here'}</span>
          <span className="tb-v2-dropzone-hint">Processed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {extracting && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Progress</div>
              <div>{Math.round(progress * 100)}%</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Duration</div>
              <div>{duration ? `${duration.toFixed(1)}s` : '-'}</div>
            </div>
          </div>
        </div>
      )}

      {resultUrl && !extracting && (
        <div style={{ padding: '0 20px 20px' }}>
          <audio controls src={resultUrl} style={{ width: '100%', marginBottom: 12 }} />
          <button type="button" onClick={downloadAudio} className="tb-v2-btn tb-v2-btn-primary">
            Download Audio ({resultExt.toUpperCase()})
          </button>
        </div>
      )}

      {!fileName && !error && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload a video file to extract its audio track.</p>}
    </div>
  );
}
