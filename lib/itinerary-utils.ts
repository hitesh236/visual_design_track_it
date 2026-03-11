import type { Itinerary } from '@/lib/itinerary-data';

// ─── Date helpers ─────────────────────────────────────────────────

export function formatDate(iso: string): string {
  if (!iso) return 'NA';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateYY(iso: string): string {
  if (!iso) return 'NA';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

// ─── Derive correct start + end dates from component metadata ─────
// tour_start_date and tour_end_date from the API are unreliable.
// The source of truth is metadata.day_date on the components.

export function deriveStartDate(components: any[]): string {
  const dates = components
    .map(c => c?.metadata?.day_date)
    .filter(Boolean)
    .sort();
  return dates[0] ?? '';
}

export function deriveEndDate(components: any[]): string {
  const dates = components
    .map(c => c?.metadata?.day_date)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1] ?? '';
}

// ─── Traveler count ───────────────────────────────────────────────

export function formatTravelers(
  adults: number,
  children: number,
  minors: number
): string {
  const parts = [];
  if (adults) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
  if (children) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
  if (minors) parts.push(`${minors} Minor${minors > 1 ? 's' : ''}`);
  return parts.join(' · ');
}

// ─── Duration label ───────────────────────────────────────────────

export function formatDuration(
  startIso: string,
  endIso: string
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const days = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const nights = days - 1;
  return `${days}D/${nights}N`;
}

// ─── Price formatter ──────────────────────────────────────────────

export function formatINR(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
