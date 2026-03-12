'use client';

type ActivityCardProps = {
  name: string;
  description?: string;
  images?: string[];
  displayMode: 'card' | 'row' | 'horizontal-card';
  showImages?: boolean;
  showDescriptions?: boolean;
};

// ─── Image with fallback ──────────────────────────────────────────

function ActivityImage({ 
  src, 
  name, 
  className 
}: { 
  src?: string; 
  name: string; 
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(135deg, var(--color-activity), var(--color-primary-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        overflow: 'clip',
        flexShrink: 0,
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
    >
      {showImages && (
        <ActivityImage src={firstImage} name={name} className="w-full h-[160px]" />
      )}

      <div style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: showDescriptions && description ? '8px' : '0' }}>
          <h3 className="card-title-override" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, flex: 1, margin: 0 }}>
            {name}
          </h3>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--color-activity)', color: '#ffffff', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" /></svg>
            Activity
          </span>
        </div>

        {showDescriptions && description && (
          <div className="note-content-container" dangerouslySetInnerHTML={{ __html: description }} />
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
    <>
      <style>{`
        .activity-h-card {
          display: flex;
          flex-direction: row;
          min-height: 140px;
        }
        .activity-h-img {
          width: 180px;
          height: auto;
        }
        
        /* Standard Mobile and Forced Mobile Preview */
        @media (max-width: 640px) {
          .activity-h-card { flex-direction: column !important; }
          .activity-h-img { width: 100% !important; height: 140px !important; }
        }
        .itinerary-shell[data-forced-mobile="true"] .activity-h-card { flex-direction: column !important; }
        .itinerary-shell[data-forced-mobile="true"] .activity-h-img { width: 100% !important; height: 140px !important; }
      `}</style>
      <div
        className="activity-h-card"
        style={{
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {showImages && (
          <ActivityImage src={firstImage} name={name} className="activity-h-img" />
        )}

        <div style={{ padding: 'var(--spacing-md)', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              margin: 0,
            }}>{name}</h3>
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
              Activity
            </span>
          </div>

          {showDescriptions && description && (
            <div
              className="note-content-container"
              style={{ fontSize: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical' }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Row variant (compact) ────────────────────────────────────────

function ActivityRow({ name }: ActivityCardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-badge)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-badge)', backgroundColor: 'var(--color-activity)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <div style={{ fontSize: 'clamp(0.75rem, 1.4vw, 0.875rem)', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)', flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{name}</div>
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
