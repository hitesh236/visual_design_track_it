'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { SidebarHeader } from './sidebar-header';
import { SidebarAccordion } from './sidebar-accordion';
import { AppearanceSection } from './appearance-section';
import { ContentSection } from './content-section';
import { IdentitySection } from './identity-section';
import { useUndo } from '@/hooks/use-undo';

import type { CompanyData } from '@/hooks/use-company';
import type { ExecutiveData } from '@/hooks/use-executive';
import type { Section } from '@/hooks/use-sections';
import { useTheme } from '@/context/theme-context';
import { getMoodPreset } from '@/lib/mood-presets';

// ─── Global Editor State Type (for Undo) ─────────────────────────

type EditorState = {
  moodId:       string;
  primaryColor: string;
  layout:       string;
  company:      CompanyData;
  executive:    ExecutiveData;
  sections:     Section[];
};

// ─── Component ───────────────────────────────────────────────────

type SidebarProps = {
  company:              CompanyData;
  updateField:          <K extends keyof CompanyData>(field: K, value: CompanyData[K]) => void;
  setCompany:           (data: CompanyData) => void;
  executive:            ExecutiveData;
  updateExecutiveField: <K extends keyof ExecutiveData>(field: K, value: ExecutiveData[K]) => void;
  setExecutive:         (data: ExecutiveData) => void;
  sections:             Section[];
  toggleVisibility:     (id: string) => void;
  reorderSections:      (newOrder: Section[]) => void;
  previewMode:          'desktop' | 'mobile';
  setPreviewMode:       (m: 'desktop' | 'mobile') => void;
};

export function Sidebar({
  company,
  updateField,
  setCompany,
  executive,
  updateExecutiveField,
  setExecutive,
  sections,
  toggleVisibility,
  reorderSections,
  previewMode,
  setPreviewMode,
}: SidebarProps) {
  const { activeMoodId, applyMood, layout, setLayout, theme, setTheme } = useTheme();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('appearance');

  const currentSnapshot = useMemo((): EditorState => ({
    moodId:       activeMoodId,
    primaryColor: theme.primaryColor,
    layout:       layout,
    company:      { ...company },
    executive:    { ...executive },
    sections:     [...sections],
  }), [activeMoodId, theme.primaryColor, layout, company, executive, sections]);

  // Undo setup
  const onUndoRevert = useCallback((state: EditorState) => {
    applyMood(getMoodPreset(state.moodId));
    setTimeout(() => {
       setTheme({ ...getMoodPreset(state.moodId).theme, primaryColor: state.primaryColor });
    }, 0);
    setLayout(state.layout as any);
    setCompany(state.company);
    setExecutive(state.executive);
    reorderSections(state.sections);
  }, [applyMood, setTheme, setLayout, setCompany, setExecutive, reorderSections]);

  const { push, undo, canUndo } = useUndo<EditorState>(currentSnapshot, onUndoRevert);

  // Reset to defaults
  const handleReset = useCallback(() => {
    const defaultPreset = getMoodPreset('nature');
    applyMood(defaultPreset);
    setLayout('stacked');
    // Clear any custom brand color override by applying the preset color
    setTimeout(() => {
      setTheme({ ...defaultPreset.theme });
    }, 0);
  }, [applyMood, setLayout, setTheme]);

  const [lastPushed, setLastPushed] = useState<EditorState>(currentSnapshot);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSnapshot.primaryColor !== lastPushed.primaryColor || 
          currentSnapshot.moodId !== lastPushed.moodId ||
          currentSnapshot.layout !== lastPushed.layout ||
          JSON.stringify(currentSnapshot) !== JSON.stringify(lastPushed)) {
        push(currentSnapshot);
        setLastPushed(currentSnapshot);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentSnapshot, lastPushed, push]);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-sidebar-open', (!isCollapsed).toString());
  }, [isCollapsed]);

  // ─── Scroll-to-Section Logic ────────────────────────────────────

  const scrollToSection = useCallback((id: string) => {
    // Find the element by ID
    const target = document.getElementById(id === 'top' ? 'section-company' : 'section-executive');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (activeAccordion === 'identity') {
      scrollToSection('top');
    }
  }, [activeAccordion, scrollToSection]);

  return (
    <>
      <style>{`
        .sidebar-root {
          width: 320px;
          height: 100vh;
          position: fixed;
          top: 0;
          right: 0;
          background: var(--color-surface);
          border-left: 1px solid var(--color-border);
          box-shadow: -4px 0 16px rgba(0,0,0,0.08);
          z-index: 1000;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-collapsed {
          transform: translateX(100%);
        }

        /* ── Overlay backdrop (mobile only) ── */
        .sidebar-backdrop {
          display: none;
        }
        @media (max-width: 768px) {
          .sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999;
            backdrop-filter: blur(2px);
          }
        }

        /* ── Desktop layout: push content ── */
        :root[data-sidebar-open="true"] .preview-area,
        :root[data-sidebar-open="true"] .mobile-preview-bg {
          margin-right: 320px;
        }
        /* ── Tablet/Mobile: sidebar overlays, NO margin ── */
        @media (max-width: 768px) {
          .sidebar-root {
            width: 300px;
            transform: translateX(100%);
            z-index: 1001;
          }
          .sidebar-root:not(.sidebar-collapsed) {
            transform: translateX(0);
          }
          :root[data-sidebar-open="true"] .preview-area,
          :root[data-sidebar-open="true"] .mobile-preview-bg {
            margin-right: 0 !important;
          }
        }

        .sidebar-tab {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 64px;
          background: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          z-index: 999;
          transition: all 0.3s ease;
        }


      `}</style>

      {isCollapsed && (
        <div className="sidebar-tab" onClick={() => setIsCollapsed(false)}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z"/>
          </svg>
        </div>
      )}

      {/* Mobile backdrop — tap to close */}
      {!isCollapsed && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsCollapsed(true)}
          aria-label="Close sidebar"
        />
      )}

      <div className={`sidebar-root ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <SidebarHeader 
          isCollapsed={isCollapsed} 
          onToggle={() => setIsCollapsed(prev => !prev)}
          onUndo={undo}
          canUndo={canUndo}
          onReset={handleReset}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
        />

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          <SidebarAccordion
            id="appearance"
            title="Appearance"
            isActive={activeAccordion === 'appearance'}
            onToggle={() => toggleAccordion('appearance')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            headerSuffix={`${activeMoodId.charAt(0).toUpperCase() + activeMoodId.slice(1)} · ${layout}`}
          >
             <AppearanceSection />
          </SidebarAccordion>

          <SidebarAccordion
            id="content"
            title="Content"
            isActive={activeAccordion === 'content'}
            onToggle={() => toggleAccordion('content')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            headerSuffix={`${sections.filter(s => s.isVisible).length} visible`}
          >
            <ContentSection 
              sections={sections}
              toggleVisibility={toggleVisibility}
              reorderSections={reorderSections}
            />
          </SidebarAccordion>

          <SidebarAccordion
            id="identity"
            title="Identity"
            isActive={activeAccordion === 'identity'}
            onToggle={() => toggleAccordion('identity')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            headerSuffix={company.name || 'Not configured'}
          >
            <IdentitySection 
              company={company} 
              updateField={updateField} 
              executive={executive} 
              updateExecutiveField={updateExecutiveField} 
              onFocusCompany={() => scrollToSection('top')}
              onFocusExecutive={() => scrollToSection('bottom')}
            />
          </SidebarAccordion>
        </div>
      </div>
    </>
  );
}
