
import type { ItineraryTheme, ScaleMode } from '@/types/itinerary-theme';

// ─── HSL Helpers ────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function resolveButtonTextColor(primaryColor: string): string {
  const l = getLuminance(primaryColor);
  return l > 0.2 ? '#1a1a1a' : '#ffffff';
}

// ─── Scale Mapping ───────────────────────────────────────────────

const SCALE_MULTIPLIER: Record<ScaleMode, string> = {
  small: '0.85',
  normal: '1.0',
  large: '1.18',
};

// ─── Spacing Scale ───────────────────────────────────────────────

const spacingScale = {
  compact:     { sm: '0.5rem',  md: '1rem',   lg: '1.5rem',  section: '2rem'  },
  comfortable: { sm: '0.75rem', md: '1.25rem', lg: '2rem',    section: '3rem'  },
  spacious:    { sm: '1rem',    md: '1.75rem', lg: '2.5rem',  section: '4rem'  },
};

export function resolveThemeToCSSVars(theme: ItineraryTheme): Record<string, string> {
  const [h, s, l] = hexToHsl(theme.primaryColor);
  const spacing = spacingScale[theme.sectionSpacing];
  const scale = SCALE_MULTIPLIER[theme.scaleMode || 'normal'];
  const isDark = theme.colorMode === 'dark';

  return {
    '--itinerary-scale': scale,
    '--color-primary': hsl(h, s, l),
    '--color-primary-muted': isDark ? hsl(h, Math.max(s - 30, 5), 18) : hsl(h, Math.max(s - 20, 10), 92),
    '--color-primary-muted-text': isDark ? '#f1f1f1' : hsl(h, s, Math.min(l, 40)),
    '--color-bg': theme.backgroundColor,
    '--color-surface': theme.surfaceColor,
    '--color-border': isDark ? hsl(h, 10, 25) : hsl(h, 15, 88),
    '--color-text': isDark ? '#f1f1f1' : '#1a1a1a',
    '--color-text-muted': isDark ? hsl(h, 5, 75) : hsl(h, 15, 38),
    '--color-text-on-primary': resolveButtonTextColor(theme.primaryColor),
    '--color-hotel': hsl(h, s, l),
    '--color-flight': 'hsl(270, 70%, 55%)',
    '--color-transport': 'hsl(25, 90%, 52%)',
    '--color-activity': 'hsl(145, 60%, 40%)',
    '--color-train': 'hsl(235, 65%, 50%)',
    '--color-bus': 'hsl(175, 60%, 38%)',
    '--font-heading': `'${theme.headingFont}', serif`,
    '--font-body': `'${theme.bodyFont}', sans-serif`,
    '--radius-card': `${theme.cardRadius}px`,
    '--spacing-sm': spacing.sm,
    '--spacing-md': spacing.md,
    '--spacing-lg': spacing.lg,
    '--spacing-section': spacing.section,
    '--color-note-bg': isDark ? hsl(h, 10, 20) : hsl(h, 25, 96),
    '--color-note-text': isDark ? '#f1f1f1' : hsl(h, 20, 25),
    '--color-note-accent': isDark ? hsl(h, s, Math.max(l, 60)) : hsl(h, s, Math.min(l, 40)),
  };
}
