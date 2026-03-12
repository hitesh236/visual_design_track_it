'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/theme-context';

// ─── Google Fonts Loader ─────────────────────────────────────────

function useGoogleFonts(headingFont: string, bodyFont: string) {
  useEffect(() => {
    const fonts = [...new Set([headingFont, bodyFont])];
    const families = fonts
      .map(f => f.replace(/ /g, '+') + ':wght@400;600;700')
      .join('&family=');

    const id = 'google-fonts-dynamic';
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
  }, [headingFont, bodyFont]);
}

// ─── Shell Component ─────────────────────────────────────────────

type ItineraryShellProps = {
  children: React.ReactNode;
};

export function ItineraryShell({ children }: ItineraryShellProps) {
  const { theme } = useTheme();

  useGoogleFonts(theme.headingFont, theme.bodyFont);

  return (
    <main
      className="itinerary-shell"
      style={{
        backgroundColor: 'var(--color-bg)',
        color:            'var(--color-text)',
        fontFamily:       'var(--font-body)',
        minHeight:        '100vh',
        width:            '100%',
        backgroundImage: `radial-gradient(
      var(--color-border) 1px,
      transparent 1px
    )`,
        backgroundSize:  '24px 24px',
      }}
    >
      <div
        className="itinerary-inner-wrapper"
        style={{
          maxWidth:        '860px',
          width:           '100%',
          margin:          '0 auto',
          padding:         '0 var(--spacing-md)',
          backgroundColor: 'var(--color-bg)',
          minHeight:       '100vh',
          boxShadow:       'var(--shadow-elevated)',
          boxSizing:       'border-box',
          overflowX:       'hidden',
        }}
      >
        {children}
      </div>
    </main>
  );
}
