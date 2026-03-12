'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────

export type ExecutiveData = {
  name:         string;
  designation:  string;
  phone:        string;
  whatsapp:     string;
  email:        string;
  message:      string;
  availability: string;
  photoUrl:     string;
};

// ─── Defaults ────────────────────────────────────────────────────

const DEFAULTS: ExecutiveData = {
  name:         'Rahul Sharma',
  designation:  'Senior Travel Consultant',
  phone:        '+91 98765 43210',
  whatsapp:     '+91 98765 43210',
  email:        'rahul.sharma@eligocs.com',
  message:      'I personally handcrafted this itinerary keeping your comfort and experience as the top priority. I am available anytime to answer your questions.',
  availability: 'Monday to Saturday, 9 AM to 7 PM IST',
  photoUrl:     '',
};

const STORAGE_KEY = 'ti:executive';

function readFromStorage(): ExecutiveData {
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

export function useExecutive() {
  const [executive, setExecutiveState] = useState<ExecutiveData>(readFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(executive));
  }, [executive]);

  const updateExecutiveField = useCallback(<K extends keyof ExecutiveData>(
    field: K,
    value: ExecutiveData[K],
  ) => {
    setExecutiveState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setExecutive = useCallback((data: ExecutiveData) => {
    setExecutiveState(data);
  }, []);

  return { executive, updateExecutiveField, setExecutive };
}
