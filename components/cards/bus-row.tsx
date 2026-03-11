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
};

// ─── Bus icon ─────────────────────────────────────────────────────

function BusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h2a1 1 0 0 0 1-1v-3.65a2 2 0 0 0-.672-1.482l-1.932-1.686A2 2 0 0 0 17.068 10H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
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

// ─── Bus row ──────────────────────────────────────────────────────

// ─── Bus card ──────────────────────────────────────────────────────

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
}: BusRowProps) {
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
              {/* Bus top view with windows */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/>
                <path d="M7 18v2M17 18v2"/>
                <path d="M2 9h20"/>
                <rect x="4" y="11" width="3" height="3" rx="0.5" fill="#fff" stroke="none"/>
                <rect x="9" y="11" width="3" height="3" rx="0.5" fill="#fff" stroke="none"/>
                <rect x="14" y="11" width="3" height="3" rx="0.5" fill="#fff" stroke="none"/>
                <circle cx="7" cy="20" r="1" fill="#fff"/>
                <circle cx="17" cy="20" r="1" fill="#fff"/>
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
            {seatNumber && <SummaryPill>Seat: {seatNumber}</SummaryPill>}
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
            @media (max-width: 480px) {
              .bus-dep-arr-mobile {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
              .bus-arr-align { text-align: left !important; }
              .bus-arrow-mobile { display: none !important; }
            }
          `}</style>
          <div 
            className="bus-dep-arr-mobile"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
              gap: '14px',
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
              <div className="time-location-override" style={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '2px',
              }}>
                {formatDateTime(departure).split(',').pop()?.trim()}
              </div>
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
              <div className="time-location-override" style={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '2px',
              }}>
                {formatDateTime(arrival).split(',').pop()?.trim()}
              </div>
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
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}
