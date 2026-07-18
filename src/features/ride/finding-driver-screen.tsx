/**
 * Screen — Finding You a Driver.
 *
 * Shows the search progress over the route map, then auto-assigns the demo
 * driver after a short delay and moves to live tracking. A pulsing ring conveys
 * the active search.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Text } from '@/components/ui/text';
import { NEARBY_VEHICLES } from '@/services/mock-data';
import { useRideStore } from '@/store/ride-store';
import { useTheme } from '@/theme';

import { SearchingBar } from './components/searching-bar';

const SEARCH_STEPS = ['Searching for drivers', 'Finding best match', 'Driver on the way', 'Arriving soon'];

/** How long the mock search runs before a driver is assigned. */
const SEARCH_DURATION_MS = 5000;

export function FindingDriverScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const vehicle = useRideStore((s) => s.vehicle);
  const assignDriver = useRideStore((s) => s.assignDriver);

  // After the search window, match the driver and hand off to tracking.
  useEffect(() => {
    const id = setTimeout(() => {
      assignDriver();
      router.replace('/tracking');
    }, SEARCH_DURATION_MS);
    return () => clearTimeout(id);
  }, [assignDriver, router]);

  const cancel = () => {
    useRideStore.getState().reset();
    router.dismissAll();
    router.replace('/home');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Map */}
      <View style={styles.mapArea}>
        <RideMap
          pickup={pickup.coordinate}
          destination={destination?.coordinate}
          nearbyVehicles={NEARBY_VEHICLES}
          showRoute>
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <View style={styles.headerText}>
              <Text variant="h3">Finding you a driver…</Text>
              <Text variant="bodySm" tone="secondary">
                This usually takes less than a minute
              </Text>
            </View>
            <Pressable
              onPress={cancel}
              style={[styles.cancelBtn, { backgroundColor: theme.colors.dangerSubtle }]}
              accessibilityRole="button"
              accessibilityLabel="Cancel ride">
              <Ionicons name="close" size={16} color={theme.colors.danger} />
              <Text variant="bodySm" tone="danger">
                Cancel
              </Text>
            </Pressable>
          </View>
        </RideMap>
      </View>

      {/* Bottom panel */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius['3xl'],
            borderTopRightRadius: theme.radius['3xl'],
          },
          theme.elevation.sheet,
        ]}>
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          <Text variant="h3" align="center" style={styles.title}>
            We are finding you the best driver
          </Text>
          <Text variant="bodySm" tone="secondary" align="center">
            Please wait a moment…
          </Text>

          {/* Sweeping searching bar */}
          <View style={styles.searchingBar}>
            <SearchingBar />
          </View>

          {/* Progress steps */}
          <View style={styles.steps}>
            {SEARCH_STEPS.map((step, i) => (
              <View key={step} style={styles.step}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: i === 0 ? theme.colors.primary : theme.colors.surfaceMuted,
                      borderColor: i === 0 ? theme.colors.primary : theme.colors.border,
                    },
                  ]}>
                  <Ionicons
                    name={i === 0 ? 'search' : i === 1 ? 'person' : i === 2 ? 'bicycle' : 'checkmark'}
                    size={16}
                    color={i === 0 ? theme.colors.onPrimary : theme.colors.textTertiary}
                  />
                </View>
                <Text variant="caption" tone={i === 0 ? 'primary' : 'tertiary'} align="center" style={styles.stepLabel}>
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* Safety card */}
          <View style={[styles.infoCard, { backgroundColor: theme.colors.primarySubtle }]}>
            <Ionicons name="shield-checkmark" size={22} color={theme.colors.primary} />
            <View style={styles.infoBody}>
              <Text variant="bodyLg" style={styles.infoTitle}>
                Safety First
              </Text>
              <Text variant="bodySm" tone="secondary">
                All our drivers are verified and background checked.
              </Text>
            </View>
          </View>

          {/* Invite card */}
          <View style={[styles.infoCard, { backgroundColor: theme.colors.infoSubtle }]}>
            <Ionicons name="gift" size={22} color={theme.colors.info} />
            <View style={styles.infoBody}>
              <Text variant="bodyLg" style={styles.infoTitle}>
                Invite friends & earn rewards!
              </Text>
              <Text variant="bodySm" tone="secondary">
                You get NPR 100, your friend gets NPR 50.
              </Text>
            </View>
          </View>

          {/* Ride details */}
          <View style={[styles.rideDetails, { borderColor: theme.colors.border }]}>
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
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  headerText: { flex: 1, gap: 2 },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  sheet: { maxHeight: '58%', paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  title: { marginTop: 4 },
  searchingBar: { marginTop: 20, paddingHorizontal: 8 },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  step: { alignItems: 'center', width: 72, gap: 8 },
  stepDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { lineHeight: 14 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  infoBody: { flex: 1, gap: 2 },
  infoTitle: { fontWeight: '600' },
  rideDetails: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    gap: 12,
  },
  rideRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rideDot: { width: 10, height: 10, borderRadius: 5 },
  rideText: { flex: 1 },
  rideFare: { fontWeight: '700' },
});
