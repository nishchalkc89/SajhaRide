/**
 * Screen — Choose a Ride.
 *
 * Map with the pickup→destination route on top; a bottom panel lists vehicle
 * options with an offer banner and a safety note. Confirming starts the driver
 * search.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { CURRENT_PICKUP, NEARBY_VEHICLES, VEHICLES } from '@/services/mock-data';
import { useRideStore } from '@/store/ride-store';
import { useTheme } from '@/theme';

import { VehicleCard } from './components/vehicle-card';

export function ChooseRideScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const selected = useRideStore((s) => s.vehicle);
  const selectVehicle = useRideStore((s) => s.selectVehicle);
  const setStage = useRideStore((s) => s.setStage);

  const confirm = () => {
    setStage('searching');
    router.push('/finding-driver');
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
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <ScreenHeader title="Choose a Ride" />
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

        {/* Route summary */}
        <View style={styles.routeSummary}>
          <Ionicons name="navigate" size={16} color={theme.colors.primary} />
          <Text variant="bodySm" tone="secondary" numberOfLines={1} style={styles.routeText}>
            {pickup.title} → {destination?.title ?? 'destination'}
          </Text>
        </View>

        {/* Offer banner */}
        <View style={[styles.offer, { backgroundColor: theme.colors.primarySubtle }]}>
          <Ionicons name="pricetag" size={16} color={theme.colors.primary} />
          <Text variant="bodySm" tone="secondary" style={styles.offerText}>
            20% OFF up to NPR 200 · code <Text variant="bodySm" tone="brand">SAJHA20</Text>
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          style={styles.listScroll}>
          {VEHICLES.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              selected={selected.id === v.id}
              onPress={() => selectVehicle(v.id)}
            />
          ))}

          {/* Safety note */}
          <View style={[styles.safety, { backgroundColor: theme.colors.infoSubtle }]}>
            <Ionicons name="shield-checkmark" size={18} color={theme.colors.info} />
            <Text variant="bodySm" tone="secondary" style={styles.safetyText}>
              All rides are insured. Your safety is our priority.
            </Text>
          </View>
        </ScrollView>

        {/* Fare + CTA */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: theme.colors.border }]}>
          <View>
            <Text variant="caption" tone="tertiary">
              Estimated Fare
            </Text>
            <Text variant="h3">NPR {selected.fare}</Text>
          </View>
          <Button
            label={`Confirm ${selected.name}`}
            fullWidth={false}
            onPress={confirm}
            trailingIcon={<Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />}
            style={styles.cta}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  sheet: {
    maxHeight: '62%',
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  routeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  routeText: { flex: 1 },
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  offerText: { flex: 1 },
  listScroll: { marginTop: 12 },
  list: { paddingHorizontal: 20, gap: 10, paddingBottom: 8 },
  safety: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  safetyText: { flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  cta: { minWidth: 180 },
});
