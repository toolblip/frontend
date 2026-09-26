import { describe, expect, it } from 'vitest';
import { assertRecordingTiming } from './video';

describe('video recording clock validation', () => {
  it('accepts aligned clocks across short and long selections', () => {
    for (const elapsed of [0, 0.5, 1, 30, 60]) {
      expect(() => assertRecordingTiming(elapsed, elapsed + 0.03, elapsed + 0.01)).not.toThrow();
    }
  });

  it('rejects the observed slow playback before offering a stretched export', () => {
    expect(() => assertRecordingTiming(0.8, 0.39, 0.8)).toThrow(/keep this tab visible/i);
  });

  it('rejects two equally slow media clocks compared with recorder time', () => {
    expect(() => assertRecordingTiming(1.6, 1, 1)).toThrow(/out of sync/i);
  });

  it('rejects audio drift even when video keeps up', () => {
    expect(() => assertRecordingTiming(1, 1.02, 0.6)).toThrow(/out of sync/i);
  });

  it('rejects audio and video separated by more than the allowed skew', () => {
    expect(() => assertRecordingTiming(1, 1.14, 0.86)).toThrow(/out of sync/i);
  });
});

// Synthetic WebM envelopes exercise parsing; real encoder artifacts are checked
// separately by the scene probe using ffprobe and decoded source-scene matching.
import { validateRecordedWebM } from './video';
function join(...parts: Uint8Array[]) { return Buffer.concat(parts); }
function element(id: number, payload: Uint8Array, unknown = false): Uint8Array {
  const hex = id.toString(16);
  const key = Buffer.from(hex.length % 2 ? '0' + hex : hex, 'hex');
  const size = unknown ? Buffer.from([0xff]) : payload.length < 127 ? Buffer.from([128 | payload.length]) : Buffer.from([64 | (payload.length >> 8), payload.length & 255]);
  return join(key, size, payload);
}
function recorded(audio = [0, 998], video = [0, 967], unknown = false, laced = false) {
  const track = (id: number, type: number) => element(0xae, join(element(0xd7, Buffer.from([id])), element(0x83, Buffer.from([type]))));
  const block = (id: number, time: number) => { const bytes = Buffer.alloc(5); bytes[0] = 128 | id; bytes.writeInt16BE(time, 1); bytes[3] = laced ? 2 : 0; bytes[4] = 1; return element(0xa3, bytes); };
  return join(element(0x1a45dfa3, Buffer.alloc(0)), element(0x18538067, join(
    element(0x1654ae6b, join(track(1, 2), track(2, 1))),
    element(0x1f43b675, join(element(0xe7, Buffer.from([0])), ...audio.map(time => block(1, time)), ...video.map(time => block(2, time))), unknown),
  ), unknown));
}
describe('encoded WebM timing verification', () => {
  it.each([false, true])('accepts complete audio/video tracks with unknown lengths=%s', unknown => {
    expect(validateRecordedWebM(recorded(undefined, undefined, unknown), 1).map(track => track.count)).toEqual([2, 2]);
  });
  it('rejects the observed 250ms loss in both encoded tails', () => {
    expect(() => validateRecordedWebM(recorded([0, 731], [0, 733], true), 1)).toThrow(/encoder dropped.*try again/i);
  });
  it.each(['audio', 'video'])('rejects an independently truncated %s track', track => {
    expect(() => validateRecordedWebM(recorded(track === 'audio' ? [0, 730] : undefined, track === 'video' ? [0, 733] : undefined), 1)).toThrow(/encoder dropped/i);
  });
  it('rejects an offset recording even if both tails reach the requested end', () => {
    expect(() => validateRecordedWebM(recorded([300, 998], [300, 967]), 1)).toThrow(/encoder dropped/i);
  });
  it('rejects a stretched recording and nonmonotonic timestamps', () => {
    expect(() => validateRecordedWebM(recorded([0, 1300], [0, 1300]), 1)).toThrow(/encoder dropped/i);
    expect(() => validateRecordedWebM(recorded([0, 998, 500]), 1)).toThrow(/encoder dropped/i);
  });
  it('rejects missing packets, laced blocks and truncated payloads', () => {
    expect(() => validateRecordedWebM(recorded([]), 1)).toThrow(/encoder dropped/i);
    expect(() => validateRecordedWebM(recorded(undefined, undefined, false, true), 1)).toThrow(/could not be verified/i);
    expect(() => validateRecordedWebM(recorded().subarray(0, -1), 1)).toThrow(/could not be verified/i);
  });
  it('uses frame-aware tolerance for short clips and allows small codec preroll', () => {
    expect(() => validateRecordedWebM(recorded([0, 98], [0, 67]), 0.1)).not.toThrow();
    expect(() => validateRecordedWebM(recorded([0], [0]), 0.1)).toThrow(/encoder dropped/i);
    expect(() => validateRecordedWebM(recorded([-7, 998]), 1)).not.toThrow();
  });
  it('ends unknown clusters at element boundaries and reads later clusters', () => {
    const block = (track: number, time: number) => {
      const bytes = Buffer.alloc(5); bytes[0] = 128 | track; bytes.writeInt16BE(time, 1); bytes[4] = 1;
      return element(0xa3, bytes);
    };
    const second = element(0x1f43b675, join(element(0xe7, Buffer.from([3, 232])), block(1, 998), block(2, 967)));
    expect(validateRecordedWebM(join(recorded(undefined, undefined, true), second), 2).map(track => track.count)).toEqual([3, 3]);
  });
  it('bounds encoded byte size and element count', () => {
    expect(() => validateRecordedWebM(new Uint8Array(128 * 1024 * 1024 + 1), 1)).toThrow(/could not be verified/i);
    const emptyElements = Buffer.alloc(200002); for (let i = 0; i < emptyElements.length; i += 2) { emptyElements[i] = 0xec; emptyElements[i + 1] = 0x80; }
    expect(() => validateRecordedWebM(emptyElements, 1)).toThrow(/could not be verified/i);
  });
  it('rejects malformed variable integers and invalid expected durations', () => {
    expect(() => validateRecordedWebM(new Uint8Array([0, 0, 0, 0]), 1)).toThrow(/could not be verified/i);
    for (const duration of [NaN, Infinity, 0, 61]) expect(() => validateRecordedWebM(recorded(), duration)).toThrow(/could not be verified/i);
  });
});
