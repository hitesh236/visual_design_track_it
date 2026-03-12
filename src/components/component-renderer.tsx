'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';
import { getLayoutConfig } from '@/lib/layout-presets';
import { NoteCard } from '@/components/cards/note-card';
import { HotelCard } from '@/components/cards/hotel-card';
import { ActivityCard } from '@/components/cards/activity-card';
import { TransportCard } from '@/components/cards/transport-row';
import { TrainCard } from '@/components/cards/train-row';
import { BusCard } from '@/components/cards/bus-row';
import { FlightCard } from '@/components/cards/flight-card';

// ─── Placeholder component ───────────────────────────────────────

function PlaceholderCard({ type, name }: { type: string; name?: string }) {
  const colorMap: Record<string, string> = {
    Note: 'var(--color-text-muted)',
    Hotel: 'var(--color-hotel)',
    Activity: 'var(--color-activity)',
    Flight: 'var(--color-flight)',
    Transport: 'var(--color-transport)',
    Train: 'var(--color-train)',
    Bus: 'var(--color-bus)',
  };
  const color = colorMap[type] ?? 'var(--color-text-muted)';
  return (
    <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-badge)', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, width: '100%', boxSizing: 'border-box' }}>
      <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '999px', backgroundColor: color, color: '#ffffff', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>{type}</span>
      <span style={{ fontSize: '13px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', wordBreak: 'break-word', minWidth: 0 }}>{name ?? `${type} component`}</span>
    </div>
  );
}

// ─── Component type guard ─────────────────────────────────────────

type ComponentType = 'Note' | 'Hotel' | 'Activity' | 'Flight' | 'Transport' | 'Train' | 'Bus';

function isKnownType(t: string): t is ComponentType {
  return ['Note', 'Hotel', 'Activity', 'Flight', 'Transport', 'Train', 'Bus'].includes(t);
}

// ─── Single component renderer ────────────────────────────────────

function SingleComponent({ component, displayMode, showImages, showDescriptions }: {
  component: any;
  displayMode: 'card' | 'row' | 'boarding-pass' | 'box' | 'inline' | 'horizontal-card';
  showImages: boolean;
  showDescriptions: boolean;
}) {
  const type: ComponentType = isKnownType(component.component_type) ? component.component_type : 'Note';
  switch (type) {
    case 'Note':
      return <NoteCard name={component.name} description={component.description ?? ''} displayMode={displayMode as 'box' | 'inline'} showDescriptions={showDescriptions} />;
    case 'Hotel':
      return <HotelCard name={component.name ?? 'Hotel'} rating={Number(component.rating) || 4} location={component.location ?? component.details?.location} address={component.address} city_name={component.details?.city_name} state_name={component.details?.state_name} mealPlan={component.details?.mealPlan} roomType={component.details?.roomType} numberOfRooms={component.details?.numberOfRooms} roomConfigurations={component.details?.roomConfigurations} otherCharges={component.details?.otherCharges} price={component.price} images={(component.images ?? []).map((img: any) => img.url)} displayMode={displayMode as 'card' | 'row' | 'horizontal-card'} showImages={showImages} showDescriptions={showDescriptions} notes={component.description} checkIn={component.start_time ?? null} checkOut={component.end_time ?? null} />;
    case 'Activity':
      return <ActivityCard name={component.name ?? 'Activity'} description={component.description} images={(component.images ?? []).map((img: any) => img.url)} displayMode={displayMode as 'card' | 'row' | 'horizontal-card'} showImages={showImages} showDescriptions={showDescriptions} />;
    case 'Flight':
      const segs = (component.details?.segments ?? []).map((s: any) => ({ ...s, fareClass: component.details?.fareClass ?? s.fareClass, depTerminal: s.depTerminal ?? s.terminal, arrTerminal: s.arrTerminal }));
      return <FlightCard airlineName={component.details?.airline_name} segments={segs.length > 0 ? segs : [{}]} passengerName={component.details?.passenger_name ?? 'Guest'} price={component.price} fareType={component.details?.fareType ?? 'Refundable'} status={component.details?.status ?? 'Confirmed'} description={component.description} displayMode={displayMode === 'row' ? 'row' : 'widget'} />;
    case 'Transport': return null;
    case 'Train':
      return <TrainCard name={component.name} from={component.details?.segments?.[0]?.from} to={component.details?.segments?.[0]?.to} departure={component.details?.segments?.[0]?.departure} arrival={component.details?.segments?.[0]?.arrival} trainNo={component.details?.segments?.[0]?.flightNo ?? component.details?.trainNo} trainName={component.details?.trainName ?? component.name} class={component.details?.fareClass ?? component.details?.segments?.[0]?.fareClass} price={component.price} notes={component.description} />;
    case 'Bus':
      return <BusCard name={component.name} from={component.details?.from} to={component.details?.to} departure={component.details?.departureDateTime} arrival={component.details?.arrivalDateTime} operator={component.details?.busOperator} busType={component.details?.busType} seatNumber={component.details?.seatNumbers} price={component.price} notes={component.description} vendorName={component.details?.vendor?.name} />;
    default:
      return <PlaceholderCard type={type} name={component.name} />;
  }
}

// ─── Main dispatcher ──────────────────────────────────────────────

type ComponentRendererProps = {
  components: any[];
  showImages?: boolean;
  showDescriptions?: boolean;
  dayDate?: string;
  dayNumber?: number;
};

export function ComponentRenderer({
  components,
  showImages = true,
  showDescriptions = true,
  dayDate,
  dayNumber,
}: ComponentRendererProps) {
  const { layout } = useTheme();
  const layoutConfig = getLayoutConfig(layout);
  const isTimeline = layout === 'timeline';

  const transportItems = components
    .filter(c => c.component_type === 'Transport')
    .map(c => ({
      id: c.id, name: c.name, pickupLocation: c.details?.pickupLocation, dropLocation: c.details?.dropLocation,
      routeStops: c.details?.routeStops, cabCategoryName: c.details?.cabCategoryName, cabModelName: c.details?.cabModelName,
      isAC: c.details?.isAC, seaterCapacity: c.details?.seaterCapacity ?? c.details?.pax, vehicleCount: c.details?.vehicleCount ?? 1,
      additionalVehicles: c.details?.additionalVehicles, price: c.price, notes: c.description,
    }));

  const resolvedShowImages = showImages && layoutConfig.dayCard.showImages;
  const resolvedShowDescriptions = showDescriptions && layoutConfig.dayCard.showDescriptions;

  return (
    <>
      {components.map((component, i) => {
        const type = component.component_type as ComponentType;
        const c = component;

        let timeLabel = '';
        if (isTimeline) {
           if (i === 0) {
             if (dayDate) {
               const dateObj = new Date(dayDate);
               timeLabel = isNaN(dateObj.getTime()) ? dayDate : dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
             }
             if (dayNumber) timeLabel = `Day ${dayNumber}${timeLabel ? '\n' + timeLabel : ''}`;
           } else {
             const startTimeStr = c.start_time ?? c.details?.segments?.[0]?.departure ?? c.details?.departureDateTime;
             if (startTimeStr) {
               try {
                 const d = new Date(startTimeStr);
                 timeLabel = isNaN(d.getTime()) ? startTimeStr : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
               } catch { timeLabel = startTimeStr; }
             }
           }
        }

        let componentEl: React.ReactNode = null;
        if (type === 'Transport') {
          const isFirstTransport = components.filter(c => c.component_type === 'Transport')[0]?.id === c.id;
          if (isFirstTransport) {
            componentEl = <TransportCard key="transport-group" items={transportItems} displayMode={layoutConfig.componentDisplay.transport === 'row' ? 'row' : 'card'} />;
          }
        } else {
          const displayMode = (() => {
            switch (type) {
              case 'Hotel': return layoutConfig.componentDisplay.hotel;
              case 'Activity': return layoutConfig.componentDisplay.activity;
              case 'Flight': return layoutConfig.componentDisplay.flight;
              case 'Note': return layoutConfig.componentDisplay.note;
              default: return 'row';
            }
          })();
          componentEl = <SingleComponent key={component.id ?? i} component={component} displayMode={displayMode} showImages={resolvedShowImages} showDescriptions={resolvedShowDescriptions} />;
        }

        if (!componentEl) return null;

        if (!isTimeline) {
          return <React.Fragment key={component.id ?? i}>{componentEl}</React.Fragment>;
        }

        return (
          <div 
            key={component.id ?? i} 
            className="timeline-item-wrapper"
            style={{ pageBreakInside: 'avoid', width: '100%', position: 'relative', marginBottom: '24px', boxSizing: 'border-box' }}
          >
            <style>{`
              .timeline-item-layout[data-key="${component.id ?? i}"] { display: flex; flex-direction: column; gap: 8px; position: relative; width: 100%; box-sizing: border-box; }
              .timeline-desktop-time, .timeline-desktop-node { display: none; }
              .timeline-desktop-content { display: block; position: relative; width: 100%; box-sizing: border-box; }
              .timeline-mobile-header { display: flex; width: 100%; box-sizing: border-box; }
              @media (min-width: 640px) {
                .timeline-item-layout[data-key="${component.id ?? i}"] { flex-direction: row; gap: 0; align-items: flex-start; }
                .timeline-desktop-time { display: block; width: 134px; padding-right: 24px; flex-shrink: 0; box-sizing: border-box; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary); font-family: var(--font-heading); white-space: pre-line; line-height: 20px; }
                .timeline-desktop-node { display: block; position: absolute; left: 134px; top: 0; bottom: -24px; width: 2px; background-color: ${i === components.length - 1 ? 'transparent' : 'var(--color-border)'}; z-index: 0; }
                .timeline-desktop-content { flex: 1; padding-left: 32px; min-width: 0; }
                .timeline-mobile-header, .timeline-mobile-connector { display: none; }
              }
            `}</style>
            <div className="timeline-item-layout" data-key={component.id ?? i}>
              <div className="timeline-mobile-header" style={{ alignItems: 'center', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', justifyContent: 'space-between', gap: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '2px solid white', boxShadow: '0 0 0 1px var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Event</span>
                 </div>
                 {timeLabel && <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', textAlign: 'right', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{timeLabel}</span>}
              </div>
              <div className="timeline-desktop-time">{timeLabel || ''}</div>
              <div className="timeline-desktop-node"><div style={{ position: 'absolute', top: '0', left: '1px', transform: 'translateX(-50%)', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid var(--color-primary)', zIndex: 10 }} /></div>
              <div className="timeline-desktop-content">{componentEl}</div>
            </div>
            {i !== components.length - 1 && <div className="timeline-mobile-connector" style={{ width: '2px', height: '16px', backgroundColor: 'var(--color-border)', margin: '4px auto' }} />}
          </div>
        );
      })}
    </>
  );
}
