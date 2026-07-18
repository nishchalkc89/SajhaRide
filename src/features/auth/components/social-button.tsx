/**
 * SocialButton — secondary auth button (Google / Apple) with a leading brand
 * glyph and centered label. Distinct from the primary Button: neutral surface,
 * hairline border.
 */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

import { GoogleGlyph } from './google-glyph';

export type SocialProvider = 'google' | 'apple';

export type SocialButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const theme = useTheme();
  const haptic = useHaptics();

  const label = provider === 'google' ? 'Google' : 'Apple';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      onPress={() => {
        haptic('light');
        onPress?.();
      }}
      style={[
        styles.button,
        {
          height: theme.sizing.buttonHeight,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          gap: theme.spacing.md,
        },
      ]}>
      <View style={styles.glyph}>
        {provider === 'google' ? (
          <GoogleGlyph size={20} />
        ) : (
          <Ionicons name="logo-apple" size={22} color={theme.colors.text} />
        )}
      </View>
      <Text variant="label">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  glyph: {
    width: 22,
    alignItems: 'center',
  },
});
