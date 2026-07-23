'use client';

/**
 * Simple QR code generator using a free API.
 * Falls back to a "copy link" message if the API fails.
 */
export async function generateQRCode(url: string, size = 200): Promise<string | null> {
  try {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=svg`;
    const response = await fetch(qrApiUrl);
    if (response.ok) {
      return qrApiUrl;
    }
    return null;
  } catch {
    return null;
  }
}

export default generateQRCode;
