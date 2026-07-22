import { THREAT_THRESHOLDS, THREAT_COLORS } from './constants';

/**
 * Calculate threat color based on threat index
 * Safe (White) -> Suspicious (Amber/Yellow) -> Critical (Red)
 */
export function getThreatColor(threatIndex: number): string {
  const clamped = Math.max(0, Math.min(1, threatIndex));

  if (clamped < THREAT_THRESHOLDS.SAFE) {
    return 'hsl(0, 0%, 90%)'; // Pure White / Light Neutral
  }
  if (clamped < THREAT_THRESHOLDS.SUSPICIOUS) {
    return 'hsl(38, 92%, 50%)'; // Amber / Yellow
  }
  return 'hsl(0, 84%, 60%)'; // Critical Red
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Interpolate between two HSL colors
 */
function interpolateHSL(color1: HSLColor, color2: HSLColor, t: number): string {
  // Interpolate hue with shortest path
  let h1 = color1.h;
  let h2 = color2.h;
  
  // Handle hue wrapping (shortest path)
  if (Math.abs(h2 - h1) > 180) {
    if (h1 > h2) {
      h1 -= 360;
    } else {
      h2 -= 360;
    }
  }

  const h = h1 + (h2 - h1) * t;
  const s = color1.s + (color2.s - color1.s) * t;
  const l = color1.l + (color2.l - color1.l) * t;

  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/**
 * Get threat level category for UI labels
 */
export function getThreatLevel(threatIndex: number): 'SAFE' | 'SUSPICIOUS' | 'CRITICAL' {
  if (threatIndex < THREAT_THRESHOLDS.SAFE) return 'SAFE';
  if (threatIndex < THREAT_THRESHOLDS.SUSPICIOUS) return 'SUSPICIOUS';
  return 'CRITICAL';
}

/**
 * Format threat index as percentage
 */
export function formatThreatPercentage(threatIndex: number): string {
  return `${Math.round(threatIndex * 100)}%`;
}

/**
 * Get shadow style based on threat level
 */
export function getThreatShadow(threatIndex: number): string {
  const color = getThreatColor(threatIndex);
  const level = getThreatLevel(threatIndex);

  if (level === 'CRITICAL') {
    return `0 0 20px ${color}, 0 0 40px ${color}`;
  } else if (level === 'SUSPICIOUS') {
    return `0 0 12px ${color}`;
  }
  return `0 0 8px ${color}`;
}

/**
 * Convert HSL to RGB for canvas operations
 */
export function hslToRgb(hsl: string): [number, number, number] {
  // Parse hsl(h, s%, l%)
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return [255, 255, 255];

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
}
