'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';
import { getLayoutConfig } from '@/lib/layout-presets';
import { formatDateShort } from '@/lib/itinerary-utils';
import { ComponentRenderer } from '@/components/component-renderer';

// ─── Types ────────────────────────────────────────────────────────

export type DayData = {
  day_number: number;
  title:      string;
  components: any[];
  date?:      string;   // from metadata.day_date
  isFeatured?: boolean;
};

// ─── Mobile hook ──────────────────────────────────────────────────

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const check = () => {
      // For hydration safety, check for window and forced mobile frame
      if (typeof window === 'undefined') return;
      const frameMobile = document.querySelector('.itinerary-shell[data-forced-mobile="true"]');
      setIsMobile(window.innerWidth < 640 || !!frameMobile);
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

  // During hydration, always return false to match server output.
  // The layout will "snap" to the correct state immediately after mount.
  return hasMounted ? isMobile : false;
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
        fontFamily:      'var(--font-heading)',
        fontSize:        '14px',
        fontWeight:      700,
        flexShrink:      0,
        boxShadow:       'var(--shadow-card)',
        zIndex:          1,
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
}: {
  dayNumber: number;
  title:     string;
  date?:     string;
  compact?:  boolean;
}) {
  const cleanTitle = title
    .replace(/^day\s+\d+[\s:·\-–—]*/i, '')
    .trim();

  // ── Compact: single horizontal bar (day label + title only) ─────
  if (compact) {
    return (
      <div
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '10px',
          paddingBottom:   'var(--spacing-sm)',
          marginBottom:    'var(--spacing-sm)',
          borderBottom:    '1px solid var(--color-border)',
          width:           '100%',
          boxSizing:       'border-box',
        }}
      >
        {/* Day label */}
        <span
          style={{
            display:         'inline-flex',
            alignItems:      'center',
            padding:         '2px 10px',
            borderRadius:    '999px',
            backgroundColor: 'var(--color-primary)',
            color:           'var(--color-text-on-primary)',
            fontSize:        'clamp(0.65rem, 1.1vw, 0.8rem)',
            fontWeight:      700,
            letterSpacing:   '0.04em',
            flexShrink:      0,
          }}
        >
          DAY {dayNumber}
        </span>

        {/* Title only — no date in compact mode */}
        <span
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'clamp(0.75rem, 1.4vw, 0.875rem)',
            fontWeight:   600,
            color:        'var(--color-primary)',
            flex:         1,
            minWidth:     0,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}
        >
          {cleanTitle}
        </span>
      </div>
    );
  }

  // ── Default: pill + stacked title (stacked + split layouts) ──────
  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '12px',
        marginBottom: 'var(--spacing-md)',
        width:        '100%',
        boxSizing:    'border-box',
      }}
    >
      <DayPill number={dayNumber} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2
          className="day-heading-override"
          style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     'clamp(1.1rem, 2.5vw, 1.125rem)', // Max 18px
            fontWeight:   700,
            color:        'var(--color-primary)',
            lineHeight:   1.2,
            marginBottom: '4px',
            margin:       0,
            wordBreak:    'break-word',
          }}
        >
          {cleanTitle}
        </h2>
        {date && (
          <div
            style={{
              fontSize:   'clamp(0.7rem, 1.2vw, 0.8125rem)',
              color:      'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {formatDateShort(date)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Timeline connector ───────────────────────────────────────────

function TimelineConnector({ style: lineStyle }: { style: 'line' | 'dotted' | 'none' }) {
  if (lineStyle === 'none') return null;

  return (
    <div
      className="day-timeline-connector"
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
}: {
  day:     DayData;
  isLast?: boolean;
}) {
  const { layout, activeMoodId } = useTheme();
  const layoutConfig = getLayoutConfig(layout);
  const date   = day.components[0]?.metadata?.day_date ?? day.date;
  const isGlass = activeMoodId === 'spiritual';
  const isMobile = useMobile();

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
        @media (max-width: 480px) {
          .day-card-inner {
            padding: var(--spacing-sm) var(--spacing-md) !important;
          }
          .day-timeline-connector {
            display: none !important;
          }
        }
        .itinerary-shell[data-forced-mobile="true"] .day-card-inner {
          padding: var(--spacing-sm) var(--spacing-md) !important;
          flex-direction: column !important;
        }
        .itinerary-shell[data-forced-mobile="true"] .day-timeline-connector {
          display: none !important;
        }
      `}</style>
      <div
        style={{
          position:     'relative',
          marginBottom: isLast ? 0 : 'var(--spacing-section)',
          maxWidth:     '100%',
          boxSizing:    'border-box',
        }}
      >
        {!isLast && <TimelineConnector style={layoutConfig.timeline.style} />}

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
              maxWidth:             '100%',
              width:                layout === 'timeline' ? '794px' : '100%',
              margin:               layout === 'timeline' ? '0 auto' : '0',
              boxSizing:            'border-box',
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
              boxSizing: 'border-box',
              minWidth:  0,
            }}
          >
            <DayHeader dayNumber={day.day_number} title={day.title} date={date} compact={isCompact} />

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
                  wordBreak:  'break-word',
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
            minWidth: 0,
            maxWidth: '100%',
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
