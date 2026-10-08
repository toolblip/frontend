'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const PUBLISHER_SRC = 'https://news.google.com/swg/js/v1/publisher.js';
const FALLBACK_HREF = 'https://www.google.com/preferences/source?q=toolblip.com';

function resolveIsDark(theme: 'light' | 'dark' | 'system'): boolean {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr === 'dark';
  }
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function loadPublisherScript() {
  if (document.querySelector(`script[src="${PUBLISHER_SRC}"]`)) return;
  const script = document.createElement('script');
  script.src = PUBLISHER_SRC;
  script.async = true;
  document.head.append(script);
}

export default function PreferredSourceButton() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(resolveIsDark(theme));
    const root = document.documentElement;
    const sync = () => setIsDark(resolveIsDark(theme));
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, [theme]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!('IntersectionObserver' in window)) {
      loadPublisherScript();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadPublisherScript();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tb-v2-preferred-source">
      <div
        ref={hostRef}
        className="google-add-preferred-source-btn"
        // Google’s publisher.js scans for this attribute.
        {...{ 'google-add-preferred-source-btn': '' }}
        data-theme={isDark ? 'dark' : 'light'}
      />
      <noscript>
        <a href={FALLBACK_HREF} target="_blank" rel="noopener noreferrer">
          Add to Preferred Sources
        </a>
      </noscript>
    </div>
  );
}
