'use client';

import QRCode from 'qrcode';

const STORAGE_PREFIX = 'qr_cache:';

const qrCache = new Map<string, string>();

function loadCacheFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      const value = localStorage.getItem(key);
      if (value) qrCache.set(key.slice(STORAGE_PREFIX.length), value);
    }
  } catch {
    // localStorage unavailable (private browsing, disabled, etc.) — fall back to in-memory only
  }
}

loadCacheFromStorage();

function saveToStorage(url: string, dataUrl: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + url, dataUrl);
  } catch {
    // storage full or unavailable — still cached in memory for this session
  }
}

/**
 * Generate QR code as data URL using client-side qrcode package.
 * Cached by URL (in-memory + localStorage) so repeat calls for the same
 * URL skip regeneration, even after a page reload.
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
    saveToStorage(url, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

export default generateQRCode;
