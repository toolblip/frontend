'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { clearToolContext, readToolContext, writeToolContext } from '@/lib/toolContext';

type ToolContextState<T extends Record<string, unknown>> = {
  /** Paid users can save per-tool defaults; the control is hidden otherwise. */
  isPaid: boolean;
  /** The saved settings for this user + tool, or null. */
  saved: T | null;
  hasSaved: boolean;
  /** Explicitly persist the given settings (paid users only). */
  save: (context: T) => void;
  /** Explicitly remove the saved settings. */
  clear: () => void;
};

/**
 * Paid-gated, explicitly user-controlled saved context for a single tool.
 * Reads the saved settings on mount and exposes save/clear actions. Only the
 * settings the caller passes to `save` are stored — never tool input/output.
 */
export function useToolContext<T extends Record<string, unknown>>(slug: string): ToolContextState<T> {
  const { user } = useAuth();
  const [isPaid, setIsPaid] = useState(false);
  const [saved, setSaved] = useState<T | null>(null);

  useEffect(() => {
    if (!user) {
      setSaved(null);
      return;
    }
    setSaved(readToolContext<T>(user.id, slug));
  }, [user, slug]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsPaid(false);
      return;
    }
    fetch('/api/subscription', { credentials: 'include', headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setIsPaid(Boolean(data?.is_pro));
      })
      .catch(() => {
        if (!cancelled) setIsPaid(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const save = useCallback(
    (context: T) => {
      if (!user || !isPaid) return;
      writeToolContext(user.id, slug, context);
      setSaved(context);
    },
    [user, isPaid, slug],
  );

  const clear = useCallback(() => {
    if (!user) return;
    clearToolContext(user.id, slug);
    setSaved(null);
  }, [user, slug]);

  return { isPaid, saved, hasSaved: saved != null, save, clear };
}
