export const FAVICON_MIN_SIZE = 16;
export const FAVICON_MAX_SIZE = 512;
export const ICO_MAX_SIZE = 256;
export const FAVICON_TEXT_MAX_GRAPHEMES = 4;
export const LOGO_FILE_ACCEPT = 'image/png,image/jpeg,image/webp,image/svg+xml';
export const LOGO_FILE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);
export const EMOJI_FONT_FAMILY = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
export const TEXT_FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export type ContainFitInput = {
  sourceWidth: number;
  sourceHeight: number;
  targetSize: number;
  paddingPercent: number;
};

export type ContainFit = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FaviconTextMode = 'emoji' | 'text';

export type FaviconTextSvgInput = {
  mode: FaviconTextMode;
  text: string;
  size: number;
  padding: number;
  background: string;
  foreground: string;
  transparent: boolean;
  fontSize: number;
};

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

export const escapeSvgAttribute = escapeSvgText;

export function splitGraphemes(value: string): string[] {
  const normalized = value.trim();
  if (!normalized) return [];

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(normalized), (segment) => segment.segment);
  }

  return Array.from(normalized);
}

export function normalizeFaviconText(value: string, maxGraphemes = FAVICON_TEXT_MAX_GRAPHEMES): string {
  return splitGraphemes(value).slice(0, maxGraphemes).join('');
}

export function getContainFit({
  sourceWidth,
  sourceHeight,
  targetSize,
  paddingPercent,
}: ContainFitInput): ContainFit | null {
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    !Number.isFinite(targetSize) ||
    !Number.isFinite(paddingPercent) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    targetSize <= 0 ||
    paddingPercent < 0 ||
    paddingPercent >= 50
  ) {
    return null;
  }

  const padding = targetSize * (paddingPercent / 100);
  const innerSize = targetSize - padding * 2;
  if (innerSize <= 0) return null;

  const scale = Math.min(innerSize / sourceWidth, innerSize / sourceHeight);
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  if (width <= 0 || height <= 0) return null;

  return {
    x: Math.round((targetSize - width) / 2),
    y: Math.round((targetSize - height) / 2),
    width,
    height,
  };
}

export function clampIcoExportSize(size: number): number {
  return Math.min(size, ICO_MAX_SIZE);
}

export function getFaviconTextFontFamily(mode: FaviconTextMode): string {
  return mode === 'emoji' ? EMOJI_FONT_FAMILY : TEXT_FONT_FAMILY;
}

export function getInitialFaviconTextFontSize(mode: FaviconTextMode, text: string, size: number): number {
  if (mode === 'emoji') return size * 0.64;
  return size * (splitGraphemes(text).length > 2 ? 0.48 : 0.58);
}

export function getFaviconTextFontWeight(mode: FaviconTextMode): string {
  return mode === 'emoji' ? '400' : '700';
}

export function getFaviconCanvasFont(mode: FaviconTextMode, fontSize: number): string {
  return `${getFaviconTextFontWeight(mode)} ${fontSize}px ${getFaviconTextFontFamily(mode)}`;
}

export function fitFaviconTextFontSize({
  mode,
  text,
  size,
  padding,
  measureText,
}: {
  mode: FaviconTextMode;
  text: string;
  size: number;
  padding: number;
  measureText: (font: string, text: string) => number;
}): number {
  const maxWidth = size * (1 - padding / 50);
  let fontSize = getInitialFaviconTextFontSize(mode, text, size);

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const font = getFaviconCanvasFont(mode, fontSize);
    if (measureText(font, text) <= maxWidth) break;
    fontSize *= 0.9;
  }

  return fontSize;
}

export function buildFaviconTextSvg({
  mode,
  text,
  size,
  background,
  foreground,
  transparent,
  fontSize,
}: FaviconTextSvgInput): string {
  const backgroundRect = transparent
    ? ''
    : `<rect width="${size}" height="${size}" rx="${Math.max(3, size * 0.18)}" fill="${escapeSvgAttribute(background)}"/>`;
  const family = escapeSvgAttribute(getFaviconTextFontFamily(mode));
  const weight = getFaviconTextFontWeight(mode);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img">${backgroundRect}<text x="50%" y="53.5%" dominant-baseline="middle" text-anchor="middle" font-family="${family}" font-size="${fontSize}" font-weight="${weight}" fill="${escapeSvgAttribute(foreground)}">${escapeSvgText(text)}</text></svg>`;
}
