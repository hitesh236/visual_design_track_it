'use client';

import { useEffect, createContext, useContext } from 'react';
import { useTheme } from '@/context/theme-context';

// ─── Shell Context ───────────────────────────────────────────────

type ShellContextValue = {
  forcedMobile: boolean;
};

const ShellContext = createContext<ShellContextValue>({ forcedMobile: false });

export function useShell() {
  return useContext(ShellContext);
}

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
  forcedMobile?: boolean;
};

export function ItineraryShell({ children, forcedMobile = false }: ItineraryShellProps) {
  const { theme } = useTheme();

  useGoogleFonts(theme.headingFont, theme.bodyFont);

  return (
    <ShellContext.Provider value={{ forcedMobile }}>
      <main
        className="itinerary-shell"
        data-forced-mobile={forcedMobile ? "true" : "false"}
        style={{
          backgroundColor: 'var(--color-bg)',
          color:            'var(--color-text)',
          fontFamily:       'var(--font-body)',
          minHeight:        '100vh',
          width:            '100%',
          backgroundImage: `radial-gradient(var(--color-border) 1px, transparent 1px)`,
          backgroundSize:  '24px 24px',
          boxSizing:       'border-box',
          overflowX:       'hidden',
        }}
      >
        <div
          className="itinerary-inner-wrapper"
          style={{
            maxWidth:        forcedMobile ? '100%' : '860px',
            width:           '100%',
            margin:          '0 auto',
            padding:         forcedMobile ? '0' : '0 var(--spacing-md)',
            backgroundColor: 'var(--color-bg)',
            minHeight:       '100vh',
            boxShadow:       forcedMobile ? 'none' : 'var(--shadow-elevated)',
            boxSizing:       'border-box',
            overflowX:       'hidden',
            position:        'relative',
          }}
        >
          {children}
        </div>
      </main>
    </ShellContext.Provider>
  );
}
