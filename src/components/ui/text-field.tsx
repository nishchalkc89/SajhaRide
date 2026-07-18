/**
 * TextField — the app's single text input primitive.
 *
 * 54pt tall, 12pt radius, hairline border that turns amber on focus. Supports a
 * leading icon, a trailing slot (e.g. the password eye toggle), and an error
 * state. Integrates with react-hook-form via a plain value/onChangeText.
 */

import { forwardRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { noWebOutline, useTheme } from '@/theme';

import { Text } from './text';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  /** Rendered inside the field, left of the text. */
  leadingIcon?: React.ReactNode;
  /** Rendered inside the field, right of the text (eye toggle, etc.). */
  trailingSlot?: React.ReactNode;
  /** Fixed content before the input — e.g. a "+977" dial-code prefix. */
  prefix?: React.ReactNode;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { leadingIcon, trailingSlot, prefix, error, containerStyle, onFocus, onBlur, ...rest },
  ref
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.field,
          {
            height: theme.sizing.inputHeight,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.lg,
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.surface,
            borderColor,
            // Focus ring reads as a slightly thicker amber edge.
            borderWidth: focused || error ? 1.5 : StyleSheet.hairlineWidth * 2,
          },
        ]}>
        {leadingIcon}
        {prefix}
        <TextInput
          ref={ref}
          style={[styles.input, theme.typography.bodyLg, noWebOutline, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {trailingSlot}
      </View>

      {error ? (
        <Text variant="caption" tone="danger" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  error: {
    marginTop: 6,
    marginLeft: 4,
  },
});
