import type { ItineraryTheme } from '@/types/itinerary-theme';

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

// ─── Contrast Guard (WhatsApp / high-glare readability) ──────────
// If primary color is too light (L > 65%) in light mode,
// auto-switch button text to dark charcoal instead of white.

function resolveButtonTextColor(l: number, colorMode: string): string {
  if (colorMode === 'light' && l > 65) return '#1a1a1a';
  return '#ffffff';
}

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

  return {
    // Colors — primary scale (auto-generated from single hex)
    '--color-primary':       hsl(h, s, l),
    '--color-primary-light': hsl(h, s, Math.min(l + 20, 95)),
    '--color-primary-dark':  hsl(h, s, Math.max(l - 20, 10)),
    '--color-primary-muted': hsl(h, Math.max(s - 20, 10), Math.min(l + 30, 95)),

    // Colors — surfaces
    '--color-bg':            theme.backgroundColor,
    '--color-surface':       theme.surfaceColor,
    '--color-border':        theme.colorMode === 'dark'
                               ? hsl(h, 10, 25)
                               : hsl(h, 15, 88),

    // Colors — text
    '--color-text':          theme.colorMode === 'dark' ? '#f1f1f1' : '#1a1a1a',
    '--color-text-muted':    theme.colorMode === 'dark'
                               ? hsl(h, 10, 65)
                               : hsl(h, 10, 45),
    '--color-text-on-primary': resolveButtonTextColor(l, theme.colorMode),

    // Colors — semantic (badges, tags)
    '--color-hotel':         'hsl(210, 80%, 50%)',
    '--color-flight':        'hsl(270, 70%, 55%)',
    '--color-transport':     'hsl(25, 90%, 52%)',
    '--color-activity':      'hsl(145, 60%, 40%)',
    '--color-train':         'hsl(235, 65%, 50%)',
    '--color-bus':           'hsl(175, 60%, 38%)',

    // Accent (complementary hue, 180° opposite)
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
  };
}

// ─── Fluid type scale (reference) ────────────────────────────────
// Use these clamp values directly in component fontSize styles.
// Do not hardcode px values for any heading or display text.

export const TYPE_SCALE = {
  display:  'clamp(1.6rem, 4vw,  2.8rem)',   // hero title
  h1:       'clamp(1.3rem, 3vw,  2rem)',      // section heading
  h2:       'clamp(1.1rem, 2.5vw, 1.6rem)',   // day card title
  h3:       'clamp(0.95rem, 2vw, 1.25rem)',   // card heading
  body:     'clamp(0.8rem, 1.5vw, 0.9375rem)', // 13–15px
  small:    'clamp(0.7rem, 1.2vw, 0.8125rem)', // 11–13px
  micro:    'clamp(0.6rem, 1vw,  0.75rem)',   // 10–12px labels
} as const;
