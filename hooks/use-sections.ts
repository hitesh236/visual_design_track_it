'use client';

import { useState, useEffect, useCallback } from 'react';

export type Section = {
  id:         string;
  label:      string;
  isVisible:  boolean;
};

const DEFAULT_SECTIONS: Section[] = [
  { id: 'company',         label: 'Company Branding',           isVisible: true },
  { id: 'hero',            label: 'Hero',                        isVisible: true },
  { id: 'greeting',        label: 'Greeting',                    isVisible: true },
  { id: 'days',            label: 'Day by Day Itinerary',        isVisible: true },
  { id: 'pricing',         label: 'Pricing Breakdown',           isVisible: true },
  { id: 'info_inclusions', label: 'Inclusions',                  isVisible: true },
  { id: 'info_exclusions', label: 'Exclusions',                  isVisible: true },
  { id: 'info_terms',      label: 'Terms and Conditions',        isVisible: true },
  { id: 'info_refund',     label: 'Refund and Cancellation Policy', isVisible: true },
  { id: 'info_payment',    label: 'Payment Policy',              isVisible: true },
  { id: 'info_amendment',  label: 'Amendment Policy',            isVisible: true },
  { id: 'info_why',        label: 'Why Choose Us',               isVisible: true },
  { id: 'executive',       label: 'Sales Executive',             isVisible: true },
];

const STORAGE_KEY = 'ti:sections';

export function useSections() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Section[];
      
      // Merge logic:
      // 1. Keep order from 'parsed'
      // 2. Filter out any that no longer exist in DEFAULT_SECTIONS
      // 3. Add any that are in DEFAULT_SECTIONS but NOT in parsed
      
      const merged = parsed
        .map(p => {
          const def = DEFAULT_SECTIONS.find(d => d.id === p.id);
          if (def) return { ...def, isVisible: p.isVisible };
          return null;
        })
        .filter((s): s is Section => !!s);

      const missing = DEFAULT_SECTIONS.filter(d => !merged.find(m => m.id === d.id));
      
      setSections([...merged, ...missing]);
    } catch (e) {
      console.warn('Failed to parse sections from storage', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  const toggleVisibility = useCallback((id: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) return { ...s, isVisible: !s.isVisible };
      return s;
    }));
  }, []);

  const reorder = useCallback((newOrder: Section[]) => {
    setSections(newOrder);
  }, []);

  return { sections, toggleVisibility, reorder };
}
