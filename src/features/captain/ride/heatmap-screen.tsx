/**
 * Page 21 — Nearby Heat Map (High Demand Areas).
 *
 * A map with a list of demand zones (high/medium) so the captain can move
 * toward busier areas. Zone chips overlay the map; a banner nudges movement.
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { CURRENT_PICKUP } from '@/services/mock-data';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

type Demand = 'high' | 'medium';
const ZONES: { name: string; demand: Demand }[] = [
  { name: 'Thamel', demand: 'high' },
  { name: 'New Baneshwor', demand: 'high' },
  { name: 'Koteshwor', demand: 'medium' },
  { name: 'Pulchowk', demand: 'medium' },
  { name: 'Durbar Marg', demand: 'high' },
];

export function HeatMapScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const demandColor = (d: Demand) => (d === 'high' ? theme.colors.danger : theme.colors.primary);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.mapArea}>
        <RideMap pickup={CURRENT_PICKUP.coordinate}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <ScreenHeader
              title="High Demand Areas"
              right={
                <View style={[styles.flame, { backgroundColor: theme.colors.dangerSubtle }]}>
                  <Ionicons name="flame" size={18} color={theme.colors.danger} />
                </View>
              }
            />
          </View>
        </RideMap>
      </View>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius['3xl'],
            borderTopRightRadius: theme.radius['3xl'],
            paddingBottom: insets.bottom + 20,
          },
          theme.elevation.sheet,
        ]}>
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

        <View style={[styles.banner, { backgroundColor: theme.colors.dangerSubtle }]}>
          <Ionicons name="flame" size={20} color={theme.colors.danger} />
          <View style={styles.flex1}>
            <Text variant="bodyLg" style={styles.bold}>
              Move to highlighted areas
            </Text>
            <Text variant="bodySm" tone="secondary">
              More rides available nearby
            </Text>
          </View>
        </View>

        <Text variant="overline" tone="tertiary" style={styles.sectionLabel}>
          NEARBY ZONES
        </Text>
        {ZONES.map((z) => (
          <View key={z.name} style={styles.zoneRow}>
            <View style={[styles.zoneDot, { backgroundColor: demandColor(z.demand) }]} />
            <Text variant="bodyLg" style={styles.flex1}>
              {z.name}
            </Text>
            <View style={[styles.demandTag, { backgroundColor: `${demandColor(z.demand)}22` }]}>
              <Text variant="caption" style={{ color: demandColor(z.demand), fontWeight: '600' }}>
                {z.demand === 'high' ? 'High demand' : 'Medium'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  flame: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sheet: { maxHeight: '58%', paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14 },
  flex1: { flex: 1 },
  bold: { fontWeight: '700' },
  sectionLabel: { marginTop: 20, marginBottom: 8 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  zoneDot: { width: 10, height: 10, borderRadius: 5 },
  demandTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
