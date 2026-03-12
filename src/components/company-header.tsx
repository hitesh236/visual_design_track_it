'use client';

import { useState } from 'react';
import type { CompanyData } from '@/hooks/use-company';

// ─── Initials extractor ──────────────────────────────────────────

function getInitials(name: string): string {
  if (!name) return 'C';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

// ─── Icons ───────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────

type CompanyHeaderProps = {
  company: CompanyData;
  id?: string;
};

export function CompanyHeader({ company, id }: CompanyHeaderProps) {
  const [logoError, setLogoError] = useState(false);

  const initials  = getInitials(company.name);
  const hasLogo   = !!company.logoUrl && !logoError;
  const hasName   = !!company.name.trim();
  const hasAddr   = !!company.address.trim();
  const hasPhone  = !!company.phone.trim();
  const hasEmail  = !!company.email.trim();
  const hasWebsite = !!company.website.trim();

  // If nothing is present, hide the section
  if (!hasLogo && !hasName && !hasAddr && !hasPhone && !hasEmail && !hasWebsite) return null;

  const websiteHref = company.website.startsWith('http')
    ? company.website
    : `https://${company.website}`;

  // ── Contact chip style ──
  const chipStyle: React.CSSProperties = {
    display:         'inline-flex',
    alignItems:      'center',
    gap:             '5px',
    padding:         '4px 10px',
    borderRadius:    'var(--radius-pill)',
    backgroundColor: 'var(--color-bg)',
    border:          '1px solid var(--color-border)',
    fontSize:        'clamp(0.65rem, 1.1vw, 0.75rem)',
    fontFamily:      'var(--font-body)',
    color:           'var(--color-text-muted)',
    textDecoration:  'none',
    transition:      'all 0.2s ease',
    maxWidth:        '100%',
  };

  return (
    <section
      id={id}
      className="company-header-root"
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        gap:             '16px',
        padding:         'var(--spacing-md) var(--spacing-lg)',
        backgroundColor: 'var(--color-surface)',
        borderBottom:    '1px solid var(--color-border)',
        fontFamily:      'var(--font-body)',
        overflowX:       'hidden',
        width:           '100%',
        boxSizing:       'border-box',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .company-header-root {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 12px !important;
          }
          .company-header-left {
            flex-direction: column !important;
            align-items: center !important;
          }
          .company-header-info {
            align-items: center !important;
          }
          .company-header-chips {
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
        }
      `}</style>

      {/* ── Left: Logo + Info ── */}
      <div
        className="company-header-left"
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '14px',
          minWidth:   0,
        }}
      >
        {/* Logo */}
        {hasLogo ? (
          <img
            className="company-logo"
            src={company.logoUrl}
            alt={company.name}
            onError={() => setLogoError(true)}
            style={{
              width:        '52px',
              height:       '52px',
              objectFit:    'contain',
              borderRadius: 'var(--radius-badge)',
              border:       '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              padding:      '4px',
              flexShrink:   0,
            }}
          />
        ) : hasName ? (
          <div
            style={{
              width:           '52px',
              height:          '52px',
              borderRadius:    'var(--radius-badge)',
              backgroundColor: 'var(--color-primary)',
              color:           'var(--color-text-on-primary)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '18px',
              fontWeight:      700,
              fontFamily:      'var(--font-heading)',
              letterSpacing:   '0.04em',
              flexShrink:      0,
            }}
          >
            {initials}
          </div>
        ) : null}

        {/* Info cluster */}
        {(hasName || hasAddr || hasPhone || hasEmail || hasWebsite) && (
          <div
            className="company-header-info"
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '3px',
              minWidth:      0,
            }}
          >
            {hasName && (
              <h2
                className="company-name"
                style={{
                  fontSize:      'clamp(0.95rem, 2vw, 1.2rem)',
                  fontWeight:    700,
                  fontFamily:    'var(--font-heading)',
                  color:         'var(--color-text)',
                  lineHeight:    1.2,
                  margin:        0,
                }}
              >
                {company.name}
              </h2>
            )}

            {hasAddr && (
              <div
                className="company-address"
                style={{
                  fontSize:   'clamp(0.65rem, 1.2vw, 0.78rem)',
                  color:      'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                {company.address}
              </div>
            )}

            {/* Contact chips */}
            {(hasPhone || hasEmail || hasWebsite) && (
              <div
                className="company-header-chips"
                style={{
                  display:  'flex',
                  gap:      '6px',
                  flexWrap: 'wrap',
                  marginTop: '4px',
                }}
              >
                {hasPhone && (
                  <a href={`tel:${company.phone}`} className="company-phone" style={{ ...chipStyle }}>
                    <span style={{ color: '#16a34a' }}><PhoneIcon /></span>
                    {company.phone}
                  </a>
                )}
                {hasEmail && (
                  <a href={`mailto:${company.email}`} className="company-email" style={{ ...chipStyle }}>
                    <span style={{ color: '#2563eb' }}><MailIcon /></span>
                    {company.email}
                  </a>
                )}
                {hasWebsite && (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-website"
                    style={{ ...chipStyle }}
                  >
                    <span style={{ color: '#8b5cf6' }}><GlobeIcon /></span>
                    {company.website}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
