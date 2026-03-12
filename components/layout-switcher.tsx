'use client';

import { useTheme } from '@/context/theme-context';
import { LAYOUT_PRESETS } from '@/lib/layout-presets';
import type { LayoutPreset } from '@/types/itinerary-theme';

// ─── Icons (inline SVG, no external dependency) ──────────────────

const LAYOUT_ICONS: Record<LayoutPreset, React.ReactNode> = {
  stacked: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="0" width="14" height="3" rx="1"/>
      <rect x="0" y="5" width="14" height="3" rx="1"/>
      <rect x="0" y="10" width="14" height="3" rx="1"/>
    </svg>
  ),
  split: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="0" width="6" height="14" rx="1"/>
      <rect x="8" y="0" width="6" height="4" rx="1"/>
      <rect x="8" y="6" width="6" height="4" rx="1"/>
    </svg>
  ),
  compact: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="0" width="14" height="2" rx="1"/>
      <rect x="0" y="4" width="14" height="2" rx="1"/>
      <rect x="0" y="8" width="14" height="2" rx="1"/>
      <rect x="0" y="12" width="14" height="2" rx="1"/>
    </svg>
  ),
};

// ─── Single layout button ─────────────────────────────────────────

function LayoutButton({
  id,
  label,
  isActive,
  onClick,
}: {
  id: LayoutPreset;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '6px',
        padding:         '6px 12px',
        borderRadius:    '999px',
        border:          isActive
                           ? '2px solid var(--color-primary)'
                           : '2px solid transparent',
        backgroundColor: isActive
                           ? 'var(--color-primary-muted)'
                           : 'transparent',
        color:           isActive
                           ? 'var(--color-primary-dark)'
                           : 'var(--color-text-muted)',
        fontFamily:      'var(--font-body)',
        fontSize:        '13px',
        fontWeight:      isActive ? 600 : 400,
        cursor:          'pointer',
        transition:      'all 0.2s ease',
        whiteSpace:      'nowrap',
      }}
    >
      {LAYOUT_ICONS[id]}
      {label}
    </button>
  );
}

// ─── Switcher container ───────────────────────────────────────────

export function LayoutSwitcher() {
  const { layout, setLayout } = useTheme();

  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '4px',
        padding:         '6px',
        borderRadius:    '999px',
        backgroundColor: 'var(--color-surface)',
        boxShadow:       'var(--shadow-card)',
        border:          '1px solid var(--color-border)',
      }}
    >
      {LAYOUT_PRESETS.map(preset => (
        <LayoutButton
          key={preset.id}
          id={preset.id}
          label={preset.label}
          isActive={layout === preset.id}
          onClick={() => setLayout(preset.id)}
        />
      ))}
    </div>
  );
}
