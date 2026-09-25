'use client';

import { useEffect, useRef, useState } from 'react';
import {
  detectGeometryMimeType,
  formatGeometryBytesExact,
  getGeometryMimeLabel,
  getGeometrySourceNotes,
  validateGeometryFile,
  verifyGeometryOutputSignature,
} from '@/lib/image-geometry';
import {
  MAX_IMAGE_LAYOUT_AGGREGATE_PIXELS,
  MAX_IMAGE_LAYOUT_FILE_BYTES,
  MAX_IMAGE_LAYOUT_SOURCE_PIXELS,
  MAX_IMAGE_LAYOUT_SOURCE_SIDE,
  MAX_IMAGE_LAYOUT_TOTAL_BYTES,
  getImageLayoutAggregateError,
  getImageLayoutSourceBoundsError,
} from '@/lib/image-layout';

export type ImageLayoutItem = {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  notes: string[];
};

export type ImageLayoutResult = {
  url: string;
  blob: Blob;
  filename: string;
  width: number;
  height: number;
};

type ReadImageLayoutFileResult =
  | { item: ImageLayoutItem; error?: never; cancelled?: never }
  | { item?: never; error: string; cancelled?: never }
  | { item?: never; error?: never; cancelled: true };

let imageLayoutIdCounter = 0;

function createImageLayoutId() {
  imageLayoutIdCounter += 1;
  return `image-layout-${Date.now()}-${imageLayoutIdCounter}`;
}

function isAbortError(err: unknown) {
  return err instanceof DOMException && err.name === 'AbortError';
}

function createAbortError() {
  return new DOMException('The image load was cancelled.', 'AbortError');
}

function decodeImageDimensions(url: string, signal: AbortSignal) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    const image = new Image();
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener('abort', abort);
    };
    const abort = () => {
      cleanup();
      image.src = '';
      reject(createAbortError());
    };

    image.onload = () => {
      cleanup();
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('This image decoded with zero dimensions.'));
        return;
      }
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      cleanup();
      reject(new Error('This image could not be decoded. Try another file or upload a replacement.'));
    };
    signal.addEventListener('abort', abort, { once: true });
    image.src = url;
  });
}

function totalBytes(items: ImageLayoutItem[]) {
  return items.reduce((total, item) => total + item.size, 0);
}

function totalPixels(items: ImageLayoutItem[]) {
  return items.reduce((total, item) => total + item.width * item.height, 0);
}

function getTotalBytesError(bytes: number) {
  if (bytes > MAX_IMAGE_LAYOUT_TOTAL_BYTES) return 'Use a smaller batch. The total source file limit is 60 MiB.';
  return '';
}

export function getAcceptedImageLayoutFiles({
  files,
  existingCount,
  existingBytes,
  maxImages,
}: {
  files: File[];
  existingCount: number;
  existingBytes: number;
  maxImages: number;
}) {
  const accepted: File[] = [];
  const errors: string[] = [];
  let nextCount = existingCount;
  let nextBytes = existingBytes;

  for (const file of files) {
    const name = file.name || 'image';
    if (nextCount >= maxImages) {
      errors.push(`${name}: Remove an image before adding more. This tool accepts up to ${maxImages} images.`);
      continue;
    }
    if (file.size > MAX_IMAGE_LAYOUT_FILE_BYTES) {
      errors.push(`${name}: Choose an image up to 20 MiB.`);
      continue;
    }
    const bytesError = getTotalBytesError(nextBytes + file.size);
    if (bytesError) {
      errors.push(`${name}: ${bytesError}`);
      continue;
    }
    accepted.push(file);
    nextCount += 1;
    nextBytes += file.size;
  }

  return { files: accepted, errors };
}

async function readImageLayoutFile(
  file: File,
  {
    signal,
    registerObjectUrl,
    releaseObjectUrl,
  }: {
    signal: AbortSignal;
    registerObjectUrl: (url: string) => void;
    releaseObjectUrl: (url: string) => void;
  },
): Promise<ReadImageLayoutFileResult> {
  try {
    if (signal.aborted) return { cancelled: true };
    const detectedMimeType = await detectGeometryMimeType(file);
    if (signal.aborted) return { cancelled: true };

    const fileError = validateGeometryFile(file, detectedMimeType);
    if (fileError) return { error: `${file.name}: ${fileError}` };

    const url = URL.createObjectURL(file);
    registerObjectUrl(url);
    try {
      const dimensions = await decodeImageDimensions(url, signal);
      releaseObjectUrl(url);
      const boundsError = getImageLayoutSourceBoundsError(dimensions.width, dimensions.height);
      if (boundsError) {
        URL.revokeObjectURL(url);
        return { error: `${file.name}: ${boundsError}` };
      }
      return {
        item: {
          id: createImageLayoutId(),
          file,
          url,
          name: file.name || 'image',
          size: file.size,
          mimeType: detectedMimeType,
          width: dimensions.width,
          height: dimensions.height,
          notes: getGeometrySourceNotes(detectedMimeType),
        },
      };
    } catch (err) {
      releaseObjectUrl(url);
      URL.revokeObjectURL(url);
      if (isAbortError(err)) return { cancelled: true };
      return { error: `${file.name}: ${err instanceof Error ? err.message : 'This image could not be decoded.'}` };
    }
  } catch (err) {
    if (isAbortError(err)) return { cancelled: true };
    return { error: `${file.name}: ${err instanceof Error ? err.message : 'This image could not be loaded.'}` };
  }
}

export function getImageLayoutItemMeta(item: ImageLayoutItem) {
  return `${item.width} x ${item.height} px | ${getGeometryMimeLabel(item.mimeType)} | ${formatGeometryBytesExact(item.size)}`;
}

export function useImageLayoutImages(maxImages: number, onOutputInvalidated?: () => void) {
  const [items, setItems] = useState<ImageLayoutItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageLayoutResult | null>(null);
  const inputGenerationRef = useRef(0);
  const outputGenerationRef = useRef(0);
  const inputAbortRef = useRef<AbortController | null>(null);
  const pendingUrlsRef = useRef(new Set<string>());
  const resultUrlRef = useRef('');
  const itemsRef = useRef<ImageLayoutItem[]>([]);
  const onOutputInvalidatedRef = useRef(onOutputInvalidated);
  onOutputInvalidatedRef.current = onOutputInvalidated;

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const registerPendingUrl = (url: string) => {
    pendingUrlsRef.current.add(url);
  };

  const releasePendingUrl = (url: string) => {
    pendingUrlsRef.current.delete(url);
  };

  const revokePendingUrls = () => {
    pendingUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    pendingUrlsRef.current.clear();
  };

  const cancelInputWork = () => {
    inputGenerationRef.current += 1;
    inputAbortRef.current?.abort();
    inputAbortRef.current = null;
    revokePendingUrls();
    setLoading(false);
  };

  const clearResult = () => {
    outputGenerationRef.current += 1;
    onOutputInvalidatedRef.current?.();
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
  };

  const setOutput = (next: ImageLayoutResult) => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = next.url;
    setResult(next);
  };

  const beginOutputAttempt = () => {
    clearResult();
    outputGenerationRef.current += 1;
    return outputGenerationRef.current;
  };

  const isCurrentAttempt = (id: number) => id === outputGenerationRef.current;

  const beginInputAttempt = () => {
    cancelInputWork();
    const controller = new AbortController();
    inputAbortRef.current = controller;
    setLoading(true);
    return { generation: inputGenerationRef.current, controller };
  };

  const isCurrentInputAttempt = (generation: number, controller: AbortController) => (
    generation === inputGenerationRef.current && inputAbortRef.current === controller && !controller.signal.aborted
  );

  const finishInputAttempt = (generation: number, controller: AbortController) => {
    if (!isCurrentInputAttempt(generation, controller)) return;
    inputAbortRef.current = null;
    setLoading(false);
  };

  const addFiles = async (files: File[], options: { replaceAll?: boolean } = {}) => {
    const imageFiles = files;
    if (imageFiles.length === 0) return;
    const { generation, controller } = beginInputAttempt();
    setErrors([]);
    clearResult();

    const baseItems = options.replaceAll ? [] : itemsRef.current;
    const planned = getAcceptedImageLayoutFiles({
      files: imageFiles,
      existingCount: baseItems.length,
      existingBytes: totalBytes(baseItems),
      maxImages,
    });
    const nextErrors = [...planned.errors];
    let nextItems = [...baseItems];
    const loadedItems: ImageLayoutItem[] = [];

    try {
      for (const file of planned.files) {
        if (!isCurrentInputAttempt(generation, controller)) break;
        const loaded = await readImageLayoutFile(file, {
          signal: controller.signal,
          registerObjectUrl: registerPendingUrl,
          releaseObjectUrl: releasePendingUrl,
        });
        if (loaded.cancelled) break;
        if (loaded.error || !loaded.item) {
          if (loaded.error) nextErrors.push(loaded.error);
          continue;
        }
        const aggregateError = getImageLayoutAggregateError([...nextItems, loaded.item]);
        if (aggregateError) {
          URL.revokeObjectURL(loaded.item.url);
          nextErrors.push(`${loaded.item.name}: ${aggregateError}`);
          continue;
        }
        nextItems = [...nextItems, loaded.item];
        loadedItems.push(loaded.item);
      }

      if (!isCurrentInputAttempt(generation, controller)) {
        loadedItems.forEach((item) => URL.revokeObjectURL(item.url));
        return;
      }

      const previousItems = itemsRef.current;
      if (options.replaceAll) previousItems.forEach((item) => URL.revokeObjectURL(item.url));
      itemsRef.current = nextItems;
      setItems(nextItems);
      setErrors(nextErrors);
    } finally {
      finishInputAttempt(generation, controller);
    }
  };

  const replaceFile = async (id: string, file: File | null) => {
    if (!file) return;
    const { generation, controller } = beginInputAttempt();
    setErrors([]);
    clearResult();

    try {
      const loaded = await readImageLayoutFile(file, {
        signal: controller.signal,
        registerObjectUrl: registerPendingUrl,
        releaseObjectUrl: releasePendingUrl,
      });
      if (!isCurrentInputAttempt(generation, controller) || loaded.cancelled) {
        if (loaded.item) URL.revokeObjectURL(loaded.item.url);
        return;
      }
      if (loaded.error || !loaded.item) {
        setErrors([loaded.error ?? `${file.name}: This image could not be loaded.`]);
        return;
      }

      const previous = itemsRef.current;
      const index = previous.findIndex((item) => item.id === id);
      if (index === -1) {
        URL.revokeObjectURL(loaded.item.url);
        return;
      }

      const next = previous.map((item, itemIndex) => itemIndex === index ? loaded.item! : item);
      const bytesError = getTotalBytesError(totalBytes(next));
      const aggregateError = getImageLayoutAggregateError(next);
      if (bytesError || aggregateError) {
        URL.revokeObjectURL(loaded.item.url);
        setErrors([`${loaded.item.name}: ${bytesError || aggregateError}`]);
        return;
      }
      URL.revokeObjectURL(previous[index].url);
      itemsRef.current = next;
      setItems(next);
    } finally {
      finishInputAttempt(generation, controller);
    }
  };

  const removeItem = (id: string) => {
    cancelInputWork();
    clearResult();
    setErrors([]);
    const previous = itemsRef.current;
    const removed = previous.find((item) => item.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    const next = previous.filter((item) => item.id !== id);
    itemsRef.current = next;
    setItems(next);
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    cancelInputWork();
    clearResult();
    const previous = itemsRef.current;
    const index = previous.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= previous.length) return;
    const next = [...previous];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    itemsRef.current = next;
    setItems(next);
  };

  const clearAll = () => {
    cancelInputWork();
    outputGenerationRef.current += 1;
    setLoading(false);
    setErrors([]);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    itemsRef.current = [];
    setItems([]);
  };

  useEffect(() => () => {
    cancelInputWork();
    outputGenerationRef.current += 1;
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  return {
    items,
    errors,
    loading,
    result,
    addFiles,
    replaceFile,
    removeItem,
    moveItem,
    clearAll,
    clearResult,
    cancelInputWork,
    beginOutputAttempt,
    isCurrentAttempt,
    setOutput,
    setErrors,
    totalBytes: totalBytes(items),
    totalPixels: totalPixels(items),
    sourceLimitText: `Each image: 20 MiB, 8192 px per side, 32 MP. Batch: 60 MiB and ${MAX_IMAGE_LAYOUT_AGGREGATE_PIXELS / 1_000_000} MP decoded.`,
    boundsText: `Output limit: ${MAX_IMAGE_LAYOUT_SOURCE_SIDE} px per side and ${MAX_IMAGE_LAYOUT_SOURCE_PIXELS / 1_000_000} MP.`,
  };
}

export async function canvasToVerifiedPngResult(canvas: HTMLCanvasElement, filename: string) {
  const width = canvas.width;
  const height = canvas.height;
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    try {
      canvas.toBlob((nextBlob) => resolve(nextBlob), 'image/png');
    } catch (err) {
      reject(err);
    }
  });
  if (!blob) throw new Error('The PNG export returned empty bytes. Try again with fewer or smaller images.');
  if (blob.type && blob.type.toLowerCase() !== 'image/png') {
    throw new Error('The browser did not return valid PNG bytes. Try again or use another browser.');
  }
  const signature = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (!verifyGeometryOutputSignature(signature, 'image/png')) {
    throw new Error('The browser did not return valid PNG bytes. Try again or use another browser.');
  }
  return {
    url: URL.createObjectURL(blob),
    blob,
    filename,
    width,
    height,
  };
}
