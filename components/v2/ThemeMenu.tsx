'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { IconSun, IconMoon, IconLaptop, IconCheck } from './icons';

type Theme = 'light' | 'dark' | 'system';

const OPTIONS: Array<[Theme, string, typeof IconSun]> = [
  ['light', 'Light', IconSun],
  ['dark', 'Dark', IconMoon],
  ['system', 'System', IconLaptop],
];

export default function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const effective: Exclude<Theme, 'system'> =
    theme === 'system'
      ? mounted && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  const TriggerIcon =
    theme === 'system' ? IconLaptop : effective === 'dark' ? IconMoon : IconSun;

  return (
    <div className="tb-v2-tm-wrap">
      <button
        ref={btnRef}
        type="button"
        className="tb-v2-btn tb-v2-btn-ghost tb-v2-tm-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme"
        aria-haspopup="true"
        aria-expanded={open}
        title="Theme"
      >
        <TriggerIcon />
      </button>

      {open && (
        <div className="tb-v2-tm-pop" ref={menuRef} role="menu">
          {OPTIONS.map(([v, label, Ic]) => (
            <button
              key={v}
              type="button"
              role="menuitemradio"
              aria-checked={theme === v}
              className={`tb-v2-tm-row${theme === v ? ' on' : ''}`}
              onClick={() => {
                setTheme(v);
                setOpen(false);
              }}
            >
              <Ic className="tb-v2-ic" />
              <span>{label}</span>
              {theme === v && <IconCheck className="tb-v2-ic tb-v2-tm-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
