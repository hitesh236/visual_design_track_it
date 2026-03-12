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

function readFromStorage(): CompanyData {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

// ─── Hook ────────────────────────────────────────────────────────

export function useCompany() {
  const [company, setCompanyState] = useState<CompanyData>(readFromStorage);

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
