'use client';

import { useState } from 'react';
import { type Section } from '@/hooks/use-sections';
import { SidebarTooltip } from './sidebar-tooltip';

type ContentSectionProps = {
  sections:         Section[];
  toggleVisibility: (id: string) => void;
  reorderSections:  (newOrder: Section[]) => void;
};

export function ContentSection({
  sections,
  toggleVisibility,
  reorderSections,
}: ContentSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const visibleCount = sections.filter(s => s.isVisible).length;
  const totalCount = sections.length;

  // ─── Drag & Drop Handlers ───────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Standard effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Transparent image to let us handle the ghost ourselves if needed, 
    // but default ghost is fine for now as per "ghost of the dragged row follows the cursor".
    // Browser does this automatically for draggable elements.
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newSections = [...sections];
    const item = newSections.splice(draggedIndex, 1)[0];
    newSections.splice(index, 0, item);

    reorderSections(newSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          fontSize:   '11px',
          fontWeight: 700,
          color:      'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom:  '4px',
          display:       'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Itinerary Sections</span>
        <span style={{ color: 'var(--color-text-muted)' }}>{visibleCount} / {totalCount} visible</span>
      </div>

      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '6px',
          position:      'relative',
        }}
      >
        {sections.map((s, idx) => {
          const isDragging = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx;

          return (
            <div key={s.id} style={{ position: 'relative' }}>
              {/* Drop target line (above) */}
              {isDragOver && draggedIndex !== idx && (
                <div
                  style={{
                    position:   'absolute',
                    top:        '-4px',
                    left:       0,
                    right:      0,
                    height:     '2px',
                    backgroundColor: 'var(--color-primary)',
                    zIndex:     10,
                    borderRadius: '2px',
                  }}
                />
              )}

              <div
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '10px',
                  padding:         '10px 12px',
                  borderRadius:    '8px',
                  backgroundColor: 'var(--color-surface)',
                  border:          '1px solid var(--color-border)',
                  opacity:         isDragging ? 0.4 : (s.isVisible ? 1 : 0.45),
                  transition:      'all 0.15s ease',
                  cursor:          'default',
                  position:        'relative',
                  boxShadow:       isDragging ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                {/* Grip Handle: 2x3 Grid */}
                <div
                  style={{
                    display:             'grid',
                    gridTemplateColumns: 'repeat(2, 3px)',
                    gridTemplateRows:    'repeat(3, 3px)',
                    gap:                 '3px',
                    color:               'var(--color-text-muted)',
                    cursor:              'grab',
                    padding:             '4px 0',
                    flexShrink:          0,
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width:           '3px',
                        height:          '3px',
                        borderRadius:    '50%',
                        backgroundColor: 'currentColor',
                      }}
                    />
                  ))}
                </div>

                {/* Name */}
                <span
                  style={{
                    fontSize:       '13px',
                    fontWeight:     600,
                    color:          'var(--color-text)',
                    flex:           1,
                    textDecoration: s.isVisible ? 'none' : 'line-through',
                    fontFamily:     'var(--font-body)',
                    userSelect:     'none',
                  }}
                >
                  {s.label}
                </span>

                {/* Toggle Visibility */}
                <SidebarTooltip text={s.isVisible ? 'Hide Section' : 'Show Section'}>
                  <button
                    onClick={() => toggleVisibility(s.id)}
                    style={{
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      padding:         '6px',
                      border:          'none',
                      backgroundColor: 'transparent',
                      color:           s.isVisible ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      cursor:          'pointer',
                      borderRadius:    '4px',
                      transition:      'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {s.isVisible ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </SidebarTooltip>
              </div>
            </div>
          );
        })}
      </div>

      <p
        style={{
          fontSize:  '11px',
          color:     'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '6px',
          textAlign: 'center',
          opacity:   0.8,
        }}
      >
        Grab handles to reorder sections. All sections are unlocked.
      </p>
    </div>
  );
}
