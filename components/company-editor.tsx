'use client';

import { useRef } from 'react';
import type { CompanyData } from '@/hooks/use-company';

// ─── Types ───────────────────────────────────────────────────────

type CompanyEditorProps = {
  company:     CompanyData;
  updateField: <K extends keyof CompanyData>(field: K, value: CompanyData[K]) => void;
};

// ─── Shared styles ───────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize:      '10px',
  fontWeight:    600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color:         'var(--color-text-muted)',
  fontFamily:    'var(--font-body)',
  marginBottom:  '2px',
  display:       'block',
};

const inputStyle: React.CSSProperties = {
  width:           '100%',
  padding:         '6px 9px',
  borderRadius:    'var(--radius-badge)',
  border:          '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)',
  color:           'var(--color-text)',
  fontFamily:      'var(--font-body)',
  fontSize:        '12px',
  outline:         'none',
  transition:      'border-color 0.2s ease',
};

// ─── Component ───────────────────────────────────────────────────

export function CompanyEditor({ company, updateField }: CompanyEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    updateField('logoUrl', url);
  }

  function clearLogo() {
    updateField('logoUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        width:         '100%',
      }}
    >
      {/* Company Name */}
      <div>
        <span style={labelStyle}>Company Name</span>
        <input
          type="text"
          value={company.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="Enter company name"
          style={inputStyle}
        />
      </div>

      {/* Address */}
      <div>
        <span style={labelStyle}>Address</span>
        <input
          type="text"
          value={company.address}
          onChange={e => updateField('address', e.target.value)}
          placeholder="Full address"
          style={inputStyle}
        />
      </div>

      {/* Phone & Email — side by side */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Phone</span>
          <input
            type="text"
            value={company.phone}
            onChange={e => updateField('phone', e.target.value)}
            placeholder="+91 ..."
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Email</span>
          <input
            type="text"
            value={company.email}
            onChange={e => updateField('email', e.target.value)}
            placeholder="you@email.com"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <span style={labelStyle}>Website</span>
        <input
          type="text"
          value={company.website}
          onChange={e => updateField('website', e.target.value)}
          placeholder="www.example.com"
          style={inputStyle}
        />
      </div>

      {/* Logo upload */}
      <div>
        <span style={labelStyle}>Logo</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Thumbnail preview */}
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt="Logo"
              style={{
                width:        '36px',
                height:       '36px',
                objectFit:    'contain',
                borderRadius: 'var(--radius-badge)',
                border:       '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                padding:      '3px',
              }}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
            id="company-logo-upload"
          />
          <label
            htmlFor="company-logo-upload"
            style={{
              padding:         '5px 12px',
              borderRadius:    'var(--radius-pill)',
              backgroundColor: 'var(--color-primary)',
              color:           'var(--color-text-on-primary)',
              fontSize:        '11px',
              fontWeight:      600,
              fontFamily:      'var(--font-body)',
              cursor:          'pointer',
              transition:      'opacity 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {company.logoUrl ? 'Change' : 'Upload Logo'}
          </label>

          {company.logoUrl && (
            <button
              type="button"
              onClick={clearLogo}
              style={{
                padding:         '5px 10px',
                borderRadius:    'var(--radius-pill)',
                backgroundColor: 'transparent',
                color:           'var(--color-text-muted)',
                fontSize:        '11px',
                fontFamily:      'var(--font-body)',
                border:          '1px solid var(--color-border)',
                cursor:          'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Hint */}
      <p
        style={{
          fontSize:   '10px',
          color:      'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
          margin:     0,
          lineHeight: 1.4,
          fontStyle:  'italic',
        }}
      >
        Leave company name empty to hide branding from the itinerary.
      </p>
    </div>
  );
}
