'use client';

import { formatINR } from '@/lib/itinerary-utils';
import { useTheme } from '@/context/theme-context';
import { SummaryPill, Tag } from './flight-card';

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

// ─── Types ──────────────────────────────────────────────────────────

export type TransportItem = {
  id?: string;
  name?: string;
  pickupLocation?: string;
  dropLocation?: string;
  routeStops?: string[];
  cabCategoryName?: string;
  cabModelName?: string;
  isAC?: boolean;
  seaterCapacity?: string | number;
  vehicleCount?: number;
  additionalVehicles?: Array<{
    categoryName: string;
    model: string;
    count: number | string;
  }>;
  price?: number | string;
  notes?: string;
};

type TransportCardProps = {
  items: TransportItem[];
  displayMode: 'card' | 'row';
};

// ─── Helpers ─────────────────────────────────────────────────────────

function buildRouteStops(items: TransportItem[]): string[] {
  const itemWithRouteStops = items.find(item => Array.isArray(item.routeStops) && item.routeStops.length > 0);
  if (itemWithRouteStops?.routeStops) {
    return itemWithRouteStops.routeStops;
  }

  const allStops = items.flatMap(item => [item.pickupLocation, item.dropLocation].filter(Boolean) as string[]);
  if (!allStops.length) return [];

  return allStops.reduce<string[]>((acc, stop) => {
    if (acc.length === 0 || acc[acc.length - 1] !== stop) {
      acc.push(stop);
    }
    return acc;
  }, []);
}

function parseDetails(item: TransportItem) {
  const tags: string[] = [];
  if (item.cabCategoryName) tags.push(item.cabCategoryName);
  if (item.isAC !== false) tags.push('AC');
  if (item.seaterCapacity) tags.push(`${item.seaterCapacity} Seater`);
  return tags;
}

// ─── Route Strip ─────────────────────────────────────────────────────

function RouteStrip({ stops }: { stops: string[] }) {
  if (!stops.length) return null;
  return (
    <div>
      {/* Label */}
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        marginBottom: '10px',
      }}>
        Route
      </div>

      {/* Scrollable pill strip */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '2px',
      }}>
        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;
          return (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
            >
              {/* Stop pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: isFirst
                  ? 'var(--color-primary)'
                  : isLast
                    ? 'var(--color-primary-muted)'
                    : 'var(--color-surface)',
                border: isFirst
                  ? '1.5px solid var(--color-primary)'
                  : isLast
                    ? '1.5px solid var(--color-primary)'
                    : '1.5px solid var(--color-border)',
                color: isFirst
                  ? 'var(--color-text-on-primary)'
                  : 'var(--color-text)',
                fontSize: '13px',
                fontWeight: isFirst || isLast ? 700 : 500,
                fontFamily: 'var(--font-body)',
                transition: 'background 0.2s ease',
                boxShadow: isFirst ? 'var(--shadow-card)' : 'none',
              }}>
                {stop}
              </div>

              {/* Arrow between stops */}
              {idx < stops.length - 1 && (
                <svg
                  width="18"
                  height="14"
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vehicle Card (stacked / split) ──────────────────────────────────

// ─── Transport Card Item (Premium Layout) ──────────────────────────────

function TransportCardItem({ item }: { item: TransportItem }) {
  const vehicleCount = item.vehicleCount ?? 1;
  const displayName = item.name ?? item.cabModelName ?? 'Transport';

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
              backgroundColor: 'var(--color-transport)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* Front-profile SUV SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
                <path d="M15 11H5m10 0l-2-4H7l-2 4" />
              </svg>
            </div>
            <h3 className="card-title-override" style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-heading)',
            }}>
              {displayName}
            </h3>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {vehicleCount > 1 && (
              <SummaryPill>
                {vehicleCount} {vehicleCount === 1 ? 'Vehicle' : 'Vehicles'}
              </SummaryPill>
            )}
            {item.cabCategoryName && <SummaryPill>{item.cabCategoryName}</SummaryPill>}
          </div>
        </div>

        {/* Full width segment block */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '12px',
          backgroundColor: 'var(--color-bg)',
          marginBottom: '0',
        }}>
          <style>{`
            @media (max-width: 480px) {
              .transport-dep-arr-mobile {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
              .transport-arr-align { text-align: left !important; }
              .transport-arrow-mobile { display: none !important; }
            }
          `}</style>
          <div 
            className="transport-dep-arr-mobile"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
              gap: '14px',
              alignItems: 'center',
            }}
          >
            {/* Pickup */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginBottom: '4px',
                fontFamily: 'var(--font-body)',
              }}>
                Pickup
              </div>
              <div className="time-location-override" style={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.3,
              }}>
                {item.pickupLocation || 'Location TBD'}
              </div>
            </div>

            <div className="transport-arrow-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
              <ArrowIcon />
            </div>

            {/* Drop */}
            <div className="transport-arr-align" style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginBottom: '4px',
                fontFamily: 'var(--font-body)',
              }}>
                Drop
              </div>
              <div className="time-location-override" style={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.3,
              }}>
                {item.dropLocation || 'Location TBD'}
              </div>
            </div>
          </div>

          {/* Tags row */}
          {(item.isAC !== false || item.seaterCapacity) && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '10px',
            }}>
              {item.isAC !== false && <Tag>AC</Tag>}
              {item.seaterCapacity && <Tag>{item.seaterCapacity} Seater</Tag>}
            </div>
          )}
        </div>

        {/* Multi-stop Route — specifically for Transporters if > 2 stops */}
        {item.routeStops && item.routeStops.length > 2 && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--color-border)' }}>
             <div style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '8px',
              fontFamily: 'var(--font-body)',
            }}>
              Route Timeline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {item.routeStops.map((stop, idx) => {
                const isEndpoint = idx === 0 || idx === item.routeStops!.length - 1;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isEndpoint ? 'var(--color-primary)' : 'transparent',
                      border: '2px solid var(--color-primary)',
                      flexShrink: 0
                    }} />
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: isEndpoint ? 'var(--color-primary)' : 'var(--color-text)',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {stop}
                    </span>
                    {idx < item.routeStops!.length - 1 && <ArrowIcon />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assigned Vehicles Section */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--color-border)' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '8px',
            fontFamily: 'var(--font-body)',
          }}>
            Assigned Vehicles
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {/* Primary Vehicle */}
            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{vehicleCount}x</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{item.cabModelName || item.cabCategoryName || 'Standard Vehicle'}</span>
            </div>
            {/* Additional Vehicles */}
            {item.additionalVehicles?.map((v, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{v.count}x</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{v.model || v.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Strip */}
      {item.notes && (
        <div className="standard-note-bar">
          <strong>Note:</strong>
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: item.notes }} />
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────

export function TransportCard({ items, displayMode }: TransportCardProps) {
  if (!items.length) return null;

  // Compact → slim row per item
  if (displayMode === 'row') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <TransportCardItem key={item.id ?? i} item={item} />
        ))}
      </div>
    );
  }

  const stops = buildRouteStops(items);

  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      padding: 'var(--spacing-md)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-md)',
    }}>

      {/* Route strip */}
      {stops.length > 0 && (
        <>
          <RouteStrip stops={stops} />
          <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
        </>
      )}

      {/* Vehicles label */}
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
      }}>
        Vehicles
      </div>

      {/* Vehicle cards grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {items.map((item, i) => (
          <TransportCardItem key={item.id ?? i} item={item} />
        ))}
      </div>
    </div>
  );
}

// Keep old name exported for backward compatibility
export { TransportCard as TransportRow };
