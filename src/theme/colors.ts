/**
 * SajhaRide colour tokens.
 *
 * Every value here was sampled from the reference screenshots. The palette is
 * deliberately small: one brand hue (amber), a neutral ramp, and four semantic
 * accents. Screens must never hardcode a hex — always go through `useTheme()`
 * or the Tailwind tokens generated from this file.
 */

/** Raw brand ramp. Amber is the single hue that carries SajhaRide's identity. */
export const palette = {
  // --- Brand (splash background, primary buttons, active pagination dot) ---
  amber50: '#FFF8E7',
  amber100: '#FFEFC2',
  amber200: '#FFE28A',
  amber300: '#FFD54F',
  amber400: '#FFCA28',
  /** Primary. Splash canvas + every primary CTA. */
  amber500: '#FFC107',
  amber600: '#F0B000',
  amber700: '#C79100',

  // --- Neutrals (text, borders, surfaces) ---
  white: '#FFFFFF',
  grey50: '#F7F7F8',
  grey100: '#F1F1F3',
  grey200: '#E5E5E7',
  grey300: '#D1D1D6',
  grey400: '#AEAEB2',
  grey500: '#8A8A8E',
  grey600: '#636366',
  grey700: '#3A3A3C',
  grey800: '#1F1F21',
  grey900: '#111113',
  black: '#000000',

  // --- Semantic accents ---
  /** Pickup dot, success tick, "arrived" state. */
  green500: '#34A853',
  green50: '#E9F6EC',
  /** Destination pin, Clear All, Cancel Ride, Emergency. */
  red500: '#E53935',
  red50: '#FDECEA',
  /** User location dot, Invite-friends banner. */
  blue500: '#1A73E8',
  blue50: '#EAF2FE',
} as const;

/** Semantic surface for a theme. Screens consume these names, not the ramp. */
export type ThemeColors = {
  /** Brand amber — primary CTA fill, active states. */
  primary: string;
  /** Pressed/darker amber. */
  primaryPressed: string;
  /** Text/icon colour that sits on `primary`. Amber needs black, not white. */
  onPrimary: string;
  /** Tinted amber wash — Safety First card. */
  primarySubtle: string;

  /** App canvas behind cards. */
  background: string;
  /** Card / sheet fill. */
  surface: string;
  /** Inset fill: search fields, chip backgrounds. */
  surfaceMuted: string;
  /** Hairline dividers and input borders. */
  border: string;

  /** Headings. */
  text: string;
  /** Body copy, subtitles. */
  textSecondary: string;
  /** Placeholders, captions, disabled. */
  textTertiary: string;

  success: string;
  successSubtle: string;
  danger: string;
  dangerSubtle: string;
  info: string;
  infoSubtle: string;

  /** Scrim behind modals and permission dialogs. */
  scrim: string;
};

export const lightColors: ThemeColors = {
  primary: palette.amber500,
  primaryPressed: palette.amber600,
  onPrimary: palette.grey900,
  primarySubtle: palette.amber50,

  background: palette.grey50,
  surface: palette.white,
  surfaceMuted: palette.grey100,
  border: palette.grey200,

  text: palette.grey900,
  textSecondary: palette.grey600,
  textTertiary: palette.grey500,

  success: palette.green500,
  successSubtle: palette.green50,
  danger: palette.red500,
  dangerSubtle: palette.red50,
  info: palette.blue500,
  infoSubtle: palette.blue50,

  scrim: 'rgba(0,0,0,0.45)',
};

export const darkColors: ThemeColors = {
  // Amber stays the brand anchor in dark mode; only its surroundings invert.
  primary: palette.amber500,
  primaryPressed: palette.amber600,
  onPrimary: palette.grey900,
  primarySubtle: 'rgba(255,193,7,0.12)',

  background: palette.black,
  surface: palette.grey800,
  surfaceMuted: palette.grey700,
  border: 'rgba(255,255,255,0.12)',

  text: palette.white,
  textSecondary: palette.grey400,
  textTertiary: palette.grey500,

  success: palette.green500,
  successSubtle: 'rgba(52,168,83,0.16)',
  danger: palette.red500,
  dangerSubtle: 'rgba(229,57,53,0.16)',
  info: palette.blue500,
  infoSubtle: 'rgba(26,115,232,0.16)',

  scrim: 'rgba(0,0,0,0.6)',
};
