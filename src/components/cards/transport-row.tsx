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

function TransportCardItem({ item }: { item: TransportItem }) {
  const vehicleCount = item.vehicleCount ?? 1;
  const displayName = item.name ?? item.cabModelName ?? 'Transport';

  return (
    <div 
      className="transport-card-item-root" 
      style={{ 
        borderRadius: 'var(--radius-card)', 
        backgroundColor: 'var(--color-surface)', 
        border: '1px solid var(--color-border)', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ padding: '14px 16px', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          {/* Header Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {item.isAC !== false && <SummaryPill>AC</SummaryPill>}
            <SummaryPill>{vehicleCount} {vehicleCount === 1 ? 'Vehicle' : 'Vehicles'}</SummaryPill>
            {item.cabCategoryName && <SummaryPill>{item.cabCategoryName}</SummaryPill>}
          </div>
        </div>

        {/* Unified Segment Box (Vehicle breakdown nested inside) */}
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '12px',
          backgroundColor: 'var(--color-bg)',
          marginBottom: '0',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div 
            className="transport-location-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
              gap: '14px',
              alignItems: 'center',
            }}
          >
            {/* Pickup */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Pickup</div>
              <div className="time-location-override" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)', fontFamily: 'var(--font-heading)', lineHeight: 1.3 }}>{item.pickupLocation || 'Location TBD'}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
              <ArrowIcon />
            </div>

            {/* Drop */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Drop</div>
              <div className="time-location-override" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)', fontFamily: 'var(--font-heading)', lineHeight: 1.3 }}>{item.dropLocation || 'Location TBD'}</div>
            </div>
          </div>

          {/* Integrated Vehicle Details Pills */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px', 
            marginTop: '14px', 
            borderTop: '1px solid var(--color-border)', 
            paddingTop: '12px' 
          }}>
            <div style={{
              backgroundColor: 'var(--color-surface)',
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
            {item.additionalVehicles?.map((v, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--color-surface)',
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

        {/* Route Timeline */}
        {item.routeStops && item.routeStops.length > 2 && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--color-border)' }}>
             <div style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '10px',
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
      </div>

      {/* Note Strip (Strictly small text) */}
      {item.notes && (
        <div 
          className="standard-note-bar" 
          style={{ 
            marginTop: 0, 
            borderRadius: 0, 
            borderLeft: 'none', 
            borderTop: '1px solid var(--color-border)', 
            padding: '10px 16px',
            fontSize: '10px'
          }}
        >
          <strong>NOTE:</strong>
          <span className="note-content-container" style={{ fontSize: '10px' }} dangerouslySetInnerHTML={{ __html: item.notes }} />
        </div>
      )}
    </div>
  );
}

export function TransportCard({ items, displayMode }: TransportCardProps) {
  if (!items.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {items.map((item, i) => (
        <TransportCardItem key={item.id ?? i} item={item} />
      ))}
    </div>
  );
}

export { TransportCard as TransportRow };
