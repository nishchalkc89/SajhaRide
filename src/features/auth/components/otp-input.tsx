/**
 * Six-box OTP entry.
 *
 * A single hidden TextInput owns the value (so paste + native SMS autofill work);
 * the visible boxes are a presentation layer that mirror each character. The
 * active box shows a caret via an amber border.
 */

import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

export type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  /** Fired when the last digit is entered. */
  onComplete?: (code: string) => void;
  hasError?: boolean;
};

export function OtpInput({ length = 6, value, onChange, onComplete, hasError }: OtpInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const focus = () => inputRef.current?.focus();

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <Pressable onPress={focus} accessibilityRole="none">
      <View style={styles.row}>
        {Array.from({ length }, (_, i) => {
          const char = value[i] ?? '';
          const isActive = focused && i === value.length;
          const filled = char !== '';

          const borderColor = hasError
            ? theme.colors.danger
            : isActive || filled
              ? theme.colors.primary
              : theme.colors.border;

          return (
            <View
              key={i}
              style={[
                styles.box,
                {
                  borderRadius: theme.radius.md,
                  borderColor,
                  borderWidth: isActive || filled ? 1.5 : StyleSheet.hairlineWidth * 2,
                  backgroundColor: filled ? theme.colors.primarySubtle : theme.colors.surface,
                },
              ]}>
              <Text variant="h2">{char}</Text>
            </View>
          );
        })}
      </View>

      {/* Hidden field that actually captures input. */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        style={styles.hiddenInput}
        // Keep it in the tree (focusable) but visually gone.
        caretHidden
      />
    </Pressable>
  );
}

const BOX_SIZE = 48;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    flex: 1,
    height: 56,
    maxWidth: BOX_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
