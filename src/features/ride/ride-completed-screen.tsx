/**
 * Ride Completed summary (Rapido screen 12).
 *
 * Green success header, an itemised summary (fare / payment / distance /
 * duration), a "Rate your Captain" control, and Done. Payment already happened
 * on the Payment screen, so this is purely the confirmation + rating.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { StarRating } from '@/features/ride/components/star-rating';
import { useHaptics } from '@/hooks/use-haptics';
import { computeFareBreakdown, useRideStore } from '@/store/ride-store';
import { CAN_ANIMATE, entranceFrom, useTheme } from '@/theme';

export function RideCompletedScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const vehicle = useRideStore((s) => s.vehicle);
  const distanceKm = useRideStore((s) => s.distanceKm);
  const driver = useRideStore((s) => s.driver);
  const paymentMethod = useRideStore((s) => s.paymentMethod);
  const setRating = useRideStore((s) => s.setRating);

  const fare = useMemo(() => computeFareBreakdown(vehicle, distanceKm), [vehicle, distanceKm]);
  const [stars, setStars] = useState(0);

  // Success tick pops in on mount.
  const scale = useSharedValue(entranceFrom(0.4, 1));
  useState(() => {
    if (CAN_ANIMATE) scale.value = withSpring(1, { damping: 10, stiffness: 160 });
  });
  const tickStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const payLabel = paymentMethod === 'wallet' ? 'Wallet' : paymentMethod === 'card' ? 'Card' : 'Cash';

  const done = () => {
    if (stars > 0) setRating(stars);
    useRideStore.getState().reset();
    router.dismissAll();
    router.replace('/home');
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Payment', value: payLabel },
    { label: 'Distance', value: `${fare.distanceKm} km` },
    { label: 'Duration', value: `${fare.durationMin} min` },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />

      {/* Green success header */}
      <View style={[styles.header, { paddingTop: insets.top + 40, backgroundColor: theme.colors.success }]}>
        <Animated.View style={[styles.tick, tickStyle]}>
          <Ionicons name="checkmark-circle" size={64} color="#fff" />
        </Animated.View>
        <Text variant="h1" style={styles.headerTitle}>
          Ride Completed
        </Text>
        <Text variant="body" style={styles.headerSub}>
          Thank you for riding with SajhaRide!
        </Text>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        {/* Summary card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <View style={styles.totalRow}>
            <Text variant="bodyLg" style={styles.bold}>
              Total Fare
            </Text>
            <Text variant="h2">NPR {fare.total}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text variant="body" tone="secondary">
                {r.label}
              </Text>
              <Text variant="body" style={styles.bold}>
                {r.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Rate captain */}
        <View style={styles.rateBlock}>
          <Text variant="h3" align="center">
            Rate your Captain
          </Text>
          {driver ? (
            <Text variant="bodySm" tone="tertiary" align="center" style={styles.driverName}>
              {driver.name} · {driver.vehicleName}
            </Text>
          ) : null}
          <StarRating value={stars} onChange={setStars} size={40} style={styles.stars} />
        </View>

        <View style={styles.spacer} />

        <Button label="Done" variant="secondary" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: 'center', paddingBottom: 32, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  tick: { marginBottom: 12 },
  headerTitle: { color: '#fff' },
  headerSub: { color: '#fff', opacity: 0.9, marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  card: { borderRadius: 16, padding: 18 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bold: { fontWeight: '700' },
  divider: { height: StyleSheet.hairlineWidth * 2, marginVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  rateBlock: { alignItems: 'center', marginTop: 32 },
  driverName: { marginTop: 4 },
  stars: { marginTop: 16 },
  spacer: { flex: 1 },
});
