'use client';

import { useTheme } from '@/context/theme-context';
import { MOOD_PRESETS } from '@/lib/mood-presets';
import type { MoodPreset, LayoutPreset } from '@/types/itinerary-theme';
import { BrandColorPicker } from '@/components/brand-color-picker';

// ─── Constants ───────────────────────────────────────────────────

const MOOD_INFO: Record<string, { desc: string }> = {
  nature:    { desc: 'Warm' },
  luxury:    { desc: 'Elite' },
  adventure: { desc: 'Bold' },
  modern:    { desc: 'Sleek' },
  spiritual: { desc: 'Serene' },
};

const LAYOUT_OPTIONS: { id: LayoutPreset; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'stacked', 
    label: 'Stacked', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="4" rx="1" />
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <rect x="4" y="16" width="16" height="4" rx="1" />
      </svg>
    ) 
  },
  { 
    id: 'timeline', 
    label: 'Timeline', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="2" x2="8" y2="22" />
        <circle cx="8" cy="6" r="3" fill="currentColor" />
        <circle cx="8" cy="18" r="3" fill="currentColor" />
      </svg>
    ) 
  },
  { 
    id: 'compact', 
    label: 'Compact', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="12" height="4" rx="1" opacity="0.4" />
        <rect x="6" y="10" width="12" height="4" rx="1" />
        <rect x="6" y="16" width="12" height="4" rx="1" />
      </svg>
    ) 
  },
  { 
    id: 'mini-compact', 
    label: 'Mini-Compact', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="2" rx="0.5" />
        <rect x="4" y="8" width="16" height="2" rx="0.5" />
        <rect x="4" y="12" width="16" height="2" rx="0.5" />
        <rect x="4" y="16" width="16" height="2" rx="0.5" />
        <rect x="4" y="20" width="16" height="2" rx="0.5" />
      </svg>
    ) 
  },
];

// ─── Component ───────────────────────────────────────────────────

export function AppearanceSection() {
  const { activeMoodId, applyMood, layout, setLayout, customCss, setCustomCss } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ── Mood ── */}
      <div>
        <span
          style={{
            fontSize:   '10px',
            fontWeight: 700,
            color:      'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom:  '8px',
            display:       'block',
          }}
        >
          Mood Style
        </span>
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '6px',
          }}
        >
          {MOOD_PRESETS.map((p) => {
            const isActive = activeMoodId === p.id;
            const info = MOOD_INFO[p.id];
            
            return (
              <button
                key={p.id}
                onClick={() => applyMood(p)}
                style={{
                  display:         'flex',
                  flexDirection:   'column',
                  alignItems:      'center',
                  justifyContent:  'center',
                  gap:             '4px',
                  padding:         '8px 4px',
                  borderRadius:    '6px',
                  border:          isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isActive ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  cursor:          'pointer',
                  transition:      'all 0.2s',
                  height:          '60px',
                  position:        'relative',
                }}
              >
                <div
                  style={{
                    width:           '8px',
                    height:          '8px',
                    backgroundColor: p.theme.primaryColor,
                    borderRadius:    '50%',
                    flexShrink:      0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                  <span
                    style={{
                      fontSize:   '11px',
                      fontWeight: 700,
                      color:      'var(--color-text)',
                      textAlign: 'center',
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize:   '9px',
                      color:      'var(--color-text-muted)',
                      fontStyle:  'italic',
                    }}
                  >
                    {info.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Layout ── */}
      <div>
        <span
          style={{
            fontSize:   '10px',
            fontWeight: 700,
            color:      'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom:  '8px',
            display:       'block',
          }}
        >
          Layout Strategy
        </span>
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 '6px',
          }}
        >
          {LAYOUT_OPTIONS.map(opt => {
            const isActive = layout === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setLayout(opt.id)}
                style={{
                  display:         'flex',
                  flexDirection:   'column',
                  alignItems:      'center',
                  gap:             '4px',
                  padding:         '8px 4px',
                  borderRadius:    '6px',
                  border:          isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isActive ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  cursor:          'pointer',
                  transition:      'all 0.2s',
                }}
              >
                <div style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {opt.icon}
                </div>
                <span
                  style={{
                    fontSize:   '11px',
                    fontWeight: 600,
                    color:      'var(--color-text)',
                  }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Brand Color ── */}
      <div 
        style={{ 
          borderTop: '1px solid var(--color-border)', 
          paddingTop: '16px', 
          marginTop: '8px' 
        }}
      >
        <span
          style={{
            fontSize:      '10px',
            fontWeight:    700,
            color:         'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom:  '10px',
            display:       'block',
          }}
        >
          Primary Branding Color
        </span>
        <BrandColorPicker />
      </div>

      {/* ── Custom CSS ── */}
      <div 
        style={{ 
          borderTop: '1px solid var(--color-border)', 
          paddingTop: '16px', 
          marginTop: '16px' 
        }}
        className="identity-custom-css"
      >
        <span
          style={{
            fontSize:      '10px',
            fontWeight:    700,
            color:         'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom:  '10px',
            display:       'block',
          }}
        >
          Custom CSS Settings
        </span>
        <textarea
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
          placeholder="/* Target elements with CSS here */&#10;.header-company-name { color: red; }"
          style={{
            width: '100%',
            height: '120px',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'var(--color-text)',
            resize: 'vertical',
          }}
        />
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Real-time CSS overrides. Use specific classes like <code>.header-company-name</code>.
        </div>
      </div>
    </div>
  );
}
