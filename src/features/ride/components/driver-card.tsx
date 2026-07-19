/**
 * DriverCard — the assigned driver's identity strip: avatar, name + rating,
 * vehicle + plate, and call/chat actions. Reused across tracking and the
 * arrived / in-progress states.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';
import type { Driver } from '@/types/ride';

export function DriverCard({ driver }: { driver: Driver }) {
  const theme = useTheme();
  const haptic = useHaptics();
  const router = useRouter();
  const contact = encodeURIComponent(driver.name);

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
        <Text variant="h3" tone="onPrimary">
          {driver.photoInitials}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text variant="bodyLg" numberOfLines={1} style={styles.name}>
            {driver.name}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={theme.colors.primary} />
            <Text variant="caption" tone="secondary">
              {driver.rating.toFixed(1)}
            </Text>
          </View>
        </View>
        <Text variant="bodySm" tone="secondary" numberOfLines={1}>
          {driver.vehicleColor} · {driver.vehicleName}
        </Text>
        <Text variant="caption" tone="tertiary">
          {driver.plate}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            haptic('light');
            router.push(`/call?name=${contact}`);
          }}
          accessibilityRole="button"
          accessibilityLabel="Call driver"
          style={[styles.action, { backgroundColor: theme.colors.successSubtle }]}>
          <Ionicons name="call" size={18} color={theme.colors.success} />
        </Pressable>
        <Pressable
          onPress={() => {
            haptic('light');
            router.push(`/chat?name=${contact}`);
          }}
          accessibilityRole="button"
          accessibilityLabel="Message driver"
          style={[styles.action, { backgroundColor: theme.colors.infoSubtle }]}>
          <Ionicons name="chatbubble-ellipses" size={18} color={theme.colors.info} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontWeight: '600', flexShrink: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
