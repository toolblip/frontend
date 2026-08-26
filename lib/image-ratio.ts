export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function simplifyRatio(width: number, height: number): { w: number; h: number; decimal: number } {
  if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
    return { w: 0, h: 0, decimal: 0 };
  }
  const g = gcd(width, height);
  return {
    w: Math.round(width / g),
    h: Math.round(height / g),
    decimal: width / height,
  };
}

export const COMMON_RATIOS = [
  { label: '1:1 Square', ratio: 1 },
  { label: '16:9 Widescreen', ratio: 16 / 9 },
  { label: '9:16 Story', ratio: 9 / 16 },
  { label: '4:3 Classic', ratio: 4 / 3 },
  { label: '3:2 Photo', ratio: 3 / 2 },
  { label: '2:3 Portrait', ratio: 2 / 3 },
  { label: '21:9 Ultrawide', ratio: 21 / 9 },
  { label: 'Passport 35:45', ratio: 35 / 45 },
] as const;

export function nearestCommonRatio(decimal: number): { label: string; ratio: number } | null {
  if (decimal <= 0 || !Number.isFinite(decimal)) return null;
  let best = COMMON_RATIOS[0];
  let bestDelta = Math.abs(decimal - best.ratio);
  for (const preset of COMMON_RATIOS) {
    const delta = Math.abs(decimal - preset.ratio);
    if (delta < bestDelta) {
      best = preset;
      bestDelta = delta;
    }
  }
  return bestDelta / decimal < 0.02 ? best : null;
}
