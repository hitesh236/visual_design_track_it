'use client';

type SidebarHeaderProps = {
  isCollapsed:      boolean;
  onToggle:         () => void;
  onUndo:           () => void;
  canUndo:          boolean;
  onReset:          () => void;
  onSettingsToggle: () => void;
  previewMode:      'desktop' | 'mobile';
  setPreviewMode:   (mode: 'desktop' | 'mobile') => void;
};

export function SidebarHeader({
  isCollapsed,
  onToggle,
  onUndo,
  canUndo,
  onReset,
  onSettingsToggle,
  previewMode = 'desktop',
  setPreviewMode,
}: SidebarHeaderProps) {
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '12px 12px 10px 12px',
        borderBottom:    '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position:        'sticky',
        top:             0,
        zIndex:          10,
        flexShrink:      0,
      }}
    >
      {/* Middle: Device Preview Switcher (Now at the start) */}
      <div
        style={{
          display:         'flex',
          padding:         '2px',
          backgroundColor: 'var(--color-bg)',
          borderRadius:    '6px',
          gap:             '1px',
        }}
      >
        <button
          onClick={() => setPreviewMode('desktop')}
          title="Desktop Preview"
          style={{
            padding:         '4px 6px',
            borderRadius:    '4px',
            border:          'none',
            backgroundColor: previewMode === 'desktop' ? 'var(--color-surface)' : 'transparent',
            color:           previewMode === 'desktop' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s',
            boxShadow:       previewMode === 'desktop' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="13" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
            <path d="M5 7h1M5 10h1"/>
          </svg>
        </button>
        <button
          onClick={() => setPreviewMode('mobile')}
          title="Mobile Preview"
          style={{
            padding:         '4px 6px',
            borderRadius:    '4px',
            border:          'none',
            backgroundColor: previewMode === 'mobile' ? 'var(--color-surface)' : 'transparent',
            color:           previewMode === 'mobile' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s',
            boxShadow:       previewMode === 'mobile' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <svg width="13" height="15" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="16" height="22" rx="3"/>
            <circle cx="9" cy="3.5" r="0.8" fill="currentColor"/>
            <line x1="6" y1="20.5" x2="12" y2="20.5" strokeWidth="2.5"/>
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last action"
          style={{
            padding:         '6px',
            borderRadius:    '6px',
            border:          'none',
            backgroundColor: 'transparent',
            color:           canUndo ? 'var(--color-text)' : 'var(--color-text-muted)',
            cursor:          canUndo ? 'pointer' : 'default',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s ease',
            opacity:         canUndo ? 1 : 0.5,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H6" />
            <polyline points="7 3 3 7 7 11" />
          </svg>
        </button>

        <button
          onClick={onReset}
          title="Reset to default layout & theme"
          style={{
            padding:         '6px',
            borderRadius:    '6px',
            border:          'none',
            backgroundColor: 'transparent',
            color:           'var(--color-text-muted)',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s ease',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Settings button */}
        <button
          onClick={onSettingsToggle}
          title="Advanced Settings"
          style={{
            padding:         '6px',
            borderRadius:    '6px',
            border:          'none',
            backgroundColor: 'transparent',
            color:           'var(--color-text)',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s ease',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <button
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            padding:         '6px',
            borderRadius:    '6px',
            border:          'none',
            backgroundColor: 'transparent',
            color:           'var(--color-text)',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            transition:      'all 0.2s ease',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform:  isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
            <path d="M14 9l3 3-3 3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
