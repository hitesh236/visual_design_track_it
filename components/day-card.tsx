'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';
import { getLayoutConfig } from '@/lib/layout-presets';
import { formatDateShort } from '@/lib/itinerary-utils';
import { ComponentRenderer, CalendarDateIcon } from '@/components/component-renderer';

// ─── Types ────────────────────────────────────────────────────────

export type DayData = {
  day_number: number;
  title:      string;
  components: any[];
  date?:      string;   // from metadata.day_date
  isFeatured?: boolean;
};

// ─── Mobile hook ──────────────────────────────────────────────────

function useMobile(forcedMobile?: boolean) {
  const [isMobileState, setIsMobileState] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const isMobile = forcedMobile || isMobileState;

  useEffect(() => {
    setHasMounted(true);
    const check = () => {
      // For hydration safety, check for window
      if (typeof window === 'undefined') return;
      setIsMobileState(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    // Poll briefly to catch the transition from desktop to mobile preview frame
    const interval = setInterval(check, 500);
    return () => {
      window.removeEventListener('resize', check);
      clearInterval(interval);
    };
  }, []);

  return { isMobile: hasMounted ? isMobile : false, hasMounted };
}

// ─── Day number pill ──────────────────────────────────────────────

function DayPill({ number }: { number: number }) {
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        width:           '40px',
        height:          '40px',
        borderRadius:    '50%',
        backgroundColor: 'var(--color-primary)',
        color:           'var(--color-text-on-primary)',
        fontFamily:      'var(--font-body)', // Better readability for numbers than the thin serif heading font
        fontSize:        '18px',
        fontWeight:      800,
        flexShrink:      0,
        boxShadow:       'var(--shadow-card)',
        zIndex:          1,
        lineHeight:      1,
      }}
    >
      {number}
    </div>
  );
}

// ─── Day header ───────────────────────────────────────────────────

function DayHeader({
  dayNumber,
  title,
  date,
  compact = false,
  isMobile = false,
  layout,
}: {
  dayNumber: number;
  title:     string;
  date?:     string;
  compact?:  boolean;
  isMobile?: boolean;
  layout?:   string;
}) {
  const cleanTitle = title
    .replace(/^day\s+\d+[\s:·\-–—]*/i, '')
    .trim();

  // ── Unified: chip + title (compact or not, mobile or not) ──────

  const dateObj = date ? new Date(date) : null;
  const month = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '';
  const day = dateObj ? dateObj.getDate().toString() : '';
  const weekday = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() : '';
  const fullWeekday = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }) : '';

  // ── 1. Stacked Layout Variant (Matching User Image) ────────────
  if (layout === 'stacked') {
    return (
      <div style={{
        display:      'flex',
        alignItems:   'flex-start', // Align circle with first line of title
        gap:          '16px',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <DayPill number={dayNumber} />
        
        <div style={{ flex: 1 }}>
          <h2 
            className="day-heading-override" 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize:   isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 800,
              color:      'var(--color-primary)',
              lineHeight: 1.3,
              margin:     0,
            }}
          >
            {cleanTitle}
          </h2>
          {dateObj && (
            <div style={{
              marginTop:       '8px',
              display:         'inline-flex',
              padding:         '3px 12px',
              borderRadius:    '999px',
              backgroundColor: 'var(--color-primary-muted)',
              color:           'var(--color-primary)',
              fontSize:        '11px',
              fontWeight:      700,
              fontFamily:      'var(--font-body)',
              textTransform:   'uppercase',
              letterSpacing:   '0.02em',
              boxShadow:       'var(--shadow-sm)',
            }}>
              {day} {month.charAt(0) + month.slice(1).toLowerCase()}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Default / Other Layouts: chip + title ──────
  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '16px',
        marginBottom: layout === 'timeline' ? 'var(--spacing-sm)' : 'var(--spacing-md)',
      }}
    >
      {dateObj ? (
        <CalendarDateIcon
          month={(isMobile && layout === 'timeline') ? 'DAY' : month}
          day={(isMobile && layout === 'timeline') ? dayNumber.toString() : day}
          weekday={weekday}
        />
      ) : (
        <DayPill number={dayNumber} />
      )}
      <div style={{ flex: 1 }}>
        {!isMobile && (
          <div style={{
            display: 'inline-flex',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-primary-muted)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px'
          }}>
            Day {dayNumber}
          </div>
        )}
        <h2
          className="day-heading-override"
          style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     'clamp(1.25rem, 3vw, 1.4rem)',
            fontWeight:   800,
            color:        'var(--color-primary)',
            lineHeight:   1.2,
            margin:       0,
          }}
        >
          {cleanTitle}
        </h2>
      </div>
    </div>
  );
}

// ─── Timeline connector ───────────────────────────────────────────

function TimelineConnector({ style: lineStyle }: { style: 'line' | 'dotted' | 'none' }) {
  if (lineStyle === 'none') return null;

  return (
    <div
      style={{
        position:        'absolute',
        left:            'calc(var(--spacing-lg) + 19px)', // accounts for card padding
        top:             'calc(var(--spacing-lg) + 40px)', // accounts for card padding
        bottom:          `calc(-1 * var(--spacing-section))`,
        width:           '2px',
        backgroundColor: lineStyle === 'dotted'
                           ? 'transparent'
                           : 'var(--color-border)',
        backgroundImage: lineStyle === 'dotted'
                           ? `repeating-linear-gradient(
                               to bottom,
                               var(--color-border) 0px,
                               var(--color-border) 6px,
                               transparent 6px,
                               transparent 12px
                             )`
                           : 'none',
        zIndex:          0,
      }}
    />
  );
}

// ─── Day card ─────────────────────────────────────────────────────

export function DayCard({
  day,
  isLast = false,
  forcedMobile,
}: {
  day:     DayData;
  isLast?: boolean;
  forcedMobile?: boolean;
}) {
  const { isMobile, hasMounted } = useMobile(forcedMobile);
  const { layout, activeMoodId } = useTheme();
  const layoutConfig = getLayoutConfig(layout);
  const date   = day.components[0]?.metadata?.day_date ?? day.date;
  const isGlass = activeMoodId === 'spiritual';

  const isFeatured = day.isFeatured ?? false;

  // Featured card gets a primary color top border + glow
  const featuredExtras: React.CSSProperties = isFeatured
    ? {
        borderColor: 'var(--color-primary)',
        boxShadow:   `
          0 0 0 1px var(--color-primary),
          var(--shadow-elevated)
        `,
      }
    : {};

  const isCompact = layoutConfig.dayCard.direction === 'column'
               && !layoutConfig.dayCard.showImages;

  return (
    <>
      <style>{`
        .timeline-global-connector {
          display: none;
        }
        @media (min-width: 1024px), print {
          /* Show global connector only on desktop/A4 */
          .itinerary-shell:not([data-forced-mobile="true"]) .timeline-global-connector {
            display: flex !important;
          }
        }
      `}</style>
      <div
        style={{
          position:     'relative',
          marginBottom: isLast ? 0 : 'var(--spacing-section)',
        }}
      >
        {!isLast && (
          <div className="timeline-global-connector">
            <TimelineConnector style={layoutConfig.timeline.style} />
          </div>
        )}

        <div
          className="day-card-inner"
          style={{
              position:             'relative',
              zIndex:               1,
              backgroundColor:      isGlass ? 'rgba(255,255,255,0.45)' : 'var(--color-surface)',
              backdropFilter:       isGlass ? 'blur(12px)' : undefined,
              WebkitBackdropFilter: isGlass ? 'blur(12px)' : undefined,
              borderRadius:         layout === 'timeline' ? '0' : 'var(--radius-card)', // timeline uses full width flow
              border:               layout === 'timeline' ? 'none' : '1px solid var(--color-border)',
              boxShadow:            layout === 'timeline' ? 'none' : 'var(--shadow-card)',
              padding:              isCompact
                                      ? 'var(--spacing-sm) var(--spacing-md)'
                                      : layout === 'timeline'
                                        ? 'var(--spacing-lg) 0' // remove horizontal padding for timeline grid to flush left/right
                                        : 'var(--spacing-lg)',
              display:              layoutConfig.dayCard.direction === 'row' && !isMobile ? 'flex' : 'block',
              gap:                  layoutConfig.dayCard.direction === 'row' && !isMobile
                                      ? 'var(--spacing-md)'
                                      : undefined,
              alignItems:           'flex-start',
              maxWidth:             layout === 'timeline' ? '794px' : 'none',
              margin:               layout === 'timeline' ? '0 auto' : '0',
              ...featuredExtras,
            }}
        >
          {/* Left column */}
          <div
            style={{
              width:      layoutConfig.dayCard.direction === 'row' && !isMobile ? 'clamp(180px, 25%, 260px)' : '100%',
              flexShrink: layoutConfig.dayCard.direction === 'row' && !isMobile ? 0 : undefined,
              position:  layoutConfig.dayCard.direction === 'row' && !isMobile
                         ? 'sticky'
                         : 'static',
              top:       '80px',
              alignSelf: 'flex-start',
              padding:   layout === 'timeline' ? '0 16px' : '0',
            }}
          >
            <DayHeader dayNumber={day.day_number} title={day.title} date={date} compact={isCompact} isMobile={isMobile} layout={layout} />

            {layoutConfig.dayCard.direction === 'row' && !isMobile && (() => {
              const note = day.components.find(c => c.component_type === 'Note');
              if (!note?.description) return null;
              const plainText = note.description.replace(/<[^>]+>/g, '');
              return (
                <p style={{
                  fontSize:   'clamp(0.7rem, 1.2vw, 0.8125rem)',
                  lineHeight: 1.6,
                  color:      'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  margin:     '0',
                  paddingTop: 'var(--spacing-sm)',
                }}>
                  {plainText}
                </p>
              );
            })()}

            {layoutConfig.dayCard.direction === 'row' && !isMobile && (
              <div style={{
                marginTop:       'var(--spacing-sm)',
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '4px',
                padding:         '3px 10px',
                borderRadius:    '999px',
                backgroundColor: 'var(--color-primary-muted)',
                color:           'var(--color-primary-dark)',
                fontSize:        'clamp(0.65rem, 1.1vw, 0.75rem)',
                fontWeight:      600,
                fontFamily:      'var(--font-body)',
              }}>
                {day.components.filter(c => c.component_type !== 'Note').length} stops
              </div>
            )}
          </div>

          {/* Divider */}
          {layoutConfig.dayCard.direction === 'row' && !isMobile && (
            <div style={{
              width:           '1px',
              alignSelf:       'stretch',
              backgroundColor: 'var(--color-border)',
              flexShrink:      0,
              margin:          '0 var(--spacing-sm)',
            }} />
          )}

          {/* Right column — components (always single column full-width) */}
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: isCompact ? '6px' : layout === 'timeline' ? '0' : 'var(--spacing-md)',
          }}>
            <ComponentRenderer
              components={
                layoutConfig.dayCard.direction === 'row' && !isMobile
                  ? day.components.filter(c => c.component_type !== 'Note')
                  : day.components
              }
              dayDate={date}
              dayNumber={day.day_number}
            />
          </div>
        </div>
      </div>
    </>
  );
}
