/**
 * Screen — Ride Completed.
 *
 * Success confirmation with the fare, payment status, an optional tip, and a
 * quick star rating that carries into the full rating screen. "View Receipt"
 * opens the itemised receipt; "Done" returns home.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { useRideStore } from '@/store/ride-store';
import { toast } from '@/store/toast-store';
import { CAN_ANIMATE, entranceFrom, useTheme } from '@/theme';

import { StarRating } from './components/star-rating';

const TIPS = [20, 50, 100];

export function RideCompletedScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const fare = useRideStore((s) => s.currentFare());
  const driver = useRideStore((s) => s.driver);
  const setRating = useRideStore((s) => s.setRating);

  const [tip, setTip] = useState<number | null>(null);
  const [stars, setStars] = useState(0);
  const [paid, setPaid] = useState(false);

  // Simulate scanning the captain's QR: the fare (+ any tip) lands in the
  // captain's wallet. On a real device this is the phone's bank/UPI scanner.
  const payViaQr = () => {
    const total = fare + (tip ?? 0);
    useCaptainStore.getState().creditWallet(total);
    setPaid(true);
    haptic('success');
    toast(`NPR ${total} paid to captain via QR`, 'success');
  };

  // Success tick pops in on mount.
  const scale = useSharedValue(entranceFrom(0.4, 1));
  useState(() => {
    if (CAN_ANIMATE) scale.value = withSpring(1, { damping: 10, stiffness: 160 });
  });
  const tickStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const finishToRating = (value: number) => {
    setStars(value);
    setRating(value);
    haptic('success');
    router.push('/rate-driver');
  };

  const done = () => {
    useRideStore.getState().reset();
    router.dismissAll();
    router.replace('/home');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Success */}
        <View style={styles.successBlock}>
          <Animated.View style={[styles.tick, { backgroundColor: theme.colors.success }, tickStyle]}>
            <Ionicons name="checkmark" size={44} color="#fff" />
          </Animated.View>
          <Text variant="h1" align="center" style={styles.title}>
            Ride Completed
          </Text>
          <Text variant="body" tone="secondary" align="center">
            Thank you for riding with us!
          </Text>
        </View>

        {/* Fare card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <View style={styles.fareRow}>
            <Text variant="h2">NPR {fare}</Text>
            {paid ? (
              <View style={[styles.paidBadge, { backgroundColor: theme.colors.successSubtle }]}>
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
                <Text variant="caption" tone="success">
                  Paid
                </Text>
              </View>
            ) : (
              <View style={[styles.paidBadge, { backgroundColor: theme.colors.dangerSubtle }]}>
                <Text variant="caption" tone="danger">
                  Payment due
                </Text>
              </View>
            )}
          </View>
          {paid ? (
            <View style={styles.payMethod}>
              <Ionicons name="qr-code-outline" size={16} color={theme.colors.success} />
              <Text variant="bodySm" tone="secondary">
                Paid via QR to captain&apos;s wallet
              </Text>
            </View>
          ) : (
            <Button
              label={`Scan & Pay NPR ${fare}`}
              onPress={payViaQr}
              leadingIcon={<Ionicons name="qr-code" size={18} color={theme.colors.onPrimary} />}
              style={styles.payBtn}
            />
          )}
        </View>

        {/* Driver + tip */}
        {driver ? (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
            <View style={styles.driverRow}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                <Text variant="bodyLg" tone="onPrimary">
                  {driver.photoInitials}
                </Text>
              </View>
              <View style={styles.flex1}>
                <Text variant="bodyLg" style={styles.driverName}>
                  {driver.name}
                </Text>
                <Text variant="caption" tone="tertiary">
                  {driver.vehicleName} · {driver.plate}
                </Text>
              </View>
            </View>

            <Text variant="bodySm" tone="secondary" style={styles.tipLabel}>
              Add a tip for your driver
            </Text>
            <View style={styles.tipRow}>
              {TIPS.map((amt) => {
                const active = tip === amt;
                return (
                  <Pressable
                    key={amt}
                    onPress={() => {
                      haptic('light');
                      setTip(active ? null : amt);
                    }}
                    style={[
                      styles.tipChip,
                      {
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                        backgroundColor: active ? theme.colors.primarySubtle : theme.colors.surface,
                      },
                    ]}>
                    <Text variant="bodySm" tone={active ? 'brand' : 'secondary'} style={styles.tipText}>
                      NPR {amt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Quick rating */}
        <View style={styles.ratingBlock}>
          <Text variant="h3" align="center">
            How was your ride?
          </Text>
          <StarRating value={stars} onChange={finishToRating} size={38} style={styles.stars} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="View Receipt"
            variant="secondary"
            onPress={() => router.push('/receipt')}
            leadingIcon={<Ionicons name="receipt-outline" size={18} color={theme.colors.text} />}
          />
          <Button label="Done" onPress={done} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  successBlock: { alignItems: 'center', marginBottom: 24 },
  tick: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { marginBottom: 4 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  fareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  payMethod: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  payBtn: { marginTop: 14 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  flex1: { flex: 1 },
  driverName: { fontWeight: '600' },
  tipLabel: { marginTop: 16, marginBottom: 10 },
  tipRow: { flexDirection: 'row', gap: 10 },
  tipChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { fontWeight: '600' },
  ratingBlock: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  stars: { marginTop: 16 },
  actions: { gap: 12 },
});
