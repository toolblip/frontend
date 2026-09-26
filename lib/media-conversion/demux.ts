/** Bounded AAC-LC demux fallback; never interprets arbitrary container bytes as PCM. */
const invalid = (): never => { throw new Error('Unsupported or malformed AAC container. Fallback supports unencrypted AAC-LC in nonfragmented MP4 and unlaced MKV.'); };
export type AacTimeline = { data: ArrayBuffer; description: Uint8Array; packets: Uint8Array[]; numberOfChannels: number; sampleRate: number; startSample: number; endSample: number };
const timingError = (): never => { throw new Error('Unsupported AAC presentation timing: edits, gaps or delays cannot be represented safely.'); };
function aacRate(config: Uint8Array) {
  const rates = [96000,88200,64000,48000,44100,32000,24000,22050,16000,12000,11025,8000,7350];
  const rate = rates[((config[0] & 7) << 1) | (config[1] >> 7)];
  // AAC-LC, 1024-sample frames, no core dependency or active SBR extension.
  if (config.length < 2 || config[0] >> 3 !== 2 || !rate || (config[1] & 7) || (config.length !== 2 && !(config.length === 5 && config[2] === 0x56 && config[3] === 0xe5 && config[4] === 0))) return invalid();
  return rate;
}
function exactSamples(ticks: number, scale: number, rate: number) {
  const value = ticks * rate / scale;
  if (!scale || !Number.isSafeInteger(ticks * rate) || !Number.isSafeInteger(Math.round(value)) || Math.abs(value - Math.round(value)) > 1e-7) return timingError();
  return Math.round(value);
}
function timeline(config: Uint8Array, packets: Uint8Array[], startSample: number, endSample: number): AacTimeline {
  if (!Number.isSafeInteger(startSample) || !Number.isSafeInteger(endSample) || startSample < 0 || endSample <= startSample || endSample > packets.length * 1024) return timingError();
  return { data: adts(config, packets), description: config.slice(), packets, numberOfChannels: (config[1] >> 3) & 15, sampleRate: aacRate(config), startSample, endSample };
}
type Element = { id: number; start: number; end: number };
function adts(config: Uint8Array, packets: Uint8Array[]): ArrayBuffer {
  if (config.length < 2 || !packets.length) return invalid();
  const object = config[0] >> 3, frequency = ((config[0] & 7) << 1) | (config[1] >> 7), channels = (config[1] >> 3) & 15;
  if (object !== 2 || frequency > 12 || channels < 1 || channels > 2) return invalid();
  const size = packets.reduce((n, p) => n + 7 + p.length, 0);
  if (size > 24 * 1024 * 1024) return invalid();
  const result = new Uint8Array(size); let offset = 0;
  for (const p of packets) {
    const length = p.length + 7; if (length > 8191 || length === 7) return invalid();
    result.set([255, 241, ((object - 1) << 6) | (frequency << 2) | (channels >> 2), ((channels & 3) << 6) | (length >> 11), (length >> 3) & 255, ((length & 7) << 5) | 31, 252], offset);
    result.set(p, offset + 7); offset += length;
  }
  return result.buffer;
}
function mkv(bytes: Uint8Array): AacTimeline {
  const vint = (at: number, id = false) => {
    const first = bytes[at]; if (!first) return invalid(); let length = 1, mask = 128;
    while (!(first & mask)) { length++; mask >>= 1; }
    if (length > (id ? 4 : 8) || at + length > bytes.length) return invalid();
    let value = id ? first : first & (mask - 1), unknown = !id && value === mask - 1;
    for (let i = 1; i < length; i++) { value = value * 256 + bytes[at + i]; unknown = unknown && bytes[at + i] === 255; }
    if (!unknown && !Number.isSafeInteger(value)) return invalid();
    return { length, value, unknown };
  };
  const elements = (start: number, end: number) => {
    const result: Element[] = [];
    while (start < end) {
      const id = vint(start, true), size = vint(start + id.length), data = start + id.length + size.length;
      if (size.unknown && id.value !== 0x18538067) return invalid();
      const next = size.unknown ? end : data + size.value;
      if (next > end || next <= start) return invalid();
      result.push({ id: id.value, start: data, end: next }); start = next;
    }
    return result;
  };
  const uint = (e?: Element) => { if (!e || e.end - e.start > 6) return invalid(); let v = 0; for (let i = e.start; i < e.end; i++) v = v * 256 + bytes[i]; return v; };
  const segment = elements(0, bytes.length).find(e => e.id === 0x18538067); if (!segment) return invalid();
  const children = elements(segment.start, segment.end), tracks = children.find(e => e.id === 0x1654ae6b); if (!tracks) return invalid();
  let track = 0, config: Uint8Array | undefined, delayNs = 0, defaultDuration = 0;
  for (const entry of elements(tracks.start, tracks.end).filter(e => e.id === 0xae)) {
    const fields = elements(entry.start, entry.end); if (uint(fields.find(e => e.id === 0x83)) !== 2) continue;
    const codec = fields.find(e => e.id === 0x86), privateData = fields.find(e => e.id === 0x63a2);
    if (!codec || new TextDecoder().decode(bytes.slice(codec.start, codec.end)) !== 'A_AAC' || !privateData || fields.some(e => e.id === 0x6d80)) return invalid();
    if (fields.some(e => e.id === 0x23314f || e.id === 0x537f)) return timingError();
    delayNs = fields.some(e => e.id === 0x56aa) ? uint(fields.find(e => e.id === 0x56aa)) : 0;
    defaultDuration = fields.some(e => e.id === 0x23e383) ? uint(fields.find(e => e.id === 0x23e383)) : 0;
    track = uint(fields.find(e => e.id === 0xd7)); config = bytes.slice(privateData.start, privateData.end); break;
  }
  if (!config || !track) return invalid();
  const sampleRate = aacRate(config);
  const nsSamples = (ns: number) => {
    const samples = ns * sampleRate / 1e9, rounded = Math.round(samples);
    if (!Number.isSafeInteger(rounded) || Math.abs(samples - rounded) > sampleRate / 1e9 + 1e-8) return timingError();
    return rounded;
  };
  const delay = nsSamples(delayNs);
  if (defaultDuration && nsSamples(defaultDuration) !== 1024) return timingError();
  const info = children.find(e => e.id === 0x1549a966);
  const scaleElement = info && elements(info.start, info.end).find(e => e.id === 0x2ad7b1);
  const scale = scaleElement ? uint(scaleElement) : 1_000_000;
  if (!scale || scale >= 512 * 1e9 / sampleRate) return timingError();
  const packets: Uint8Array[] = [];
  let padding = 0;
  const block = (e: Element, clusterTime: number, group: Element[] = []) => {
    const t = vint(e.start); if (t.value !== track) return;
    const p = e.start + t.length;
    if (p + 3 >= e.end || (bytes[p + 2] & 6)) return invalid();
    if (padding) return timingError(); // Discard padding may only trim the final packet.
    const relative = new DataView(bytes.buffer, bytes.byteOffset + p, 2).getInt16(0);
    const timestamp = (clusterTime + relative) * scale;
    const expected = packets.length * 1024 * 1e9 / sampleRate;
    if (timestamp < 0 || (!packets.length && timestamp !== 0) || Math.abs(timestamp - expected) > scale) return timingError();
    const discard = group.find(e => e.id === 0x75a2);
    if (discard) {
      if (bytes[discard.start] & 128) return timingError();
      padding = nsSamples(uint(discard));
      if (padding > 1024) return timingError();
    }
    const duration = group.find(e => e.id === 0x9b);
    if (duration && Math.abs(uint(duration) * scale - (1024 - padding) * 1e9 / sampleRate) > scale) return timingError();
    packets.push(bytes.slice(p + 3, e.end));
  };
  for (const cluster of children.filter(e => e.id === 0x1f43b675)) {
    const fields = elements(cluster.start, cluster.end), clusterTime = uint(fields.find(e => e.id === 0xe7));
    for (const e of fields) {
      if (e.id === 0xa3) block(e, clusterTime);
      if (e.id === 0xa0) {
        const group = elements(e.start, e.end);
        if (group.filter(e => e.id === 0xa1).length !== 1) return invalid();
        block(group.find(e => e.id === 0xa1)!, clusterTime, group);
      }
    }
  }
  return timeline(config, packets, delay, packets.length * 1024 - padding);
}
function mp4(bytes: Uint8Array): AacTimeline {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u32 = (p: number) => { if (p < 0 || p + 4 > bytes.length) return invalid(); return view.getUint32(p); };
  type Box = { type: string; start: number; end: number };
  const boxes = (start: number, end: number): Box[] => {
    const result: Box[] = [];
    while (start < end) {
      if (start + 8 > end) return invalid(); let size = u32(start), header = 8;
      if (size === 1) { size = u32(start + 8) * 2 ** 32 + u32(start + 12); header = 16; }
      if (size === 0) size = end - start;
      if (size < header || start + size > end || !Number.isSafeInteger(size)) return invalid();
      result.push({ type: String.fromCharCode(...bytes.slice(start + 4, start + 8)), start: start + header, end: start + size }); start += size;
    }
    return result;
  };
  const child = (b: Box, type: string) => boxes(b.start, b.end).find(e => e.type === type) || invalid();
  const top = boxes(0, bytes.length), moov = top.find(e => e.type === 'moov'), mdats = top.filter(e => e.type === 'mdat');
  if (!moov || top.some(e => e.type === 'moof')) return invalid();
  for (const trak of boxes(moov.start, moov.end).filter(e => e.type === 'trak')) {
    const mdia = child(trak, 'mdia'), hdlr = child(mdia, 'hdlr');
    if (String.fromCharCode(...bytes.slice(hdlr.start + 8, hdlr.start + 12)) !== 'soun') continue;
    const stbl = child(child(mdia, 'minf'), 'stbl'), stsd = child(stbl, 'stsd');
    if (u32(stsd.start + 4) !== 1) return invalid();
    const entry = boxes(stsd.start + 8, stsd.end)[0];
    if (!entry || entry.type !== 'mp4a' || bytes[entry.start + 8] || bytes[entry.start + 9]) return invalid();
    const esds = boxes(entry.start + 28, entry.end).find(e => e.type === 'esds'); if (!esds) return invalid();
    // Parse ISO descriptor lengths and flags, rather than searching raw payload for a tag byte.
    const descriptor = (p: number, end: number): { tag: number; start: number; end: number } => {
      const tag = bytes[p++]; let size = 0, n = 0, b: number;
      do { if (p >= end || n++ === 4) return invalid(); b = bytes[p++]; size = size * 128 + (b & 127); } while (b & 128);
      if (p + size > end) return invalid(); return { tag, start: p, end: p + size };
    };
    const es = descriptor(esds.start + 4, esds.end); if (es.tag !== 3 || es.start + 3 > es.end) return invalid();
    let p = es.start + 3; const flags = bytes[es.start + 2];
    if (flags & 128) p += 2; if (flags & 64) p += 1 + bytes[p]; if (flags & 32) p += 2;
    const decoder = descriptor(p, es.end); if (decoder.tag !== 4 || bytes[decoder.start] !== 0x40) return invalid();
    const specific = descriptor(decoder.start + 13, decoder.end); if (specific.tag !== 5) return invalid();
    const config = bytes.slice(specific.start, specific.end);
    const stsz = child(stbl, 'stsz'), stsc = child(stbl, 'stsc');
    const fixed = u32(stsz.start + 4), count = u32(stsz.start + 8); if (!count || count > 100000 || (!fixed && stsz.start + 12 + count * 4 > stsz.end)) return invalid();
    const tables = boxes(stbl.start, stbl.end), offsets = tables.find(e => e.type === 'stco' || e.type === 'co64'); if (!offsets) return invalid();
    const chunks = u32(offsets.start + 4), wide = offsets.type === 'co64', entries = u32(stsc.start + 4);
    if (!entries || entries > chunks || stsc.start + 8 + entries * 12 > stsc.end || offsets.start + 8 + chunks * (wide ? 8 : 4) > offsets.end) return invalid();
    const map = Array.from({ length: entries }, (_, i) => ({ first: u32(stsc.start + 8 + i * 12), samples: u32(stsc.start + 12 + i * 12), description: u32(stsc.start + 16 + i * 12) }));
    if (map[0].first !== 1 || map.some((e, i) => e.description !== 1 || !e.samples || (i > 0 && e.first <= map[i - 1].first))) return invalid();
    let sample = 0, rule = 0; const packets: Uint8Array[] = [];
    for (let chunk = 1; chunk <= chunks; chunk++) {
      while (rule + 1 < map.length && map[rule + 1].first <= chunk) rule++;
      const at = offsets.start + 8 + (chunk - 1) * (wide ? 8 : 4); let offset = wide ? u32(at) * 2 ** 32 + u32(at + 4) : u32(at);
      for (let i = 0; i < map[rule].samples; i++) {
        if (sample >= count) return invalid(); const size = fixed || u32(stsz.start + 12 + sample * 4); sample++;
        if (!size || !Number.isSafeInteger(offset) || !mdats.some(m => offset >= m.start && offset + size <= m.end)) return invalid();
        packets.push(bytes.slice(offset, offset + size)); offset += size;
      }
    }
    if (sample !== count) return invalid();
    const sampleRate = aacRate(config);
    const header = (box: Box) => {
      const version = bytes[box.start];
      if (version > 1 || box.start + (version ? 32 : 20) > box.end) return invalid();
      const scale = u32(box.start + (version ? 20 : 12));
      const duration = version ? u32(box.start + 24) * 2 ** 32 + u32(box.start + 28) : u32(box.start + 16);
      if (!scale || !Number.isSafeInteger(duration)) return timingError();
      return { scale, duration };
    };
    const media = header(child(mdia, 'mdhd'));
    const stts = child(stbl, 'stts'), runs = u32(stts.start + 4);
    if (!runs || stts.start + 8 + runs * 8 !== stts.end || tables.some(e => e.type === 'ctts')) return timingError();
    let frames = 0, presentationSamples = 0;
    for (let i = 0; i < runs; i++) {
      const n = u32(stts.start + 8 + i * 8), delta = exactSamples(u32(stts.start + 12 + i * 8), media.scale, sampleRate);
      if (!n || delta < 1 || delta > 1024 || (delta !== 1024 && (i !== runs - 1 || n !== 1))) return timingError();
      frames += n; presentationSamples += n * delta;
    }
    if (frames !== count || exactSamples(media.duration, media.scale, sampleRate) !== presentationSamples) return timingError();
    let startSample = 0, endSample = presentationSamples;
    const edits = boxes(trak.start, trak.end).filter(e => e.type === 'edts');
    if (edits.length > 1) return timingError();
    if (edits.length) {
      const elst = child(edits[0], 'elst'), version = bytes[elst.start];
      if (version > 1 || u32(elst.start + 4) !== 1 || elst.end - elst.start !== (version ? 28 : 20)) return timingError();
      const movie = header(child(moov, 'mvhd'));
      const duration = version ? u32(elst.start + 8) * 2 ** 32 + u32(elst.start + 12) : u32(elst.start + 8);
      const mediaTime = version ? view.getInt32(elst.start + 16) * 2 ** 32 + u32(elst.start + 20) : view.getInt32(elst.start + 12);
      if (mediaTime < 0 || u32(elst.start + (version ? 24 : 16)) !== 65536) return timingError();
      startSample = exactSamples(mediaTime, media.scale, sampleRate);
      endSample = startSample + exactSamples(duration, movie.scale, sampleRate);
      if (endSample > presentationSamples) return timingError();
    }
    return timeline(config, packets, startSample, endSample);
  }
  return invalid();
}
export function demuxAac(bytes: Uint8Array, kind: 'mp4' | 'mkv'): AacTimeline {
  if (!bytes.length || bytes.length > 20 * 1024 * 1024) return invalid();
  return kind === 'mkv' ? mkv(bytes) : mp4(bytes);
}
