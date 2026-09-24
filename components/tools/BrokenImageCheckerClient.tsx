'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';

const MAX_IMAGES_TO_CHECK = 20;
const PAGE_FETCH_TIMEOUT_MS = 10_000;
const IMAGE_LOAD_TIMEOUT_MS = 8_000;
const MAX_HTML_BYTES = 1_000_000;
const IMAGE_CONCURRENCY = 4;

type ImageSourceKind = 'src' | 'data-src' | 'data-lazy-src' | 'srcset';
type ImageStatus = 'loaded' | 'failed' | 'timed-out' | 'unsupported';

export type BrokenImageCandidate = {
  src: string;
  source: ImageSourceKind;
};

type BrokenImageResult = BrokenImageCandidate & {
  status: ImageStatus;
  label: string;
  ok: boolean;
};

type ExtractedImages = {
  candidates: BrokenImageCandidate[];
  discoveredCount: number;
  uniqueCount: number;
  skippedCount: number;
  capped: boolean;
};

type RunSummary = ExtractedImages & {
  checkedCount: number;
  loadedCount: number;
  failedCount: number;
};

function resolveHttpUrl(value: string, baseUrl: string) {
  try {
    const url = new URL(value, baseUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

export function parseBrokenImageSrcset(value: string) {
  const candidates: string[] = [];
  let index = 0;

  while (index < value.length) {
    while (index < value.length && /[\s,]/.test(value[index])) index += 1;
    if (index >= value.length) break;

    const urlStart = index;
    while (index < value.length && !/\s/.test(value[index])) {
      index += 1;
    }

    const token = value.slice(urlStart, index);
    const endedAtCommaDelimiter = /,\s*$/.test(token);
    const rawUrl = token.replace(/,+$/, '');
    if (rawUrl && !/^data:/i.test(rawUrl)) candidates.push(rawUrl);

    if (endedAtCommaDelimiter) continue;
    while (index < value.length && value[index] !== ',') index += 1;
    if (index < value.length && value[index] === ',') index += 1;
  }

  return candidates;
}

export function normalizeBrokenImagePageUrl(input: string):
  | { ok: true; url: string }
  | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: 'Enter a page URL first.' };

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { ok: false, error: 'Enter an absolute http:// or https:// page URL.' };
    }
    return { ok: true, url: url.href };
  } catch {
    return { ok: false, error: 'Enter an absolute http:// or https:// page URL.' };
  }
}

export function getBrokenImagePageFetchUrl(pageUrl: string, origin: string) {
  const parsed = new URL(pageUrl);
  if (parsed.origin === origin) return `${parsed.pathname}${parsed.search}`;
  return `/api/proxy?url=${encodeURIComponent(pageUrl)}`;
}

export function canReadBrokenImageHtmlResponse(contentType: string) {
  const normalized = contentType.toLowerCase().split(';')[0].trim();
  return !normalized || normalized === 'text/html' || normalized === 'application/xhtml+xml';
}

export function buildBrokenImageExtraction({
  pageUrl,
  baseHref = '',
  sources,
}: {
  pageUrl: string;
  baseHref?: string | null;
  sources: Array<{ value: string; source: ImageSourceKind | 'data-srcset' }>;
}): ExtractedImages {
  const resolvedBase = baseHref ? resolveHttpUrl(baseHref, pageUrl) ?? pageUrl : pageUrl;
  const discovered: BrokenImageCandidate[] = [];
  let skippedCount = 0;

  for (const item of sources) {
    if (!item.value) continue;
    if (item.source === 'srcset' || item.source === 'data-srcset') {
      for (const candidate of parseBrokenImageSrcset(item.value)) {
        const resolved = resolveHttpUrl(candidate, resolvedBase);
        if (resolved) discovered.push({ src: resolved, source: 'srcset' });
        else skippedCount += 1;
      }
    } else {
      const resolved = resolveHttpUrl(item.value, resolvedBase);
      if (resolved) discovered.push({ src: resolved, source: item.source });
      else skippedCount += 1;
    }
  }

  const unique = new Map<string, BrokenImageCandidate>();
  for (const item of discovered) {
    if (!unique.has(item.src)) unique.set(item.src, item);
  }

  return {
    candidates: Array.from(unique.values()).slice(0, MAX_IMAGES_TO_CHECK),
    discoveredCount: discovered.length,
    uniqueCount: unique.size,
    skippedCount,
    capped: unique.size > MAX_IMAGES_TO_CHECK,
  };
}

export function extractBrokenImageCandidates(html: string, pageUrl: string): ExtractedImages {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sources: Array<{ value: string; source: ImageSourceKind | 'data-srcset' }> = [];

  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    const dataSrc = img.getAttribute('data-src');
    const dataLazySrc = img.getAttribute('data-lazy-src');
    const srcset = img.getAttribute('srcset');
    const dataSrcset = img.getAttribute('data-srcset');

    if (src) sources.push({ value: src, source: 'src' });
    if (dataSrc) sources.push({ value: dataSrc, source: 'data-src' });
    if (dataLazySrc) sources.push({ value: dataLazySrc, source: 'data-lazy-src' });
    if (srcset) sources.push({ value: srcset, source: 'srcset' });
    if (dataSrcset) sources.push({ value: dataSrcset, source: 'data-srcset' });
  });

  return buildBrokenImageExtraction({
    pageUrl,
    baseHref: doc.querySelector('base[href]')?.getAttribute('href') ?? '',
    sources,
  });
}

function statusLabel(status: ImageStatus) {
  if (status === 'loaded') return 'Loaded';
  if (status === 'failed') return 'Failed to load';
  if (status === 'timed-out') return 'Timed out';
  return 'Unsupported URL';
}

function checkImageLoad(candidate: BrokenImageCandidate, registerCleanup: (cleanup: () => void) => () => void): Promise<BrokenImageResult> {
  if (!/^https?:\/\//i.test(candidate.src)) {
    return Promise.resolve({
      ...candidate,
      status: 'unsupported',
      label: statusLabel('unsupported'),
      ok: false,
    });
  }

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    let unregister: (() => void) | null = null;
    const finish = (status: ImageStatus) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      image.src = '';
      unregister?.();
      resolve({
        ...candidate,
        status,
        label: statusLabel(status),
        ok: status === 'loaded',
      });
    };
    const timer = window.setTimeout(() => finish('timed-out'), IMAGE_LOAD_TIMEOUT_MS);

    unregister = registerCleanup(() => finish('timed-out'));
    image.onload = () => finish(image.naturalWidth > 0 ? 'loaded' : 'failed');
    image.onerror = () => finish('failed');
    image.src = candidate.src;
  });
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
  isCancelled: () => boolean,
) {
  const results: R[] = [];
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length && !isCancelled()) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));
  return results.filter(Boolean);
}

async function readBrokenImageHtmlWithCap(response: Response) {
  const lengthHeader = response.headers.get('content-length');
  const contentLength = lengthHeader ? Number(lengthHeader) : 0;
  if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) {
    throw new Error('That page HTML is too large to scan here.');
  }

  if (!response.body) {
    const html = await response.text();
    if (new TextEncoder().encode(html).length > MAX_HTML_BYTES) {
      throw new Error('That page HTML is too large to scan here.');
    }
    return html;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) {
      reader.cancel().catch(() => undefined);
      throw new Error('That page HTML is too large to scan here.');
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

export default function BrokenImageCheckerClient({}: {}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BrokenImageResult[]>([]);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [error, setError] = useState('');
  const runIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const cleanupRef = useRef<Set<() => void>>(new Set());

  const cancelPending = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    for (const cleanup of cleanupRef.current) cleanup();
    cleanupRef.current.clear();
  }, []);

  useEffect(() => cancelPending, [cancelPending]);

  const clearAll = useCallback(() => {
    cancelPending();
    setUrl('');
    setLoading(false);
    setResults([]);
    setSummary(null);
    setError('');
  }, [cancelPending]);

  const loadExample = useCallback(() => {
    cancelPending();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    setUrl(`${origin}/samples/broken-image-checker.html`);
    setLoading(false);
    setResults([]);
    setSummary(null);
    setError('');
  }, [cancelPending]);

  const checkImages = useCallback(async () => {
    cancelPending();
    const page = normalizeBrokenImagePageUrl(url);
    if (!page.ok) {
      setError(page.error);
      setResults([]);
      setSummary(null);
      setLoading(false);
      return;
    }

    const runId = runIdRef.current;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), PAGE_FETCH_TIMEOUT_MS);
    abortRef.current = controller;
    setLoading(true);
    setError('');
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch(getBrokenImagePageFetchUrl(page.url, window.location.origin), { signal: controller.signal });
      if (!response.ok) throw new Error(`Could not fetch the page through the proxy (${response.status}).`);

      const contentType = response.headers.get('content-type') ?? '';
      if (!canReadBrokenImageHtmlResponse(contentType)) {
        throw new Error('That URL did not return HTML.');
      }

      const html = await readBrokenImageHtmlWithCap(response);
      if (runId !== runIdRef.current) return;

      const extracted = extractBrokenImageCandidates(html, page.url);
      if (extracted.candidates.length === 0) {
        setSummary({ ...extracted, checkedCount: 0, loadedCount: 0, failedCount: 0 });
        setLoading(false);
        return;
      }

      const checked = await runWithConcurrency(
        extracted.candidates,
        IMAGE_CONCURRENCY,
        (candidate) => checkImageLoad(candidate, (cleanup) => {
          cleanupRef.current.add(cleanup);
          return () => cleanupRef.current.delete(cleanup);
        }),
        () => runId !== runIdRef.current,
      );
      if (runId !== runIdRef.current) return;

      const loadedCount = checked.filter((item) => item.ok).length;
      setResults(checked);
      setSummary({
        ...extracted,
        checkedCount: checked.length,
        loadedCount,
        failedCount: checked.length - loadedCount,
      });
    } catch (err) {
      if (runId !== runIdRef.current) return;
      const message = err instanceof Error && err.name === 'AbortError'
        ? 'The page request timed out.'
        : err instanceof Error
          ? err.message
          : 'Could not fetch the page. Make sure the URL is accessible.';
      setError(message);
      setResults([]);
      setSummary(null);
    } finally {
      window.clearTimeout(timeout);
      if (abortRef.current === controller) abortRef.current = null;
      if (runId === runIdRef.current) setLoading(false);
    }
  }, [cancelPending, url]);

  const hasInput = url.trim().length > 0 || results.length > 0 || Boolean(summary) || Boolean(error) || loading;

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <label className="tb-v2-tool-label" htmlFor="broken-image-url">Webpage URL</label>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={hasInput}
          exampleCount={1}
          exampleDisabled={loading}
        />
      </div>
      <div className="tb-v2-tool-input-body" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="broken-image-url"
            className="tb-v2-input"
            style={{ flex: 1 }}
            value={url}
            onChange={(event) => {
              cancelPending();
              setUrl(event.target.value);
              setLoading(false);
              setResults([]);
              setSummary(null);
              setError('');
            }}
            placeholder="https://example.com/page"
            onKeyDown={(event) => event.key === 'Enter' && checkImages()}
          />
          <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={checkImages} disabled={loading || !url.trim()}>
            {loading ? 'Checking...' : 'Check images'}
          </button>
        </div>

        {loading && <div className="tb-v2-banner" role="status" style={{ marginTop: 12 }}>Fetching the page and checking image loads...</div>}
        {error && <div className="tb-v2-banner tb-v2-banner-err" role="alert" style={{ marginTop: 12 }}>{error}</div>}

        {!results.length && !loading && !error && !summary && (
          <p className="tb-v2-empty" style={{ marginTop: 12 }}>
            Enter an absolute page URL. The tool scans static HTML img tags, including src, data-src, data-lazy-src, and srcset candidates, then checks the first 20 unique HTTP images by loading them in the browser.
          </p>
        )}
      </div>

      {summary && (
        <div className="tb-v2-tool-output-body">
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span>Found {summary.uniqueCount} unique image URL{summary.uniqueCount === 1 ? '' : 's'}</span>
            <span>Checked {summary.checkedCount}</span>
            <span>Loaded {summary.loadedCount}</span>
            <span>Needs review {summary.failedCount}</span>
          </div>
          {summary.checkedCount === 0 && (
            <p className="tb-v2-empty" style={{ marginTop: 12 }}>
              No image URLs were found in the static HTML for this page.
            </p>
          )}
          {summary.capped && (
            <div className="tb-v2-banner tb-v2-banner-warn" style={{ marginTop: 12 }}>
              Found {summary.uniqueCount} unique image URLs. Only the first {MAX_IMAGES_TO_CHECK} were checked.
            </div>
          )}
          {summary.skippedCount > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginTop: 12 }}>
              Skipped {summary.skippedCount} non-HTTP or unsupported image URL{summary.skippedCount === 1 ? '' : 's'}.
            </p>
          )}
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Image load results</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-2">
              {results.map((result) => (
                <div key={result.src} className="flex flex-col gap-1 rounded-md border border-gray-200 p-3 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <a href={result.src} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 break-all hover:underline dark:text-blue-300">
                      {result.src}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Found in {result.source}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded ${result.ok ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {result.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginTop: 12 }}>
              Failed or timed-out loads need review. Browser image errors do not prove a 404; they can also come from blocking, hotlink protection, proxy redirects, or network timeouts. Relative URLs are resolved against the submitted page URL because the proxy does not expose the final redirect URL.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
