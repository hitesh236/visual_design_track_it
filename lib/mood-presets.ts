import type { MoodPreset } from '@/types/itinerary-theme';

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'nature',
    label: 'Nature',
    theme: {
      primaryColor:    '#4A7C59',
      logoUrl:         null,
      backgroundColor: '#faf7f2',
      surfaceColor:    '#ffffff',
      colorMode:       'light',
      headingFont:     'Merriweather',
      bodyFont:        'Open Sans',
      cardRadius:      12,
      sectionSpacing:  'comfortable',
    },
  },
  {
    id: 'luxury',
    label: 'Luxury',
    theme: {
      primaryColor:    '#C9A84C',
      logoUrl:         null,
      backgroundColor: '#1a1a2e',
      surfaceColor:    '#16213e',
      colorMode:       'dark',
      headingFont:     'Cormorant Garamond',
      bodyFont:        'DM Sans',
      cardRadius:      4,
      sectionSpacing:  'spacious',
    },
  },
  {
    id: 'adventure',
    label: 'Adventure',
    theme: {
      primaryColor:    '#E85D04',
      logoUrl:         null,
      backgroundColor: '#f5f0eb',
      surfaceColor:    '#ffffff',
      colorMode:       'light',
      headingFont:     'Montserrat',
      bodyFont:        'Lato',
      cardRadius:      4,
      sectionSpacing:  'comfortable',
    },
  },
  {
    id: 'modern',
    label: 'Modern',
    theme: {
      primaryColor:    '#2563EB',
      logoUrl:         null,
      backgroundColor: '#ffffff',
      surfaceColor:    '#f8fafc',
      colorMode:       'light',
      headingFont:     'Inter',
      bodyFont:        'Inter',
      cardRadius:      6,
      sectionSpacing:  'compact',
    },
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    theme: {
      primaryColor:    '#7B5EA7',
      logoUrl:         null,
      backgroundColor: '#f3f0f7',
      surfaceColor:    'rgba(255,255,255,0.6)',
      colorMode:       'light',
      headingFont:     'Playfair Display',
      bodyFont:        'Nunito',
      cardRadius:      20,
      sectionSpacing:  'spacious',
    },
  },
];

// Helper — get a preset by id, fallback to nature
export function getMoodPreset(id: string): MoodPreset {
  return MOOD_PRESETS.find(p => p.id === id) ?? MOOD_PRESETS[0];
}
