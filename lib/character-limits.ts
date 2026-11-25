// X (Twitter) limits for the Character Counter presets. Counts are plain string length;
// X weights links, emoji and some scripts differently, so the result is an estimate.
export const X_LIMITS = [
  { id: 'post', label: 'X post', limit: 280 },
  { id: 'bio', label: 'X bio', limit: 160 },
  { id: 'name', label: 'X display name', limit: 50 },
  { id: 'username', label: 'X username', limit: 15 },
] as const;

export type LimitPresetId = (typeof X_LIMITS)[number]['id'];

export function limitStatus(count: number, limit: number): { remaining: number; over: boolean } {
  return { remaining: limit - count, over: count > limit };
}
