'use client';

import { useTheme } from '@/context/theme-context';
import { MOOD_PRESETS } from '@/lib/mood-presets';
import type { MoodPreset } from '@/types/itinerary-theme';

const MOOD_DOT_COLORS: Record<string, string> = {
  nature:    '#4A7C59',
  luxury:    '#C9A84C',
  adventure: '#E85D04',
  modern:    '#2563EB',
  spiritual: '#7B5EA7',
};

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}

function SocialButton({ icon, label, href = '#' }: { icon: React.ReactNode; label: string; href?: string }) {
  return (
    <a
      href={href}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '50%',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        e.currentTarget.style.color = 'var(--color-text-on-primary)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        e.currentTarget.style.color = 'var(--color-text-muted)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {icon}
    </a>
  );
}

function MoodDots() {
  const { activeMoodId, applyMood } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {MOOD_PRESETS.map(preset => (
        <button
          key={preset.id}
          onClick={() => applyMood(preset)}
          title={preset.label}
          style={{
            width: activeMoodId === preset.id ? '24px' : '10px',
            height: '10px',
            borderRadius: '999px',
            backgroundColor: MOOD_DOT_COLORS[preset.id],
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'width 0.25s ease, opacity 0.2s ease',
            opacity: activeMoodId === preset.id ? 1 : 0.4,
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = activeMoodId === preset.id ? '1' : '0.4';
          }}
        />
      ))}
    </div>
  );
}

export function Footer() {
  const { activeMoodId } = useTheme();
  return (
    <footer style={{ marginTop: 'var(--spacing-section)', padding: 'var(--spacing-lg) var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
      
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px', letterSpacing: '-0.01em', margin: 0 }}>
            TrackItinerary
          </h2>
          <div style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.75rem)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Premium travel itineraries, crafted for every journey.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SocialButton icon={<WhatsAppIcon />}  label="WhatsApp" />
          <SocialButton icon={<InstagramIcon />} label="Instagram" />
          <SocialButton icon={<FacebookIcon />}  label="Facebook" />
          <SocialButton icon={<TwitterIcon />}   label="Twitter / X" />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: 'var(--spacing-md)' }} />

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        <div style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.75rem)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          © {new Date().getFullYear()} TrackItinerary. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: 'clamp(0.6rem, 1vw, 0.7rem)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Theme</span>
          <MoodDots />
          <span style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.75rem)', color: 'var(--color-primary)', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'capitalize' as const }}>
            {activeMoodId}
          </span>
        </div>
      </div>

    </footer>
  );
}
