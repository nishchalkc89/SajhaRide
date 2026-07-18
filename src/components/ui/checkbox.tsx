/** Square checkbox with an amber fill + white tick when checked. */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

export type CheckboxProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  accessibilityLabel?: string;
};

export function Checkbox({ checked, onChange, accessibilityLabel }: CheckboxProps) {
  const theme = useTheme();
  const haptic = useHaptics();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => {
        haptic('light');
        onChange(!checked);
      }}
      style={[
        styles.box,
        {
          borderRadius: theme.radius.sm - 2,
          borderColor: checked ? theme.colors.primary : theme.colors.border,
          backgroundColor: checked ? theme.colors.primary : 'transparent',
        },
      ]}>
      {checked ? <Ionicons name="checkmark" size={14} color={theme.colors.onPrimary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
