/** Tappable 5-star rating control. */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

export function StarRating({
  value,
  onChange,
  size = 32,
  readOnly,
  style,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const haptic = useHaptics();

  return (
    <View style={[styles.row, { gap: size * 0.2 }, style]} accessibilityRole="adjustable">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= value;
        return (
          <Pressable
            key={i}
            disabled={readOnly}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${i} star${i > 1 ? 's' : ''}`}
            onPress={() => {
              haptic('light');
              onChange?.(i);
            }}>
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? theme.colors.primary : theme.colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
