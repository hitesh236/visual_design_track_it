'use client';

import { useState, useEffect } from 'react';
import { formatINR } from '@/lib/itinerary-utils';
import { useTheme } from '@/context/theme-context';

// ─── Types ─────────────────────────────────────────────────────────

type Segment = {
  flightNo?: string;
  from?: string;
  from_code?: string;
  from_city?: string;
  to?: string;
  to_code?: string;
  to_city?: string;
  departure?: string;
  arrival?: string;
  baggage?: string;
  cabinBaggage?: string;
  seatNumber?: string;
  gate?: string;
  terminal?: string;
  fareClass?: string;
  depTerminal?: string;
  arrTerminal?: string;
  flightType?: string; // 'Non-stop' | 'Connecting'
};

type FlightCardProps = {
  airlineName?: string;
  segments: Segment[];
  passengerName?: string;
  price?: number | string;
  fareType?: string;
  status?: string;
  description?: string;
  displayMode: 'widget' | 'row';
};

// ─── Helpers ────────────────────────────────────────────────────────

function fmt(iso?: string): string {
  if (!iso) return 'NA';
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch { return 'NA'; }
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch { return ''; }
}

function calcDuration(dep?: string, arr?: string): string {
  if (!dep || !arr) return '';
  try {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    if (diff <= 0) return '';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  } catch { return ''; }
}

function calcLayover(arrPrev?: string, depNext?: string): string {
  if (!arrPrev || !depNext) return '';
  try {
    const diff = new Date(depNext).getTime() - new Date(arrPrev).getTime();
    if (diff <= 0) return '';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  } catch { return ''; }
}

function calcTotalDuration(segments: Segment[]): string {
  if (!segments.length) return '';
  const first = segments[0].departure;
  const last = segments[segments.length - 1].arrival;
  return calcDuration(first, last);
}

function extractCode(code?: string, fullName?: string): string {
  if (code) return code.toUpperCase();
  if (!fullName) return 'N/A';
  const m = fullName.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : fullName.slice(0, 3).toUpperCase();
}

function extractCity(city?: string, fullName?: string): string {
  if (city) return city;
  if (!fullName) return '';
  return fullName
    .replace(/\s*(International|Airport|Rimpochee|Bakula|Kushok|Indira Gandhi)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Sub-components ─────────────────────────────────────────────────

export function SummaryPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      padding: '5px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap' as const,
    }}>
      {children}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: '11px',
      color: 'var(--color-text)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      padding: '4px 8px',
      borderRadius: '999px',
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap' as const,
    }}>
      {children}
    </span>
  );
}

function AirportBlock({
  code, city, fullName, time, align,
}: {
  code: string; city: string; fullName?: string;
  time: string; align: 'left' | 'right';
}) {
  return (
    <div style={{ textAlign: align, minWidth: 0 }}>
      <div style={{
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--color-text)',
        lineHeight: 1,
        marginBottom: '4px',
        fontFamily: 'var(--font-heading)',
      }}>
        {code}
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--color-primary)',
        marginBottom: '4px',
        fontFamily: 'var(--font-body)',
      }}>
        {time}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.4,
        fontFamily: 'var(--font-body)',
      }}>
        {fullName ?? city}
      </div>
    </div>
  );
}

function CenterBlock({ duration, flightType }: { duration: string; flightType: string }) {
  return (
    <div style={{
      textAlign: 'center',
      minWidth: '120px',
      padding: '0 8px',
    }}>
      {duration && (
        <div style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          marginBottom: '6px',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
        }}>
          {duration}
        </div>
      )}
      {/* Arrow line */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '2px',
        background: 'var(--color-border)',
        margin: '0 auto 6px',
      }}>
        <div style={{
          position: 'absolute',
          right: '-1px',
          top: '-4px',
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `7px solid var(--color-border)`,
        }} />
      </div>
      <div style={{
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
      }}>
        {flightType}
      </div>
    </div>
  );
}

function LayoverStrip({
  code, city, duration,
}: {
  code: string; city: string; duration: string;
}) {
  return (
    <div style={{
      margin: '6px 0 8px',
      padding: '10px 12px',
      backgroundColor: 'var(--color-primary-muted)',
      border: '1px dashed var(--color-primary)',
      borderRadius: '10px',
      fontSize: '12px',
      color: 'var(--color-primary-dark)',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
    }}>
      ✈ Layover in {city} ({code}){duration ? ` — ${duration}` : ''}
    </div>
  );
}

// ─── Single segment card ─────────────────────────────────────────────

function SegmentCard({ seg, isMobile }: { seg: Segment; isMobile: boolean }) {
  const fromCode = extractCode(seg.from_code, seg.from);
  const toCode = extractCode(seg.to_code, seg.to);
  const fromCity = extractCity(seg.from_city, seg.from);
  const toCity = extractCity(seg.to_city, seg.to);
  const duration = calcDuration(seg.departure, seg.arrival);
  const flightType = seg.flightType ?? 'Non-stop';

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '12px',
      backgroundColor: 'var(--color-bg)',
      marginBottom: '0',
    }}>
      {/* Segment top: from | center | to */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '6px', // tighter gap for mobile
        alignItems: 'center',
      }}>
        <AirportBlock
          code={fromCode}
          city={fromCity}
          fullName={seg.from}
          time={fmt(seg.departure)}
          align="left"
        />
        <CenterBlock duration={duration} flightType={flightType} />
        <AirportBlock
          code={toCode}
          city={toCity}
          fullName={seg.to}
          time={fmt(seg.arrival)}
          align={isMobile ? 'left' : 'right'}
        />
      </div>

      {/* Tags row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '10px',
      }}>
        {seg.flightNo && <Tag>Flight {seg.flightNo}</Tag>}
        {seg.fareClass && <Tag>{seg.fareClass}</Tag>}
        {seg.depTerminal && <Tag>Dep Terminal: {seg.depTerminal}</Tag>}
        {seg.arrTerminal && <Tag>Arr Terminal: {seg.arrTerminal}</Tag>}
        {seg.terminal && !seg.depTerminal && <Tag>Terminal: {seg.terminal}</Tag>}
        {seg.gate && seg.gate !== 'NA' && <Tag>Gate: {seg.gate}</Tag>}
        {seg.seatNumber && <Tag>Seat: {seg.seatNumber}</Tag>}
      </div>
    </div>
  );
}

// ─── Row variant (compact layout) ───────────────────────────────────

function FlightRow({ segments, airlineName, price }: {
  segments: Segment[]; airlineName?: string; price?: number | string;
}) {
  const first = segments[0] ?? {};
  const last = segments[segments.length - 1] ?? {};
  const fromCode = extractCode(first.from_code, first.from);
  const toCode = extractCode(last.to_code, last.to);
  const duration = calcTotalDuration(segments);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      borderRadius: 'var(--radius-badge)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
    }}>
      {/* Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-badge)',
        backgroundColor: 'var(--color-flight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {/* Premium airplane icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none">
          <path d="M22 16.21v-1.895l-9.5-5.525V3.1a1.5 1.5 0 0 0-3 0v5.69L0 14.315v1.895l9.5-2.79V19l-2 1.5v1.5l3-.875 3 .875V20.5L12 19v-5.58z"/>
        </svg>
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{fromCode}</span>
          <svg width="16" height="12" viewBox="0 0 32 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="30" y2="12" /><polyline points="22 5 30 12 22 19" /></svg>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{toCode}</span>
          {segments.length > 1 && <Tag>{segments.length - 1} stop{segments.length > 2 ? 's' : ''}</Tag>}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {[airlineName, fmt(first.departure), fmt(last.arrival), duration].filter(Boolean).join(' · ')}
        </div>
      </div>
      {price && Number(price) > 0 && (
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
          {formatINR(price)}
        </div>
      )}
    </div>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────

export function FlightCard({
  airlineName,
  segments,
  passengerName,
  price,
  fareType = 'Refundable',
  status = 'Confirmed',
  description,
  displayMode,
}: FlightCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Compact row for compact layout
  if (displayMode === 'row') {
    return (
      <FlightRow
        segments={segments}
        airlineName={airlineName}
        price={price}
      />
    );
  }

  if (!segments.length) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];
  const fromCode = extractCode(first.from_code, first.from);
  const toCode = extractCode(last.to_code, last.to);
  const totalDuration = calcTotalDuration(segments);
  const stopCount = segments.length - 1;
  const departDate = fmtDate(first.departure);
  const baggage = first.baggage
    ? `${first.baggage} check-in${first.cabinBaggage ? ` + ${first.cabinBaggage} cabin` : ''}`
    : 'As per airline policy';

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'clip',
    }}>
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
          {/* Airline icon placeholder */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-flight)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {/* Premium airplane icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none">
              <path d="M22 16.21v-1.895l-9.5-5.525V3.1a1.5 1.5 0 0 0-3 0v5.69L0 14.315v1.895l9.5-2.79V19l-2 1.5v1.5l3-.875 3 .875V20.5L12 19v-5.58z"/>
            </svg>
          </div>
          <h3 className="card-title-override" style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
          }}>
            {airlineName ? `${airlineName}: ` : 'Flight: '}
            {fromCode} → {toCode}
          </h3>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {departDate && <SummaryPill>{departDate}</SummaryPill>}
          {stopCount === 0 ? <SummaryPill>Direct</SummaryPill> : <SummaryPill>{stopCount} Stop{stopCount > 1 ? 's' : ''}</SummaryPill>}
          {totalDuration && <SummaryPill>Total: {totalDuration}</SummaryPill>}
        </div>
      </div>

      {/* Segments + Layovers */}
      {segments.map((seg, idx) => (
        <div key={idx}>
          <SegmentCard seg={seg} isMobile={isMobile} />

          {/* Layover between segments */}
          {idx < segments.length - 1 && (() => {
            const nextSeg = segments[idx + 1];
            const layover = calcLayover(seg.arrival, nextSeg.departure);
            const layCode = extractCode(seg.to_code, seg.to);
            const layCity = extractCity(seg.to_city, seg.to);
            return (
              <LayoverStrip
                key={`layover-${idx}`}
                code={layCode}
                city={layCity}
                duration={layover}
              />
            );
          })()}
        </div>
      ))}

      {/* Bottom detail grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(120px, 1fr))',
        gap: '10px',
        marginTop: '12px',
      }}>
        {[
          { label: 'Baggage', value: baggage },
          ...(first.fareClass ? [{ label: 'Class', value: first.fareClass }] : []),
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px 10px',
          }}>
            <div style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              fontFamily: 'var(--font-body)',
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--color-text)',
              fontWeight: 600,
              lineHeight: 1.4,
              fontFamily: 'var(--font-body)',
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* User notes / description */}
      {description && (
        <div className="standard-note-bar">
          <strong>Note:</strong>
          <div
            className="note-content-container"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  );
}
