'use client';

import QRCode from 'qrcode';

const qrCache = new Map<string, string>();

/**
 * Generate QR code as data URL using client-side qrcode package.
 * Cached by URL so repeat calls for the same URL skip regeneration.
 * Falls back to null if generation fails.
 */
export async function generateQRCode(url: string, size = 200): Promise<string | null> {
  const cached = qrCache.get(url);
  if (cached) return cached;

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    qrCache.set(url, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

export default generateQRCode;
