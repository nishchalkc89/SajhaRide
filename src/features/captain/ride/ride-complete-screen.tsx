/** Page 34 — Ride Completed (fare credited). */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCaptainStore } from '@/store/captain-store';
import { useTheme } from '@/theme';

import { MetricPair } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

export function CaptainRideCompleteScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const request = useCaptainStore((s) => s.request);

  if (!request) return <CaptainRideGuard />;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.background, paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
      ]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.top}>
        <View style={[styles.tick, { backgroundColor: theme.colors.success }]}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
        <Text variant="h1" align="center" style={styles.title}>
          Ride Completed!
        </Text>
        <Text variant="h2" tone="brand" align="center" style={styles.fare}>
          NPR {request.fare}
        </Text>
        <Text variant="body" tone="secondary" align="center">
          Credited to your wallet
        </Text>
      </View>

      <View style={styles.metrics}>
        <MetricPair
          left={{ value: `${request.totalDistanceKm} km`, label: 'Total Distance' }}
          right={{ value: `${request.etaMinutes} min`, label: 'Total Time' }}
        />
      </View>

      <View style={styles.spacer} />

      <Button label="Done" onPress={() => router.replace('/captain/rate')} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  top: { alignItems: 'center' },
  tick: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { marginBottom: 12 },
  fare: { marginBottom: 2 },
  metrics: { marginTop: 32 },
  spacer: { flex: 1 },
  cta: {},
});
