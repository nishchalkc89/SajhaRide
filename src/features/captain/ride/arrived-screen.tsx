/**
 * Pages 26–27 — Captain Arrived → Waiting for Customer.
 *
 * Phase 1: "You have arrived" confirmation with an "I Have Arrived" button that
 * notifies the customer. Phase 2: a waiting screen with a live waiting timer,
 * contact + cancel, and "Verify OTP" once the customer is on the way.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { ContactRow } from './components/route-card';
import { CaptainRideGuard } from './components/ride-guard';

function mmss(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function CaptainArrivedScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const request = useCaptainStore((s) => s.request);

  const [notified, setNotified] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);

  // Waiting timer counts up once the customer has been notified.
  useEffect(() => {
    if (!notified) return;
    const id = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [notified]);

  if (!request) return <CaptainRideGuard />;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ paddingTop: insets.top }}>
        <ScreenHeader title={notified ? 'Waiting for Customer' : undefined} />
      </View>

      <View style={styles.content}>
        {!notified ? (
          <>
            <View style={styles.center}>
              <View style={[styles.pin, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="location" size={40} color="#fff" />
              </View>
              <Text variant="h1" align="center" style={styles.title}>
                You have arrived!
              </Text>
              <Text variant="body" tone="secondary" align="center">
                at pickup location
              </Text>
            </View>

            <View style={[styles.placeCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
              <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              <View style={styles.flex1}>
                <Text variant="bodyLg" style={styles.bold}>
                  {request.pickupTitle}
                </Text>
                <Text variant="caption" tone="tertiary">
                  {request.pickupAddress}
                </Text>
              </View>
            </View>

            <View style={styles.spacer} />
            <Button
              label="I Have Arrived"
              onPress={() => {
                haptic('success');
                setNotified(true);
                toast('Customer notified you have arrived');
              }}
              style={{ marginBottom: insets.bottom + 16 }}
            />
          </>
        ) : (
          <>
            <View style={styles.center}>
              <View style={[styles.waitIcon, { backgroundColor: theme.colors.primarySubtle }]}>
                <Ionicons name="walk" size={38} color={theme.colors.primary} />
              </View>
              <Text variant="h3" align="center" style={styles.title}>
                Customer is on the way…
              </Text>
              <View style={[styles.waitBadge, { backgroundColor: theme.colors.surfaceMuted }]}>
                <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                <Text variant="bodySm" tone="secondary">
                  Waiting time{' '}
                  <Text variant="bodySm" tone="brand" style={styles.bold}>
                    {mmss(waitSeconds)}
                  </Text>
                </Text>
              </View>
              <Text variant="bodySm" tone="tertiary" align="center" style={styles.waitHint}>
                Please wait at the pickup location
              </Text>
            </View>

            <View style={styles.contact}>
              <ContactRow name={request.riderName} />
            </View>

            <View style={styles.spacer} />

            <Button
              label="Verify OTP to Start"
              onPress={() => router.push('/captain/verify')}
              style={styles.cta}
            />
            <Button
              label="Cancel Ride"
              variant="ghost"
              haptic="warning"
              onPress={() => {
                useCaptainStore.getState().declineRequest();
                router.replace('/captain');
              }}
              style={{ marginBottom: insets.bottom + 8 }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  center: { alignItems: 'center', marginTop: 32 },
  pin: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  waitIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { marginBottom: 8 },
  bold: { fontWeight: '700' },
  waitBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginTop: 4 },
  waitHint: { marginTop: 12 },
  placeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginTop: 32 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  flex1: { flex: 1 },
  contact: { marginTop: 28 },
  spacer: { flex: 1 },
  cta: { marginBottom: 10 },
});
