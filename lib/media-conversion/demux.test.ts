import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { demuxAac } from './demux';
import { applyAacTimeline, decodeAudio } from './audio';
describe('AAC container fallback', () => {
  it.each(['mkv', 'm4a', 'mp4'])('extracts AAC from %s byte-for-byte equal to the independent ADTS fixture', ext => {
    const bytes = new Uint8Array(readFileSync(`public/samples/media-conversion/example.${ext}`));
    const adts = demuxAac(bytes, ext === 'mkv' ? 'mkv' : 'mp4');
    expect(adts.startSample).toBe(1024);
    expect(adts.endSample - adts.startSample).toBe(88200);
    // Independently remuxed fixture: every AAC packet and ADTS header must survive.
    expect(new Uint8Array(adts.data)).toEqual(new Uint8Array(readFileSync('public/samples/media-conversion/example.aac')));
  });
  it('rejects truncated and malformed containers', () => {
    expect(() => demuxAac(new Uint8Array([0]), 'mkv')).toThrow();
    expect(() => demuxAac(new Uint8Array([0]), 'mp4')).toThrow();
    for (const ext of ['mkv', 'mp4'] as const) {
      const bytes = new Uint8Array(readFileSync(`public/samples/media-conversion/example.${ext}`));
      expect(() => demuxAac(bytes.slice(0, bytes.length / 2), ext)).toThrow();
    }
  });
});

const u32 = (n: number) => { const b=Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const atom = (name: string, ...parts: Uint8Array[]) => { const payload=Buffer.concat(parts); return Buffer.concat([u32(payload.length+8),Buffer.from(name),payload]); };
const descriptor = (tag: number, payload: Buffer) => Buffer.concat([Buffer.from([tag,payload.length]),payload]);
function craftedMp4({start=0,duration=3072,rate=65536,deltas=[1024,1024,1024],edits=true}:{start?:number;duration?:number;rate?:number;deltas?:number[];edits?:boolean}={}) {
  const config=Buffer.from([0x12,0x08]);
  const es=descriptor(3,Buffer.concat([Buffer.from([0,1,0]),descriptor(4,Buffer.concat([Buffer.from([0x40]),Buffer.alloc(12),descriptor(5,config)]))]));
  const entry=atom('mp4a',Buffer.alloc(28),atom('esds',Buffer.alloc(4),es));
  const stbl=atom('stbl',atom('stsd',Buffer.alloc(4),u32(1),entry),atom('stsz',Buffer.alloc(4),u32(1),u32(3)),atom('stsc',Buffer.alloc(4),u32(1),u32(1),u32(3),u32(1)),atom('stco',Buffer.alloc(4),u32(1),u32(16)),atom('stts',Buffer.alloc(4),u32(deltas.length),...deltas.flatMap(delta=>[u32(1),u32(delta)])));
  const header=(ticks:number)=>Buffer.concat([Buffer.alloc(12),u32(44100),u32(ticks),Buffer.alloc(4)]);
  const edit=Buffer.alloc(20);edit.writeUInt32BE(1,4);edit.writeUInt32BE(duration,8);edit.writeInt32BE(start,12);edit.writeUInt32BE(rate,16);
  const trak=atom('trak',...(edits?[atom('edts',atom('elst',edit))]:[]),atom('mdia',atom('mdhd',header(deltas.reduce((a,b)=>a+b,0))),atom('hdlr',Buffer.alloc(8),Buffer.from('soun')),atom('minf',stbl)));
  return Buffer.concat([atom('ftyp'),atom('mdat',Buffer.from([1,2,3])),atom('moov',atom('mvhd',header(duration)),trak)]);
}
function ebml(id: number, payload: Uint8Array) { const hex=id.toString(16); const key=Buffer.from(hex.length%2?'0'+hex:hex,'hex'); let size=payload.length<127?Buffer.from([0x80|payload.length]):Buffer.from([0x40|(payload.length>>8),payload.length&255]); return Buffer.concat([key,size,payload]); }
const unsigned = (n:number) => { const b=Buffer.alloc(6); b.writeUIntBE(n,0,6); return b; };
function craftedMkv(timestamps=[0,23,46], delay=0, discard=0) {
  const track=ebml(0xae,Buffer.concat([ebml(0xd7,Buffer.from([1])),ebml(0x83,Buffer.from([2])),ebml(0x86,Buffer.from('A_AAC')),ebml(0x63a2,Buffer.from([0x12,0x08])),ebml(0x56aa,unsigned(delay))]));
  const blocks=timestamps.map((time,i)=> { const header=Buffer.alloc(4);header[0]=0x81;header.writeInt16BE(time,1);header[3]=0x80;const data=Buffer.concat([header,Buffer.from([i+1])]);return i===timestamps.length-1 && discard ? ebml(0xa0,Buffer.concat([ebml(0xa1,data),ebml(0x75a2,unsigned(discard))])):ebml(0xa3,data); });
  return ebml(0x18538067,Buffer.concat([ebml(0x1654ae6b,track),ebml(0x1f43b675,Buffer.concat([ebml(0xe7,Buffer.from([0])),...blocks]))]));
}
describe('independent AAC timing fixtures',()=>{
  it('carries exact MP4 presentation trims separately from encoded packets',()=>{
    const full=demuxAac(craftedMp4(),'mp4'),trimmed=demuxAac(craftedMp4({start:1024,duration:2048}),'mp4');
    expect(trimmed.data).toEqual(full.data);expect(trimmed.sampleRate).toBe(44100);expect(trimmed.startSample).toBe(1024);expect(trimmed.endSample).toBe(3072);
  });
  it('rejects empty edits, rate changes, out-of-range trims and non-AAC sample timing',()=>{
    for(const input of [craftedMp4({start:-1}),craftedMp4({rate:32768}),craftedMp4({start:2048,duration:2048}),craftedMp4({deltas:[1024,2048,1024]})]) expect(()=>demuxAac(input,'mp4')).toThrow();
  });
  it('accepts quantized continuous MKV timestamps and exact nanosecond priming/padding',()=>{
    const result=demuxAac(craftedMkv([0,23,46],23219955,23219955),'mkv');expect(result.startSample).toBe(1024);expect(result.endSample).toBe(2048);
  });
  it('rejects MKV gaps, overlaps, leading offsets and nonsample-aligned delay',()=>{
    for(const input of [craftedMkv([0,23,90]),craftedMkv([0,0,46]),craftedMkv([10,33,56]),craftedMkv([0,23,46],1000)]) expect(()=>demuxAac(input,'mkv')).toThrow();
  });
});

function pcm(length: number, sampleRate=44100) {
  const channels=[Float32Array.from({length},(_,i)=>i),Float32Array.from({length},(_,i)=>-i)];
  return {length,sampleRate,numberOfChannels:2,getChannelData:(channel:number)=>channels[channel],copyToChannel:(source:Float32Array,channel:number)=>channels[channel].set(source)} as unknown as AudioBuffer;
}
describe('decoded AAC presentation',()=>{
  const context={createBuffer:(_channels:number,length:number,rate:number)=>pcm(length,rate)} as Pick<AudioContext,'createBuffer'>;
  it('trims encoder priming and padding on every channel',()=>{
    const plan=demuxAac(craftedMp4({start:1024,duration:1024}),'mp4');
    const result=applyAacTimeline(pcm(3072),plan,context);
    expect(result.length).toBe(1024);expect(result.getChannelData(0)[0]).toBe(1024);expect(result.getChannelData(1)[1023]).toBe(-2047);
  });
  it('applies trims in the decoded sample rate and rejects truncated PCM',()=>{
    const plan=demuxAac(craftedMp4({start:1024,duration:1024}),'mp4');
    const result=applyAacTimeline(pcm(4096,48000),plan,context);
    expect(result.length).toBe(Math.round(1024*48000/44100));expect(result.getChannelData(0)[0]).toBe(Math.round(1024*48000/44100));
    expect(()=>applyAacTimeline(pcm(1024),plan,context)).toThrow();
  });
});

it('fallback decoding exposes trimmed PCM and closes its audio context',async()=>{
  const closed=vi.fn();
  class Context {
    state='running';calls=0;
    async decodeAudioData(bytes:ArrayBuffer) { if (++this.calls===1) throw new Error('Native container unsupported');expect(new Uint8Array(bytes)[0]).toBe(255);return pcm(3072); }
    createBuffer(_channels:number,length:number,rate:number) {return pcm(length,rate);}
    async close(){this.state='closed';closed();}
  }
  vi.stubGlobal('AudioContext',Context);
  try {
    const file=new File([new Uint8Array(craftedMp4({start:1024,duration:1024}))],'trimmed.m4a');
    const result=await decodeAudio(file,new AbortController().signal,'mp4');
    expect(result.length).toBe(1024);expect(result.getChannelData(0)[0]).toBe(1024);expect(closed).toHaveBeenCalledOnce();
  } finally {vi.unstubAllGlobals();}
});
