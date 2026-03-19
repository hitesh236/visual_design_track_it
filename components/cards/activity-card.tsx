'use client';

type ActivityCardProps = {
  name: string;
  description?: string;
  images?: string[];
  displayMode: 'card' | 'row' | 'horizontal-card';
  showImages?: boolean;
  showDescriptions?: boolean;
  hideTime?: boolean;
};

// ─── Image with fallback ──────────────────────────────────────────

function ActivityImage({ src, name, size = '160px', horizontal = false }: { src?: string; name: string; size?: string; horizontal?: boolean }) {
  if (!src) {
    return (
      <div
        style={{
          width: horizontal ? '100%' : '100%',
          height: horizontal ? '100%' : size,
          borderRadius: horizontal ? '0' : 'var(--radius-badge)',
          background: 'linear-gradient(135deg, var(--color-activity), var(--color-primary-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Simplified high-visibility ticket icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9Z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        width: horizontal ? '100%' : '100%',
        height: horizontal ? '100%' : size,
        borderRadius: horizontal ? '0' : 'var(--radius-badge)',
        overflow: 'clip',
      }}
    >
      <img
        src={src}
        alt={name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </div>
  );
}

// ─── Card variant ─────────────────────────────────────────────────

function ActivityCardFull({
  name,
  description,
  images,
  showImages,
  showDescriptions,
}: ActivityCardProps) {
  const firstImage = images?.[0];

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        overflow: 'clip',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-elevated)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
    >
      {/* Image */}
      {showImages && (
        <ActivityImage src={firstImage} name={name} />
      )}

      {/* Content */}
      <div style={{ padding: 'var(--spacing-md)' }}>

        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: showDescriptions && description ? '8px' : '0',
          }}
        >
          <h3
            className="card-title-override"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              flex: 1,
              margin: 0,
            }}
          >
            {name}
          </h3>

          {/* Activity badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-activity)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {/* Ticket icon */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9Z"/>
            </svg>
            Activity
          </span>
        </div>

        {/* Description */}
        {showDescriptions && description && (
          <div
            className="activity-note-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Horizontal variant (for Mini-Compact) ────────────────────────

function ActivityCardHorizontal({
  name,
  description,
  images,
  showImages,
  showDescriptions,
}: ActivityCardProps) {
  const firstImage = images?.[0];

  return (
    <div
      className="mini-compact-card activity-horizontal"
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Image on Left */}
      {showImages && (
        <div className="mini-compact-img">
          <ActivityImage src={firstImage} name={name} horizontal />
        </div>
      )}

      {/* Content on Right */}
      <div style={{ padding: 'var(--spacing-md)', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.3,
            margin: 0,
          }}>
            {name}
          </h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: 'var(--color-activity)',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {/* Ticket icon */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9Z"/>
            </svg>
            Activity
          </span>
        </div>

        {showDescriptions && description && (
          <div
            className="activity-note-content"
            style={{ fontSize: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Row variant (compact) ────────────────────────────────────────
// Shows only the activity name — no description, no images.

function ActivityRow({ name, images }: ActivityCardProps) {
  const firstImage = images?.[0];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-badge)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Thumbnail or Icon */}
      {firstImage ? (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid var(--color-border)',
          }}
        >
          <img
            src={firstImage}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-activity)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9Z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
      )}

      {/* Activity name */}
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          fontFamily: 'var(--font-body)',
          flex: 1,
          minWidth: 0,
          wordBreak: 'break-word',
        }}
      >
        {name}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────

export function ActivityCard(props: ActivityCardProps) {
  if (props.displayMode === 'row') {
    return <ActivityRow {...props} />;
  }
  if (props.displayMode === 'horizontal-card') {
    return <ActivityCardHorizontal {...props} />;
  }
  return <ActivityCardFull {...props} />;
}
