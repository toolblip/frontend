export const FAVICON_MIN_SIZE = 16;
export const FAVICON_MAX_SIZE = 512;
export const ICO_MAX_SIZE = 256;

export function parseFaviconSizeDraft(draft: string): number | null {
  const trimmed = draft.trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const size = Number(trimmed);
  if (!Number.isFinite(size) || !Number.isInteger(size)) return null;
  if (size < FAVICON_MIN_SIZE || size > FAVICON_MAX_SIZE) return null;

  return size;
}

export function escapeSvgText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
