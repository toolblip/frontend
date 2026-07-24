'use client';

import QRCode from 'qrcode';

/**
 * Generate QR code as data URL using client-side qrcode package.
 * Falls back to null if generation fails.
 */
export async function generateQRCode(url: string, size = 200): Promise<string | null> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch {
    return null;
  }
}

export default generateQRCode;
