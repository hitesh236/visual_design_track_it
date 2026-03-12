'use client';

import { formatINR } from '@/lib/itinerary-utils';
import { useTheme } from '@/context/theme-context';
import { SummaryPill, Tag } from './flight-card';

type TrainRowProps = {
  name?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  trainNo?: string;
  trainName?: string;
  class?: string;
  price?: number | string;
  notes?: string;
};

// ─── Train icon ───────────────────────────────────────────────────

function TrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="4" y="3" width="16" height="14" rx="3" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8.5" cy="19.5" r="1.5" />
      <circle cx="15.5" cy="19.5" r="1.5" />
      <path d="M8.5 17.5l-2 2" />
      <path d="M15.5 17.5l2 2" />
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

// ─── Train card ────────────────────────────────────────────────────

export function TrainCard({
  name,
  from,
  to,
  departure,
  arrival,
  trainNo,
  trainName,
  class: travelClass,
  price,
  notes,
}: TrainRowProps) {
  const displayTrainName = trainName || name || 'Train';
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
              backgroundColor: 'var(--color-train)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* Train side profile with wheels */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="12" rx="2"/>
                <path d="M2 10h20"/>
                <rect x="4" y="6.5" width="3" height="2" rx="0.5" fill="#fff" stroke="none"/>
                <rect x="9" y="6.5" width="3" height="2" rx="0.5" fill="#fff" stroke="none"/>
                <rect x="14" y="6.5" width="3" height="2" rx="0.5" fill="#fff" stroke="none"/>
                <circle cx="6" cy="19" r="2" fill="#fff" stroke="none"/>
                <circle cx="18" cy="19" r="2" fill="#fff" stroke="none"/>
                <path d="M4 17h16v2H4z" fill="#fff" stroke="none"/>
              </svg>
            </div>
            <h3 className="card-title-override" style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}>
              {displayTrainName}
            </h3>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {departDate && <SummaryPill>{departDate}</SummaryPill>}
            {trainNo && <SummaryPill>{trainNo}</SummaryPill>}
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
              .train-dep-arr-mobile {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
              .train-arr-align { text-align: left !important; }
              .train-arrow-mobile { display: none !important; }
            }
          `}</style>
          <div 
            className="train-dep-arr-mobile"
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

            <div className="train-arrow-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
              <ArrowIcon />
            </div>

            {/* Arrival */}
            <div className="train-arr-align" style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
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

          {/* Tags row */}
          {travelClass && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '10px',
            }}>
              <Tag>Class: {travelClass}</Tag>
            </div>
          )}
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
