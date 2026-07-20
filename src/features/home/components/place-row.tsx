/** A single recent-search / search-result row: clock icon, title, chevron. */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';
import type { NamedPlace } from '@/types/ride';

export function PlaceRow({
  place,
  icon = 'time-outline',
  onPress,
}: {
  place: NamedPlace;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={place.title}
      style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
      </View>
      <View style={styles.body}>
        <Text variant="bodyLg" numberOfLines={1} style={styles.title}>
          {place.title}
        </Text>
        {place.subtitle ? (
          <Text variant="bodySm" tone="tertiary" numberOfLines={2}>
            {place.subtitle}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  title: { fontWeight: '500' },
});
