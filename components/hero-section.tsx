'use client';

import { useTheme } from '@/context/theme-context';
import {
  deriveStartDate,
  deriveEndDate,
  formatDate,
  formatDateYY,
  formatTravelers,
  formatDuration,
  formatINR,
} from '@/lib/itinerary-utils';

type HeroProps = {
  title: string;
  featureImage: string;
  finalPrice: string | number;
  adults: number;
  children: number;
  minors: number;
  clientName: string;
  inquiryId: string;
  components: any[];           // raw components array for date derivation
};

// ─── Badge pill ───────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '999px',
        backgroundColor: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ─── Stats bar item ───────────────────────────────────────────────

function StatItem({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div
      className="hero-stat-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        flex: '1 1 140px',   // grow + shrink, min 140px per item
        minWidth: 0,
      }}
    >
      <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 'clamp(0.75rem, 1.6vw, 0.9375rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </div>
        {subValue && (
          <div
            style={{
              fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
              color: 'var(--color-text-muted)',
              marginTop: '-1px',
            }}
          >
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}

function StatDivider() {
  return (
    <div
      className="hero-stat-divider"
      style={{
        width: '1px',
        height: '32px',
        backgroundColor: 'var(--color-border)',
        flexShrink: 0,
        alignSelf: 'center',
      }}
    />
  );
}

// ─── Hero ─────────────────────────────────────────────────────────

export function HeroSection({
  title,
  featureImage,
  finalPrice,
  adults,
  children,
  minors,
  clientName,
  inquiryId,
  components,
}: HeroProps) {
  const { activeMoodId, theme } = useTheme();

  // ── Mood-specific style overrides ──────────────────────────────

  const titleLetterSpacing: Record<string, string> = {
    luxury: '0.02em',    // Cormorant Garamond breathes wide
    adventure: '-0.01em',   // Montserrat tight
    modern: '-0.02em',   // Inter very tight
    nature: '0em',       // Merriweather neutral
    spiritual: '0.01em',    // Playfair Display slight open
  };

  const statsBarExtras: React.CSSProperties =
    theme.colorMode === 'dark'
      ? {
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }
      : activeMoodId === 'spiritual'
        ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderTop: 'none',
        }
        : {};

  const heroOverlayExtras: React.CSSProperties =
    activeMoodId === 'luxury'
      ? {
        // Luxury gets a subtle color tint matching the dark bg
        background: 'linear-gradient(to bottom, rgba(26,26,46,0.2) 0%, rgba(26,26,46,0.4) 40%, rgba(26,26,46,0.88) 100%)',
      }
      : activeMoodId === 'spiritual'
        ? {
          // Spiritual gets a soft purple tint
          background: 'linear-gradient(to bottom, rgba(123,94,167,0.1) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 100%)',
        }
        : {};
  const startDate = deriveStartDate(components);
  const endDate = deriveEndDate(components);
  const duration = formatDuration(startDate, endDate);
  const totalTravelers = adults + children + minors;
  const travelers = formatTravelers(adults, children, minors);
  const totalDays = parseInt(duration);

  const numericPrice = typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice;
  const perPersonPrice = totalTravelers > 0 ? numericPrice / totalTravelers : 0;

  return (
    <div style={{ marginBottom: 'var(--spacing-section)' }}>
      <style>{`
        @media (max-width: 480px) {
          .hero-client-price-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .hero-price-badge {
            align-self: flex-start !important;
          }
          .hero-stat-item {
            padding: 8px 14px !important;
            flex: 1 1 calc(50% - 28px) !important;
          }
          .hero-stat-divider {
            display: none !important;
          }
          /* Heading capped at 22px */
          .hero-title {
            font-size: 22px !important;
          }
          /* Price number capped at 18px */
          .hero-price-pill {
            font-size: 18px !important;
          }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .hero-stat-item {
            flex: 1 1 calc(33% - 28px) !important;
          }
          .hero-stat-divider {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Hero image: minHeight so tall titles expand naturally ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(320px, 40vw, 560px)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          marginBottom: '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Background image */}
        <img
          src={featureImage}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Layer 1 — base bottom-up gradient for text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1,
            ...heroOverlayExtras,
          }}
        />

        {/* Layer 2 — subtle top vignette for badge readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%)',
            zIndex: 1,
          }}
        />

        {/* Content over image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'var(--spacing-lg)',
            zIndex: 2,
          }}
        >
          {/* Badge row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <Badge>{`${totalDays} Days · ${parseInt(duration) - 1} Nights`}</Badge>
            <Badge>{travelers}</Badge>
          </div>

          {/* Title */}
          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.375rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 12px 0',
              lineHeight: 1.25,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: titleLetterSpacing[activeMoodId] ?? '0em',
            }}
          >
            {title}
          </h1>

          {/* Client line + price on same row */}
          <div
            className="hero-client-price-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <p
              className="hero-client-text"
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
                margin: 0,
                fontFamily: 'var(--font-body)',
              }}
            >
              Prepared for{' '}
              <strong className="hero-client-name" style={{ color: '#ffffff' }}>{clientName}</strong>
              <span className="hero-inquiry-separator">{' — '}</span>
              <span className="hero-inquiry-id">{inquiryId}</span>
            </p>

            {/* Price badge */}
            <div
              className="hero-price-badge"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '2px',
              }}
            >
              {/* Label above price */}
              <span
                style={{
                  fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Total Package
              </span>

              {/* Price pill */}
              <div
                className="hero-price-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                  letterSpacing: '-0.01em',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Rupee sparkle dot */}
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-text-on-primary)',
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                />
                {formatINR(finalPrice)}
              </div>

              {/* Per person sub-label */}
              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {perPersonPrice > 0 ? `${formatINR(perPersonPrice)} per person` : `for ${totalTravelers} travelers`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          backgroundColor: 'var(--color-surface)',
          borderRadius: `0 0 var(--radius-card) var(--radius-card)`,
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)',
          borderTop: 'none',
          padding: 'var(--spacing-sm) 0',
          ...statsBarExtras,
        }}
      >
        <StatItem
          icon={<CalendarIcon />}
          label="Travel Dates"
          value={`${formatDateYY(startDate)} - ${formatDateYY(endDate)}`}
        />
        <StatDivider />
        <StatItem
          icon={<UsersIcon />}
          label="Travelers"
          value={String(totalTravelers)}
        />
        <StatDivider />
        <StatItem
          icon={<ClockIcon />}
          label="Duration"
          value={duration}
        />
        <StatDivider />
        <StatItem
          icon={<SunIcon />}
          label="Package Type"
          value="Open"
        />
      </div>

    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}
