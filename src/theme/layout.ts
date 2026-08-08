/** Spacing, radius and elevation primitives. 4pt base grid. */

import { Platform } from 'react-native';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

/** Horizontal gutter used by every full-bleed screen in the mocks. */
export const screenPadding = spacing.xl; // 20

export const radius = {
  none: 0,
  sm: 8,
  md: 12, // inputs
  lg: 14, // primary buttons
  xl: 16, // cards
  '2xl': 20,
  '3xl': 24, // bottom sheet top corners
  full: 999, // FABs, chips, pills
} as const;

export type ElevationLevel = 'none' | 'sm' | 'md' | 'lg' | 'sheet';

/**
 * Cross-platform shadows. iOS reads shadow*, Android only reads elevation.
 * React Native Web supports shadow* only for backwards compat and warns on
 * every use, wanting the CSS-native `boxShadow` string instead — so web gets
 * boxShadow and native gets shadow-prefixed props + elevation, never both on
 * the same platform.
 */
type ShadowSpec = { opacity: number; radius: number; offset: { width: number; height: number }; elevation: number };

function buildShadow({ opacity, radius, offset, elevation: androidElevation }: ShadowSpec) {
  if (Platform.OS === 'web') {
    const shadow =
      opacity === 0 ? 'none' : `${offset.width}px ${offset.height}px ${radius}px rgba(0, 0, 0, ${opacity})`;
    return { boxShadow: shadow };
  }
  return {
    shadowColor: '#000',
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: offset,
    elevation: androidElevation,
  };
}

export const elevation: Record<ElevationLevel, ReturnType<typeof buildShadow>> = {
  none: buildShadow({ opacity: 0, radius: 0, offset: { width: 0, height: 0 }, elevation: 0 }),
  /** Chips, small floating controls. */
  sm: buildShadow({ opacity: 0.06, radius: 8, offset: { width: 0, height: 2 }, elevation: 2 }),
  /** Cards resting on the canvas. */
  md: buildShadow({ opacity: 0.08, radius: 16, offset: { width: 0, height: 4 }, elevation: 4 }),
  /** Map FABs, floating location cards. */
  lg: buildShadow({ opacity: 0.1, radius: 24, offset: { width: 0, height: 8 }, elevation: 8 }),
  /** Bottom sheets — shadow casts upward. */
  sheet: buildShadow({ opacity: 0.12, radius: 28, offset: { width: 0, height: -6 }, elevation: 16 }),
};

/** Standard control heights, measured from the mocks. */
export const sizing = {
  buttonHeight: 54,
  inputHeight: 54,
  fab: 44,
  iconButton: 40,
  avatar: 48,
  sheetHandleWidth: 40,
  sheetHandleHeight: 4,
} as const;

/** Motion constants so every spring in the app feels like the same product. */
export const motion = {
  /** Default spring for entrances and sheet snaps. */
  spring: { damping: 18, stiffness: 180, mass: 1 } as const,
  /** Snappier spring for press feedback. */
  springFast: { damping: 22, stiffness: 320, mass: 0.7 } as const,
  duration: { fast: 150, base: 250, slow: 400, splash: 2200 } as const,
  /** Scale applied to a pressed button. */
  pressScale: 0.97,
} as const;
