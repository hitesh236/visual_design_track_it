'use client';

import { useRef } from 'react';
import type { ExecutiveData } from '@/hooks/use-executive';

// ─── Shared styles ───────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize:      '10px',
  fontWeight:    600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color:         'var(--color-text-muted)',
  fontFamily:    'var(--font-body)',
  marginBottom:  '2px',
  display:       'block',
};

const inputStyle: React.CSSProperties = {
  width:           '100%',
  padding:         '6px 9px',
  borderRadius:    'var(--radius-badge)',
  border:          '1.5px solid var(--color-border)',
  backgroundColor: 'var(--color-bg)',
  color:           'var(--color-text)',
  fontFamily:      'var(--font-body)',
  fontSize:        '12px',
  outline:         'none',
  transition:      'border-color 0.2s ease',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize:      'vertical',
  minHeight:   '50px',
};

// ─── Component ───────────────────────────────────────────────────

type ExecutiveEditorProps = {
  executive:             ExecutiveData;
  updateExecutiveField: <K extends keyof ExecutiveData>(field: K, value: ExecutiveData[K]) => void;
};

export function ExecutiveEditor({ executive, updateExecutiveField }: ExecutiveEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    updateExecutiveField('photoUrl', url);
  }

  function clearPhoto() {
    updateExecutiveField('photoUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        width:         '100%',
      }}
    >
      {/* ── Photo ── */}
      <div>
        <span style={labelStyle}>Profile Photo</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {executive.photoUrl && (
            <img
              src={executive.photoUrl}
              alt="Photo"
              style={{
                width:        '36px',
                height:       '36px',
                objectFit:    'cover',
                borderRadius: '50%',
                border:       '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                padding:      '2px',
              }}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
            id="executive-photo-upload"
          />
          <label
            htmlFor="executive-photo-upload"
            style={{
              padding:         '5px 12px',
              borderRadius:    'var(--radius-pill)',
              backgroundColor: 'var(--color-primary)',
              color:           'var(--color-text-on-primary)',
              fontSize:        '11px',
              fontWeight:      600,
              fontFamily:      'var(--font-body)',
              cursor:          'pointer',
              transition:      'opacity 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {executive.photoUrl ? 'Change' : 'Upload Photo'}
          </label>

          {executive.photoUrl && (
            <button
              type="button"
              onClick={clearPhoto}
              style={{
                padding:         '5px 10px',
                borderRadius:    'var(--radius-pill)',
                backgroundColor: 'transparent',
                color:           'var(--color-text-muted)',
                fontSize:        '11px',
                fontFamily:      'var(--font-body)',
                border:          '1px solid var(--color-border)',
                cursor:          'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* ── Name & Designation ── */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ flex: 1.2 }}>
          <span style={labelStyle}>Name</span>
          <input
            type="text"
            value={executive.name}
            onChange={e => updateExecutiveField('name', e.target.value)}
            placeholder="Executive Name"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Designation</span>
          <input
            type="text"
            value={executive.designation}
            onChange={e => updateExecutiveField('designation', e.target.value)}
            placeholder="Job Title"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Phone & WhatsApp ── */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Phone</span>
          <input
            type="text"
            value={executive.phone}
            onChange={e => updateExecutiveField('phone', e.target.value)}
            placeholder="+91 ..."
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>WhatsApp</span>
          <input
            type="text"
            value={executive.whatsapp}
            onChange={e => updateExecutiveField('whatsapp', e.target.value)}
            placeholder="+91 ..."
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Email ── */}
      <div>
        <span style={labelStyle}>Email</span>
        <input
          type="text"
          value={executive.email}
          onChange={e => updateExecutiveField('email', e.target.value)}
          placeholder="email@example.com"
          style={inputStyle}
        />
      </div>

      {/* ── Personal Message ── */}
      <div>
        <span style={labelStyle}>Personal Message</span>
        <textarea
          value={executive.message}
          onChange={e => updateExecutiveField('message', e.target.value)}
          placeholder="I handcrafted this itinerary for you..."
          style={textareaStyle}
        />
      </div>

      {/* ── Availability ── */}
      <div>
        <span style={labelStyle}>Availability</span>
        <input
          type="text"
          value={executive.availability}
          onChange={e => updateExecutiveField('availability', e.target.value)}
          placeholder="Mon-Sat, 9AM-7PM IST"
          style={inputStyle}
        />
      </div>

      <p
        style={{
          fontSize:   '10px',
          color:      'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
          margin:     '2px 0 0 0',
          lineHeight: 1.4,
          fontStyle:  'italic',
        }}
      >
        Clear executive name to hide this section from the itinerary.
      </p>
    </div>
  );
}
