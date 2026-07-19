/** Captain History tab — past trips with fares, routes and dates. */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

type Trip = {
  id: string;
  from: string;
  to: string;
  date: string;
  fare: number;
  vehicle: 'Bike' | 'Auto';
  rating: number;
};

const TRIPS: Trip[] = [
  { id: 't1', from: 'Balkumari', to: 'Thamel', date: 'Today, 2:14 PM', fare: 165, vehicle: 'Bike', rating: 5 },
  { id: 't2', from: 'Pulchowk', to: 'Koteshwor', date: 'Today, 12:40 PM', fare: 120, vehicle: 'Auto', rating: 4 },
  { id: 't3', from: 'Jawalakhel', to: 'Boudhanath', date: 'Today, 11:02 AM', fare: 210, vehicle: 'Bike', rating: 5 },
  { id: 't4', from: 'Lagankhel', to: 'New Baneshwor', date: 'Yesterday, 6:20 PM', fare: 140, vehicle: 'Bike', rating: 5 },
  { id: 't5', from: 'Kupandole', to: 'Airport', date: 'Yesterday, 8:05 AM', fare: 260, vehicle: 'Auto', rating: 4 },
];

export function CaptainHistoryScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.screenTitle}>
          Ride History
        </Text>

        {TRIPS.map((t) => (
          <View key={t.id} style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
            <View style={styles.head}>
              <View style={styles.vehicleTag}>
                <Ionicons name={t.vehicle === 'Auto' ? 'car-sport' : 'bicycle'} size={16} color={theme.colors.primary} />
                <Text variant="bodySm" tone="secondary">
                  {t.vehicle}
                </Text>
              </View>
              <Text variant="caption" tone="tertiary">
                {t.date}
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
                  {t.from}
                </Text>
                <Text variant="body" numberOfLines={1} style={styles.bold}>
                  {t.to}
                </Text>
              </View>
            </View>

            <View style={[styles.foot, { borderTopColor: theme.colors.border }]}>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons
                    key={i}
                    name={i <= t.rating ? 'star' : 'star-outline'}
                    size={13}
                    color={i <= t.rating ? theme.colors.primary : theme.colors.border}
                  />
                ))}
              </View>
              <Text variant="bodyLg" tone="brand" style={styles.bold}>
                NPR {t.fare}
              </Text>
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
  card: { marginHorizontal: 20, marginBottom: 12, borderRadius: 16, padding: 16 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  vehicleTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  route: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', paddingVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, flex: 1, marginVertical: 4, minHeight: 16 },
  routeText: { flex: 1, justifyContent: 'space-between', gap: 12 },
  bold: { fontWeight: '700' },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  ratingRow: { flexDirection: 'row', gap: 2 },
});
