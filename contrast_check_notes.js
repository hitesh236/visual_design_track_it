
const MOOD_PRESETS = [
  {
    id: 'nature',
    theme: {
      primaryColor:    '#437051',
      backgroundColor: '#faf7f2',
      surfaceColor:    '#ffffff',
      colorMode:       'light',
    },
  },
  {
    id: 'luxury',
    theme: {
      primaryColor:    '#C9A84C',
      backgroundColor: '#1a1a2e',
      surfaceColor:    '#16213e',
      colorMode:       'dark',
    },
  },
  {
    id: 'adventure',
    theme: {
      primaryColor:    '#B04402',
      backgroundColor: '#f5f0eb',
      surfaceColor:    '#ffffff',
      colorMode:       'light',
    },
  },
  {
    id: 'modern',
    theme: {
      primaryColor:    '#2563EB',
      backgroundColor: '#ffffff',
      surfaceColor:    '#f8fafc',
      colorMode:       'light',
    },
  },
  {
    id: 'spiritual',
    theme: {
      primaryColor:    '#7B5EA7',
      backgroundColor: '#f3f0f7',
      surfaceColor:    'rgba(255,255,255,0.6)',
      colorMode:       'light',
    },
  },
];

function hexToHsl(hex) {
  if (hex.startsWith('rgba')) {
      hex = '#faf9fb';
  }
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const val = Math.round(255 * color);
    return val.toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getLuminance(hex) {
  const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(rgb.slice(0, 2), 16) / 255;
  const g = parseInt(rgb.slice(2, 4), 16) / 255;
  const b = parseInt(rgb.slice(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function resolveThemeToCSSVars(theme) {
  const [h, s, l] = hexToHsl(theme.primaryColor);
  const isDark = theme.colorMode === 'dark';

  const surface = theme.surfaceColor.startsWith('rgba') 
    ? '#faf9fb' 
    : theme.surfaceColor;

  return {
    primary: theme.primaryColor,
    bg: theme.backgroundColor,
    surface: surface,
    text: isDark ? '#f1f1f1' : '#1a1a1a',
    
    // Note variables (the ones we just added)
    noteBg: isDark ? hslToHex(h, 10, 20) : hslToHex(h, 25, 96),
    noteText: isDark ? '#f1f1f1' : hslToHex(h, 20, 25),
    noteAccent: isDark ? hslToHex(h, s, Math.max(l, 60)) : hslToHex(h, s, Math.min(l, 40)),
  };
}

const combinations = [
  { fg: 'noteText', bg: 'noteBg', label: 'Note Text on Note BG' },
  { fg: 'noteAccent', bg: 'noteBg', label: 'Note Accent (Label/Bold) on Note BG' },
];

let result = 'NOTE CONTRAST VERIFICATION REPORT:\n';

MOOD_PRESETS.forEach(mood => {
  const vars = resolveThemeToCSSVars(mood.theme);
  result += `\nMood: ${mood.id.toUpperCase()}\n`;
  combinations.forEach(combo => {
    const fgColor = vars[combo.fg];
    const bgColor = vars[combo.bg];
    const ratio = getContrast(fgColor, bgColor);
    const pass = ratio >= 4.5 ? 'PASS' : 'FAIL';
    result += ` - ${combo.label.padEnd(45)}: ${fgColor} on ${bgColor} -> ${ratio.toFixed(2)}:1 [${pass}]\n`;
  });
});

console.log(result);
require('fs').writeFileSync('contrast_report_notes.txt', result);
