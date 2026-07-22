'use client';

import { useMemo } from 'react';
import { getThreatColor, getThreatLevel, getThreatShadow } from '@/lib/colors';
import { THREAT_COLORS, THEME } from '@/lib/constants';

/**
 * Hook for dynamic threat-based color theming
 */
export function useThemeColors(threatIndex: number) {
  return useMemo(
    () => ({
      threatColor: getThreatColor(threatIndex),
      threatLevel: getThreatLevel(threatIndex),
      threatShadow: getThreatShadow(threatIndex),
      
      // UI theme colors
      background: THEME.BG_DEEP,
      card: THEME.BG_CARD,
      border: THEME.BORDER,
      textPrimary: THEME.TEXT_PRIMARY,
      textSecondary: THEME.TEXT_SECONDARY,
      
      // Semantic colors
      success: THREAT_COLORS.SAFE,
      warning: THREAT_COLORS.WARNING,
      critical: THREAT_COLORS.CRITICAL,
    }),
    [threatIndex]
  );
}
