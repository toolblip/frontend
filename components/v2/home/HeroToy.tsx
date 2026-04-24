'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ToyWordCounter from './ToyWordCounter';
import ToyQR from './ToyQR';
import ToyColor from './ToyColor';

type Tab = { id: 'words' | 'qr' | 'color'; label: string; href: string };

const TABS: Tab[] = [
  { id: 'words', label: 'Words', href: '/tools/word-counter' },
  { id: 'qr', label: 'QR code', href: '/tools/qr-code-generator' },
  { id: 'color', label: 'Color', href: '/tools/color-picker' },
];

const ROTATE_INTERVAL = 4000;

export default function HeroToy() {
  const [tab, setTab] = useState<'words' | 'qr' | 'color'>('words');
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTab((prev) => {
        const idx = TABS.findIndex((t) => t.id === prev);
        return TABS[(idx + 1) % TABS.length].id;
      });
    }, ROTATE_INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Restart timer when user clicks a tab manually
  const handleTabClick = (id: 'words' | 'qr' | 'color') => {
    setTab(id);
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    // Resume auto-rotate after 5s of inactivity
    setTimeout(() => {
      setIsPaused(false);
      startTimer();
    }, 5000);
  };

  return (
    <div
      className="tb-v2-toy"
      onMouseEnter={() => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        startTimer();
      }}
    >
      <div className="tb-v2-toy-head">
        <div className="tb-v2-toy-tabs" role="tablist" aria-label="Try a tool">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`tb-v2-toy-tab ${tab === t.id ? 'on' : ''}`}
              onClick={() => handleTabClick(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tb-v2-toy-meta">
          <span className="tb-v2-live-dot" aria-hidden="true" />
          <span>Live</span>
        </div>
      </div>
      <div className="tb-v2-toy-body">
        {tab === 'words' && <ToyWordCounter />}
        {tab === 'qr' && <ToyQR />}
        {tab === 'color' && <ToyColor />}
      </div>
      <div className="tb-v2-toy-foot">
        <Link href={TABS.find((t) => t.id === tab)!.href} className="tb-v2-toy-link">
          Open {TABS.find((t) => t.id === tab)!.label} tool
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        {!isPaused && (
          <span className="tb-v2-toy-rotate-hint">Auto-rotating</span>
        )}
      </div>
    </div>
  );
}
