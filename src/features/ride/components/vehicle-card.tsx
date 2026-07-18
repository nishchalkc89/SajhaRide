/**
 * VehicleCard — a selectable ride option: icon, name + tagline, ETA, fare and a
 * radio indicator. The selected card gets an amber ring and tinted fill; the
 * recommended option carries a "Best for you" badge.
 */

import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';
import type { Vehicle } from '@/types/ride';

export function VehicleCard({
  vehicle,
  selected,
  onPress,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const haptic = useHaptics();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${vehicle.name}, NPR ${vehicle.fare}`}
      onPress={() => {
        haptic('light');
        onPress();
      }}
      style={[
        styles.card,
        {
          borderRadius: theme.radius.lg,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth * 2,
          backgroundColor: selected ? theme.colors.primarySubtle : theme.colors.surface,
        },
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Image source={vehicle.image} style={styles.vehicleImage} resizeMode="contain" />
      </View>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text variant="bodyLg" style={styles.name}>
            {vehicle.name}
          </Text>
          {vehicle.recommended ? (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text variant="caption" tone="onPrimary" style={styles.badgeText}>
                Best for you
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="caption" tone="tertiary" numberOfLines={1}>
          {vehicle.tagline}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
          <Text variant="caption" tone="secondary">
            {vehicle.etaMinutes} min away
          </Text>
          <Ionicons name="person-outline" size={12} color={theme.colors.textSecondary} style={styles.metaGap} />
          <Text variant="caption" tone="secondary">
            {vehicle.capacity}
          </Text>
        </View>
      </View>

      <View style={styles.fareCol}>
        <Text variant="bodyLg" style={styles.fare}>
          NPR {vehicle.fare}
        </Text>
        <View
          style={[
            styles.radio,
            {
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected ? theme.colors.primary : 'transparent',
            },
          ]}>
          {selected ? <Ionicons name="checkmark" size={12} color={theme.colors.onPrimary} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vehicleImage: {
    width: 52,
    height: 52,
  },
  body: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaGap: { marginLeft: 6 },
  fareCol: { alignItems: 'flex-end', gap: 8 },
  fare: { fontWeight: '700' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
