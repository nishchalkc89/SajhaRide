/**
 * Screen — Trip Receipt.
 *
 * Itemised fare breakdown, route, payment method and a ride id. Reads the
 * completed ride from the store.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { computeFareBreakdown, useRideStore } from '@/store/ride-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

export function ReceiptScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const vehicle = useRideStore((s) => s.vehicle);
  const distanceKm = useRideStore((s) => s.distanceKm);
  const fare = useMemo(() => computeFareBreakdown(vehicle, distanceKm), [vehicle, distanceKm]);

  const lineItems = [
    { label: 'Base Fare', value: fare.base },
    { label: `Distance (${fare.distanceKm} km)`, value: fare.distance },
    { label: `Time (${fare.durationMin} min)`, value: fare.time },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Trip Receipt" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        <Text variant="bodySm" tone="tertiary" style={styles.date}>
          {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}
          {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </Text>

        {/* Route */}
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.info }]} />
            <Text variant="body" numberOfLines={1} style={styles.flex1}>
              {pickup.title}
            </Text>
          </View>
          <View style={[styles.routeLine, { borderColor: theme.colors.border }]} />
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            <Text variant="body" numberOfLines={1} style={styles.flex1}>
              {destination?.title ?? 'Destination'}
            </Text>
          </View>
        </View>

        {/* Fare breakdown */}
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          {lineItems.map((item) => (
            <View key={item.label} style={styles.lineItem}>
              <Text variant="body" tone="secondary">
                {item.label}
              </Text>
              <Text variant="body">NPR {item.value}</Text>
            </View>
          ))}
          <View style={[styles.totalDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.lineItem}>
            <Text variant="bodyLg" style={styles.totalLabel}>
              Total
            </Text>
            <Text variant="h3">NPR {fare.total}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={[styles.payRow, { borderColor: theme.colors.border }]}>
          <View style={styles.payLeft}>
            <Ionicons name="cash-outline" size={20} color={theme.colors.textSecondary} />
            <Text variant="body">Payment Method</Text>
          </View>
          <Text variant="bodyLg" style={styles.payValue}>
            Cash
          </Text>
        </View>

        <View style={styles.rideId}>
          <Text variant="caption" tone="tertiary">
            Ride ID
          </Text>
          <Text variant="caption" tone="secondary">
            RID{Math.floor(1000000 + Math.random() * 8999999)}
          </Text>
        </View>

        <Button
          label="Download Receipt"
          variant="secondary"
          onPress={() => toast('Receipt saved to your downloads', 'success')}
          leadingIcon={<Ionicons name="download-outline" size={18} color={theme.colors.text} />}
          style={styles.download}
        />
        <Button label="Done" onPress={() => router.replace('/home')} style={styles.done} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  date: { marginTop: 4, marginBottom: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { borderLeftWidth: 1.5, borderStyle: 'dashed', height: 20, marginLeft: 4, marginVertical: 4 },
  flex1: { flex: 1 },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  totalDivider: { height: StyleSheet.hairlineWidth * 2, marginVertical: 10 },
  totalLabel: { fontWeight: '600' },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  payLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payValue: { fontWeight: '600' },
  rideId: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 28 },
  download: { marginBottom: 12 },
  done: {},
});
