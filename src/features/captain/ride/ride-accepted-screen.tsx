/** Page 24 — Ride Accepted confirmation. */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCaptainStore } from '@/store/captain-store';
import { useTheme } from '@/theme';

import { ContactRow, RouteCard } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

export function RideAcceptedScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const request = useCaptainStore((s) => s.request);
  const startNavigation = useCaptainStore((s) => s.startNavigation);

  if (!request) return <CaptainRideGuard />;

  const start = () => {
    startNavigation();
    router.replace('/captain/navigate');
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.top}>
        <View style={[styles.tick, { backgroundColor: theme.colors.success }]}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </View>
        <Text variant="h1" align="center" style={styles.title}>
          Ride Accepted!
        </Text>
        <Text variant="body" tone="secondary" align="center">
          Head to the pickup location
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
        <RouteCard request={request} />
      </View>

      <View style={styles.contact}>
        <ContactRow name={request.riderName} />
      </View>

      <View style={styles.spacer} />

      <Button
        label="Start Navigation"
        onPress={start}
        leadingIcon={<Ionicons name="navigate" size={18} color={theme.colors.onPrimary} />}
        style={styles.cta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  top: { alignItems: 'center', marginTop: 20 },
  tick: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { marginBottom: 6 },
  card: { borderRadius: 16, padding: 18, marginTop: 32 },
  contact: { marginTop: 16 },
  spacer: { flex: 1 },
  cta: {},
});
