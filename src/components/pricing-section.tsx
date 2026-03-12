'use client';

import { formatINR } from '@/lib/itinerary-utils';

type PricingItem = {
  item_name:   string;
  item_type:   string;
  day_number:  number;
  price:       number | string;
};

type PricingSectionProps = {
  items:       PricingItem[];
  totalPrice:  number | string;
};

// ─── Type badge colors ────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Hotel:     'var(--color-hotel)',
  Flight:    'var(--color-flight)',
  Transport: 'var(--color-transport)',
  Activity:  'var(--color-activity)',
  Train:     'var(--color-train)',
  Bus:       'var(--color-bus)',
  Other:     'var(--color-text-muted)',
};

function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.Other;
  return (
    <span
      style={{
        display:         'inline-flex',
        padding:         '2px 8px',
        borderRadius:    '999px',
        backgroundColor: color,
        color:           '#ffffff',
        fontSize:        '10px',
        fontWeight:      600,
        letterSpacing:   '0.04em',
        textTransform:   'uppercase',
        whiteSpace:      'nowrap',
      }}
    >
      {type}
    </span>
  );
}

// ─── Section header ───────────────────────────────────────────────

function SectionHeader() {
  return (
    <div
      className="pricing-header"
      style={{
        display:               'grid',
        gridTemplateColumns:   '60px minmax(0, 1fr) 100px 90px',
        gap:                   'var(--spacing-sm)',
        padding:               'var(--spacing-sm) var(--spacing-md)',
        borderRadius:          'var(--radius-badge)',
        backgroundColor:       'var(--color-primary-muted)',
        marginBottom:          'var(--spacing-sm)',
        width:                 '100%',
        boxSizing:             'border-box',
      }}
    >
      {['Day', 'Item', 'Type', 'Price'].map(label => (
        <div
          key={label}
          className={label === 'Type' ? 'type-header' : ''}
          style={{
            fontSize:      'clamp(0.6rem, 1vw, 0.75rem)',
            fontWeight:    700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color:         'var(--color-primary-dark)',
            fontFamily:    'var(--font-body)',
            textAlign:     label === 'Price' ? 'right' : 'left',
            minWidth:      0,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Single pricing row ───────────────────────────────────────────

function PricingRow({
  item,
  isLast,
}: {
  item:   PricingItem;
  isLast: boolean;
}) {
  return (
    <div
      className="pricing-row"
      style={{
        display:             'grid',
        gridTemplateColumns: '60px minmax(0, 1fr) 100px 90px',
        gap:                 'var(--spacing-sm)',
        padding:             'var(--spacing-sm) var(--spacing-md)',
        borderBottom:        isLast
                               ? 'none'
                               : '1px solid var(--color-border)',
        alignItems:          'center',
        transition:          'background-color 0.15s ease',
        borderRadius: 'var(--radius-badge)',
        margin:       '0 4px',
        width:        'calc(100% - 8px)',
        boxSizing:    'border-box',
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      {/* Day */}
      <div
        style={{
          fontSize:        'clamp(0.7rem, 1.2vw, 0.8125rem)',
          fontWeight:      700,
          color:           'var(--color-text-on-primary)',
          fontFamily:      'var(--font-body)',
          backgroundColor: 'var(--color-primary)',
          width:           '28px',
          height:          '28px',
          borderRadius:    '50%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
        }}
      >
        {item.day_number}
      </div>

      {/* Item name */}
      <div
        style={{
          fontSize:     'clamp(0.75rem, 1.4vw, 0.875rem)',
          fontWeight:   500,
          color:        'var(--color-text)',
          fontFamily:   'var(--font-body)',
          wordBreak:    'break-word',
          minWidth:     0,
        }}
      >
        {item.item_name}
      </div>

      {/* Type badge */}
      <div className="pricing-type-col" style={{ minWidth: 0 }}>
        <TypeBadge type={item.item_type} />
      </div>

      {/* Price */}
      <div
        style={{
          fontSize:   'clamp(0.75rem, 1.4vw, 0.875rem)',
          fontWeight: 700,
          color:      'var(--color-primary)',
          fontFamily: 'var(--font-body)',
          textAlign:  'right',
          flexShrink: 0,
        }}
      >
        {formatINR(item.price)}
      </div>
    </div>
  );
}

// ─── Day group ────────────────────────────────────────────────────

function DayGroup({
  dayNumber,
  items,
}: {
  dayNumber: number;
  items:     PricingItem[];
}) {
  const dayTotal = items.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div
      style={{
        marginBottom: 'var(--spacing-md)',
        borderRadius: 'var(--radius-card)',
        border:       '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        width:        '100%',
        boxSizing:    'border-box',
        overflow:     'hidden',
      }}
    >
      {/* Day label bar */}
      <div
        style={{
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          padding:         '6px var(--spacing-md)',
          backgroundColor: 'var(--color-primary-muted)',
          borderBottom:    '1px solid var(--color-border)',
          width:           '100%',
          boxSizing:       'border-box',
        }}
      >
        <span
          style={{
            fontSize:      'clamp(0.65rem, 1.1vw, 0.75rem)',
            fontWeight:    700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color:         'var(--color-primary-dark)',
            fontFamily:    'var(--font-body)',
          }}
        >
          Day {dayNumber}
        </span>
        <span
          style={{
            fontSize:   'clamp(0.7rem, 1.2vw, 0.8125rem)',
            fontWeight: 700,
            color:      'var(--color-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {formatINR(dayTotal)}
        </span>
      </div>

      {/* Items */}
      {items.map((item, i) => (
        <PricingRow
          key={i}
          item={item}
          isLast={i === items.length - 1}
        />
      ))}
    </div>
  );
}

// ─── Total footer ─────────────────────────────────────────────────

function TotalFooter({ total }: { total: number | string }) {
  return (
    <div
      style={{
        display:         'flex',
        justifyContent:  'space-between',
        alignItems:      'center',
        padding:         'var(--spacing-md) var(--spacing-lg)',
        borderRadius:    'var(--radius-card)',
        backgroundColor: 'var(--color-primary)',
        marginTop:       'var(--spacing-md)',
        boxShadow:       'var(--shadow-elevated)',
        width:           '100%',
        boxSizing:       'border-box',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize:      'clamp(0.6rem, 1vw, 0.75rem)',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'var(--color-text-on-primary)',
            opacity:       0.75,
            fontFamily:    'var(--font-body)',
            marginBottom:  '2px',
          }}
        >
          Total Package Price
        </div>
        <div
          style={{
            fontSize:   'clamp(0.65rem, 1.1vw, 0.75rem)',
            color:      'var(--color-text-on-primary)',
            opacity:    0.7,
            fontFamily: 'var(--font-body)',
          }}
        >
          Inclusive of all taxes
        </div>
      </div>

      <div
        style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(1.4rem, 3vw, 2rem)',
          fontWeight:    700,
          color:         'var(--color-text-on-primary)',
          letterSpacing: '-0.01em',
          flexShrink:    0,
        }}
      >
        {formatINR(total)}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────

export function PricingSection({ items, totalPrice }: PricingSectionProps) {
  // Group items by day
  const grouped = items.reduce<Record<number, PricingItem[]>>(
    (acc, item) => {
      const dn = item.day_number;
      if (!acc[dn]) acc[dn] = [];
      acc[dn].push(item);
      return acc;
    },
    {}
  );

  const sortedDays = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <section
      style={{
        marginBottom: 'var(--spacing-section)',
        maxWidth:     '100%',
        width:        '100%',
        boxSizing:    'border-box',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .pricing-header {
            display: none !important;
          }
          .pricing-row {
            display: grid !important;
            grid-template-columns: auto minmax(0, 1fr) !important;
            grid-template-areas: 
              "day name"
              "type price" !important;
            row-gap: 8px !important;
            column-gap: 12px !important;
            padding: 14px !important;
            margin: 0 0 12px 0 !important;
            border: 1px solid var(--color-border) !important;
            border-radius: var(--radius-card) !important;
            background-color: transparent !important;
            align-items: center !important;
            width: 100% !important;
          }
          .pricing-row:last-child {
            margin-bottom: 0 !important;
            border-bottom: 1px solid var(--color-border) !important;
          }
          .pricing-row:hover {
            background-color: var(--color-primary-muted) !important;
          }
          .pricing-row > div:nth-child(1) { grid-area: day; }
          .pricing-row > div:nth-child(2) { grid-area: name; font-size: 0.95rem !important; }
          .pricing-row > div:nth-child(3) { grid-area: type; margin-left: 0 !important; }
          .pricing-row > div:nth-child(4) { grid-area: price; justify-self: end; font-size: 1rem !important; }
        }
      `}</style>
      {/* Section title */}
      <h2
        style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(1.2rem, 3vw, 1.6rem)',
          fontWeight:    700,
          color:         'var(--color-text)',
          marginBottom:  'var(--spacing-md)',
          paddingBottom: 'var(--spacing-sm)',
          borderBottom:  '2px solid var(--color-primary)',
          display:       'inline-block',
        }}
      >
        Pricing Summary
      </h2>

      {/* Column headers */}
      <SectionHeader />

      {/* Day groups */}
      {sortedDays.map(day => (
        <DayGroup
          key={day}
          dayNumber={day}
          items={grouped[day]}
        />
      ))}

      {/* Total */}
      <TotalFooter total={totalPrice} />
    </section>
  );
}