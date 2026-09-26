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
      decoded = await decodeAacPackets(aac, context, signal);
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

// TypeScript 5.5's DOM declarations omit the WebCodecs audio interfaces.
type AacFrame = { numberOfFrames: number; numberOfChannels: number; sampleRate: number; timestamp: number;
  copyTo(destination: Float32Array, options: { planeIndex: number; format: 'f32-planar' }): void; close(): void };
type AacConfig = { codec: string; sampleRate: number; numberOfChannels: number; description: Uint8Array };
type AacDecoder = EventTarget & { state: string; decodeQueueSize: number; configure(config: AacConfig): void; decode(chunk: unknown): void; flush(): Promise<void>; close(): void };
type AudioCodecs = {
  AudioDecoder?: { new(init: { output(frame: AacFrame): void; error(error: DOMException): void }): AacDecoder; isConfigSupported(config: AacConfig): Promise<{ supported?: boolean }> };
  EncodedAudioChunk?: new(init: { type: 'key'; timestamp: number; data: Uint8Array }) => unknown;
};
/** Raw AAC + AudioSpecificConfig bypasses decodeAudioData's implicit ADTS priming trim.
 * See https://www.w3.org/TR/webcodecs-aac-codec-registration/ .
 */
export async function decodeAacPackets(timeline: AacTimeline, context: Pick<AudioContext, 'createBuffer'>, signal: AbortSignal): Promise<AudioBuffer> {
  signal.throwIfAborted();
  const { AudioDecoder: Decoder, EncodedAudioChunk: Chunk } = globalThis as unknown as AudioCodecs;
  if (!Decoder || !Chunk) throw new Error('This browser cannot decode this AAC container with exact timing. Use a browser with WebCodecs audio decoding.');
  const { sampleRate, numberOfChannels, packets, startSample, endSample } = timeline;
  const totalFrames = packets.length * 1024, length = endSample - startSample;
  if (!Number.isSafeInteger(totalFrames) || totalFrames * numberOfChannels > 24_000_000 || numberOfChannels < 1 || numberOfChannels > 2 || length / sampleRate > 120) throw new Error('Decoded audio exceeds 120 seconds or the PCM memory limit.');
  if (!Number.isSafeInteger(startSample) || !Number.isSafeInteger(endSample) || startSample < 0 || length < 1 || endSample > totalFrames) throw new Error('Invalid AAC presentation range.');
  const config = { codec: 'mp4a.40.2', sampleRate, numberOfChannels, description: timeline.description };
  if (!(await Decoder.isConfigSupported(config)).supported) throw new Error('This browser does not support exact AAC-LC packet decoding.');
  signal.throwIfAborted();
  const output = context.createBuffer(numberOfChannels, length, sampleRate);
  let decodedFrames = 0, failure: Error | undefined, decoder: AacDecoder | undefined;
  let rejectDrain: ((error: Error) => void) | undefined;
  const close = () => { if (decoder && decoder.state !== 'closed') decoder.close(); };
  const fail = (error: Error) => { failure ??= error; rejectDrain?.(failure); close(); };
  const abort = () => fail(signal.reason instanceof Error ? signal.reason : new Error('Audio decoding cancelled.'));
  try {
    decoder = new Decoder({
      error: fail,
      output: frame => {
        try {
          if (failure || signal.aborted) return;
          const count = frame.numberOfFrames;
          if (frame.sampleRate !== sampleRate || frame.numberOfChannels !== numberOfChannels || !Number.isSafeInteger(count) || count < 1 || decodedFrames + count > totalFrames || Math.round(frame.timestamp * sampleRate / 1e6) !== decodedFrames) throw new Error('AAC decoder changed packet timing or output dimensions.');
          const from = Math.max(startSample, decodedFrames), to = Math.min(endSample, decodedFrames + count);
          if (to > from) for (let channel = 0; channel < numberOfChannels; channel++) {
            const samples = new Float32Array(count);
            frame.copyTo(samples, { planeIndex: channel, format: 'f32-planar' });
            output.getChannelData(channel).set(samples.subarray(from - decodedFrames, to - decodedFrames), from - startSample);
          }
          decodedFrames += count;
        } catch (error) { fail(error instanceof Error ? error : new Error('AAC sample copy failed.')); }
        finally { frame.close(); }
      },
    });
    signal.addEventListener('abort', abort, { once: true });
    decoder.configure(config);
    for (let index = 0; index < packets.length; index++) {
      signal.throwIfAborted(); if (failure) throw failure;
      decoder.decode(new Chunk({ type: 'key', timestamp: Math.round(index * 1024 * 1e6 / sampleRate), data: packets[index] }));
      if (decoder.decodeQueueSize > 16) await new Promise<void>((resolve, reject) => {
        const cleanup = () => { decoder!.removeEventListener('dequeue', check); rejectDrain = undefined; };
        const rejectWait = (error: Error) => { cleanup(); reject(error); };
        const check = () => {
          if (failure) rejectWait(failure);
          else if (decoder!.decodeQueueSize <= 16) { cleanup(); resolve(); }
        };
        rejectDrain = rejectWait;
        decoder!.addEventListener('dequeue', check);
        check();
      });
      // Yield even when a decoder consumes synchronously, so Cancel remains usable.
      if (index % 16 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    signal.throwIfAborted(); if (failure) throw failure;
    await decoder.flush();
    signal.throwIfAborted(); if (failure) throw failure;
    if (decodedFrames !== totalFrames) throw new Error('AAC decoder omitted samples; no converted file was created.');
    return output;
  } catch (error) { throw failure ?? error; }
  finally { signal.removeEventListener('abort', abort); close(); }
}
