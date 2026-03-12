export type LayoutPreset = 'stacked' | 'timeline' | 'compact' | 'mini-compact';

export type ItineraryTheme = {
  primaryColor: string;
  logoUrl: string | null;
  backgroundColor: string;
  surfaceColor: string;
  colorMode: 'light' | 'dark';
  sectionSpacing: 'compact' | 'comfortable' | 'spacious';
  headingFont: string;
  bodyFont: string;
  cardRadius: number;
};

export type MoodPreset = {
  id: string;
  label: string;
  theme: ItineraryTheme;
};
