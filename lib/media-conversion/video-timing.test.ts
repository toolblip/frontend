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
