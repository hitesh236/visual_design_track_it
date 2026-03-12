'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────

export type CompanyData = {
  name:    string;
  address: string;
  phone:   string;
  email:   string;
  website: string;
  logoUrl: string;
};

// ─── Defaults ────────────────────────────────────────────────────

const DEFAULTS: CompanyData = {
  name:    'Eligocs Travels',
  address: '123 Connaught Place, New Delhi, Delhi 110001, India',
  phone:   '+91 98100 00000',
  email:   'hello@eligocs.com',
  website: 'www.eligocs.com',
  logoUrl: '',
};

const STORAGE_KEY = 'ti:company';

// ─── Hook ────────────────────────────────────────────────────────

export function useCompany() {
  const [company, setCompanyState] = useState<CompanyData>(DEFAULTS);

  // Load from localStorage only after mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCompanyState({ ...DEFAULTS, ...parsed });
      } catch (e) {
        console.warn('Failed to parse company data from storage', e);
      }
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(company));
  }, [company]);

  const updateField = useCallback(<K extends keyof CompanyData>(
    field: K,
    value: CompanyData[K],
  ) => {
    setCompanyState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setCompany = useCallback((data: CompanyData) => {
    setCompanyState(data);
  }, []);

  return { company, updateField, setCompany };
}
