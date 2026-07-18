/** Spacing, radius and elevation primitives. 4pt base grid. */

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
 * Cross-platform shadows. iOS reads shadow*, Android only reads elevation, so
 * both are always specified together.
 */
export const elevation: Record<
  ElevationLevel,
  {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  }
> = {
  none: {
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  /** Chips, small floating controls. */
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  /** Cards resting on the canvas. */
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  /** Map FABs, floating location cards. */
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  /** Bottom sheets — shadow casts upward. */
  sheet: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
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
