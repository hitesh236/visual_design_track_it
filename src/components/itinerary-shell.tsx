
'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';

export function ItineraryShell({ children, forcedMobile = false }: { children: React.ReactNode; forcedMobile?: boolean }) {
  const { theme } = useTheme();

  return (
    <div 
      className="itin-shell" 
      data-forced-mobile={forcedMobile ? "true" : "false"}
    >
      <div 
        className="itin-wrapper"
        style={{
          paddingTop: forcedMobile ? '0' : 'var(--spacing-lg)',
          paddingBottom: 'var(--spacing-section)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function useShell() {
  if (typeof document !== 'undefined') {
    const shell = document.querySelector('.itin-shell');
    return { forcedMobile: shell?.getAttribute('data-forced-mobile') === 'true' };
  }
  return { forcedMobile: false };
}
