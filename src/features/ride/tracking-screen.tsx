/**
 * Screen — Live Tracking (Driver Assigned → Arrived → Ride in Progress).
 *
 * One screen, three stages driven by the ride store. The driver "arrives"
 * automatically after a short delay; the rider starts the trip, which then
 * completes on a timer and routes to the completion screen.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { NEARBY_VEHICLES } from '@/services/mock-data';
import { useRideStore } from '@/store/ride-store';
import { useTheme } from '@/theme';

import { DriverCard } from './components/driver-card';

/** Driver reaches the pickup this long after assignment. */
const ARRIVE_AFTER_MS = 4000;
/** Trip auto-completes this long after it starts. */
const TRIP_DURATION_MS = 5000;

const STAGE_COPY = {
  assigned: { title: 'Driver on the way', subtitle: '2 min · 500 m away' },
  arrived: { title: 'Driver has arrived', subtitle: 'Meet at the pickup point' },
  in_progress: { title: 'Ride in progress', subtitle: 'Enjoy your ride' },
} as const;

export function TrackingScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const vehicle = useRideStore((s) => s.vehicle);
  const driver = useRideStore((s) => s.driver);
  const stage = useRideStore((s) => s.stage);
  const setStage = useRideStore((s) => s.setStage);

  // assigned → arrived (driver reaches pickup).
  useEffect(() => {
    if (stage !== 'assigned') return;
    const id = setTimeout(() => setStage('arrived'), ARRIVE_AFTER_MS);
    return () => clearTimeout(id);
  }, [stage, setStage]);

  // in_progress → completed (trip ends).
  useEffect(() => {
    if (stage !== 'in_progress') return;
    const id = setTimeout(() => {
      setStage('completed');
      router.replace('/ride-completed');
    }, TRIP_DURATION_MS);
    return () => clearTimeout(id);
  }, [stage, setStage, router]);

  const copy = STAGE_COPY[stage as keyof typeof STAGE_COPY] ?? STAGE_COPY.assigned;
  const isArrived = stage === 'arrived';
  const inProgress = stage === 'in_progress';

  // Driver sits at pickup until the trip starts, then "moves" toward the drop.
  const driverLocation = inProgress
    ? { latitude: (pickup.coordinate.latitude + (destination?.coordinate.latitude ?? pickup.coordinate.latitude)) / 2, longitude: (pickup.coordinate.longitude + (destination?.coordinate.longitude ?? pickup.coordinate.longitude)) / 2 }
    : pickup.coordinate;

  if (!driver) {
    // Guard: reached without an assignment (e.g. deep link) — send home.
    return (
      <View style={[styles.root, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text variant="body" tone="secondary">
          No active ride.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Map */}
      <View style={styles.mapArea}>
        <RideMap
          pickup={pickup.coordinate}
          destination={destination?.coordinate}
          driverLocation={driverLocation}
          nearbyVehicles={inProgress ? [] : NEARBY_VEHICLES}
          showRoute>
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <View style={[styles.headerCard, { backgroundColor: theme.colors.surface }, theme.elevation.md]}>
              <Text variant="h3">{copy.title}</Text>
              <Text variant="bodySm" tone="secondary">
                {copy.subtitle}
              </Text>
            </View>
          </View>
        </RideMap>
      </View>

      {/* Bottom sheet */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius['3xl'],
            borderTopRightRadius: theme.radius['3xl'],
            paddingBottom: insets.bottom + 16,
          },
          theme.elevation.sheet,
        ]}>
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

        {/* In-progress trip stats */}
        {inProgress ? (
          <View style={[styles.stats, { borderColor: theme.colors.border }]}>
            <View style={styles.stat}>
              <Text variant="h3">10 min</Text>
              <Text variant="caption" tone="tertiary">
                Distance Left
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.stat}>
              <Text variant="h3">3.2 km</Text>
              <Text variant="caption" tone="tertiary">
                Remaining
              </Text>
            </View>
          </View>
        ) : null}

        <DriverCard driver={driver} />

        {/* Arrived banner */}
        {isArrived ? (
          <View style={[styles.arrivedBanner, { backgroundColor: theme.colors.successSubtle }]}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text variant="bodySm" tone="secondary" style={styles.arrivedText}>
              Your driver is waiting at {pickup.title}.
            </Text>
          </View>
        ) : null}

        {/* Ride details */}
        <View style={[styles.rideDetails, { borderTopColor: theme.colors.border }]}>
          <View style={styles.rideRow}>
            <View style={[styles.rideDot, { backgroundColor: theme.colors.info }]} />
            <Text variant="body" numberOfLines={1} style={styles.rideText}>
              {pickup.title}
            </Text>
          </View>
          <View style={styles.rideRow}>
            <View style={[styles.rideDot, { backgroundColor: theme.colors.primary }]} />
            <Text variant="body" numberOfLines={1} style={styles.rideText}>
              {destination?.title ?? 'Destination'}
            </Text>
            <Text variant="bodyLg" style={styles.rideFare}>
              NPR {vehicle.fare}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {isArrived ? (
            <Button
              label="Start Ride"
              onPress={() => setStage('in_progress')}
              trailingIcon={<Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />}
            />
          ) : inProgress ? (
            <View style={styles.actionRow}>
              <Button label="Emergency" variant="danger" fullWidth={false} style={styles.flex1}
                leadingIcon={<Ionicons name="alert-circle" size={18} color={theme.colors.onPrimary} />}
                onPress={() => {}}
              />
              <Button label="Share Trip" variant="secondary" fullWidth={false} style={styles.flex1} onPress={() => {}} />
            </View>
          ) : (
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => {
                  useRideStore.getState().reset();
                  router.replace('/home');
                }}
                style={[styles.cancelBtn, { borderColor: theme.colors.border }]}
                accessibilityRole="button">
                <Text variant="label" tone="danger">
                  Cancel Ride
                </Text>
              </Pressable>
              <Button label="Share Live Location" variant="secondary" fullWidth={false} style={styles.flex1} onPress={() => {}} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20 },
  headerCard: { padding: 14, borderRadius: 16, gap: 2 },
  sheet: { paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  stats: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: StyleSheet.hairlineWidth * 2 },
  arrivedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  arrivedText: { flex: 1 },
  rideDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    gap: 12,
  },
  rideRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rideDot: { width: 10, height: 10, borderRadius: 5 },
  rideText: { flex: 1 },
  rideFare: { fontWeight: '700' },
  actions: { marginTop: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  cancelBtn: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
