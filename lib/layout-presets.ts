import type { LayoutPreset } from '@/types/itinerary-theme';

// ─── Layout Config Shape ─────────────────────────────────────────
// Each layout preset defines HOW day cards and components
// are arranged — not how they look. Styling is always from theme tokens.

export type LayoutConfig = {
  id: LayoutPreset;
  label: string;
  description: string;

  // Day card arrangement
  dayCard: {
    direction: 'column' | 'row';       // column = stacked, row = split
    showImages: boolean;                // compact hides all images
    showDescriptions: boolean;          // compact hides long text
    componentColumns: 1 | 2;           // 2 = two-column grid inside day card
  };

  // Timeline connector
  timeline: {
    show: boolean;                      // compact hides the vertical line
    style: 'line' | 'dotted' | 'none';
  };

  // Component cards inside each day
  componentDisplay: {
    hotel: 'card' | 'row';             // card = image + details, row = single line
    activity: 'card' | 'row';
    transport: 'row';                   // always a row, never a card
    flight: 'boarding-pass' | 'row';   // compact uses simple row
    note: 'box' | 'inline';            // inline = no background box
  };
};

// ─── 3 Layout Presets ────────────────────────────────────────────

export const LAYOUT_PRESETS: LayoutConfig[] = [
  {
    id: 'stacked',
    label: 'Stacked',
    description: 'Full detail, top to bottom. Best for travelers.',
    dayCard: {
      direction:          'column',
      showImages:         true,
      showDescriptions:   true,
      componentColumns:   1,
    },
    timeline: {
      show:  true,
      style: 'line',
    },
    componentDisplay: {
      hotel:     'card',
      activity:  'card',
      transport: 'row',
      flight:    'boarding-pass',
      note:      'box',
    },
  },
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Perfect for print. 3 columns with a continuous timeline.',
    dayCard: {
      direction:          'column',
      showImages:         true,
      showDescriptions:   true,
      componentColumns:   1,
    },
    timeline: {
      show:  false, // We will build a custom internal timeline line per day for this layout
      style: 'none',
    },
    componentDisplay: {
      hotel:     'card',
      activity:  'card',
      transport: 'row',
      flight:    'boarding-pass',
      note:      'box',
    },
  },
  {
    id: 'compact',
    label: 'Compact',
    description: 'No images, maximum density. Best for agents.',
    dayCard: {
      direction:          'column',
      showImages:         false,
      showDescriptions:   false,
      componentColumns:   2,
    },
    timeline: {
      show:  false,
      style: 'none',
    },
    componentDisplay: {
      hotel:     'row',
      activity:  'row',
      transport: 'row',
      flight:    'row',
      note:      'inline',
    },
  },
];

// Helper — get layout config by id, fallback to stacked
export function getLayoutConfig(id: LayoutPreset): LayoutConfig {
  return LAYOUT_PRESETS.find(p => p.id === id) ?? LAYOUT_PRESETS[0];
}
