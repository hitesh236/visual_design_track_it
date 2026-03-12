'use client';

import { useTheme } from '@/context/theme-context';
import { MOOD_PRESETS } from '@/lib/mood-presets';
import type { MoodPreset } from '@/types/itinerary-theme';
import { useState, useEffect } from 'react';

// ─── Mood dot color (small preview circle per mood) ──────────────

const MOOD_DOT: Record<string, string> = {
  nature:    '#4A7C59',
  luxury:    '#C9A84C',
  adventure: '#E85D04',
  modern:    '#2563EB',
  spiritual: '#7B5EA7',
};

// ─── Single mood pill button ─────────────────────────────────────

function MoodButton({
  preset,
  isActive,
  onClick,
}: {
  preset: MoodPreset;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 480);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <button
      onClick={onClick}
      title={preset.label}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '4px',
        padding:         '6px 8px',
        borderRadius:    '999px',
        border:          isActive
                           ? '2px solid var(--color-primary)'
                           : '2px solid transparent',
        backgroundColor: isActive
                           ? 'var(--color-primary)'
                           : 'transparent',
        color:           isActive
                           ? 'var(--color-text-on-primary)'
                           : 'var(--color-text)',
        fontFamily:      'var(--font-body)',
        fontSize:        'clamp(0.6rem, 1vw, 0.8125rem)',
        fontWeight:      isActive ? 600 : 400,
        cursor:          'pointer',
        transition:      'all 0.2s ease',
        whiteSpace:      'nowrap',
      }}
    >
      {/* Color dot */}
      <span
        style={{
          width:        '8px',
          height:       '8px',
          borderRadius: '50%',
          backgroundColor: MOOD_DOT[preset.id],
          flexShrink:   0,
        }}
      />
      {/* Hide label below 480px */}
      <span
        style={{
          display: isSmall ? 'none' : 'inline',
        }}
      >
        {preset.label}
      </span>
    </button>
  );
}

// ─── Switcher container ──────────────────────────────────────────

export function MoodSwitcher() {
  const { activeMoodId, applyMood } = useTheme();

  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '2px',
        padding:         '4px',
        borderRadius:    '999px',
        backgroundColor: 'var(--color-surface)',
        boxShadow:       'var(--shadow-elevated)',
        border:          '1px solid var(--color-border)',
        flexWrap:        'wrap',
        maxWidth:        'calc(100vw - 40px)',
      }}
    >
      {MOOD_PRESETS.map(preset => (
        <MoodButton
          key={preset.id}
          preset={preset}
          isActive={activeMoodId === preset.id}
          onClick={() => applyMood(preset)}
        />
      ))}
    </div>
  );
}
