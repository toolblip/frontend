export function isHeicFile(file: File): boolean {
  return /\.(heic|heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif';
}

/**
 * Browsers can't decode HEIC/HEIF via the native Image()/canvas pipeline -
 * iPhone photos default to this format, so any tool that feeds an upload
 * straight into `new Image()` silently fails on them (onload never fires,
 * canvas stays blank, no error surfaces). Converts to a JPEG File first;
 * returns the original file untouched for every other format.
 */
export async function convertHeicIfNeeded(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;

  const heic2any = (await import('heic2any')).default;
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
  const blob = Array.isArray(result) ? result[0] : result;
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
}
