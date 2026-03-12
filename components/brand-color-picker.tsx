'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';
import { getMoodPreset } from '@/lib/mood-presets';

// ─── Quick-swatch palette — 10 swatches, shown in 2 rows of 5 ────

const PRESET_SWATCHES = [
  { hex: '#C9A84C', label: 'Warm Gold' },
  { hex: '#2563EB', label: 'Royal Blue' },
  { hex: '#D2691E', label: 'Burnt Orange' },
  { hex: '#7B5EA7', label: 'Violet Purple' },
  { hex: '#2D6A4F', label: 'Forest Green' },
  { hex: '#C41E3A', label: 'Crimson Red' },
  { hex: '#0D9488', label: 'Teal' },
  { hex: '#6B4226', label: 'Walnut Brown' },
  { hex: '#4338CA', label: 'Indigo' },
  { hex: '#DB2777', label: 'Magenta Pink' },
] as const;

// ─── Hex validation ──────────────────────────────────────────────

function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function normalizeHex(raw: string): string {
  return '#' + raw.trim().replace(/^#+/, '');
}

// ─── Component ───────────────────────────────────────────────────

export function BrandColorPicker() {
  const { theme, setTheme, activeMoodId } = useTheme();
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const [hexDraft, setHexDraft] = useState(theme.primaryColor);
  const [previewColor, setPreviewColor] = useState(theme.primaryColor);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHexDraft(theme.primaryColor.toUpperCase());
    setPreviewColor(theme.primaryColor);
    setHasError(false);
  }, [theme.primaryColor]);

  function applyColor(hex: string) {
    setTheme({ ...theme, primaryColor: hex });
  }

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexDraft(raw);
    setHasError(false);
    const normalized = normalizeHex(raw);
    if (isValidHex(normalized)) setPreviewColor(normalized);
  }

  function commitHex() {
    const normalized = normalizeHex(hexDraft);
    if (isValidHex(normalized)) {
      setHasError(false);
      applyColor(normalized);
    } else {
      setHasError(true);
    }
  }

  function handleHexKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); commitHex(); }
  }

  function handleNativeInput(e: React.FormEvent<HTMLInputElement>) {
    const hex = e.currentTarget.value.toUpperCase();
    setPreviewColor(hex);
    setHexDraft(hex);
  }

  function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyColor(e.target.value.toUpperCase());
  }

  function resetToMoodDefault() {
    applyColor(getMoodPreset(activeMoodId).theme.primaryColor);
  }

  function isSwatchActive(hex: string) {
    return theme.primaryColor.toUpperCase() === hex.toUpperCase();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* ── Big Color Preview Box + Hex Input ── */}
      <div
        style={{
          display:       'flex',
          alignItems:    'stretch',
          borderRadius:  '8px',
          overflow:      'hidden',
          border:        `1.5px solid ${hasError ? 'hsl(0,70%,50%)' : 'var(--color-border)'}`,
        }}
      >
        {/* Left: Big Color Box (clickable → opens native picker) */}
        <div
          style={{ position: 'relative', flexShrink: 0 }}
          title="Click to open color picker"
        >
          <div
            onClick={() => nativeInputRef.current?.click()}
            style={{
              width:           '56px',
              height:          '100%',
              minHeight:       '44px',
              backgroundColor: previewColor,
              cursor:          'pointer',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              transition:      'background-color 0.1s ease',
            }}
          >
            {/* Eyedropper icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L11 6.67l-8 8a2 2 0 0 0-.59 1.41V20h4a2 2 0 0 0 1.41-.59l8-8 2.06-2.06a5.5 5.5 0 0 0 0-7.78z"/>
              <line x1="11" y1="6.5" x2="17.5" y2="13"/>
            </svg>
          </div>
          {/* Hidden native input */}
          <input
            ref={nativeInputRef}
            type="color"
            value={theme.primaryColor}
            onInput={handleNativeInput}
            onChange={handleNativeChange}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer',
              border: 'none', padding: 0,
            }}
            tabIndex={-1}
          />
        </div>

        {/* Right: Hex Input (always visible) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
          <div style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-text-muted)',
            padding: '6px 10px 2px 10px',
          }}>
            Hex Code
          </div>
          <input
            type="text"
            value={hexDraft}
            onChange={handleHexChange}
            onBlur={commitHex}
            onKeyDown={handleHexKeyDown}
            spellCheck={false}
            autoComplete="off"
            placeholder="#000000"
            style={{
              flex:            1,
              border:          'none',
              outline:         'none',
              padding:         '2px 10px 6px 10px',
              backgroundColor: 'transparent',
              color:           'var(--color-text)',
              fontFamily:      'var(--font-body)',
              fontSize:        '14px',
              fontWeight:      700,
              letterSpacing:   '0.04em',
            }}
          />
        </div>
      </div>

      {/* ── Swatch Grid: 5-per-row, 2 rows = 10 swatches, SQUARE ── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap:                 '6px',
        }}
      >
        {PRESET_SWATCHES.map(({ hex, label }) => {
          const active = isSwatchActive(hex);
          return (
            <button
              key={hex}
              type="button"
              title={label}
              onClick={() => applyColor(hex)}
              style={{
                aspectRatio:     '1 / 1',
                borderRadius:    '6px',
                backgroundColor: hex,
                border:          active
                  ? '3px solid var(--color-text)'
                  : '2px solid transparent',
                cursor:          'pointer',
                padding:         0,
                outline:         active ? `2px solid ${hex}` : 'none',
                outlineOffset:   active ? '1px' : '0',
                transition:      'transform 0.15s ease, outline 0.15s ease',
                transform:       active ? 'scale(1.08)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = active ? 'scale(1.08)' : 'scale(1)'; }}
            />
          );
        })}
      </div>

      {/* ── Reset link ── */}
      <button
        type="button"
        onClick={resetToMoodDefault}
        style={{
          background: 'none', border: 'none', padding: 0, margin: 0,
          fontSize: '11px', fontFamily: 'var(--font-body)',
          color: 'var(--color-text-muted)', cursor: 'pointer',
          alignSelf: 'flex-start', transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
      >
        ↺ Reset to mood default
      </button>
    </div>
  );
}
