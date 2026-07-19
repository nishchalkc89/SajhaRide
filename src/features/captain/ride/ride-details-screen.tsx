/** Page 23 — Ride Details Before Accept. */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { useTheme } from '@/theme';

import { MetricPair, RouteCard } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

export function RideDetailsScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const request = useCaptainStore((s) => s.request);
  const acceptRequest = useCaptainStore((s) => s.acceptRequest);

  if (!request) return <CaptainRideGuard />;

  const accept = () => {
    haptic('success');
    acceptRequest();
    router.replace('/captain/accepted');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.mapArea}>
        <RideMap pickup={request.pickupCoord} destination={request.dropCoord} showRoute>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <ScreenHeader />
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
        <Text variant="h3" style={styles.title}>
          Ride Details
        </Text>

        <MetricPair
          left={{ value: `${request.pickupDistanceKm} km`, label: 'Pickup' }}
          right={{ value: `${request.totalDistanceKm} km`, label: 'Total distance' }}
        />

        <View style={styles.routeWrap}>
          <RouteCard request={request} />
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={theme.colors.primary} />
            <Text variant="bodySm" tone="secondary">
              {request.riderRating.toFixed(1)} ({request.riderRides} rides)
            </Text>
          </View>
          <View>
            <Text variant="caption" tone="tertiary" align="right">
              Est. Fare
            </Text>
            <Text variant="h3" tone="brand">
              NPR {request.fare}
            </Text>
          </View>
        </View>

        <Button label="Accept Ride" onPress={accept} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  sheet: { paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  title: { marginBottom: 14 },
  routeWrap: { marginTop: 16 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cta: { marginTop: 18 },
});
