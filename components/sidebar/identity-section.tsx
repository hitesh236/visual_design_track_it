'use client';

import { useState, useEffect } from 'react';
import { CompanyEditor } from '@/components/company-editor';
import { ExecutiveEditor } from '@/components/executive-editor';
import type { CompanyData } from '@/hooks/use-company';
import type { ExecutiveData } from '@/hooks/use-executive';

type IdentitySectionProps = {
  company:              CompanyData;
  updateField:          <K extends keyof CompanyData>(field: K, value: CompanyData[K]) => void;
  executive:            ExecutiveData;
  updateExecutiveField: <K extends keyof ExecutiveData>(field: K, value: ExecutiveData[K]) => void;
  onFocusCompany?:      () => void;
  onFocusExecutive?:    () => void;
};

// ─── Collapsible Panel ───────────────────────────────────────────

function CollapsiblePanel({
  id,
  label,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border:       '1px solid var(--color-border)',
        borderRadius: '8px',
        overflow:     'hidden',
        transition:   'border-color 0.2s',
        borderColor:  isOpen ? 'var(--color-primary)' : 'var(--color-border)',
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
          padding:         '10px 12px',
          backgroundColor: isOpen ? 'var(--color-primary-muted)' : 'var(--color-surface)',
          border:          'none',
          cursor:          'pointer',
          textAlign:       'left',
          transition:      'background-color 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-primary)', display: 'flex' }}>{icon}</span>
          <span style={{
            fontSize: '13px', fontWeight: 700,
            color: 'var(--color-text)', fontFamily: 'var(--font-heading)',
          }}>
            {label}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export function IdentitySection({
  company,
  updateField,
  executive,
  updateExecutiveField,
  onFocusCompany,
  onFocusExecutive,
}: IdentitySectionProps) {
  // Both closed by default — user must click to reveal
  const [openPanel, setOpenPanel] = useState<'company' | 'executive' | null>(null);

  const togglePanel = (panel: 'company' | 'executive') => {
    setOpenPanel(prev => prev === panel ? null : panel);
  };

  // Scroll when panel opens
  useEffect(() => {
    if (openPanel === 'company' && onFocusCompany) {
      onFocusCompany();
    } else if (openPanel === 'executive' && onFocusExecutive) {
      onFocusExecutive();
    }
  }, [openPanel, onFocusCompany, onFocusExecutive]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

      {/* Company Panel */}
      <CollapsiblePanel
        id="company"
        label="Company"
        isOpen={openPanel === 'company'}
        onToggle={() => togglePanel('company')}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        }
      >
        <CompanyEditor company={company} updateField={updateField} />
      </CollapsiblePanel>

      {/* Executive Panel */}
      <CollapsiblePanel
        id="executive"
        label="Sales Executive"
        isOpen={openPanel === 'executive'}
        onToggle={() => togglePanel('executive')}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        }
      >
        <ExecutiveEditor executive={executive} updateExecutiveField={updateExecutiveField} />
      </CollapsiblePanel>

    </div>
  );
}
