/**
 * The pickup / destination card shown on Home and the destination search.
 *
 * Green pickup dot connected by a dotted rail to the red destination pin, with
 * an "+ Add Stop" affordance. Matches the mock's routing card.
 */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';
import type { NamedPlace } from '@/types/ride';

export type WhereToCardProps = {
  pickup: NamedPlace;
  destination?: NamedPlace | null;
  onPressPickup?: () => void;
  onPressDestination?: () => void;
  onPressAddStop?: () => void;
};

export function WhereToCard({
  pickup,
  destination,
  onPressPickup,
  onPressDestination,
  onPressAddStop,
}: WhereToCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl },
        theme.elevation.md,
      ]}>
      {/* Rail */}
      <View style={styles.rail}>
        <View style={[styles.dot, { borderColor: theme.colors.success }]} />
        <View style={[styles.dottedLine, { borderColor: theme.colors.border }]} />
        <Ionicons name="location" size={16} color={theme.colors.danger} />
      </View>

      {/* Fields */}
      <View style={styles.fields}>
        <Pressable onPress={onPressPickup} style={styles.field}>
          <Text variant="caption" tone="tertiary">
            Pick-up location
          </Text>
          <Text variant="bodyLg" numberOfLines={1} style={styles.value}>
            {pickup.title}
          </Text>
        </Pressable>

        <View style={[styles.fieldDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.destRow}>
          <Pressable onPress={onPressDestination} style={styles.field}>
            <Text
              variant="bodyLg"
              tone={destination ? 'primary' : 'tertiary'}
              numberOfLines={1}
              style={styles.value}>
              {destination?.title ?? 'Where to?'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onPressAddStop}
            accessibilityRole="button"
            accessibilityLabel="Add stop"
            style={[styles.addStop, { borderColor: theme.colors.border }]}>
            <Ionicons name="add" size={14} color={theme.colors.text} />
            <Text variant="caption" tone="secondary">
              Add Stop
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  rail: {
    alignItems: 'center',
    paddingTop: 20,
    width: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
  },
  dottedLine: {
    flex: 1,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 6,
    minHeight: 20,
  },
  fields: { flex: 1 },
  field: { flex: 1 },
  value: { marginTop: 2, fontWeight: '600' },
  fieldDivider: {
    height: StyleSheet.hairlineWidth * 2,
    marginVertical: 12,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  addStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
