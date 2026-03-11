'use client';

import { useState, type ReactNode } from 'react';

export function SidebarTooltip({ text, children }: { text: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const onEnter = () => {
    const t = setTimeout(() => setVisible(true), 500);
    setTimer(t);
  };

  const onLeave = () => {
    if (timer) clearTimeout(timer);
    setVisible(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {children}
      {visible && (
        <div
          style={{
            position:        'absolute',
            bottom:          '100%',
            left:            '50%',
            transform:       'translateX(-50%) translateY(-8px)',
            backgroundColor: 'var(--color-text)',
            color:           'var(--color-surface)',
            padding:         '4px 8px',
            borderRadius:    '4px',
            fontSize:        '10px',
            fontWeight:      600,
            whiteSpace:      'nowrap',
            zIndex:          1100,
            pointerEvents:   'none',
            boxShadow:       '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {text}
          <div
            style={{
              position:    'absolute',
              top:         '100%',
              left:        '50%',
              transform:   'translateX(-50%)',
              borderLeft:  '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop:   '4px solid var(--color-text)',
            }}
          />
        </div>
      )}
    </div>
  );
}
