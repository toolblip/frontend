'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { encodeImageOptimizerWebp } from '@/lib/image-optimizer-webp';
import styles from './ImageOptimizerClient.module.css';

type OutputFormat = 'jpeg' | 'png' | 'webp';
type ImageDimensions = { width: number; height: number };
type OptimizerValidation =
  | { valid: true; width: number; height: number; error: '' }
  | { valid: false; width: 0; height: 0; error: string };

type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
  detectedMimeType: string;
  notes: string[];
};

type OptimizerResult = {
  url: string;
  fileName: string;
  blob: Blob;
  width: number;
  height: number;
  formatLabel: string;
  actualQuality: number | null;
  qualityAutoReduced: boolean;
  keptOriginal: boolean;
  couldMakeSmaller: boolean;
  notes: string[];
};

type SizeAwareOptimizerEncodeResult = {
  blob: Blob | null;
  actualQuality: number | null;
  qualityAutoReduced: boolean;
  couldMakeSmaller: boolean;
  failed: boolean;
  cancelled: boolean;
  mimeMismatch: boolean;
  error?: string;
};

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_CANVAS_SIDE = 8192;
const MAX_CANVAS_PIXELS = 32_000_000;
const DEFAULT_QUALITY = 82;
const MIN_QUALITY = 35;
const QUALITY_RETRY_STEP = 10;
const SAMPLE_URL = '/samples/image-resizer-mountain.jpg';
const SAMPLE_NAME = 'image-optimizer-photo.jpg';
const SAMPLE_MIME = 'image/jpeg';
const ACCEPTED_TYPES = '.png,.jpg,.jpeg,.webp,.gif,.svg,image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

const FORMAT_OPTIONS: Record<OutputFormat, { mimeType: string; extension: 'jpg' | 'png' | 'webp'; label: 'JPEG' | 'PNG' | 'WebP'; qualityApplies: boolean }> = {
  jpeg: { mimeType: 'image/jpeg', extension: 'jpg', label: 'JPEG', qualityApplies: true },
  png: { mimeType: 'image/png', extension: 'png', label: 'PNG', qualityApplies: false },
  webp: { mimeType: 'image/webp', extension: 'webp', label: 'WebP', qualityApplies: true },
};

const MIME_TO_FORMAT: Record<string, OutputFormat> = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function validateOptimizerDimensions(rawWidth: number, rawHeight: number): OptimizerValidation {
  if (!Number.isFinite(rawWidth) || !Number.isFinite(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Enter a width and height before optimizing.' };
  }

  if (!Number.isInteger(rawWidth) || !Number.isInteger(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be whole pixels.' };
  }

  if (rawWidth < 1 || rawHeight < 1) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be at least 1 pixel.' };
  }

  if (rawWidth > MAX_CANVAS_SIDE || rawHeight > MAX_CANVAS_SIDE) {
    return { valid: false, width: 0, height: 0, error: `Use dimensions up to ${MAX_CANVAS_SIDE} px on each side.` };
  }

  if (rawWidth * rawHeight > MAX_CANVAS_PIXELS) {
    return { valid: false, width: 0, height: 0, error: 'Use a smaller output size, up to 32 megapixels.' };
  }

  return { valid: true, width: rawWidth, height: rawHeight, error: '' };
}

export function getImageOptimizerOutputDimensions({
  sourceWidth,
  sourceHeight,
  widthInput,
  heightInput,
  maintainAspectRatio,
}: {
  sourceWidth: number;
  sourceHeight: number;
  widthInput: number;
  heightInput: number;
  maintainAspectRatio: boolean;
}): ImageDimensions {
  if (!maintainAspectRatio) {
    return { width: widthInput, height: heightInput };
  }

  const ratio = Math.min(widthInput / sourceWidth, heightInput / sourceHeight, 1);
  return {
    width: Math.max(1, Math.round(sourceWidth * ratio)),
    height: Math.max(1, Math.round(sourceHeight * ratio)),
  };
}

export async function encodeImageOptimizerBlobWithSizeAwareness({
  originalBytes,
  requestedMimeType,
  maxQuality,
  encode,
  isCancelled,
}: {
  originalBytes: number;
  requestedMimeType: string;
  maxQuality: number;
  encode: (mimeType: string, quality?: number) => Promise<Blob | null>;
  isCancelled: () => boolean;
}): Promise<SizeAwareOptimizerEncodeResult> {
  const qualityApplies = requestedMimeType === 'image/jpeg' || requestedMimeType === 'image/webp';
  const maxCandidateQuality = Math.min(100, Math.max(MIN_QUALITY, Math.round(maxQuality)));
  const candidates: Array<number | null> = qualityApplies ? [] : [null];

  if (qualityApplies) {
    for (let nextQuality = maxCandidateQuality; nextQuality > MIN_QUALITY; nextQuality -= QUALITY_RETRY_STEP) {
      candidates.push(nextQuality);
    }
    if (candidates[candidates.length - 1] !== MIN_QUALITY) candidates.push(MIN_QUALITY);
  }

  const cancelledResult = (): SizeAwareOptimizerEncodeResult => ({
    blob: null,
    actualQuality: null,
    qualityAutoReduced: false,
    couldMakeSmaller: false,
    failed: false,
    cancelled: true,
    mimeMismatch: false,
  });
  const failedResult = (error?: string): SizeAwareOptimizerEncodeResult => ({
    blob: null,
    actualQuality: null,
    qualityAutoReduced: false,
    couldMakeSmaller: false,
    failed: true,
    cancelled: false,
    mimeMismatch: false,
    ...(error ? { error } : {}),
  });

  let best: { blob: Blob; quality: number | null } | null = null;

  for (const candidateQuality of candidates) {
    if (isCancelled()) {
      return cancelledResult();
    }

    let blob: Blob | null;
    try {
      blob = await encode(requestedMimeType, candidateQuality == null ? undefined : candidateQuality / 100);
    } catch (err) {
      if (isCancelled()) return cancelledResult();
      return failedResult(err instanceof Error && err.message ? err.message : undefined);
    }

    if (isCancelled()) {
      return cancelledResult();
    }

    if (!blob) {
      return failedResult();
    }

    const actualMimeType = (blob.type || '').toLowerCase();
    if (actualMimeType !== requestedMimeType) {
      return { blob: null, actualQuality: null, qualityAutoReduced: false, couldMakeSmaller: false, failed: true, cancelled: false, mimeMismatch: true };
    }

    const recordedQuality = qualityApplies ? candidateQuality : null;
    if (!best || blob.size < best.blob.size) best = { blob, quality: recordedQuality };
    if (!qualityApplies || blob.size < originalBytes) break;
  }

  if (!best) {
    return failedResult();
  }

  return {
    blob: best.blob,
    actualQuality: best.quality,
    qualityAutoReduced: best.quality != null && best.quality < maxCandidateQuality,
    couldMakeSmaller: best.blob.size < originalBytes,
    failed: false,
    cancelled: false,
    mimeMismatch: false,
  };
}

export function getImageOptimizerOutputPolicy({
  original,
  encoded,
  originalName,
  requestedMimeType,
  requestedFilename,
  originalDimensions,
  outputDimensions,
}: {
  original: Blob;
  encoded: Blob;
  originalName: string;
  requestedMimeType: string;
  requestedFilename: string;
  originalDimensions: ImageDimensions;
  outputDimensions: ImageDimensions;
}) {
  const sameFormat = normalizeMime(original.type) === requestedMimeType;
  const sameDimensions = originalDimensions.width === outputDimensions.width && originalDimensions.height === outputDimensions.height;

  if (sameFormat && sameDimensions && encoded.size >= original.size) {
    return {
      blob: original,
      fileName: getCanonicalFileNameForMime(originalName, requestedMimeType),
      keptOriginal: true,
      note: 'No smaller export was available with the same format and size, so the original file is kept.',
    };
  }

  return {
    blob: encoded,
    fileName: requestedFilename,
    keptOriginal: false,
    note: encoded.size >= original.size ? 'This export is larger than the original because the requested size or format changed.' : null,
  };
}

export function getCanonicalOptimizerSourceFile(file: File, detectedMimeType: string) {
  const declared = normalizeMime(file.type);
  if (declared === detectedMimeType) return file;
  return new File([file], file.name, { type: detectedMimeType, lastModified: file.lastModified });
}

function normalizeMime(mimeType: string) {
  const normalized = mimeType.toLowerCase();
  return normalized === 'image/jpg' ? 'image/jpeg' : normalized;
}

function getSafeBaseName(fileName: string) {
  return (fileName.replace(/\.[^.]+$/, '').trim() || 'image').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

function getExtensionForMime(mimeType: string): 'jpg' | 'png' | 'webp' {
  const normalized = normalizeMime(mimeType);
  if (normalized === 'image/jpeg') return 'jpg';
  if (normalized === 'image/webp') return 'webp';
  return 'png';
}

function getCanonicalFileNameForMime(fileName: string, mimeType: string) {
  return `${getSafeBaseName(fileName)}.${getExtensionForMime(mimeType)}`;
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 bytes';
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatBytesWithExact(bytes: number) {
  return `${formatBytes(bytes)} (${bytes.toLocaleString()} bytes)`;
}

function getFileExtension(fileName: string) {
  return fileName.toLowerCase().split('.').pop() || '';
}

function inferAllowedTypeFromName(fileName: string) {
  const extension = getFileExtension(fileName);
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'svg') return 'image/svg+xml';
  return '';
}

async function detectImageMimeType(file: File) {
  const header = new Uint8Array(await file.slice(0, 512).arrayBuffer());
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return 'image/jpeg';
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) return 'image/png';
  if (String.fromCharCode(...header.slice(0, 4)) === 'RIFF' && String.fromCharCode(...header.slice(8, 12)) === 'WEBP') return 'image/webp';
  if (String.fromCharCode(...header.slice(0, 3)) === 'GIF') return 'image/gif';
  const text = new TextDecoder('utf-8', { fatal: false }).decode(header).trimStart().toLowerCase();
  if (text.startsWith('<svg') || text.includes('<svg')) return 'image/svg+xml';
  return '';
}

function getSourceNotes(mimeType: string) {
  if (mimeType === 'image/gif') return ['GIF is optimized as a still frame. Animation is not kept.'];
  if (mimeType === 'image/svg+xml') return ['SVG is rasterized to pixels before export.'];
  return [];
}

function getDefaultFormat(mimeType: string): OutputFormat {
  return MIME_TO_FORMAT[normalizeMime(mimeType)] ?? 'png';
}

function getDownloadName(fileName: string, format: OutputFormat, dimensions: ImageDimensions) {
  const option = FORMAT_OPTIONS[format];
  return `${getSafeBaseName(fileName)}-optimized-${dimensions.width}x${dimensions.height}.${option.extension}`;
}

function getSizeChangeLabel(originalBytes: number, outputBytes: number, keptOriginal: boolean) {
  if (keptOriginal) return 'Original kept, no size reduction';
  const delta = outputBytes - originalBytes;
  if (delta === 0) return 'Same size';
  const percent = originalBytes > 0 ? Math.abs(delta / originalBytes * 100) : 0;
  if (delta < 0) return `${percent.toFixed(1)}% smaller`;
  return `${percent.toFixed(1)}% larger`;
}

function fileMismatchError(file: File, detectedMimeType: string) {
  const declared = normalizeMime(file.type);
  const named = inferAllowedTypeFromName(file.name);
  const typeToCheck = declared.startsWith('image/') ? declared : named;
  if (!detectedMimeType || !typeToCheck) return '';
  if (typeToCheck !== detectedMimeType) {
    return `This file looks like ${detectedMimeType.replace('image/', '').toUpperCase()}, but its name or MIME type says ${typeToCheck.replace('image/', '').toUpperCase()}. Rename or export it correctly first.`;
  }
  return '';
}

export default function ImageOptimizerClient() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [widthInput, setWidthInput] = useState(0);
  const [heightInput, setHeightInput] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const loadId = useRef(0);
  const encodeId = useRef(0);
  const encodeAbortRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    loadId.current++;
    encodeId.current++;
    encodeAbortRef.current?.abort();
    encodeAbortRef.current = null;
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  const clearResult = () => {
    encodeId.current++;
    encodeAbortRef.current?.abort();
    encodeAbortRef.current = null;
    setOptimizing(false);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
  };

  const revokeSource = () => {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = '';
    }
  };

  const clear = () => {
    loadId.current++;
    clearResult();
    revokeSource();
    setSource(null);
    setWidthInput(0);
    setHeightInput(0);
    setMaintainAspectRatio(true);
    setFormat('jpeg');
    setQuality(DEFAULT_QUALITY);
    setError('');
    setLoading(false);
    setOptimizing(false);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const invalidateForSettingChange = () => {
    clearResult();
    setError('');
  };

  const loadFile = async (file: File, options: { autoOptimize?: boolean } = {}) => {
    const id = ++loadId.current;
    clearResult();
    revokeSource();
    setSource(null);
    setError('');
    setLoading(true);
    setIsDragging(false);

    const fail = (message: string) => {
      if (id !== loadId.current) return;
      revokeSource();
      setSource(null);
      setResult(null);
      setWidthInput(0);
      setHeightInput(0);
      setLoading(false);
      setOptimizing(false);
      setError(message);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (file.size > MAX_UPLOAD_BYTES) {
      fail('Choose an image up to 20 MiB.');
      return;
    }

    const declared = normalizeMime(file.type);
    const declaredOrNamed = declared.startsWith('image/') ? declared : inferAllowedTypeFromName(file.name);
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'].includes(declaredOrNamed)) {
      fail('Choose a PNG, JPEG, WebP, GIF, or SVG image.');
      return;
    }

    let detectedMimeType = '';
    try {
      detectedMimeType = await detectImageMimeType(file);
    } catch {
      fail('This file could not be read. Try another image.');
      return;
    }

    if (id !== loadId.current) return;
    if (!detectedMimeType) {
      fail('This does not look like a supported image file.');
      return;
    }

    const mismatch = fileMismatchError(file, detectedMimeType);
    if (mismatch) {
      fail(mismatch);
      return;
    }

    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current) return;
      const decodedWidth = img.naturalWidth;
      const decodedHeight = img.naturalHeight;
      const validation = validateOptimizerDimensions(decodedWidth, decodedHeight);
      if (!validation.valid) {
        fail(validation.error);
        return;
      }
      const canonicalFile = getCanonicalOptimizerSourceFile(file, detectedMimeType);
      const nextSource = {
        file: canonicalFile,
        url,
        width: decodedWidth,
        height: decodedHeight,
        detectedMimeType,
        notes: getSourceNotes(detectedMimeType),
      };
      const nextFormat = getDefaultFormat(detectedMimeType);
      setSource(nextSource);
      setWidthInput(decodedWidth);
      setHeightInput(decodedHeight);
      setMaintainAspectRatio(true);
      setFormat(nextFormat);
      setQuality(DEFAULT_QUALITY);
      setLoading(false);
      setError('');
      if (options.autoOptimize) {
        void optimizeWithSource(nextSource, {
          widthInput: decodedWidth,
          heightInput: decodedHeight,
          maintainAspectRatio: true,
          format: nextFormat,
          quality: DEFAULT_QUALITY,
        });
      }
    };
    img.onerror = () => fail('This image could not be decoded in the browser. Try another file.');
    img.src = url;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void loadFile(file);
    e.target.value = '';
  };

  const loadExample = async () => {
    clear();
    const id = ++loadId.current;
    setLoading(true);
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error('sample unavailable');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      await loadFile(new File([blob], SAMPLE_NAME, { type: blob.type || SAMPLE_MIME }), { autoOptimize: true });
    } catch {
      if (id !== loadId.current) return;
      setLoading(false);
      setError('The example image could not be loaded. Try again or upload your own image.');
    }
  };

  const optimizeWithSource = async (
    activeSource: SourceImage,
    activeSettings = { widthInput, heightInput, maintainAspectRatio, format, quality },
  ) => {
    const plannedDimensions = getImageOptimizerOutputDimensions({
      sourceWidth: activeSource.width,
      sourceHeight: activeSource.height,
      widthInput: activeSettings.widthInput,
      heightInput: activeSettings.heightInput,
      maintainAspectRatio: activeSettings.maintainAspectRatio,
    });
    const dimensionValidation = validateOptimizerDimensions(plannedDimensions.width, plannedDimensions.height);
    if (!dimensionValidation.valid) {
      setError(dimensionValidation.error);
      return;
    }

    clearResult();
    const id = ++encodeId.current;
    const abortController = new AbortController();
    encodeAbortRef.current = abortController;
    const sourceLoadId = loadId.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Could not create the export canvas in this browser.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not start the image export in this browser.');
      return;
    }

    setOptimizing(true);
    setError('');

    const isCancelled = () => id !== encodeId.current || sourceLoadId !== loadId.current;
    const isAbortCancelled = () => isCancelled() || abortController.signal.aborted;
    const finishEncode = () => {
      if (encodeAbortRef.current === abortController) encodeAbortRef.current = null;
    };
    const fail = (message: string) => {
      if (isAbortCancelled()) return;
      finishEncode();
      setOptimizing(false);
      setError(message);
    };

    const img = new Image();
    img.onload = async () => {
      if (isAbortCancelled()) return;
      try {
        canvas.width = dimensionValidation.width;
        canvas.height = dimensionValidation.height;
        const nextCtx = canvas.getContext('2d');
        if (isAbortCancelled()) return;
        if (!nextCtx) {
          fail('Could not finish the image export in this browser.');
          return;
        }
        nextCtx.imageSmoothingEnabled = true;
        nextCtx.imageSmoothingQuality = 'high';
        if (activeSettings.format === 'jpeg') {
          nextCtx.fillStyle = '#ffffff';
          nextCtx.fillRect(0, 0, dimensionValidation.width, dimensionValidation.height);
        } else {
          nextCtx.clearRect(0, 0, dimensionValidation.width, dimensionValidation.height);
        }
        nextCtx.drawImage(img, 0, 0, dimensionValidation.width, dimensionValidation.height);
        if (isAbortCancelled()) return;

        const formatOption = FORMAT_OPTIONS[activeSettings.format];
        const encodeCanvasBlob = (mimeType: string, encodeQuality?: number) => new Promise<Blob | null>((resolve, reject) => {
          if (isAbortCancelled()) {
            resolve(null);
            return;
          }
          try {
            canvas.toBlob((blob) => {
              if (isAbortCancelled()) {
                resolve(null);
                return;
              }
              resolve(blob);
            }, mimeType, encodeQuality);
          } catch (toBlobError) {
            reject(toBlobError);
          }
        });
        let fallbackRgba: Uint8ClampedArray | null = null;
        const encodeBlob = async (mimeType: string, encodeQuality?: number) => {
          if (mimeType !== 'image/webp') return encodeCanvasBlob(mimeType, encodeQuality);
          if (isAbortCancelled()) return null;
          return encodeImageOptimizerWebp({
            width: dimensionValidation.width,
            height: dimensionValidation.height,
            quality: Math.round((encodeQuality ?? 1) * 100),
            encodeNative: () => encodeCanvasBlob(mimeType, encodeQuality),
            getRgba: () => {
              if (isAbortCancelled()) return new Uint8ClampedArray();
              if (!fallbackRgba) fallbackRgba = nextCtx.getImageData(0, 0, dimensionValidation.width, dimensionValidation.height).data;
              return fallbackRgba;
            },
            signal: abortController.signal,
          });
        };

        const encoded = await encodeImageOptimizerBlobWithSizeAwareness({
          originalBytes: activeSource.file.size,
          requestedMimeType: formatOption.mimeType,
          maxQuality: activeSettings.quality,
          encode: encodeBlob,
          isCancelled: isAbortCancelled,
        });

        if (encoded.cancelled || isAbortCancelled()) return;
        if (encoded.failed || !encoded.blob) {
          fail(encoded.error || (encoded.mimeMismatch ? `Your browser did not return ${formatOption.label}. Try another format.` : 'This image could not be optimized. Try smaller dimensions or another file.'));
          return;
        }

        const requestedFilename = getDownloadName(activeSource.file.name, activeSettings.format, dimensionValidation);
        const policy = getImageOptimizerOutputPolicy({
          original: activeSource.file,
          encoded: encoded.blob,
          originalName: activeSource.file.name,
          requestedMimeType: formatOption.mimeType,
          requestedFilename,
          originalDimensions: { width: activeSource.width, height: activeSource.height },
          outputDimensions: dimensionValidation,
        });
        const outputBlob = policy.blob;
        const resultUrl = URL.createObjectURL(outputBlob);
        if (isAbortCancelled()) {
          URL.revokeObjectURL(resultUrl);
          return;
        }
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = resultUrl;
        setResult({
          url: resultUrl,
          fileName: policy.fileName,
          blob: outputBlob,
          width: policy.keptOriginal ? activeSource.width : dimensionValidation.width,
          height: policy.keptOriginal ? activeSource.height : dimensionValidation.height,
          formatLabel: policy.keptOriginal ? FORMAT_OPTIONS[getDefaultFormat(activeSource.detectedMimeType)].label : formatOption.label,
          actualQuality: policy.keptOriginal ? null : encoded.actualQuality,
          qualityAutoReduced: !policy.keptOriginal && encoded.qualityAutoReduced,
          keptOriginal: policy.keptOriginal,
          couldMakeSmaller: encoded.couldMakeSmaller,
          notes: [
            ...activeSource.notes,
            ...(policy.note ? [policy.note] : []),
            ...(!policy.keptOriginal && activeSettings.format === 'jpeg' ? ['JPEG uses a white background for transparent pixels.'] : []),
            ...(!policy.keptOriginal && activeSettings.format === 'png' ? ['PNG is lossless here, so quality does not change the export.'] : []),
          ],
        });
        finishEncode();
        setOptimizing(false);
      } catch (err) {
        fail(err instanceof Error && err.message ? err.message : 'This image could not be optimized. Try again or choose another format.');
      }
    };
    img.onerror = () => fail('This image could not be decoded for export.');
    img.src = activeSource.url;
  };

  const optimize = () => {
    if (!source || loading || optimizing) return;
    void optimizeWithSource(source);
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.fileName;
    link.click();
  };

  const dimensionValidation = source ? validateOptimizerDimensions(widthInput, heightInput) : null;
  const plannedDimensions = source && dimensionValidation?.valid
    ? getImageOptimizerOutputDimensions({ sourceWidth: source.width, sourceHeight: source.height, widthInput, heightInput, maintainAspectRatio })
    : null;
  const plannedValidation = plannedDimensions ? validateOptimizerDimensions(plannedDimensions.width, plannedDimensions.height) : null;
  const formatOption = FORMAT_OPTIONS[format];
  const qualityApplies = formatOption.qualityApplies;
  const canClear = Boolean(source || result || error || loading || optimizing);
  const canOptimize = Boolean(source && dimensionValidation?.valid && plannedValidation?.valid && !loading && !optimizing);
  const resultSummary = result && source ? getSizeChangeLabel(source.file.size, result.blob.size, result.keptOriginal) : '';
  const resultStatus = result?.keptOriginal
    ? 'No smaller same-format export was found.'
    : result?.couldMakeSmaller
      ? 'Optimized output is smaller than the original.'
      : 'Optimized output is not smaller than the original.';
  const sourceMeta = source ? `${formatBytes(source.file.size)} · ${source.width} × ${source.height} px` : '';
  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={() => void loadExample()} onClear={clear} canClear={canClear} exampleDisabled={loading || optimizing} />
      </div>

      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFile} hidden aria-label="Select image to optimize" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${source ? `tb-image-upload-compact ${styles.uploadCompact}` : ''} ${isDragging ? 'dragging' : ''}`}
          onClick={openFilePicker}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const dropped = e.dataTransfer.files[0]; if (dropped) void loadFile(dropped); }}
          aria-label={source ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={loading}
        >
          {source ? (
            <>
              <span className={styles.uploadThumbnail} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={source.url} alt="" />
              </span>
              <span className={`tb-image-upload-copy ${styles.uploadCopy}`}>
                <span className={`tb-v2-dropzone-text ${styles.fileName}`} title={source.file.name}>{loading ? 'Loading image...' : source.file.name}</span>
                <span className={`tb-v2-dropzone-hint ${styles.fileMeta}`}>{sourceMeta}</span>
                <span className={`tb-v2-dropzone-hint ${styles.replaceHint}`}>Drop another image to replace.</span>
              </span>
              <span className={`tb-v2-btn tb-v2-btn-sm ${styles.replaceAffordance}`}>
                <Upload size={15} aria-hidden="true" />
                <span>Replace image</span>
              </span>
            </>
          ) : (
            <>
              <Upload size={28} aria-hidden="true" />
              <span className="tb-image-upload-copy">
                <span className="tb-v2-dropzone-text">{loading ? 'Loading image...' : 'Click to upload or drag an image here'}</span>
                <span className="tb-v2-dropzone-hint">PNG, JPEG, WebP, GIF, or SVG. 20 MiB max.</span>
              </span>
            </>
          )}
        </button>

        {(loading || optimizing) && <p className="tb-image-hint" role="status">{loading ? 'Checking image...' : 'Optimizing image...'}</p>}
        {error && <p className="tb-image-hint" role="alert">{error}</p>}

        {source && (
          <>
            <div className="tb-v2-card tb-image-settings">
              <div className="tb-image-fields">
                <div className="tb-image-field">
                  <label className="tb-v2-tool-label" htmlFor="optimizer-width">Width</label>
                  <input
                    id="optimizer-width"
                    type="number"
                    min="1"
                    max={MAX_CANVAS_SIDE}
                    value={widthInput || ''}
                    onChange={(e) => { setWidthInput(Number(e.target.value)); invalidateForSettingChange(); }}
                    className="tb-v2-input"
                    aria-describedby="optimizer-dimension-help"
                  />
                </div>
                <div className="tb-image-field">
                  <label className="tb-v2-tool-label" htmlFor="optimizer-height">Height</label>
                  <input
                    id="optimizer-height"
                    type="number"
                    min="1"
                    max={MAX_CANVAS_SIDE}
                    value={heightInput || ''}
                    onChange={(e) => { setHeightInput(Number(e.target.value)); invalidateForSettingChange(); }}
                    className="tb-v2-input"
                    aria-describedby="optimizer-dimension-help"
                  />
                </div>
              </div>
              <label className="tb-image-hint tb-v2-flex tb-v2-items-center tb-v2-gap-2" style={{ display: 'inline-flex', gap: 8 }}>
                <input type="checkbox" checked={maintainAspectRatio} onChange={(e) => { setMaintainAspectRatio(e.target.checked); invalidateForSettingChange(); }} />
                Preserve aspect ratio and do not upscale
              </label>
              <p id="optimizer-dimension-help" className="tb-image-hint">
                {dimensionValidation?.valid && plannedValidation?.valid && plannedDimensions
                  ? `Output size: ${plannedDimensions.width} × ${plannedDimensions.height} px. Limit: ${MAX_CANVAS_SIDE} px per side and 32 megapixels.`
                  : dimensionValidation?.error || plannedValidation?.error}
              </p>

              <div className="tb-image-fields">
                <div className="tb-image-field">
                  <span className="tb-v2-tool-label">Output format</span>
                  <div className="tb-v2-mode-tabs" role="group" aria-label="Output format">
                    {(['jpeg', 'png', 'webp'] as OutputFormat[]).map((option) => (
                      <button key={option} type="button" onClick={() => { setFormat(option); invalidateForSettingChange(); }} aria-pressed={format === option} className={`tb-v2-mode-tab ${format === option ? 'on' : ''}`}>
                        {option === 'webp' ? 'WebP' : option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="tb-image-hint">
                    {format === 'jpeg' && 'JPEG is good for photos. Transparent pixels become white.'}
                    {format === 'png' && 'PNG is lossless here. Quality is disabled.'}
                    {format === 'webp' && 'WebP keeps transparency and supports lossy quality.'}
                  </p>
                </div>
                <div className="tb-image-field">
                  <label className="tb-image-card-head" htmlFor="optimizer-quality"><span className="tb-v2-tool-label">Maximum quality</span><span className="tb-v2-range-val">{qualityApplies ? `${quality}%` : 'Lossless'}</span></label>
                  <input id="optimizer-quality" type="range" min={MIN_QUALITY} max="100" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); invalidateForSettingChange(); }} disabled={!qualityApplies} className="tb-image-quality" />
                  <p className="tb-image-hint">{qualityApplies ? 'Quality is a maximum for JPEG and WebP. The encoder may try lower values to find a smaller file.' : 'PNG ignores the quality slider because this export is lossless.'}</p>
                </div>
              </div>

              <div className="tb-image-actions">
                <button type="button" onClick={optimize} disabled={!canOptimize} className="tb-v2-btn tb-v2-btn-primary">{optimizing ? 'Optimizing...' : 'Optimize Image'}</button>
              </div>
            </div>

            <div className="tb-image-workspace">
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}>
                  <span className={styles.previewTitleGroup}>
                    <span className="tb-v2-tool-label">Original</span>
                    <span className="tb-image-hint">{formatBytesWithExact(source.file.size)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={loading}
                    className={`tb-v2-btn tb-v2-btn-sm ${styles.previewReplaceButton}`}
                    aria-label="Replace original image"
                  >
                    <Upload size={14} aria-hidden="true" />
                    <span>Replace image</span>
                  </button>
                </figcaption>
                <div className="tb-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt="Original image" />
                </div>
                <p className="tb-image-hint">{source.width} × {source.height} px</p>
              </figure>

              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className={`tb-image-card-head ${styles.previewCaption}`}><span className="tb-v2-tool-label">Optimized</span>{result && <span className="tb-image-hint">{formatBytesWithExact(result.blob.size)} · {result.formatLabel}</span>}</figcaption>
                <div className="tb-image-preview" aria-busy={optimizing}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result.url} alt="Optimized image" />
                  ) : <p className="tb-image-hint">{optimizing ? 'Optimizing...' : 'Change settings, then optimize to preview the output.'}</p>}
                </div>
                <p className="tb-image-hint">{result ? `${result.width} × ${result.height} px` : 'No current optimized image.'}</p>
              </figure>
            </div>

            {result && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div>
                  <strong>{resultSummary}</strong>
                  <p className="tb-image-hint">{formatBytesWithExact(source.file.size)} original to {formatBytesWithExact(result.blob.size)} output. {resultStatus}</p>
                  {result.actualQuality != null && <p className="tb-image-hint">Encoding quality: {result.actualQuality}%{result.qualityAutoReduced ? ' after automatic retry' : ''}</p>}
                  {result.notes.map((note) => <p key={note} className="tb-image-hint">{note}</p>)}
                </div>
                <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">Download optimized image</button>
              </div>
            )}
          </>
        )}
      </div>

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
