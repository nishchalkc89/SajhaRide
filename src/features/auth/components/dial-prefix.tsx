/** The "🇳🇵 +977" dial-code prefix shown inside phone TextFields. */

import { StyleSheet, View } from 'react-native';

import { FlagNP } from '@/components/brand/flag-np';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

export function DialPrefix() {
  const theme = useTheme();
  return (
    <View style={[styles.row, { gap: theme.spacing.sm, borderRightColor: theme.colors.border }]}>
      <FlagNP width={18} />
      <Text variant="bodyLg" tone="secondary">
        +977
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
  },
});
