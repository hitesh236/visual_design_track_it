'use client';

import { useTheme } from '@/context/theme-context';

type HotelCardProps = {
  name: string;
  rating: number;
  location?: string;
  address?: string;
  city_name?: string;
  state_name?: string;
  mealPlan?: string;
  roomType?: string;
  numberOfRooms?: number | string;
  roomConfigurations?: Array<{
    id?: string;
    roomType: string;
    numberOfRooms: number | string;
    extraWithBed?: number | string;
    extraWithoutBed?: number | string;
  }>;
  otherCharges?: Array<{ name: string; [key: string]: any }>;
  price?: number | string;
  images?: string[];
  displayMode: 'card' | 'row';
  showImages?: boolean;
  showDescriptions?: boolean;
  notes?: string;
  checkIn?: string | null;
  checkOut?: string | null;
};

// ─── Time formatter ───────────────────────────────────────────────
function formatTime(val?: string | null): string {
  if (!val) return 'Standard Time';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return val;
  }
}

// ─── Formatting ──────────────────────────────────────────────────
function formatPrice(val?: number | string) {
  if (!val) return '';
  const n = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(n) || n === 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Badge ────────────────────────────────────────────────────────

function Badge({
  children,
  color = 'var(--color-hotel)',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '999px',
        backgroundColor: color,
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ─── Image with fallback ──────────────────────────────────────────

function HotelImage({ src, name, rating }: { src?: string; name: string; rating: number }) {
  const badgeText = rating > 0 ? `${rating} Star Hotel` : 'Hotel';

  return (
    <div
      style={{
        width: '100%',
        height: '180px',
        borderRadius: 'var(--radius-badge)',
        position: 'relative',
        overflow: 'clip',
        background: !src ? 'linear-gradient(135deg, var(--color-primary-muted), var(--color-primary-light))' : undefined,
      }}
    >
      {src ? (
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
      ) : (
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Hotel building with floor windows */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="1"/>
            <path d="M4 8h16M4 14h16"/>
            <path d="M9 22V14h6v8"/>
            <rect x="6.5" y="4.5" width="2" height="2" fill="var(--color-primary)" stroke="none"/>
            <rect x="10.5" y="4.5" width="2" height="2" fill="var(--color-primary)" stroke="none"/>
            <rect x="14.5" y="4.5" width="2" height="2" fill="var(--color-primary)" stroke="none"/>
            <rect x="6.5" y="9.5" width="2" height="2" fill="var(--color-primary)" stroke="none"/>
            <rect x="14.5" y="9.5" width="2" height="2" fill="var(--color-primary)" stroke="none"/>
          </svg>
        </div>
      )}

      {/* Overlay Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 1
      }}>
        <Badge color="rgba(0,0,0,0.6)">{badgeText}</Badge>
      </div>
    </div>
  );
}

// ─── Card variant (stacked + split) ──────────────────────────────

function HotelCardFull({
  name,
  rating,
  location,
  city_name,
  state_name,
  mealPlan,
  roomType,
  numberOfRooms,
  otherCharges,
  price,
  images,
  showImages,
  roomConfigurations,
  notes,
  checkIn,
  checkOut,
}: HotelCardProps) {
  const firstImage = images?.[0];

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        overflow: 'clip',
        boxShadow: 'var(--shadow-sm)',
        width: '100%',
        transition: 'box-shadow 0.2s ease',
        backgroundColor: 'var(--color-surface)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-elevated)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
    >
      {/* Image */}
      {showImages && (
        <HotelImage src={firstImage} name={name} rating={rating} />
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
            marginBottom: '8px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              className="card-title-override"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', // Max 16px (1rem == 16px)
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.3,
                marginBottom: '4px',
                margin: 0,
              }}
            >
              {name}
            </h3>
            {rating > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                {rating} Star Hotel
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {(location || city_name || state_name) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.8125rem)',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              marginBottom: '10px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {[location, city_name, state_name].filter(Boolean).join(', ')}
          </div>
        )}

        {/* Details grid or Room Configurations */}
        <div style={{ marginTop: '12px' }}>
          {mealPlan && (
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meal Plan:</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-hotel)', backgroundColor: 'var(--color-hotel-muted, #fff5f5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-hotel-border, #fed7d7)' }}>
                {mealPlan}
              </span>
            </div>
          )}

          {roomConfigurations && roomConfigurations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Room Configurations</span>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: roomConfigurations.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: '8px' 
              }}>
                {roomConfigurations.map((room, idx) => {
                  const isThirdOfThree = roomConfigurations.length === 3 && idx === 2;
                  return (
                    <div key={room.id ?? idx} style={{ 
                      backgroundColor: 'var(--color-bg)', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '4px',
                      gridColumn: isThirdOfThree ? 'span 2' : undefined
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)', wordBreak: 'break-word' }}>{room.roomType}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                            {room.numberOfRooms} {Number(room.numberOfRooms) === 1 ? 'Room' : 'Rooms'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {Number(room.extraWithBed) > 0 && (
                          <span style={{ fontSize: '9px', backgroundColor: 'var(--color-hotel)', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
                            +{room.extraWithBed} Bed
                          </span>
                        )}
                        {Number(room.extraWithoutBed) > 0 && (
                          <span style={{ fontSize: '9px', backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary-dark)', padding: '1px 5px', borderRadius: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
                            +{room.extraWithoutBed} Extra
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px'
              }}
            >
              {roomType && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Room Type</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{roomType}</span>
                </div>
              )}
              {numberOfRooms && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Rooms</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{numberOfRooms}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check-in / Check-out */}
        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px dashed var(--color-border)',
          display: 'flex',
          gap: '24px',
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Check-In</div>
            <div className="time-location-override" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{formatTime(checkIn)}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Check-Out</div>
            <div className="time-location-override" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>{formatTime(checkOut)}</div>
          </div>
        </div>

        {/* Other Inclusions */}
        {otherCharges && otherCharges.length > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', display: 'block', marginBottom: '4px' }}>Other Inclusions</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {otherCharges.map((charge, idx) => (
                <span key={idx} style={{ fontSize: '12px', color: 'var(--color-primary-dark)', backgroundColor: 'var(--color-primary-muted)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-body)' }}>
                  {charge.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {notes && (
        <div className="standard-note-bar">
          <strong>Note:</strong>
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}

function HotelRow({
  name,
  rating,
  location,
  city_name,
  state_name,
  mealPlan,
  roomType,
  numberOfRooms,
  otherCharges,
  price,
  roomConfigurations,
  notes,
  checkIn,
  checkOut,
}: HotelCardProps) {
  const displayLocation = [location, city_name, state_name].filter(Boolean).join(', ');

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* ── Main content ─────────────────────────────────────── */}
      <div style={{ padding: '14px 16px' }}>

        {/* Row 1: Icon + Name block */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '6px' }}>

          {/* Hotel icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-hotel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
              <path d="M8 22v-4h8v4" />
              <path d="M12 2v4" />
              <path d="M8 10h.01M16 10h.01M8 14h.01M16 14h.01" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Name + stars + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Hotel name — wraps freely */}
            <h3
              className="card-title-override"
              style={{
                fontWeight: 700,
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', // Max 16px
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.3,
                marginBottom: '5px',
                margin: 0,
              }}
            >  {name || 'Hotel'}
            </h3>

            {/* Stars */}
            {rating > 0 && (
              <div style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>
                {Array.from({ length: Math.min(Math.max(rating, 0), 5) }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            )}

            {/* Location */}
            {displayLocation && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{displayLocation}</span>
              </div>
            )}

            {/* Room configuration pills — inside the name column */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {roomConfigurations && roomConfigurations.length > 0 ? (
                roomConfigurations.map((room, idx) => (
                  <span key={room.id ?? idx} style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-hotel)',
                    backgroundColor: 'var(--color-hotel-muted, #fff5f5)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    border: '1px solid var(--color-hotel-border, #fed7d7)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {room.numberOfRooms} {room.roomType}
                    {Number(room.extraWithBed) > 0 && ` (+${room.extraWithBed} Bed)`}
                    {Number(room.extraWithoutBed) > 0 && ` (+${room.extraWithoutBed} Ext)`}
                  </span>
                ))
              ) : (
                roomType && (
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-hotel)',
                    backgroundColor: 'var(--color-hotel-muted, #fff5f5)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    border: '1px solid var(--color-hotel-border, #fed7d7)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {numberOfRooms && `${numberOfRooms} `}{roomType}
                  </span>
                )
              )}
            </div>

            {/* Meals — inside the name column */}
            {mealPlan && (
              <div style={{
                marginTop: '6px',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}>
                Meals: <strong style={{ color: 'var(--color-text)' }}>{mealPlan}</strong>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Check-in / Check-out — indented to align under name ─ */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        padding: '10px 16px',
        paddingLeft: '68px', // 16px outer + 40px icon + 12px gap
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {/* Check-In */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '3px',
            fontFamily: 'var(--font-body)',
          }}>
            Check-In
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
          }}>
            {formatTime(checkIn)}
          </div>
        </div>

        {/* Separator icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 12c-2.4 0-4.67.97-6.36 2.66A9 9 0 0 0 12 21" />
          <path d="M12 3a9 9 0 0 0-9 9" />
          <path d="M3 12c2.4 0 4.67-.97 6.36-2.66A9 9 0 0 0 12 3" />
          <path d="M12 21a9 9 0 0 0 9-9" />
        </svg>

        {/* Check-Out */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '3px',
            fontFamily: 'var(--font-body)',
          }}>
            Check-Out
          </div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
          }}>
            {formatTime(checkOut)}
          </div>
        </div>
      </div>

      {/* ── Note strip ───────────────────────────────────────── */}
      {notes && (
        <div className="standard-note-bar">
          <strong>Note:</strong>
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────

export function HotelCard(props: HotelCardProps) {
  if (props.displayMode === 'row') {
    return <HotelRow {...props} />;
  }
  return <HotelCardFull {...props} />;
}
