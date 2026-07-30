'use client';

import { useState, useRef } from 'react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00.0';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${s.padStart(4, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];

export default function CutterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const onTimeUpdateRef = useRef<(() => void) | null>(null);

  const loadFile = (selected: File | undefined) => {
    if (!selected || !selected.type.startsWith('video/')) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(selected);
    setVideoUrl(URL.createObjectURL(selected));
    setStatus('idle');
    setErrorMsg('');
    setOutputUrl(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setEndTime(video.duration);
  };

  const stopRecording = () => {
    const video = videoRef.current;
    if (video && onTimeUpdateRef.current) {
      video.removeEventListener('timeupdate', onTimeUpdateRef.current);
      video.removeEventListener('ended', onTimeUpdateRef.current);
      onTimeUpdateRef.current = null;
    }
    if (video) video.pause();
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const handleCut = () => {
    const video = videoRef.current;
    if (!video || !file) return;

    const clampedStart = Math.max(0, Math.min(startTime, duration));
    const clampedEnd = Math.max(clampedStart + 0.1, Math.min(endTime, duration));

    const captureStream =
      (video as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream }).captureStream ||
      (video as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream }).mozCaptureStream;

    if (!captureStream || typeof MediaRecorder === 'undefined') {
      setStatus('error');
      setErrorMsg('This browser does not support in-browser video capture. Try Chrome or Firefox, or use FFmpeg (ffmpeg -ss START -to END -i input.mp4 -c copy output.mp4).');
      return;
    }

    const mimeType = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) || '';
    if (!mimeType) {
      setStatus('error');
      setErrorMsg('No supported video recording format found in this browser.');
      return;
    }

    let stream: MediaStream;
    try {
      stream = captureStream.call(video);
    } catch {
      setStatus('error');
      setErrorMsg('Could not capture this video for cutting. It may be blocked by browser security restrictions.');
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType });
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onerror = () => {
      setStatus('error');
      setErrorMsg('Recording failed partway through. Try a shorter range.');
    };
    recorder.onstop = () => {
      video.muted = false;
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputSize(blob.size);
      setStatus('done');
    };

    setStatus('recording');
    setErrorMsg('');
    setRecordedSeconds(0);
    video.muted = true;

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      recorder.start();
      video.play();

      const onTimeUpdate = () => {
        setRecordedSeconds(Math.max(0, video.currentTime - clampedStart));
        if (video.currentTime >= clampedEnd) stopRecording();
      };
      onTimeUpdateRef.current = onTimeUpdate;
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('ended', onTimeUpdate);
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = clampedStart;
  };

  const clearFile = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setVideoUrl(null);
    setOutputUrl(null);
    setStatus('idle');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cut Video</span>
      </div>

      {!videoUrl ? (
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🎬</span>
          <span className="tb-v2-dropzone-text">Click or drag a video file here</span>
          <span className="tb-v2-dropzone-hint">Trim a clip by choosing a start and end time</span>
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--fg-2)' }}>{file?.name}</span>
            <button type="button" onClick={clearFile} className="tb-v2-btn-sm">Remove</button>
          </div>

          <video
            ref={videoRef}
            src={videoUrl}
            controls
            onLoadedMetadata={onLoadedMetadata}
            style={{ width: '100%', borderRadius: 8, background: '#000' }}
          />

          {duration > 0 && (
            <>
              <div className="tb-v2-range-row">
                <label className="tb-v2-tool-label">Start</label>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 0.1))}
                  className="tb-v2-range"
                />
                <span className="tb-v2-range-val">{formatTime(startTime)}</span>
              </div>
              <div className="tb-v2-range-row">
                <label className="tb-v2-tool-label">End</label>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 0.1))}
                  className="tb-v2-range"
                />
                <span className="tb-v2-range-val">{formatTime(endTime)}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--fg-3)' }}>
                Clip length: {formatTime(Math.max(0, endTime - startTime))}. Cutting plays the range in real time to
                capture it, so it takes about as long as the clip itself.
              </p>

              <button
                type="button"
                onClick={handleCut}
                disabled={status === 'recording'}
                className="tb-v2-btn tb-v2-btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                {status === 'recording' ? `Cutting... ${formatTime(recordedSeconds)}` : 'Cut Clip'}
              </button>
            </>
          )}

          {status === 'error' && (
            <div className="tb-v2-banner tb-v2-banner-err">{errorMsg}</div>
          )}

          {status === 'done' && outputUrl && (
            <div className="flex flex-col gap-2">
              <video src={outputUrl} controls style={{ width: '100%', borderRadius: 8, background: '#000' }} />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--fg-3)' }}>{formatBytes(outputSize)} &middot; WebM</span>
                <a href={outputUrl} download="trimmed.webm" className="tb-v2-btn tb-v2-btn-sm">
                  Download
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
