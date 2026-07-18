/** Circular floating map control (locate, layers, notifications). */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

export function MapControlButton({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const haptic = useHaptics();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        haptic('light');
        onPress?.();
      }}
      style={[
        styles.button,
        { backgroundColor: theme.colors.surface, borderRadius: theme.sizing.fab / 2 },
        theme.elevation.md,
      ]}>
      <Ionicons name={icon} size={20} color={theme.colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
