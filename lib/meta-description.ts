export const META_DESCRIPTION_MIN = 110;
export const META_DESCRIPTION_MAX = 155;

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function splitSentences(text: string): string[] {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Clamp a meta description to `max` characters. Keeps whole sentences when at
 * least `min` characters survive, otherwise cuts at the last word boundary.
 * Never invents text.
 */
export function clampMetaDescription(
  description: string,
  { min = META_DESCRIPTION_MIN, max = META_DESCRIPTION_MAX }: { min?: number; max?: number } = {},
): string {
  const text = normalizeWhitespace(description);
  if (text.length <= max) return text;

  let kept = '';
  for (const sentence of splitSentences(text)) {
    const next = kept ? `${kept} ${sentence}` : sentence;
    if (next.length > max) break;
    kept = next;
  }
  if (kept.length >= min) return kept;

  const boundary = text.lastIndexOf(' ', max);
  const cut = boundary >= 25 ? text.slice(0, boundary) : text.slice(0, max);
  return cut.replace(/[\s,;:\-–—(]+$/, '').trim();
}
