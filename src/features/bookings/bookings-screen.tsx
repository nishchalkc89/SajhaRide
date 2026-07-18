/**
 * Bookings tab — trip history with a simple upcoming/completed segmented
 * filter. Demo data; "Book Again" re-seeds the ride store from a past trip.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { PLACE_CATALOGUE } from '@/services/mock-data';
import { useRideStore } from '@/store/ride-store';
import { useTheme } from '@/theme';

type Trip = {
  id: string;
  from: string;
  to: string;
  date: string;
  fare: number;
  vehicle: string;
  status: 'completed' | 'cancelled';
};

const TRIPS: Trip[] = [
  { id: 'r1', from: 'Balkumari', to: 'Thamel, Kathmandu', date: 'Today, 10:24 AM', fare: 65, vehicle: 'Bike', status: 'completed' },
  { id: 'r2', from: 'Kupandole', to: 'Tribhuvan Airport', date: 'Jul 15, 8:02 AM', fare: 210, vehicle: 'Car', status: 'completed' },
  { id: 'r3', from: 'New Baneshwor', to: 'Patan Durbar Square', date: 'Jul 12, 5:40 PM', fare: 95, vehicle: 'Bike', status: 'cancelled' },
  { id: 'r4', from: 'Jawalakhel', to: 'Boudhanath Stupa', date: 'Jul 10, 1:15 PM', fare: 180, vehicle: 'Auto', status: 'completed' },
];

export function BookingsScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setDestination = useRideStore((s) => s.setDestination);

  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const trips = filter === 'all' ? TRIPS : TRIPS.filter((t) => t.status === filter);

  const bookAgain = (trip: Trip) => {
    const place = PLACE_CATALOGUE.find((p) => p.title === trip.to);
    if (place) setDestination(place);
    router.push('/choose-ride');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.screenTitle}>
          My Bookings
        </Text>

        {/* Filter */}
        <View style={styles.filterRow}>
          {(['all', 'completed', 'cancelled'] as const).map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                ]}>
                <Text variant="bodySm" tone={active ? 'onPrimary' : 'secondary'} style={styles.filterText}>
                  {f[0].toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {trips.map((trip) => (
          <View key={trip.id} style={[styles.tripCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
            <View style={styles.tripHeader}>
              <View style={styles.vehicleTag}>
                <Ionicons
                  name={trip.vehicle === 'Bike' ? 'bicycle' : trip.vehicle === 'Auto' ? 'car-sport' : 'car'}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySm" tone="secondary">
                  {trip.vehicle}
                </Text>
              </View>
              <Text variant="caption" tone="tertiary">
                {trip.date}
              </Text>
            </View>

            <View style={styles.route}>
              <View style={styles.rail}>
                <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
                <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
                <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
              </View>
              <View style={styles.routeText}>
                <Text variant="body" numberOfLines={1}>
                  {trip.from}
                </Text>
                <Text variant="body" numberOfLines={1} style={styles.toText}>
                  {trip.to}
                </Text>
              </View>
            </View>

            <View style={[styles.tripFooter, { borderTopColor: theme.colors.border }]}>
              <View style={styles.statusRow}>
                <Ionicons
                  name={trip.status === 'completed' ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={trip.status === 'completed' ? theme.colors.success : theme.colors.danger}
                />
                <Text variant="bodySm" tone="secondary">
                  {trip.status === 'completed' ? 'Completed' : 'Cancelled'} · NPR {trip.fare}
                </Text>
              </View>
              <Pressable onPress={() => bookAgain(trip)} hitSlop={8}>
                <Text variant="bodySm" tone="brand" style={styles.bookAgain}>
                  Book Again
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screenTitle: { paddingHorizontal: 20, marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  filterText: { fontWeight: '600' },
  tripCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  vehicleTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  route: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', paddingVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, flex: 1, marginVertical: 4, minHeight: 18 },
  routeText: { flex: 1, justifyContent: 'space-between', gap: 12 },
  toText: { fontWeight: '500' },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bookAgain: { fontWeight: '600' },
});
