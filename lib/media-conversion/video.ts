export type Cue = { start: number; end: number; text: string };
export function parseSubtitles(source: string): Cue[] {
  if (source.length > 100000) throw new Error('Subtitles exceed 100,000 characters.');
  const blocks = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim().split(/\n\s*\n/);
  const cues: Cue[] = [];
  const time = (value: string) => {
    const m = /^(?:(\d{2,}):)?(\d{2}):(\d{2})[.,](\d{3})$/.exec(value);
    if (!m || Number(m[2]) >= 60 || Number(m[3]) >= 60) throw new Error('Invalid subtitle timestamp.');
    return Number(m[1] || 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
  };
  for (const block of blocks) {
    if (/^(WEBVTT|NOTE|STYLE|REGION)(?:\s|$)/.test(block)) { if (block.includes('-->')) throw new Error('Separate the WEBVTT header from cues with a blank line.'); continue; }
    const lines = block.split('\n'); const index = lines.findIndex(l => l.includes('-->'));
    if (index < 0 || index > 1) throw new Error('Invalid subtitle cue. Use SRT or WebVTT timestamps.');
    const match = /^(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/.exec(lines[index]);
    if (!match) throw new Error('Invalid subtitle timestamp range.');
    const start = time(match[1]), end = time(match[2]);
    const text = lines.slice(index + 1).join('\n').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (end <= start || !text.trim()) throw new Error('Each cue needs text and an end after its start.');
    cues.push({ start, end, text });
  }
  if (!cues.length || cues.length > 1000) throw new Error('Use 1–1,000 subtitle cues.');
  return cues;
}
export function validateRange(start: number, end: number, duration: number) {
  if (![start, end, duration].every(Number.isFinite) || start < 0 || end > duration + 0.001 || end <= start || end - start > 60) throw new Error('Select a range within the video, longer than zero and at most 60 seconds.');
}
export function assertRecordingTiming(recordedSeconds: number, videoSeconds: number, audioSeconds: number) {
  // MediaRecorder timestamps canvas frames using elapsed recording time. Playback
  // and decoded audio have independent clocks; a stalled clock would stretch the
  // export or desynchronize it. Allow scheduling/frame jitter, not accumulated drift.
  const clocks = [recordedSeconds, videoSeconds, audioSeconds];
  if (!clocks.every(Number.isFinite) || Math.max(...clocks) - Math.min(...clocks) > 0.2) {
    throw new Error('Video and audio fell out of sync while recording. Keep this tab visible and try again when your device is less busy.');
  }
}
export function waitMedia(video: HTMLVideoElement, event: string, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener(event, done); video.removeEventListener('error', error); signal.removeEventListener('abort', abort); };
    const done = () => { cleanup(); resolve(); };
    const error = () => { cleanup(); reject(new Error('This browser cannot decode the video.')); };
    const abort = () => { cleanup(); reject(new Error('Video processing cancelled.')); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('Video loading timed out.')); }, 15000);
    video.addEventListener(event, done, { once: true }); video.addEventListener('error', error, { once: true }); signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}
export type CaptionStyle = { size: number; color: string; background: string; effect: 'default' | 'outline' | 'shadow' };
export async function renderVideo(file: File, start: number, end: number, cues: Cue[], style: CaptionStyle, signal: AbortSignal): Promise<{ blob: Blob; width: number; height: number }> {
  signal.throwIfAborted();
  if (typeof MediaRecorder === 'undefined') throw new Error('This browser cannot record video.');
  const mime = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  if (!mime) throw new Error('This browser has no WebM video encoder.');
  const video = document.createElement('video'); video.playsInline = true; video.preload = 'auto'; video.muted = true;
  const url = URL.createObjectURL(file);
  let context: AudioContext | undefined, source: AudioBufferSourceNode | undefined, stream: MediaStream | undefined, audioStream: MediaStream | undefined, recorder: MediaRecorder | undefined;
  let raf = 0;
  const abortResources = () => { video.pause(); stream?.getTracks().forEach(t => t.stop()); if (context && context.state !== 'closed') void context.close().catch(() => {}); };
  signal.addEventListener('abort', abortResources, { once: true });
  try {
    const loaded = waitMedia(video, 'loadeddata', signal); video.src = url; await loaded;
    validateRange(start, end, video.duration);
    if (video.duration > 120) throw new Error('Source video must be at most 120 seconds for bounded audio decoding.');
    const width = video.videoWidth, height = video.videoHeight;
    if (!width || !height || width * height > 1920 * 1080) throw new Error('Video must be at most 1920 × 1080 pixels (2,073,600 total pixels).');
    if (start > 0) { const sought = waitMedia(video, 'seeked', signal); video.currentTime = start; await sought; }
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    if (!canvas.captureStream) throw new Error('Canvas recording is unsupported in this browser.');
    stream = canvas.captureStream(30);
    context = new AudioContext();
    const audio = await context.decodeAudioData(await file.arrayBuffer()); signal.throwIfAborted();
    if (audio.length * audio.numberOfChannels > 24_000_000 || audio.numberOfChannels > 8) throw new Error('Source audio exceeds the PCM memory limit.');
    source = context.createBufferSource(); source.buffer = audio;
    const destination = context.createMediaStreamDestination(); source.connect(destination); audioStream = destination.stream;
    for (const track of audioStream.getAudioTracks()) stream.addTrack(track);
    await context.resume(); signal.throwIfAborted();
    const paint = () => {
      ctx.drawImage(video, 0, 0, width, height);
      const active = cues.filter(c => video.currentTime >= c.start && video.currentTime < c.end);
      if (active.length) {
        const fontSize = Math.max(8, Math.round(style.size * width / 640));
        ctx.font = `${fontSize}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        const lines: string[] = [];
        for (const raw of active.map(c => c.text).join('\n').split('\n')) {
          let line = '';
          for (const character of raw) { if (ctx.measureText(line + character).width > width * 0.9) { lines.push(line); line = ''; } line += character; }
          lines.push(line);
        }
        const lineHeight = fontSize * 1.25, bottom = height * 0.92;
        if (lines.length * lineHeight > height * 0.7) throw new Error('Caption text does not fit the frame. Shorten the cue or reduce font size.');
        ctx.fillStyle = style.background; ctx.fillRect(0, bottom - lines.length * lineHeight - 4, width, lines.length * lineHeight + 8);
        ctx.fillStyle = style.color; ctx.strokeStyle = '#000'; ctx.lineWidth = Math.max(1, fontSize / 12);
        if (style.effect === 'shadow') { ctx.shadowColor = '#000'; ctx.shadowBlur = 3; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1; }
        lines.forEach((line, index) => { const y = bottom - (lines.length - index - 1) * lineHeight; if (style.effect === 'outline') ctx.strokeText(line, width / 2, y); ctx.fillText(line, width / 2, y); });
        ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      }
    };
    paint();
    const chunks: Blob[] = []; recorder = new MediaRecorder(stream, { mimeType: mime });
    const rec = recorder;
    const blob = await new Promise<Blob>((resolve, reject) => {
      let failed = false;
      let recordingStartedAt: number | undefined, audioStartedAt = 0;
      const assertTiming = () => {
        if (recordingStartedAt !== undefined) assertRecordingTiming((performance.now() - recordingStartedAt) / 1000, video.currentTime - start, context!.currentTime - audioStartedAt);
      };
      const cleanup = () => { clearTimeout(timeout); cancelAnimationFrame(raf); signal.removeEventListener('abort', abort); video.removeEventListener('error', error); video.removeEventListener('ended', ended); video.pause(); };
      const fail = (message: string) => { if (failed) return; failed = true; cleanup(); if (rec.state !== 'inactive') rec.stop(); reject(new Error(message)); };
      const abort = () => fail('Video processing cancelled.'); const error = () => fail('Video decode failed during recording.');
      const stop = () => { try { assertTiming(); paint(); } catch (e) { fail((e as Error).message); return; } cleanup(); if (rec.state !== 'inactive') rec.stop(); };
      const ended = () => { if (video.currentTime + 0.15 < end) fail('Video ended before the selected range.'); else stop(); };
      const timeout = setTimeout(() => fail('Recording stalled or timed out. Keep this tab visible while converting.'), (end - start) * 1000 + 15000);
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onerror = () => fail('Video encoding failed.');
      rec.onstop = () => { cleanup(); if (failed) return; const result = new Blob(chunks, { type: 'video/webm' }); if (result.size < 100) reject(new Error('Encoder produced no video.')); else resolve(result); };
      signal.addEventListener('abort', abort, { once: true }); video.addEventListener('error', error); video.addEventListener('ended', ended);
      const tick = () => { if (failed || rec.state === 'inactive') return; try { assertTiming(); paint(); } catch (e) { fail((e as Error).message); return; } if (video.currentTime >= end) stop(); else raf = requestAnimationFrame(tick); };
      video.play().then(() => { if (failed || signal.aborted) return; paint(); recordingStartedAt = performance.now(); audioStartedAt = context!.currentTime; rec.start(250); source!.start(audioStartedAt, start, end - start); raf = requestAnimationFrame(tick); }).catch(() => fail('Playback was blocked by the browser. Try converting again.'));
      if (signal.aborted) abort();
    });
    signal.throwIfAborted();
    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    if (head[0] !== 0x1a || head[1] !== 0x45 || head[2] !== 0xdf || head[3] !== 0xa3) throw new Error('Encoder output is not WebM.');
    return { blob, width, height };
  } finally {
    signal.removeEventListener('abort', abortResources);
    cancelAnimationFrame(raf); video.pause();
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stream?.getTracks().forEach(t => t.stop()); audioStream?.getTracks().forEach(t => t.stop()); try { source?.stop(); } catch { /* A cancelled source may not have started. */ } source?.disconnect();
    if (context && context.state !== 'closed') await context.close();
    video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url);
  }
}
