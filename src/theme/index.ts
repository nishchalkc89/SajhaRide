/**
 * Theme entry point + context.
 *
 * `useTheme()` is the only sanctioned way for a component to read design
 * tokens. It reacts to the OS colour scheme and to an explicit user override
 * persisted in MMKV.
 */

import { createContext, useContext } from 'react';

import { darkColors, lightColors, palette, type ThemeColors } from './colors';
import { elevation, motion, radius, screenPadding, sizing, spacing } from './layout';
import { fontFamily, typography } from './typography';

export * from './colors';
export * from './layout';
export * from './motion-utils';
export * from './typography';
export * from './web-styles';

export type ColorSchemeName = 'light' | 'dark';

export type Theme = {
  scheme: ColorSchemeName;
  colors: ThemeColors;
  spacing: typeof spacing;
  screenPadding: typeof screenPadding;
  radius: typeof radius;
  elevation: typeof elevation;
  sizing: typeof sizing;
  motion: typeof motion;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  palette: typeof palette;
};

const base = {
  spacing,
  screenPadding,
  radius,
  elevation,
  sizing,
  motion,
  typography,
  fontFamily,
  palette,
};

export const lightTheme: Theme = { scheme: 'light', colors: lightColors, ...base };
export const darkTheme: Theme = { scheme: 'dark', colors: darkColors, ...base };

export const ThemeContext = createContext<Theme>(lightTheme);

/** Read the active theme. Throws nothing — defaults to light outside a provider. */
export const useTheme = (): Theme => useContext(ThemeContext);
