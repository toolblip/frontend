'use client';
import { useEffect, useRef, useState } from 'react';

export type MediaResult = { blob: Blob; name: string; detail?: string; preview?: 'image' | 'audio' | 'video' };
export function useMediaJob() {
  const [result, setResult] = useState<(MediaResult & { url: string }) | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const generation = useRef(0);
  const url = useRef('');
  const controller = useRef<AbortController | null>(null);
  const cancel = () => {
    generation.current++;
    controller.current?.abort(); controller.current = null;
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = ''; setResult(null); setError(''); setBusy(false);
  };
  useEffect(() => () => {
    generation.current++;
    controller.current?.abort();
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);
  const run = async (work: (signal: AbortSignal) => Promise<MediaResult | null>) => {
    cancel(); const id = generation.current; const ctrl = new AbortController(); controller.current = ctrl; setBusy(true);
    const timeout = setTimeout(() => ctrl.abort(new Error('Processing timed out. Try a smaller file.')), 120_000);
    let abortListener: (() => void) | undefined;
    try {
      const aborted = new Promise<never>((_, reject) => {
        abortListener = () => reject(ctrl.signal.reason || new Error('Processing cancelled.'));
        ctrl.signal.addEventListener('abort', abortListener, { once: true });
      });
      const output = await Promise.race([work(ctrl.signal), aborted]);
      ctrl.signal.throwIfAborted();
      if (generation.current !== id || !output) return;
      if (!output.blob.size) throw new Error('Conversion produced an empty file.');
      url.current = URL.createObjectURL(output.blob);
      setResult({ ...output, url: url.current });
    } catch (e) {
      if (generation.current === id) setError(e instanceof Error ? e.message : 'Conversion failed.');
    } finally { clearTimeout(timeout); if (abortListener) ctrl.signal.removeEventListener('abort', abortListener); if (generation.current === id) setBusy(false); }
  };
  return { result, error, busy, ready, cancel, run, setError, generation };
}
