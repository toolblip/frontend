'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Density = 'comfy' | 'compact';
type Font = 'sans' | 'serif';

type Settings = { theme: Theme; density: Density; font: Font };

const DEFAULTS: Settings = { theme: 'system', density: 'comfy', font: 'sans' };
const STORAGE_KEY = 'tb_settings';
const LEGACY_THEME_KEY = 'theme';

type Ctx = {
  theme: Theme;
  density: Density;
  font: Font;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
  setFont: (f: Font) => void;
};

const SettingsContext = createContext<Ctx>({
  ...DEFAULTS,
  setTheme: () => {},
  setDensity: () => {},
  setFont: () => {},
});

function readStored(): Settings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return {
        theme: (parsed.theme as Theme) || DEFAULTS.theme,
        density: (parsed.density as Density) || DEFAULTS.density,
        font: (parsed.font as Font) || DEFAULTS.font,
      };
    }
    const legacy = window.localStorage.getItem(LEGACY_THEME_KEY) as Theme | null;
    if (legacy) return { ...DEFAULTS, theme: legacy };
  } catch {}
  return DEFAULTS;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function applyDensity(density: Density) {
  document.documentElement.setAttribute('data-density', density);
}

function applyFont(font: Font) {
  document.documentElement.setAttribute('data-fontswap', font);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = readStored();
    setSettings(s);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(settings.theme);
    applyDensity(settings.density);
    applyFont(settings.font);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, mounted]);

  useEffect(() => {
    if (!mounted || settings.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mounted, settings.theme]);

  const value: Ctx = {
    theme: settings.theme,
    density: settings.density,
    font: settings.font,
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setDensity: (density) => setSettings((s) => ({ ...s, density })),
    setFont: (font) => setSettings((s) => ({ ...s, font })),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useTheme = () => {
  const { theme, setTheme } = useContext(SettingsContext);
  return { theme, setTheme };
};

export const useSettings = () => useContext(SettingsContext);
