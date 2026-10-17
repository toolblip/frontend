"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** When false, no widget renders and the token stays "" (the backend skips verification too). */
export const TURNSTILE_ENABLED = SITE_KEY !== "";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export type TurnstileHandle = { reset: () => void };

type TurnstileProps = { onToken: (token: string) => void };

/**
 * Cloudflare Turnstile widget. Tokens are single-use: call `reset()` after any
 * failed submit, which also clears the token reported to the parent.
 */
const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile({ onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
        onTokenRef.current("");
      },
    }),
    []
  );

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => onTokenRef.current(""));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      onTokenRef.current("");
    };
  }, []);

  if (!TURNSTILE_ENABLED) return null;
  return <div ref={containerRef} />;
});

export default Turnstile;
