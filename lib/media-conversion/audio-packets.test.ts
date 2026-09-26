import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { demuxAac } from './demux';
import { decodeAacPackets, decodeAudio } from './audio';
const timeline = () => demuxAac(new Uint8Array(readFileSync('public/samples/media-conversion/example.m4a')), 'mp4');
const context = { createBuffer(channels: number, length: number, sampleRate: number) {
  const data = Array.from({ length: channels }, () => new Float32Array(length));
  return { length, sampleRate, numberOfChannels: channels, duration: length / sampleRate,
    getChannelData: (channel: number) => data[channel],
    copyToChannel: (source: Float32Array, channel: number) => data[channel].set(source),
  } as AudioBuffer;
} };
function decoderMock({ missing = false, abort, badTimestamp = false }: { missing?: boolean; abort?: AbortController; badTimestamp?: boolean } = {}) {
  const closed = vi.fn(), frameClosed = vi.fn(); let count = 0;
  class Decoder extends EventTarget {
    state = 'unconfigured'; decodeQueueSize = 0;
    static async isConfigSupported() { return { supported: true }; }
    constructor(private init: { output: (frame: unknown) => void }) { super(); }
    configure() { this.state = 'configured'; }
    decode(chunk: { timestamp: number }) {
      const index = count++;
      if (!missing || index !== 87) this.init.output({ numberOfFrames: 1024, sampleRate: 44100, numberOfChannels: 1,
        timestamp: chunk.timestamp + (badTimestamp ? 100000 : 0),
        copyTo: (destination: Float32Array) => destination.set(Float32Array.from({ length: 1024 }, (_, n) => index * 1024 + n)),
        close: frameClosed,
      });
      if (index === 1) abort?.abort();
    }
    async flush() {}
    close() { this.state = 'closed'; closed(); }
  }
  vi.stubGlobal('AudioDecoder', Decoder);
  vi.stubGlobal('EncodedAudioChunk', class { constructor(init: object) { Object.assign(this, init); } });
  return { closed, frameClosed, count: () => count };
}
afterEach(() => vi.unstubAllGlobals());
describe('raw AAC packet decoding', () => {
  it('retains every raw frame then applies priming and padding exactly once', async () => {
    const mock = decoderMock();
    const result = await decodeAacPackets(timeline(), context, new AbortController().signal);
    expect(result.length).toBe(88200); expect(result.getChannelData(0)[0]).toBe(1024);
    expect(result.getChannelData(0).at(-1)).toBe(89223);
    expect(mock.closed).toHaveBeenCalledOnce(); expect(mock.frameClosed).toHaveBeenCalledTimes(88);
  });
  it('rejects missing samples and wrong timestamps rather than padding or shifting', async () => {
    for (const options of [{ missing: true }, { badTimestamp: true }]) {
      const mock = decoderMock(options);
      await expect(decodeAacPackets(timeline(), context, new AbortController().signal)).rejects.toThrow();
      expect(mock.closed).toHaveBeenCalledOnce(); expect(mock.frameClosed).toHaveBeenCalled();
    }
  });
  it('closes the decoder and stops queueing when cancelled', async () => {
    const abort = new AbortController(), mock = decoderMock({ abort });
    await expect(decodeAacPackets(timeline(), context, abort.signal)).rejects.toThrow();
    expect(mock.count()).toBe(2); expect(mock.closed).toHaveBeenCalledOnce();
  });
  it('rejects oversized decode buffers before allocating PCM', async () => {
    decoderMock(); const allocate = vi.fn(context.createBuffer);
    const plan = { ...timeline(), packets: Array(24000).fill(new Uint8Array([1])), numberOfChannels: 2 };
    await expect(decodeAacPackets(plan, { createBuffer: allocate }, new AbortController().signal)).rejects.toThrow(/memory limit/i);
    expect(allocate).not.toHaveBeenCalled();
  });
});

it('container fallback uses raw packets instead of implicitly trimmed ADTS decoding',async()=>{
  const mock=decoderMock(), closed=vi.fn(), native=vi.fn(async()=>{throw new Error('Container unsupported');});
  class Context { state='running';decodeAudioData=native;createBuffer=context.createBuffer;async close(){this.state='closed';closed();} }
  vi.stubGlobal('AudioContext',Context);
  const file=new File([new Uint8Array(readFileSync('public/samples/media-conversion/example.m4a'))],'example.m4a');
  const result=await decodeAudio(file,new AbortController().signal,'mp4');
  expect(result.length).toBe(88200);expect(native).toHaveBeenCalledOnce();expect(closed).toHaveBeenCalledOnce();expect(mock.closed).toHaveBeenCalledOnce();
});

it('backpressures a delayed decoder and releases a pending dequeue wait on abort',async()=>{
  const abort=new AbortController();let queued=0,peak=0,closed=0;
  class Decoder extends EventTarget {
    state='unconfigured';decodeQueueSize=0;
    static async isConfigSupported(){return {supported:true};}
    configure(){this.state='configured';}
    decode(){this.decodeQueueSize++;queued++;peak=Math.max(peak,this.decodeQueueSize);if(this.decodeQueueSize===17)setTimeout(()=>abort.abort(),0);}
    async flush(){throw new Error('Should not flush after abort');}
    close(){this.state='closed';closed++;}
  }
  vi.stubGlobal('AudioDecoder',Decoder);vi.stubGlobal('EncodedAudioChunk',class{});
  await expect(decodeAacPackets(timeline(),context,abort.signal)).rejects.toThrow();
  expect(peak).toBe(17);expect(queued).toBe(17);expect(closed).toBe(1);
});
it('closes a configured decoder when flush fails',async()=>{
  const closed=vi.fn();
  class Decoder extends EventTarget {
    state='unconfigured';decodeQueueSize=0;
    static async isConfigSupported(){return {supported:true};}
    configure(){this.state='configured';}decode(){}async flush(){throw new Error('Codec failed');}close(){this.state='closed';closed();}
  }
  vi.stubGlobal('AudioDecoder',Decoder);vi.stubGlobal('EncodedAudioChunk',class{});
  await expect(decodeAacPackets(timeline(),context,new AbortController().signal)).rejects.toThrow('Codec failed');
  expect(closed).toHaveBeenCalledOnce();
});
