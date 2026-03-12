'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import type { ItineraryTheme, MoodPreset, LayoutPreset } from '@/types/itinerary-theme';
import { resolveThemeToCSSVars } from '@/lib/resolve-theme';
import { getMoodPreset } from '@/lib/mood-presets';

// ─── Constants ───────────────────────────────────────────────────

const STORAGE_KEY_MOOD   = 'ti:activeMoodId';
const STORAGE_KEY_LAYOUT = 'ti:layout';
const STORAGE_KEY_CSS    = 'ti:customCss';

const DEFAULT_LAYOUT: LayoutPreset = 'stacked';

// ─── Context Shape ───────────────────────────────────────────────

type ThemeContextValue = {
  theme: ItineraryTheme;
  layout: LayoutPreset;
  activeMoodId: string;
  customCss: string;
  setTheme: (theme: ItineraryTheme) => void;
  applyMood: (preset: MoodPreset) => void;
  setLayout: (layout: LayoutPreset) => void;
  setCustomCss: (css: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with static defaults to ensure server/client match on first pass
  const [activeMoodId, setActiveMoodId] = useState<string>('nature');
  const [layout, setLayoutState] = useState<LayoutPreset>(DEFAULT_LAYOUT);
  const [theme, setThemeState] = useState<ItineraryTheme>(getMoodPreset('nature').theme);
  const [customCss, setCustomCssState] = useState<string>('');

  // Load from localStorage ONLY after mounting to prevent hydration errors
  useEffect(() => {
    const savedMood = localStorage.getItem(STORAGE_KEY_MOOD);
    const savedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);
    const savedCss = localStorage.getItem(STORAGE_KEY_CSS);

    if (savedMood) {
      setActiveMoodId(savedMood);
      setThemeState(getMoodPreset(savedMood).theme);
    }
    if (savedLayout) {
      setLayoutState(savedLayout as LayoutPreset);
    }
    if (savedCss) {
      setCustomCssState(savedCss);
    }
  }, []);

  // Inject CSS vars into <html>
  useEffect(() => {
    const vars = resolveThemeToCSSVars(theme);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  // Persist + set data-mood
  useEffect(() => {
    document.documentElement.setAttribute('data-mood', activeMoodId);
    localStorage.setItem(STORAGE_KEY_MOOD, activeMoodId);
  }, [activeMoodId]);

  // Persist + set data-layout
  useEffect(() => {
    document.documentElement.setAttribute('data-layout', layout);
    localStorage.setItem(STORAGE_KEY_LAYOUT, layout);
  }, [layout]);

  // Persist custom CSS
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CSS, customCss);
  }, [customCss]);

  const setTheme = useCallback((newTheme: ItineraryTheme) => {
    setThemeState(newTheme);
  }, []);

  const applyMood = useCallback((preset: MoodPreset) => {
    setThemeState(preset.theme);
    setActiveMoodId(preset.id);
  }, []);

  const setLayout = useCallback((newLayout: LayoutPreset) => {
    setLayoutState(newLayout);
  }, []);

  const setCustomCss = useCallback((css: string) => {
    setCustomCssState(css);
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      layout,
      activeMoodId,
      customCss,
      setTheme,
      applyMood,
      setLayout,
      setCustomCss,
    }}>
      {children}
      {/* Inject custom CSS globally */}
      <style suppressHydrationWarning>{customCss}</style>
    </ThemeContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
