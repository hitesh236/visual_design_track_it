'use client';

import { useState } from 'react';
import { useTheme } from '@/context/theme-context';

// ─── Types ────────────────────────────────────────────────────────

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

type AccordionProps = {
  items: {
    title: string;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }[];
};

// ─── Chevron icon ─────────────────────────────────────────────────

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Single accordion item ────────────────────────────────────────

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { activeMoodId } = useTheme();

  const cardExtras: React.CSSProperties =
    activeMoodId === 'spiritual'
      ? {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.5)',
      }
      : activeMoodId === 'luxury' && isOpen
        ? {
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 0 1px var(--color-primary), var(--shadow-elevated)',
        }
        : {};

  const openPanelBg: React.CSSProperties =
    activeMoodId === 'luxury'
      ? { backgroundColor: 'rgba(201,168,76,0.06)' }
      : activeMoodId === 'adventure'
        ? { backgroundColor: 'rgba(232,93,4,0.04)' }
        : {};

  return (
    <>
      <style>{`
        /* 📱 1. MOBILE FIRST (Default Tighter Spacing) */
        .accordion-trigger, .accordion-content {
          padding: var(--spacing-sm) var(--spacing-md) !important;
        }

        /* 🧬 2. DESKTOP/PRINT ENHANCEMENTS */
        @media (min-width: 1024px), print {
          .itinerary-shell:not([data-forced-mobile="true"]) .accordion-trigger,
          .itinerary-shell:not([data-forced-mobile="true"]) .accordion-content {
            padding: var(--spacing-md) var(--spacing-lg) !important;
          }
        }
      `}</style>
      <div
        style={{
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          boxShadow: isOpen ? 'var(--shadow-elevated)' : 'var(--shadow-card)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          ...cardExtras,
        }}
      >
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="accordion-trigger"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            backgroundColor: isOpen ? 'var(--color-primary-muted)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!isOpen)
              e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)';
          }}
          onMouseLeave={e => {
            if (!isOpen)
              e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div
              style={{
                width: '3px',
                height: '18px',
                borderRadius: '999px',
                backgroundColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)',
                flexShrink: 0,
                transition: 'background-color 0.2s ease',
              }}
            />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                fontWeight: 600,
                color: isOpen ? 'var(--color-primary)' : 'var(--color-text)',
                transition: 'color 0.2s ease',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>
          <span style={{ color: isOpen ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color 0.2s ease' }}>
            <ChevronIcon isOpen={isOpen} />
          </span>
        </button>

        <div className="accordion-content-wrapper" style={{ maxHeight: isOpen ? '2000px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
          <div className="accordion-content" style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderTop: '1px solid var(--color-border)', ...openPanelBg }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Accordion group ──────────────────────────────────────────────

export function Accordion({ items }: AccordionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
      }}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          defaultOpen={item.defaultOpen}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
