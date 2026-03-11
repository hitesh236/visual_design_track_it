'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

type SidebarAccordionProps = {
  id:           string;
  title:        string;
  icon:         ReactNode;
  isActive:     boolean;
  onToggle:     () => void;
  headerSuffix?: ReactNode; // For showing active selections in header
  children:     ReactNode;
};

export function SidebarAccordion({
  title,
  icon,
  isActive,
  onToggle,
  headerSuffix,
  children,
}: SidebarAccordionProps) {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
        width:        '100%',
        overflow:     'hidden',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width:           '100%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '16px 12px',
          backgroundColor: isActive ? 'var(--color-bg)' : 'transparent',
          border:          'none',
          cursor:          'pointer',
          transition:      'background-color 0.2s',
          textAlign:       'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ color: 'var(--color-primary)', display: 'flex' }}>
            {icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize:   '13px',
                fontWeight: 600,
                color:      'var(--color-text)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {title}
            </span>
            {!isActive && headerSuffix && (
              <div
                style={{
                  fontSize:   '11px',
                  color:      'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {headerSuffix}
              </div>
            )}
          </div>
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform:  isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color:      'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Content wrapper with transition */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isActive ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* Inner container with padding */}
          <div
            style={{
              padding: '4px 12px 16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
