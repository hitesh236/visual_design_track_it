'use client';

import { useState } from 'react';
import type { ExecutiveData } from '@/hooks/use-executive';

// ─── Initials extractor ──────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

// ─── Icons ───────────────────────────────────────────────────────

function PhoneIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.895-5.335 11.898-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function MailIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────

type ExecutiveCardProps = {
  executive: ExecutiveData;
};

export function ExecutiveCard({ executive }: ExecutiveCardProps) {
  const [photoError, setPhotoError] = useState(false);

  if (!executive.name.trim()) return null;

  const initials = getInitials(executive.name);
  const hasPhoto = !!executive.photoUrl && !photoError;

  const whatsappMessage = encodeURIComponent(`Hi, I received my travel itinerary and would like to discuss further.`);
  const whatsappUrl = `https://wa.me/${executive.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const Avatar = () => hasPhoto ? (
    <img
      src={executive.photoUrl}
      alt={executive.name}
      onError={() => setPhotoError(true)}
      style={{
        width:        '80px',
        height:       '80px',
        borderRadius: '50%',
        objectFit:    'cover',
        border:       '3px solid var(--color-surface)',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink:   0,
        display:      'block',
      }}
    />
  ) : (
    <div
      style={{
        width:           '80px',
        height:          '80px',
        borderRadius:    '50%',
        backgroundColor: 'var(--color-primary)',
        color:           'var(--color-text-on-primary)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        fontSize:        '28px',
        fontWeight:      700,
        fontFamily:      'var(--font-heading)',
        border:          '3px solid var(--color-surface)',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink:      0,
      }}
    >
      {initials}
    </div>
  );

  return (
    <>
      <style>{`
        /* ── Desktop layout ─────────────────────────── */
        .exec-card-root {
          display:         flex;
          justify-content: space-between;
          align-items:     flex-start;
          gap:             clamp(16px, 4vw, 32px);
          padding:         clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem);
          margin:          var(--spacing-section) 0;
          background-color: var(--color-primary-muted);
          border-left:     4px solid var(--color-primary);
          border-radius:   var(--radius-card);
          font-family:     var(--font-body);
        }

        .exec-card-left {
          display:     flex;
          align-items: flex-start;
          gap:         20px;
          flex:        1;
          min-width:   0;
        }

        .exec-card-info {
          display:        flex;
          flex-direction: column;
          gap:            4px;
          min-width:      0;
        }

        .exec-card-name {
          font-size:   1.25rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color:       var(--color-text);
        }

        .exec-card-designation {
          font-size:      0.85rem;
          font-weight:    600;
          color:          var(--color-text-muted);
          letter-spacing: 0.02em;
        }

        .exec-card-message {
          font-size:   0.95rem;
          color:       var(--color-text);
          margin:      12px 0 0 0;
          line-height: 1.6;
          font-style:  italic;
          opacity:     0.85;
          word-break:  break-word;
        }

        .exec-card-right {
          display:        flex;
          flex-direction: column;
          align-items:    flex-end;
          gap:            12px;
          flex-shrink:    0;
        }

        .exec-card-buttons {
          display:        flex;
          flex-direction: column;
          gap:            8px;
          min-width:      180px;
        }

        .exec-btn {
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             8px;
          padding:         10px 20px;
          border-radius:   var(--radius-badge);
          font-size:       13px;
          font-weight:     600;
          font-family:     var(--font-body);
          text-decoration: none;
          transition:      opacity 0.2s ease;
          cursor:          pointer;
          white-space:     nowrap;
        }
        .exec-btn:hover { opacity: 0.88; }

        .exec-card-availability {
          font-size:  0.75rem;
          color:      var(--color-text-muted);
          text-align: right;
          margin-top: 4px;
        }

        /* ── Mobile layout (≤ 640px) ─────────────────── */
        @media (max-width: 640px) {
          .exec-card-root {
            flex-direction: column;
            padding:        1.25rem;
            gap:            0;
          }

          /* Top section: avatar + name/designation side by side */
          .exec-card-left {
            flex-direction: row;
            align-items:    center;
            gap:            14px;
            width:          100%;
            margin-bottom:  14px;
          }

          .exec-card-info { gap: 2px; }

          .exec-card-name        { font-size: 1rem;   }
          .exec-card-designation { font-size: 0.78rem; }

          /* Message full-width below the avatar row */
          .exec-card-message {
            font-size: 0.875rem;
            margin:    0 0 16px 0;
          }

          /* Buttons: 2-column grid, full width */
          .exec-card-right {
            width:       100%;
            align-items: stretch;
          }

          .exec-card-buttons {
            display:               grid;
            grid-template-columns: 1fr 1fr;
            gap:                   8px;
            min-width:             unset;
            width:                 100%;
          }

          /* Make email button span full width on its own row */
          .exec-btn-email {
            grid-column: 1 / -1;
          }

          .exec-card-availability {
            text-align: center;
            margin-top: 8px;
          }
        }
      `}</style>

      <div className="exec-card-root">

        {/* ── Left: Profile + Message ── */}
        <div className="exec-card-left">
          <Avatar />

          <div className="exec-card-info">
            <h2 className="exec-card-name" style={{ margin: 0 }}>{executive.name}</h2>
            <div className="exec-card-designation">{executive.designation}</div>

            {/* Message: on mobile sits outside exec-card-left below,
                on desktop sits inside exec-card-info */}
            <p className="exec-card-message exec-msg-desktop">
              {executive.message}
            </p>
          </div>
        </div>

        {/* Message shown separately on mobile (injected via CSS order trick) */}
        <style>{`
          @media (max-width: 640px) {
            .exec-msg-desktop { display: none !important; }
          }
          @media (min-width: 641px) {
            .exec-msg-mobile  { display: none !important; }
          }
        `}</style>
        <p className="exec-card-message exec-msg-mobile">
          {executive.message}
        </p>

        {/* ── Right: Action Buttons ── */}
        <div className="exec-card-right">
          <div className="exec-card-buttons">
            {/* Call Now */}
            <a
              href={`tel:${executive.phone}`}
              className="exec-btn"
              style={{
                backgroundColor: 'var(--color-primary)',
                color:           'var(--color-text-on-primary)',
              }}
            >
              <PhoneIcon />
              Call Now
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="exec-btn"
              style={{
                backgroundColor: '#25D366',
                color:           '#ffffff',
              }}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>

            {/* Send Email — spans full width on mobile grid */}
            <a
              href={`mailto:${executive.email}`}
              className="exec-btn exec-btn-email"
              style={{
                backgroundColor: 'transparent',
                border:          '1.5px solid var(--color-primary)',
                color:           'var(--color-primary)',
              }}
            >
              <MailIcon />
              Send Email
            </a>
          </div>

          {executive.availability && (
            <div className="exec-card-availability">
              {executive.availability}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
