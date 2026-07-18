/** "or continue with" — a centered label flanked by hairlines. */

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

export function AuthDivider({ label = 'or continue with' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { gap: theme.spacing.md }]}>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <Text variant="bodySm" tone="tertiary">
        {label}
      </Text>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
  },
});
