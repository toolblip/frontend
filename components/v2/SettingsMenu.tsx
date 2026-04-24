'use client';

import { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/components/ThemeProvider';
import {
  IconSettings,
  IconSun,
  IconMoon,
  IconLaptop,
  IconRows,
  IconRowsTight,
  IconType,
  IconTypeSerif,
} from './icons';

type ThemeOpt = 'light' | 'dark' | 'system';
type DensityOpt = 'comfy' | 'compact';
type FontOpt = 'sans' | 'serif';

const THEME_ROWS: Array<[ThemeOpt, string, typeof IconSun]> = [
  ['light', 'Light', IconSun],
  ['dark', 'Dark', IconMoon],
  ['system', 'System', IconLaptop],
];

const DENSITY_ROWS: Array<[DensityOpt, string, typeof IconRows]> = [
  ['comfy', 'Comfortable', IconRows],
  ['compact', 'Compact', IconRowsTight],
];

const FONT_ROWS: Array<[FontOpt, string, typeof IconType]> = [
  ['sans', 'Default', IconType],
  ['serif', 'Serif', IconTypeSerif],
];

export default function SettingsMenu() {
  const { theme, density, font, setTheme, setDensity, setFont } = useSettings();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="tb-v2-sm-wrap">
      <button
        ref={btnRef}
        type="button"
        className="tb-v2-btn tb-v2-btn-ghost tb-v2-sm-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        aria-haspopup="true"
        aria-expanded={open}
        title="Settings"
      >
        <IconSettings />
      </button>

      {open && (
        <div className="tb-v2-sm-pop" ref={menuRef} role="dialog" aria-label="Settings">
          <div className="tb-v2-sm-section">
            <div className="tb-v2-sm-label">Theme</div>
            <div className="tb-v2-sm-opts tb-v2-sm-opts-3">
              {THEME_ROWS.map(([v, label, Ic]) => (
                <button
                  key={v}
                  type="button"
                  className={`tb-v2-sm-opt${theme === v ? ' on' : ''}`}
                  onClick={() => setTheme(v)}
                  aria-pressed={theme === v}
                >
                  <Ic className="tb-v2-ic" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="tb-v2-sm-section">
            <div className="tb-v2-sm-label">Density</div>
            <div className="tb-v2-sm-opts tb-v2-sm-opts-2">
              {DENSITY_ROWS.map(([v, label, Ic]) => (
                <button
                  key={v}
                  type="button"
                  className={`tb-v2-sm-opt${density === v ? ' on' : ''}`}
                  onClick={() => setDensity(v)}
                  aria-pressed={density === v}
                >
                  <Ic className="tb-v2-ic" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="tb-v2-sm-section">
            <div className="tb-v2-sm-label">Font</div>
            <div className="tb-v2-sm-opts tb-v2-sm-opts-2">
              {FONT_ROWS.map(([v, label, Ic]) => (
                <button
                  key={v}
                  type="button"
                  className={`tb-v2-sm-opt${font === v ? ' on' : ''}`}
                  onClick={() => setFont(v)}
                  aria-pressed={font === v}
                >
                  <Ic className="tb-v2-ic" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
