'use client';

import React from 'react';

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
  displayMode: 'card' | 'row' | 'horizontal-card';
  showImages?: boolean;
  showDescriptions?: boolean;
  notes?: string;
  checkIn?: string | null;
  checkOut?: string | null;
};

function formatTime(val?: string | null): string {
  if (!val) return 'Standard Time';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return val; }
}

function Badge({ children, color = 'var(--color-hotel)' }: { children: React.ReactNode; color?: string; }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '999px', backgroundColor: color, color: '#ffffff', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function HotelImage({ src, name, rating, className }: { src?: string; name: string; rating: number; className?: string; }) {
  const badgeText = rating > 0 ? `${rating} Star Hotel` : 'Hotel';
  return (
    <div className={className} style={{ position: 'relative', overflow: 'clip', flexShrink: 0, background: !src ? 'linear-gradient(135deg, var(--color-primary-muted), var(--color-primary-light))' : undefined }}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M4 8h16M4 14h16"/><path d="M9 22V14h6v8"/>
          </svg>
        </div>
      )}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }}>
        <Badge color="rgba(0,0,0,0.6)">{badgeText}</Badge>
      </div>
    </div>
  );
}

function HotelCardFull(props: HotelCardProps) {
  const { name, rating, location, city_name, state_name, mealPlan, images, showImages, roomConfigurations, notes, checkIn, checkOut } = props;
  const firstImage = images?.[0];
  return (
    <div className="hotel-card-full" style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', overflow: 'clip', boxShadow: 'var(--shadow-sm)', width: '100%', backgroundColor: 'var(--color-surface)' }}>
      {showImages && <HotelImage src={firstImage} name={name} rating={rating} className="w-full h-[180px]" />}
      <div className="hotel-card-body" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ marginBottom: '8px' }}>
          <h3 className="card-title-override" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, margin: 0 }}>{name}</h3>
          {rating > 0 && <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>{rating} Star Hotel</div>}
        </div>
        {(location || city_name || state_name) && <div className="hotel-card-location" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>{[location, city_name, state_name].filter(Boolean).join(', ')}</div>}
        <div className="hotel-card-details" style={{ marginTop: '12px' }}>
          {mealPlan && <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Meal Plan:</span><span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-hotel)', backgroundColor: 'var(--color-primary-muted)', padding: '2px 8px', borderRadius: '4px' }}>{mealPlan}</span></div>}
          <div className="hotel-room-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {roomConfigurations?.map((room, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--color-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{room.roomType}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{room.numberOfRooms} {Number(room.numberOfRooms) === 1 ? 'Room' : 'Rooms'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hotel-card-times" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)', display: 'flex', gap: '24px' }}>
          <div><div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Check-In</div><div className="time-location-override" style={{ fontSize: '13px', fontWeight: 600 }}>{formatTime(checkIn)}</div></div>
          <div><div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Check-Out</div><div className="time-location-override" style={{ fontSize: '13px', fontWeight: 600 }}>{formatTime(checkOut)}</div></div>
        </div>
      </div>
      {notes && <div className="standard-note-bar"><strong>Note:</strong><span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} /></div>}
    </div>
  );
}

function HotelCardHorizontal(props: HotelCardProps) {
  const { name, rating, location, city_name, state_name, mealPlan, images, showImages, roomConfigurations, notes, checkIn, checkOut, roomType, numberOfRooms } = props;
  const firstImage = images?.[0];
  const displayLocation = [location, city_name, state_name].filter(Boolean).join(', ');

  return (
    <div
      className="horizontal-card-root hotel-h-card"
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        width: '100%',
        minHeight: '180px',
      }}
    >
      {showImages && (
        <HotelImage src={firstImage} name={name} rating={rating} className="horizontal-card-image hotel-h-image" />
      )}
      <div className="hotel-h-content" style={{ padding: 'var(--spacing-md)', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <h3 className="card-title-override" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3, margin: 0 }}>{name}</h3>
          {displayLocation && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>{displayLocation}</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
          <div className="hotel-h-info-col" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Stay Details</div>
            {mealPlan && <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Meal: {mealPlan}</div>}
            {roomConfigurations && roomConfigurations.length > 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>{roomConfigurations.map(r => `${r.numberOfRooms}x ${r.roomType}`).join(', ')}</div>
            ) : ( roomType && <div style={{ fontSize: '0.75rem' }}>{numberOfRooms}x {roomType}</div> )}
          </div>
          <div className="hotel-h-timing-col" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Timing</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div><div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>IN</div><div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{formatTime(checkIn)}</div></div>
              <div><div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>OUT</div><div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{formatTime(checkOut)}</div></div>
            </div>
          </div>
        </div>
        {notes && <div className="hotel-h-footer" style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px dashed var(--color-border)', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{notes.replace(/<[^>]+>/g, '').substring(0, 100)}...</div>}
      </div>
    </div>
  );
}

function HotelRow(props: HotelCardProps) {
  const { name, rating, location, city_name, state_name, mealPlan, notes, checkIn, checkOut, roomType, numberOfRooms } = props;
  const displayLocation = [location, city_name, state_name].filter(Boolean).join(', ');
  return (
    <div className="hotel-card-row" style={{ borderRadius: 'var(--radius-card)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div className="hotel-icon-bg" style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-hotel)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" /><path d="M8 22v-4h8v4" /><path d="M12 2v4" /><path d="M8 10h.01M16 10h.01M8 14h.01M16 14h.01" strokeWidth="3" strokeLinecap="round" /></svg>
          </div>
          <div className="hotel-row-info" style={{ flex: 1, minWidth: 0 }}>
            <h3 className="card-title-override" style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', color: 'var(--color-text)', fontFamily: 'var(--font-heading)', lineHeight: 1.3, marginBottom: '5px', margin: 0 }}>{name || 'Hotel'}</h3>
            {rating > 0 && <div className="hotel-stars" style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>{Array.from({ length: Math.min(Math.max(rating, 0), 5) }).map((_, i) => (<svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>))}</div>}
            {displayLocation && <div className="hotel-row-location" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg><span>{displayLocation}</span></div>}
          </div>
        </div>
      </div>
      <div className="hotel-row-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '10px 16px', paddingLeft: '68px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1 }}><div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '3px' }}>Check-In</div><div className="time-location-override" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatTime(checkIn)}</div></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '3px' }}>Check-Out</div><div className="time-location-override" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{formatTime(checkOut)}</div></div>
      </div>
      {notes && <div className="standard-note-bar"><strong>Note:</strong><span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} /></div>}
    </div>
  );
}

export function HotelCard(props: HotelCardProps) {
  if (props.displayMode === 'row') return <HotelRow {...props} />;
  if (props.displayMode === 'horizontal-card') return <HotelCardHorizontal {...props} />;
  return <HotelCardFull {...props} />;
}
