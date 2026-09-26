export function pcmWav(channels: Float32Array[], sampleRate: number): ArrayBuffer {
  const frames = channels[0]?.length || 0;
  if (!frames || channels.length > 8 || !Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000 || channels.some(c => c.length !== frames) || frames * channels.length > 24_000_000) throw new Error('Unsupported or oversized PCM audio.');
  const size = frames * channels.length * 2; const buffer = new ArrayBuffer(44 + size); const view = new DataView(buffer);
  const text = (at: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i)); };
  text(0, 'RIFF'); view.setUint32(4, 36 + size, true); text(8, 'WAVE'); text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels.length, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * channels.length * 2, true); view.setUint16(32, channels.length * 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, size, true);
  let p = 44;
  for (let i = 0; i < frames; i++) for (const channel of channels) {
    if (!Number.isFinite(channel[i])) throw new Error('Non-finite PCM sample.');
    const sample = Math.max(-1, Math.min(1, channel[i])); view.setInt16(p, Math.round(sample * (sample < 0 ? 32768 : 32767)), true); p += 2;
  }
  return buffer;
}
export function mediaContainer(bytes: Uint8Array): 'aac' | 'mp4' | 'mkv' | 'wav' | 'unknown' {
  const s = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes[0] === 255 && (bytes[1] & 0xf6) === 0xf0) return 'aac';
  if (s(4, 8) === 'ftyp') return 'mp4';
  if (s(0, 4) === '\x1aE\xdf\xa3') return 'mkv';
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WAVE') return 'wav';
  return 'unknown';
}
export async function decodeAudio(file: File, signal: AbortSignal, expected?: 'aac' | 'mp4' | 'mkv') {
  if (!file.size || file.size > 20 * 1024 * 1024) throw new Error('Choose a nonempty audio/video file up to 20 MB.');
  const bytes = await file.arrayBuffer(); signal.throwIfAborted();
  const kind = mediaContainer(new Uint8Array(bytes));
  if (kind === 'unknown' || (expected && kind !== expected)) throw new Error(`Invalid input container${expected ? `: expected ${expected.toUpperCase()}` : ''}.`);
  const context = new AudioContext({ sampleRate: 44100 });
  const abort = () => { void context.close().catch(() => {}); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    let decoded: AudioBuffer;
    try { decoded = await context.decodeAudioData(bytes); } catch { throw new Error('This browser cannot decode the audio in this container, or the file has no decodable audio. No converted file was created.'); }
    signal.throwIfAborted();
    if (decoded.duration > 120 || decoded.length * decoded.numberOfChannels > 24_000_000 || decoded.numberOfChannels > 8) throw new Error('Decoded audio exceeds 120 seconds or the PCM memory limit.');
    return decoded;
  } finally { signal.removeEventListener('abort', abort); if (context.state !== 'closed') await context.close(); }
}
