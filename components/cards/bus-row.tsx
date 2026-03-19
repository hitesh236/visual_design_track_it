'use client';

import { formatINR } from '@/lib/itinerary-utils';
import { useTheme } from '@/context/theme-context';
import { SummaryPill, Tag } from './flight-card';

type BusRowProps = {
  name?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  operator?: string;
  busType?: string;
  seatNumber?: string;
  price?: number | string;
  notes?: string;
  vendorName?: string;
  hideTime?: boolean;
  displayMode?: 'card' | 'row';
};

// ─── Bus icon ─────────────────────────────────────────────────────

function BusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M8 15h0.01" />
      <path d="M16 15h0.01" />
      <path d="M6 19v2" />
      <path d="M18 19v2" />
    </svg>
  );
}

// ─── Arrow icon ───────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 32 24"
      fill="none"
      stroke="var(--color-text-muted)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <line x1="2" y1="12" x2="30" y2="12" />
      <polyline points="22 5 30 12 22 19" />
    </svg>
  );
}

function formatDateTime(iso?: string): string {
  if (!iso) return 'NA';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function formatAmount(val?: number | string) {
  if (!val) return '—';
  const n = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(n)) return val;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(n);
}


// ─── Premium Row Layout (Mini-Compact) ───────────────────────────────

function BusRowPremium({
  name,
  from,
  to,
  departure,
  operator,
  busType,
  price,
  hideTime,
}: BusRowProps) {
  const displayBusName = operator || name || 'Bus';
  const details = [
    busType,
    !hideTime && formatDateTime(departure).split(',').pop()?.trim()
  ].filter(Boolean).join(' · ');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      borderRadius: 'var(--radius-badge)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      width: '100%',
    }}>
      {/* Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-badge)',
        backgroundColor: 'var(--color-bus, #fb8c00)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <BusIcon />
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{from || 'From'}</span>
          <ArrowIcon />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{to || 'To'}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {displayBusName} {details && ` · ${details}`}
        </div>
      </div>
      {/* Price removed as per user request */}
    </div>
  );
}

export function BusCard({
  name,
  from,
  to,
  departure,
  arrival,
  operator,
  busType,
  seatNumber,
  price,
  notes,
  vendorName,
  hideTime,
  displayMode,
}: BusRowProps) {
  if (displayMode === 'row') {
    return (
      <BusRowPremium
        name={name}
        from={from}
        to={to}
        departure={departure}
        operator={operator}
        busType={busType}
        price={price}
        hideTime={hideTime}
      />
    );
  }

  const busDisplayName = vendorName || operator || name || 'Bus';
  const departDate = formatDateTime(departure).split(',')[0];

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '14px 16px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bus)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* High-visibility Bus Icon (Front Profile) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="16" rx="2" />
                <path d="M4 11h16" />
                <path d="M8 15h.01" />
                <path d="M16 15h.01" />
                <path d="M6 19v2" />
                <path d="M18 19v2" />
              </svg>
            </div>
            <h3 className="card-title-override" style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}>
              {busDisplayName}
            </h3>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {departDate && <SummaryPill>{departDate}</SummaryPill>}
            {busType && <SummaryPill>{busType}</SummaryPill>}
          </div>
        </div>

        {/* Full width departure and arrival block (Segment Style) */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '12px',
          backgroundColor: 'var(--color-bg)',
          marginBottom: '0',
        }}>
          <style>{`
            .bus-dep-arr-mobile {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            .bus-arr-align { text-align: left !important; }
            .bus-arrow-mobile { display: none !important; }

            @media (min-width: 768px) {
              .bus-dep-arr-mobile {
                grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
                gap: 14px !important;
              }
              .bus-arr-align { text-align: right !important; }
              .bus-arrow-mobile { display: flex !important; }
            }
          `}</style>
          <div 
            className="bus-dep-arr-mobile"
            style={{
              display: 'grid',
              alignItems: 'center',
            }}
          >
            {/* Departure */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginBottom: '4px',
                fontFamily: 'var(--font-body)',
              }}>
                Departure
              </div>
              {!hideTime && (
                <div className="time-location-override" style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '2px',
                }}>
                  {formatDateTime(departure).split(',').pop()?.trim()}
                </div>
              )}
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text)',
              }}>
                {from || 'Unknown'}
              </div>
            </div>

            <div className="bus-arrow-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
              <ArrowIcon />
            </div>

            {/* Arrival */}
            <div className="bus-arr-align" style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginBottom: '4px',
                fontFamily: 'var(--font-body)',
              }}>
                Arrival
              </div>
              {!hideTime && (
                <div className="time-location-override" style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '2px',
                }}>
                  {formatDateTime(arrival).split(',').pop()?.trim()}
                </div>
              )}
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text)',
              }}>
                {to || 'Unknown'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Note Strip */}
      {notes && (
        <div className="standard-note-bar">
          <strong>Note:</strong>
          <span className="bus-note-content" dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}
