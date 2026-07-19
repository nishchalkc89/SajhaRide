/** Page 25 — Navigate to Pickup (map + arrive). */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { ContactRow } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

export function NavigateToPickupScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const request = useCaptainStore((s) => s.request);
  const arriveAtPickup = useCaptainStore((s) => s.arriveAtPickup);

  if (!request) return <CaptainRideGuard />;

  const arrive = () => {
    arriveAtPickup();
    router.replace('/captain/arrived');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.mapArea}>
        {/* Follow the captain toward the pickup. */}
        <RideMap pickup={request.pickupCoord} follow={request.pickupCoord}>
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <View style={[styles.navPill, { backgroundColor: theme.colors.primary }, theme.elevation.md]}>
              <Ionicons name="navigate" size={16} color={theme.colors.onPrimary} />
              <Text variant="label" tone="onPrimary">
                Navigate to Pickup
              </Text>
            </View>
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

        <View style={styles.distRow}>
          <View>
            <Text variant="h2">{request.pickupDistanceKm} km</Text>
            <Text variant="bodySm" tone="tertiary">
              to pickup · {request.pickupTitle}
            </Text>
          </View>
          <Button
            label="Navigate"
            size="md"
            fullWidth={false}
            variant="secondary"
            onPress={() => toast('Opening turn-by-turn navigation…')}
            leadingIcon={<Ionicons name="navigate" size={16} color={theme.colors.text} />}
          />
        </View>

        <View style={styles.contact}>
          <ContactRow name={request.riderName} />
        </View>

        <Button label="I Have Arrived" onPress={arrive} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  navPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  sheet: { paddingTop: 8, paddingHorizontal: 20 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  distRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contact: { marginTop: 16 },
  cta: { marginTop: 16 },
});
