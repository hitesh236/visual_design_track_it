'use client';

import { useTheme } from '@/context/theme-context';
import { getLayoutConfig } from '@/lib/layout-presets';
import { NoteCard } from '@/components/cards/note-card';
import { HotelCard } from '@/components/cards/hotel-card';
import { ActivityCard } from '@/components/cards/activity-card';
import { TransportCard } from '@/components/cards/transport-row';
import { TrainCard } from '@/components/cards/train-row';
import { BusCard } from '@/components/cards/bus-row';
import { FlightCard } from '@/components/cards/flight-card';

// ─── Placeholder components ───────────────────────────────────────

function PlaceholderCard({
  type,
  name,
}: {
  type: string;
  name?: string;
}) {
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
    <div
      style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--radius-badge)',
        border: `1px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: 0.7,
      }}
    >
      {/* Type badge */}
      <span
        style={{
          display: 'inline-flex',
          padding: '2px 8px',
          borderRadius: '999px',
          backgroundColor: color,
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        {type}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-body)',
          wordBreak: 'break-word',
        }}
      >
        {name ?? `${type} component`}
      </span>
    </div>
  );
}

// ─── Calendar Sticker Component ───────────────────────────────────

export function CalendarDateIcon({ month, day, weekday, isSmall = false }: { month: string, day: string, weekday: string, isSmall?: boolean }) {
  return (
    <div style={{
      width: isSmall ? '56px' : '68px',
      backgroundColor: 'var(--color-surface)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      fontFamily: 'var(--font-heading)',
    }}>
      {/* Weekday on top (e.g. WED) */}
      <div style={{
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        fontSize: isSmall ? '10px' : '11px',
        fontWeight: 700,
        padding: isSmall ? '3px 2px' : '5px 2px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {weekday.slice(0, 3)}
      </div>
      {/* Date below (e.g. MAR 10) */}
      <div style={{
        padding: isSmall ? '4px 0' : '6px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: isSmall ? '10px' : '11px',
          fontWeight: 700,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          marginBottom: isSmall ? '0' : '2px',
          opacity: 0.8
        }}>
          {month}
        </div>
        <div style={{
          fontSize: isSmall ? '18px' : '22px',
          fontWeight: 800,
          color: 'var(--color-text)',
          lineHeight: 1
        }}>
          {day}
        </div>
      </div>
    </div>
  );
}

// ─── Component type guard ─────────────────────────────────────────

type ComponentType =
  | 'Note'
  | 'Hotel'
  | 'Activity'
  | 'Flight'
  | 'Transport'
  | 'Train'
  | 'Bus';

function isKnownType(t: string): t is ComponentType {
  return ['Note', 'Hotel', 'Activity', 'Flight', 'Transport', 'Train', 'Bus'].includes(t);
}

// ─── Single component renderer ────────────────────────────────────

function SingleComponent({
  component,
  displayMode,
  showImages,
  showDescriptions,
  hideTime = false,
}: {
  component: any;
  displayMode: 'card' | 'row' | 'boarding-pass' | 'box' | 'inline' | 'horizontal-card';
  showImages: boolean;
  showDescriptions: boolean;
  hideTime?: boolean;
}) {
  const type: ComponentType = isKnownType(component.component_type)
    ? component.component_type
    : 'Note';

  switch (type) {
    case 'Note':
      return (
        <NoteCard
          name={component.name}
          description={component.description ?? ''}
          displayMode={displayMode as 'box' | 'inline'}
          showDescriptions={showDescriptions}
          hideTime={hideTime}
        />
      );
    case 'Hotel':
      return (
        <HotelCard
          name={component.name ?? 'Hotel'}
          rating={Number(component.rating) || 4}
          location={component.location ?? component.details?.location}
          address={component.address}
          city_name={component.details?.city_name}
          state_name={component.details?.state_name}
          mealPlan={component.details?.mealPlan}
          roomType={component.details?.roomType}
          numberOfRooms={component.details?.numberOfRooms}
          roomConfigurations={component.details?.roomConfigurations}
          otherCharges={component.details?.otherCharges}
          price={component.price}
          images={(component.images ?? []).map((img: any) => img.url)}
          displayMode={displayMode as 'card' | 'row' | 'horizontal-card'}
          showImages={showImages}
          showDescriptions={showDescriptions}
          notes={component.description}
          checkIn={component.start_time ?? null}
          checkOut={component.end_time ?? null}
          hideTime={hideTime}
        />
      );
    case 'Activity':
      return (
        <ActivityCard
          name={component.name ?? 'Activity'}
          description={component.description}
          images={(component.images ?? []).map((img: any) => img.url)}
          displayMode={displayMode as 'card' | 'row' | 'horizontal-card'}
          showImages={showImages}
          showDescriptions={showDescriptions}
          hideTime={hideTime}
        />
      );
    case 'Flight': {
      const c = component;
      const segs = (c.details?.segments ?? []).map((s: any) => ({
        ...s,
        fareClass: c.details?.fareClass ?? s.fareClass,
        depTerminal: s.depTerminal ?? s.terminal,
        arrTerminal: s.arrTerminal,
      }));
      return (
        <FlightCard
          airlineName={c.details?.airline_name}
          segments={segs.length > 0 ? segs : [{}]}
          passengerName={c.details?.passenger_name ?? 'Guest'}
          price={c.price}
          fareType={c.details?.fareType ?? 'Refundable'}
          status={c.details?.status ?? 'Confirmed'}
          description={c.description}
          displayMode={displayMode === 'row' ? 'row' : 'widget'}
          hideTime={hideTime}
        />
      );
    }
    case 'Transport':
      return null; // Handled by grouping in ComponentRenderer
    case 'Train':
      return (
        <TrainCard
          name={component.name}
          from={component.details?.segments?.[0]?.from}
          to={component.details?.segments?.[0]?.to}
          departure={component.details?.segments?.[0]?.departure}
          arrival={component.details?.segments?.[0]?.arrival}
          trainNo={component.details?.segments?.[0]?.flightNo
            ?? component.details?.trainNo}
          trainName={component.details?.trainName ?? component.name}
          class={component.details?.fareClass
            ?? component.details?.segments?.[0]?.fareClass}
          price={component.price}
          notes={component.description}
          hideTime={hideTime}
          displayMode={displayMode as any}
        />
      );
    case 'Bus':
      return (
        <BusCard
          name={component.name}
          from={component.details?.from}
          to={component.details?.to}
          departure={component.details?.departureDateTime}
          arrival={component.details?.arrivalDateTime}
          operator={component.details?.busOperator}
          busType={component.details?.busType}
          seatNumber={component.details?.seatNumbers}
          price={component.price}
          notes={component.description}
          vendorName={component.details?.vendor?.name}
          hideTime={hideTime}
          displayMode={displayMode as any}
        />
      );
    default:
      return <PlaceholderCard type={type} name={component.name} />;
  }
}

// ─── Main dispatcher ──────────────────────────────────────────────

type ComponentRendererProps = {
  components: any[];
  showImages?: boolean;
  showDescriptions?: boolean;
};

export function ComponentRenderer({
  components,
  showImages = true,
  showDescriptions = true,
  dayDate,
  dayNumber,
}: ComponentRendererProps & { dayDate?: string, dayNumber?: number }) {
  const { layout } = useTheme();
  const layoutConfig = getLayoutConfig(layout);
  const lc = layoutConfig;

  const transportItems = components
    .filter(c => c.component_type === 'Transport')
    .map(c => ({
      id: c.id,
      name: c.name,
      pickupLocation: c.details?.pickupLocation,
      dropLocation: c.details?.dropLocation,
      routeStops: c.details?.routeStops,
      cabCategoryName: c.details?.cabCategoryName,
      cabModelName: c.details?.cabModelName,
      isAC: c.details?.isAC,
      seaterCapacity: c.details?.seaterCapacity ?? c.details?.pax,
      vehicleCount: c.details?.vehicleCount ?? 1,
      additionalVehicles: c.details?.additionalVehicles,
      price: c.price,
      notes: c.description,
    }));

  // Override with layout config values
  const resolvedShowImages = showImages && layoutConfig.dayCard.showImages;
  const resolvedShowDescriptions = showDescriptions && layoutConfig.dayCard.showDescriptions;

  return (
    <>
      <style>{`
        .timeline-item-wrapper {
          page-break-inside: avoid;
          width: 100%;
          position: relative;
          margin-bottom: 24px;
        }
        .timeline-item-layout {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }
        .timeline-desktop-time { 
          display: flex; 
          justify-content: flex-start; 
          align-items: flex-start;
          width: 100%;
          padding: 0 16px;
        }
        .timeline-hide-on-mobile { display: none !important; }
        .timeline-desktop-node { display: none; }
        .timeline-desktop-content { 
          display: block; 
          position: relative; 
          padding: 0 16px;
        }
        .timeline-mobile-connector { display: flex; }

        @media (min-width: 1024px), print {
          /* Apply desktop styles only if NOT forced into mobile preview mode */
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-item-layout {
            flex-direction: row;
            gap: 0;
            align-items: flex-start;
            display: grid;
            grid-template-columns: 80px 32px 1fr;
          }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-desktop-time { 
            display: flex; 
            justify-content: flex-end !important;
            width: 80px;
            padding: 0 16px 0 0;
            flex-shrink: 0;
          }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-hide-on-mobile { display: flex !important; }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-desktop-node { 
            display: block; 
            position: relative;
            width: 32px;
            align-self: stretch; /* Crucial for continuous line */
          }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-desktop-node::before {
            content: '';
            position: absolute;
            left: 16px;
            top: 0;
            bottom: -24px; /* Perfectly bridges the 24px margin-bottom */
            width: 2px;
            background-color: var(--color-primary);
            opacity: 0.15;
          }
          /* Start the line at the node center for the first item */
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-item-wrapper:first-of-type .timeline-desktop-node::before {
            top: 12px; 
          }
          /* Stop the line at the node for the last item */
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-item-wrapper:last-of-type .timeline-desktop-node::before {
            bottom: auto;
            height: 12px;
          }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-desktop-content {
            flex: 1;
            padding-left: 0;
            padding-right: 0;
          }
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-mobile-connector { display: none; }
        }
      `}</style>

      {components.map((component, i) => {
        const type = component.component_type as ComponentType;
        const c = component;

        const isTimeline = layout === 'timeline';

        // For timeline layout, determine what to show in the left column
        let timeLabel = '';
        let dateParts: { month: string, day: string, weekday: string } | null = null;
        
        if (isTimeline) {
          // Only show specific component time (if available) - Day Header already shows the date sticker
          const startTimeStr = c.start_time ?? c.details?.segments?.[0]?.departure ?? c.details?.departureDateTime;
          if (startTimeStr) {
            try {
              const d = new Date(startTimeStr);
              timeLabel = isNaN(d.getTime()) ? startTimeStr : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch(e) { 
              timeLabel = startTimeStr; 
            }
          }
        }

        let componentEl: React.ReactNode;

        if (type === 'Transport') {
          // Only render once for the first Transport — the grouped card covers all
          const isFirstTransport = components.filter(c => c.component_type === 'Transport')[0]?.id === c.id;
          if (!isFirstTransport) return null;
          
          componentEl = (
            <TransportCard
              key="transport-group"
              items={transportItems}
              displayMode={lc.componentDisplay.transport === 'row' ? 'row' : 'card'}
              hideTime={isTimeline}
            />
          );
        } else {
          // Resolve display mode from layout config
          const displayMode = (() => {
            switch (type) {
              case 'Hotel': return layoutConfig.componentDisplay.hotel;
              case 'Activity': return layoutConfig.componentDisplay.activity;
              case 'Flight': return layoutConfig.componentDisplay.flight;
              case 'Note': return layoutConfig.componentDisplay.note;
              default: return 'row';
            }
          })();

          componentEl = (
            <SingleComponent
              key={component.id ?? i}
              component={component}
              displayMode={displayMode}
              showImages={resolvedShowImages}
              showDescriptions={resolvedShowDescriptions}
              hideTime={isTimeline}
            />
          );
        }

        if (!isTimeline) {
          return <div key={component.id ?? i}>{componentEl}</div>;
        }

        return (
          <div 
            key={component.id ?? i} 
            className="timeline-item-wrapper"
          >
            <div className="timeline-item-layout">
              
              {/* === SHARED Time Column (Shows as header on mobile, left col on desktop) === */}
              <div 
                className={`timeline-desktop-time ${i === 0 ? 'timeline-hide-on-mobile' : ''}`}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start', // Default for mobile as requested
                  alignItems: 'flex-start',
                }}
              >
                 {timeLabel ? (
                   dateParts ? (
                     <CalendarDateIcon {...dateParts} />
                   ) : (
                     <div style={{
                       backgroundColor: 'var(--color-primary-muted)',
                       border: '1px solid var(--color-primary-border, var(--color-border))',
                       borderRadius: '8px',
                       padding: '6px 12px',
                       textAlign: 'center',
                       minWidth: '60px',
                       fontSize: '13px',
                       fontWeight: 700,
                       color: 'var(--color-primary)',
                       fontFamily: 'var(--font-heading)',
                       whiteSpace: 'pre-line',
                       lineHeight: '1.2',
                       boxShadow: 'var(--shadow-sm)',
                     }}>
                       {timeLabel}
                     </div>
                   )
                 ) : null}
              </div>

              {/* === DESKTOP SEAM (Line & Absolute Circle) === */}
              <div className="timeline-desktop-node">
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg)',
                    border: '2px solid var(--color-primary)',
                    zIndex: 10,
                  }} />
              </div>

              {/* === DESKTOP COL 2: Fluid Content === */}
              <div className="timeline-desktop-content">
                 {componentEl}
              </div>

            </div>
            
            {/* === MOBILE STACKED CONNECTOR LINE === */}
            {i !== components.length - 1 && (
              <div 
                className="timeline-mobile-connector"
                style={{
                  width: '2px',
                  height: '14px',
                  backgroundColor: 'var(--color-border)',
                  margin: '4px auto',
                }}
              />
            )}
            
          </div>
        );
      })}
    </>
  );
}
