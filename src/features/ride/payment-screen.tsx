/**
 * Passenger Payment (Rapido screen 11).
 *
 * After the ride ends: total fare, a quick "Rate your ride", the payment method,
 * and a Pay button. Paying credits the captain's wallet (via the QR/UPI concept)
 * and advances to the completion summary.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { StarRating } from '@/features/ride/components/star-rating';
import { useCaptainStore } from '@/store/captain-store';
import { useRideStore } from '@/store/ride-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

export function PaymentScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const fare = useRideStore((s) => s.currentFare());
  const paymentMethod = useRideStore((s) => s.paymentMethod);
  const setPaymentMethod = useRideStore((s) => s.setPaymentMethod);
  const setRating = useRideStore((s) => s.setRating);

  const [stars, setStars] = useState(0);

  const pay = () => {
    haptic('success');
    useCaptainStore.getState().creditWallet(fare);
    if (stars > 0) setRating(stars);
    toast(`NPR ${fare} paid`, 'success');
    router.replace('/ride-completed');
  };

  const label = paymentMethod === 'wallet' ? 'Wallet' : paymentMethod === 'card' ? 'Card' : 'Cash';
  const nextMethod = () => {
    const order = ['cash', 'wallet', 'card'] as const;
    setPaymentMethod(order[(order.indexOf(paymentMethod) + 1) % order.length]);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />

      {/* Dark header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: theme.colors.text }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={24} color={theme.colors.background} />
        </Pressable>
        <Text variant="h3" style={{ color: theme.colors.background }}>
          Payment
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        {/* Total fare */}
        <View style={styles.fareBlock}>
          <Text variant="body" tone="secondary">
            Total Fare
          </Text>
          <Text variant="display" style={styles.fareValue}>
            NPR {fare}
          </Text>
        </View>

        {/* Rate */}
        <View style={styles.rateBlock}>
          <Text variant="h3" align="center">
            Rate your ride
          </Text>
          <StarRating value={stars} onChange={setStars} size={38} style={styles.stars} />
        </View>

        {/* Payment method */}
        <View style={[styles.methodCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <Text variant="bodySm" tone="tertiary" style={styles.methodTitle}>
            Payment Method
          </Text>
          <View style={styles.methodRow}>
            <View style={styles.methodLeft}>
              <Ionicons name="cash-outline" size={20} color={theme.colors.textSecondary} />
              <Text variant="bodyLg" style={styles.methodLabel}>
                {label}
              </Text>
            </View>
            <Pressable onPress={nextMethod} hitSlop={8}>
              <Text variant="bodySm" tone="brand">
                Change
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.spacer} />

        <Button label={`Pay NPR ${fare}`} onPress={pay} />
        <Pressable onPress={() => router.push('/support')} style={styles.help}>
          <Text variant="bodySm" tone="brand" align="center">
            Need Help?
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSpacer: { width: 24 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  fareBlock: { alignItems: 'center', gap: 4 },
  fareValue: { marginTop: 2 },
  rateBlock: { alignItems: 'center', marginTop: 32 },
  stars: { marginTop: 16 },
  methodCard: { borderRadius: 16, padding: 16, marginTop: 32 },
  methodTitle: { marginBottom: 10 },
  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  methodLabel: { fontWeight: '600' },
  spacer: { flex: 1 },
  help: { paddingVertical: 12 },
});
