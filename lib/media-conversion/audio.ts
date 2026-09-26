import { demuxAac, type AacTimeline } from './demux';
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
    try { decoded = await context.decodeAudioData(bytes.slice(0)); } catch {
      signal.throwIfAborted();
      if (kind !== 'mp4' && kind !== 'mkv') throw new Error('This browser cannot decode the audio in this container, or the file has no decodable audio. No converted file was created.');
      const aac = demuxAac(new Uint8Array(bytes), kind);
      signal.throwIfAborted();
      try { decoded = await context.decodeAudioData(aac.data); } catch { throw new Error('This browser cannot decode the extracted AAC audio. No converted file was created.'); }
      signal.throwIfAborted();
      decoded = applyAacTimeline(decoded, aac, context);
    }
    signal.throwIfAborted();
    if (decoded.duration > 120 || decoded.length * decoded.numberOfChannels > 24_000_000 || decoded.numberOfChannels > 8) throw new Error('Decoded audio exceeds 120 seconds or the PCM memory limit.');
    return decoded;
  } finally { signal.removeEventListener('abort', abort); if (context.state !== 'closed') await context.close(); }
}


/** Encode bounded PCM in yielding blocks so cancellation remains responsive. */
export async function pcmMp3(channels: Float32Array[], sampleRate: number, signal: AbortSignal): Promise<Blob> {
  signal.throwIfAborted();
  const frames = channels[0]?.length || 0;
  if (!frames || channels.length > 2 || ![8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000].includes(sampleRate) || channels.some(c => c.length !== frames) || frames * channels.length > 24_000_000) throw new Error('MP3 supports mono or stereo PCM within the audio memory limit.');
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  signal.throwIfAborted();
  const encoder = new Mp3Encoder(channels.length, sampleRate, 128);
  const chunks: ArrayBuffer[] = [];
  const block = (channel: Float32Array, start: number) => Int16Array.from(channel.subarray(start, start + 1152), value => {
    if (!Number.isFinite(value)) throw new Error('Non-finite PCM sample.');
    const clipped = Math.max(-1, Math.min(1, value));
    return Math.round(clipped * (clipped < 0 ? 32768 : 32767));
  });
  for (let start = 0; start < frames; start += 1152) {
    signal.throwIfAborted();
    const bytes = encoder.encodeBuffer(block(channels[0], start), channels[1] ? block(channels[1], start) : undefined);
    if (bytes.length) chunks.push(Uint8Array.from(bytes).buffer);
    if (start % (1152 * 16) === 0) await new Promise(resolve => setTimeout(resolve, 0));
  }
  signal.throwIfAborted();
  const tail = encoder.flush(); if (tail.length) chunks.push(Uint8Array.from(tail).buffer);
  return new Blob(chunks, { type: 'audio/mpeg' });
}

/** ADTS has no edit-list metadata: apply container trims to decoded PCM explicitly. */
export function applyAacTimeline(decoded: AudioBuffer, timeline: AacTimeline, context: Pick<AudioContext, 'createBuffer'>): AudioBuffer {
  const ratio = decoded.sampleRate / timeline.sampleRate;
  const start = Math.round(timeline.startSample * ratio);
  const length = Math.round((timeline.endSample - timeline.startSample) * ratio);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(length) || start < 0 || length < 1 || start + length > decoded.length) throw new Error('Decoded AAC does not cover the container presentation range.');
  if (length / decoded.sampleRate > 120 || length * decoded.numberOfChannels > 24_000_000 || decoded.numberOfChannels > 8) throw new Error('Decoded audio exceeds 120 seconds or the PCM memory limit.');
  const output = context.createBuffer(decoded.numberOfChannels, length, decoded.sampleRate);
  for (let channel = 0; channel < decoded.numberOfChannels; channel++) output.copyToChannel(decoded.getChannelData(channel).subarray(start, start + length), channel);
  return output;
}
