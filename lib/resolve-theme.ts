
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
  // WCAG says text needs 4.5:1 ratio. 
  // White text (L=1.0) on background with luminance L: (1.0 + 0.05) / (L + 0.05) >= 4.5 => L <= 0.183
  // Dark text (L=0.01) on background with luminance L: (L + 0.05) / (0.01 + 0.05) >= 4.5 => L >= 0.22
  // We'll use 0.2 as the threshold.
  return l > 0.2 ? '#1a1a1a' : '#ffffff';
}

// ─── Scale Mapping ───────────────────────────────────────────────

const SCALE_OFFSETS: Record<ScaleMode, string> = {
  small: '-2px',
  normal: '0px',
  large: '2px',
};

// ─── Spacing Scale ───────────────────────────────────────────────

const spacingScale = {
  compact:     { sm: '0.5rem',  md: '1rem',   lg: '1.5rem',  section: '2rem'  },
  comfortable: { sm: '0.75rem', md: '1.25rem', lg: '2rem',    section: '3rem'  },
  spacious:    { sm: '1rem',    md: '1.75rem', lg: '2.5rem',  section: '4rem'  },
};

// ─── Main Resolver ───────────────────────────────────────────────

export function resolveThemeToCSSVars(
  theme: ItineraryTheme
): Record<string, string> {
  const [h, s, l] = hexToHsl(theme.primaryColor);
  const spacing = spacingScale[theme.sectionSpacing];
  const fontAdjust = SCALE_OFFSETS[theme.scaleMode || 'normal'];

  const isDark = theme.colorMode === 'dark';

  return {
    // Scaling Factor
    '--font-size-adjust':     fontAdjust,

    // Colors — primary scale
    '--color-primary':       hsl(h, s, l),
    '--color-primary-light': hsl(h, s, Math.min(l + 20, 95)),
    '--color-primary-dark':  hsl(h, s, Math.max(l - 20, 10)),
    // In dark mode, primary-muted should be DARKENED if it's used as a background for light text,
    // or kept very light if used with dark text. 
    // Let's make it consistent: very light for light mode, very dark for dark mode.
    '--color-primary-muted': isDark
                               ? hsl(h, Math.max(s - 30, 5), 18)
                               : hsl(h, Math.max(s - 20, 10), 92),
    '--color-primary-muted-text': isDark ? '#f1f1f1' : hsl(h, s, Math.min(l, 40)),

    // Colors — surfaces
    '--color-bg':            theme.backgroundColor,
    '--color-surface':       theme.surfaceColor,
    '--color-border':        isDark
                               ? hsl(h, 10, 25)
                               : hsl(h, 15, 88),

    // Colors — text
    '--color-text':          isDark ? '#f1f1f1' : '#1a1a1a',
    '--color-text-muted':    isDark
                               ? hsl(h, 5, 75) // Lighter for dark mode
                               : hsl(h, 15, 38), // Darker for light mode
    '--color-text-on-primary': resolveButtonTextColor(theme.primaryColor),

    // Colors — semantic
    // Colors — semantic (Hotel)
    '--color-hotel':         hsl(h, s, l),
    '--color-hotel-muted':   isDark ? hsl(h, 25, 20) : hsl(h, 30, 96),
    '--color-hotel-border':  isDark ? hsl(h, s, 35) : hsl(h, s, 85),
    '--color-hotel-text':    isDark ? hsl(h, s, 90) : hsl(h, s, 25),
    
    '--color-flight':        'hsl(270, 70%, 55%)',
    '--color-transport':     'hsl(25, 90%, 52%)',
    '--color-activity':      'hsl(145, 60%, 40%)',
    '--color-train':         'hsl(235, 65%, 50%)',
    '--color-bus':           'hsl(175, 60%, 38%)',

    // Accent
    '--color-accent':        hsl((h + 180) % 360, s, l),

    // Typography
    '--font-heading':        `'${theme.headingFont}', serif`,
    '--font-body':           `'${theme.bodyFont}', sans-serif`,

    // Shape
    '--radius-card':         `${theme.cardRadius}px`,
    '--radius-pill':         '999px',
    '--radius-badge':        `${Math.max(theme.cardRadius - 6, 4)}px`,

    // Shadow
    '--shadow-card':         theme.colorMode === 'dark'
                               ? '0 4px 24px rgba(0,0,0,0.4)'
                               : '0 2px 16px rgba(0,0,0,0.08)',
    '--shadow-elevated':     theme.colorMode === 'dark'
                               ? '0 8px 40px rgba(0,0,0,0.6)'
                               : '0 8px 32px rgba(0,0,0,0.12)',

    // Spacing
    '--spacing-sm':          spacing.sm,
    '--spacing-md':          spacing.md,
    '--spacing-lg':          spacing.lg,
    '--spacing-section':     spacing.section,

    // Note Section Specifically (Fixes WCAG failures in various moods)
    '--color-note-bg':       isDark
                               ? hsl(h, 10, 20)
                               : hsl(h, 25, 96),
    '--color-note-text':     isDark ? '#f1f1f1' : hsl(h, 20, 25),
    '--color-note-accent':   isDark 
                               ? hsl(h, s, Math.max(l, 60)) // Brighter primary/accent for dark mode
                               : hsl(h, s, Math.min(l, 40)), // Darker primary/accent for light mode
  };
}
