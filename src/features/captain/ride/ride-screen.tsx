/**
 * Pages 29–31 — Ride Started / Live Navigation / Ride in Progress.
 *
 * The bike drives live from pickup to drop (map follows it), with a turn banner,
 * a progress timeline and Call/Chat. "End Ride" moves to payment collection.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDriveSimulation } from '@/hooks/use-drive-simulation';
import { useCaptainStore } from '@/store/captain-store';
import { useTheme } from '@/theme';

import { ContactRow } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

const TRIP_MS = 14000;

export function CaptainRideScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const request = useCaptainStore((s) => s.request);
  const reachDestination = useCaptainStore((s) => s.reachDestination);

  const { position, progress } = useDriveSimulation(
    request?.pickupCoord,
    request?.dropCoord,
    !!request,
    TRIP_MS
  );

  if (!request) return <CaptainRideGuard />;

  const remainingKm = (request.totalDistanceKm * (1 - progress)).toFixed(1);
  const remainingMin = Math.max(1, Math.round(request.etaMinutes * (1 - progress)));

  const end = () => {
    reachDestination();
    router.replace('/captain/payment');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />

      <View style={styles.mapArea}>
        <RideMap
          pickup={request.pickupCoord}
          destination={request.dropCoord}
          follow={position}>
          {/* Turn banner (Page 30) */}
          <View style={[styles.turnBanner, { paddingTop: insets.top + 8 }]}>
            <View style={[styles.turnCard, { backgroundColor: theme.colors.text }]}>
              <Ionicons name="arrow-forward" size={22} color={theme.colors.background} style={styles.turnIcon} />
              <View style={styles.flex1}>
                <Text variant="bodyLg" style={{ color: theme.colors.background, fontWeight: '700' }}>
                  Continue for {remainingKm} km
                </Text>
                <Text variant="caption" style={{ color: theme.colors.background, opacity: 0.7 }}>
                  toward {request.dropTitle}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.statusPill, { backgroundColor: theme.colors.success }, theme.elevation.md]}>
            <Ionicons name="play" size={13} color="#fff" />
            <Text variant="caption" style={styles.pillText}>
              Ride Started
            </Text>
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

        <View style={styles.goingRow}>
          <View>
            <Text variant="h3">Going to {request.dropTitle}</Text>
            <Text variant="bodySm" tone="secondary">
              {remainingKm} km · {remainingMin} mins remaining
            </Text>
          </View>
        </View>

        {/* Progress timeline */}
        <View style={styles.timeline}>
          <View style={styles.tlRow}>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text variant="body" numberOfLines={1} style={styles.tlText}>
              {request.pickupTitle}
            </Text>
          </View>
          <View style={[styles.tlLine, { backgroundColor: theme.colors.border }]} />
          <View style={styles.tlRow}>
            <View style={[styles.tlDot, { borderColor: theme.colors.primary }]} />
            <Text variant="body" numberOfLines={1} style={styles.tlText}>
              On the way
            </Text>
            <Text variant="caption" tone="tertiary">
              {remainingMin} min
            </Text>
          </View>
          <View style={[styles.tlLine, { backgroundColor: theme.colors.border }]} />
          <View style={styles.tlRow}>
            <Ionicons name="location" size={18} color={theme.colors.danger} />
            <Text variant="body" numberOfLines={1} style={styles.tlText}>
              {request.dropTitle}
            </Text>
          </View>
        </View>

        <View style={styles.contact}>
          <ContactRow name={request.riderName} />
        </View>

        <Button label="End Ride" variant="danger" onPress={end} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  turnBanner: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  turnCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16 },
  turnIcon: { transform: [{ rotate: '-45deg' }] },
  flex1: { flex: 1 },
  statusPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { color: '#fff', fontWeight: '600' },
  sheet: { paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  goingRow: { marginBottom: 16 },
  timeline: { gap: 4 },
  tlRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tlText: { flex: 1 },
  tlDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 4, marginHorizontal: 1 },
  tlLine: { width: 2, height: 14, marginLeft: 8, marginVertical: 2 },
  contact: { marginTop: 20 },
  cta: { marginTop: 16 },
});
