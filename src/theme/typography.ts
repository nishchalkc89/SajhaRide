/**
 * Type scale, measured off the reference screens.
 *
 * The mocks use an SF-Pro-like grotesque. We ship Inter so Android and iOS
 * render identically — SF Pro is not licensed for redistribution off-Apple.
 */

/** Font family keys registered in the root layout via expo-font. */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export type TextVariant =
  | 'display' // "SajhaRide" splash wordmark
  | 'h1' // "Welcome Back!", "Comfortable Rides"
  | 'h2' // "Select Destination", sheet titles
  | 'h3' // "Saved Places", "Ride Details"
  | 'bodyLg' // card primary line ("Balkumari, Lalitpur")
  | 'body' // onboarding subtitle, descriptions
  | 'bodySm' // helper text under a card title
  | 'label' // button text
  | 'caption' // "Save location", timestamps
  | 'overline'; // section eyebrows

export type TypeStyle = {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  letterSpacing?: number;
};

export const typography: Record<TextVariant, TypeStyle> = {
  display: { fontSize: 34, lineHeight: 40, fontFamily: fontFamily.bold, letterSpacing: -0.6 },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: fontFamily.bold, letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: fontFamily.bold, letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 22, fontFamily: fontFamily.semibold, letterSpacing: -0.2 },
  bodyLg: { fontSize: 16, lineHeight: 22, fontFamily: fontFamily.semibold },
  body: { fontSize: 14, lineHeight: 21, fontFamily: fontFamily.regular },
  bodySm: { fontSize: 13, lineHeight: 18, fontFamily: fontFamily.regular },
  label: { fontSize: 16, lineHeight: 20, fontFamily: fontFamily.semibold, letterSpacing: -0.1 },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: fontFamily.regular },
  overline: { fontSize: 11, lineHeight: 14, fontFamily: fontFamily.semibold, letterSpacing: 0.6 },
};
