'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { IconSun, IconMoon, IconLaptop, IconCheck } from './icons';

type Mode = 'light' | 'dark' | 'system';

export default function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const systemDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const displayed: 'light' | 'dark' = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  const TriggerIcon = theme === 'system' ? IconLaptop : displayed === 'dark' ? IconMoon : IconSun;

  const rows: Array<[Mode, string, typeof IconSun]> = [
    ['light', 'Light', IconSun],
    ['dark', 'Dark', IconMoon],
    ['system', 'System', IconLaptop],
  ];

  return (
    <div className="tb-v2-theme-menu-wrap" style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        className="tb-v2-btn tb-v2-btn-ghost"
        onClick={() => setOpen((o) => !o)}
        title="Theme"
        aria-label="Theme"
        style={{ width: 36, height: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <TriggerIcon />
      </button>
      {open && (
        <div className="tb-v2-tm-pop" ref={menuRef}>
          {rows.map(([v, label, Ic]) => (
            <button
              key={v}
              className={`tb-v2-tm-row ${theme === v ? 'on' : ''}`}
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
