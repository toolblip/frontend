import createModule from './vendor/jsquash-webp-1.5.0/codec/enc/webp_enc.js';
import { defaultOptions } from './vendor/jsquash-webp-1.5.0/meta.js';

let modulePromise;

function getModule() {
  if (!modulePromise) {
    modulePromise = createModule({
      locateFile: (filename) => new URL(`./vendor/jsquash-webp-1.5.0/codec/enc/${filename}`, import.meta.url).href,
    });
  }
  return modulePromise;
}

function getErrorMessage(err) {
  return err instanceof Error && err.message ? err.message : 'The local WebP encoder failed.';
}

function validateInput(data) {
  const { rgba, width, height, quality } = data || {};
  if (!(rgba instanceof ArrayBuffer)) {
    throw new Error('The local WebP encoder received invalid pixels.');
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('The local WebP encoder received invalid dimensions.');
  }
  if (rgba.byteLength !== width * height * 4) {
    throw new Error('The local WebP encoder received invalid pixel data.');
  }
  if (!Number.isFinite(quality) || quality < 0 || quality > 100) {
    throw new Error('The local WebP encoder received invalid quality.');
  }
  return { rgba, width, height, quality };
}

self.onmessage = async (event) => {
  try {
    const { rgba, width, height, quality } = validateInput(event.data);
    const module = await getModule();
    const result = module.encode(new Uint8Array(rgba), width, height, {
      ...defaultOptions,
      quality,
    });
    const bytes = result instanceof Uint8Array ? result : new Uint8Array(result);
    const copy = bytes.slice();
    self.postMessage({ ok: true, buffer: copy.buffer }, [copy.buffer]);
  } catch (err) {
    self.postMessage({
      ok: false,
      error: getErrorMessage(err),
    });
  }
};
