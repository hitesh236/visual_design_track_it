'use client';

import { useState, useCallback } from 'react';
import COMPANY_INFO from '@/data/companyinfo.json';

// ─── Types ───────────────────────────────────────────────────────

export type CompanyData = {
  name:    string;
  address: string;
  phone:   string;
  email:   string;
  website: string;
  logoUrl: string;
};

// ─── Seed from companyinfo.json ──────────────────────────────────

function seedFromJson(): CompanyData {
  try {
    const branch = (COMPANY_INFO as any).data?.data?.[0];
    if (!branch) throw new Error('No branch data');

    // The `data` field is a stringified JSON containing extra info
    let extra: any = {};
    try { extra = JSON.parse(branch.data ?? '{}').extra ?? {}; } catch { /* ignore */ }

    const name    = branch.name ?? extra.name ?? '';
    const address = (extra.address ?? branch.address ?? '').replace(/\r\n/g, ', ');
    const email   = branch.email ?? (extra.emails?.[0] ?? '');
    const phone   = extra.phones?.[0] ?? '';
    const website = '';
    const logoUrl = branch.logo?.medium_url ?? extra.logoUrl ?? '';

    return { name, address, phone, email, website, logoUrl };
  } catch {
    return { name: '', address: '', phone: '', email: '', website: '', logoUrl: '' };
  }
}

// ─── Hook ────────────────────────────────────────────────────────

export function useCompany() {
  // Always starts fresh from companyinfo.json — no localStorage
  const [company, setCompanyState] = useState<CompanyData>(seedFromJson);

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

