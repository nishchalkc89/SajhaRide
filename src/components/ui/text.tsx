/**
 * Typed text primitive. Enforces the type scale — screens pick a `variant`
 * rather than passing raw fontSize/fontWeight.
 */

import { useMemo } from 'react';
import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TextVariant } from '@/theme';

/** Semantic colour slots a caller may choose; maps onto ThemeColors. */
type TextTone = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'onPrimary' | 'success' | 'danger';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Horizontal alignment. Defaults to the platform's natural start edge. */
  align?: 'auto' | 'left' | 'right' | 'center';
};

export function Text({
  variant = 'body',
  tone = 'primary',
  align,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();

  const toneColor: Record<TextTone, string> = useMemo(
    () => ({
      primary: theme.colors.text,
      secondary: theme.colors.textSecondary,
      tertiary: theme.colors.textTertiary,
      brand: theme.colors.primary,
      onPrimary: theme.colors.onPrimary,
      success: theme.colors.success,
      danger: theme.colors.danger,
    }),
    [theme]
  );

  return (
    <RNText
      style={StyleSheet.compose(
        [theme.typography[variant], { color: toneColor[tone] }, align ? { textAlign: align } : null],
        style
      )}
      {...rest}
    />
  );
}
