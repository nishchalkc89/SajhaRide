/**
 * Pages 32–33 — Destination Reached → Collect Payment.
 *
 * Shows the total fare and a Cash / UPI choice. Picking UPI reveals the
 * scannable QR (customer scans to pay into the captain wallet). Confirm credits
 * the wallet and moves to the completion screen.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaymentQR } from '@/components/ui/payment-qr';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore, type CaptainPayment } from '@/store/captain-store';
import { useTheme } from '@/theme';

import { CaptainRideGuard } from './components/ride-guard';

export function CollectPaymentScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const request = useCaptainStore((s) => s.request);
  const paymentMethod = useCaptainStore((s) => s.paymentMethod);
  const setPaymentMethod = useCaptainStore((s) => s.setPaymentMethod);
  const collectPayment = useCaptainStore((s) => s.collectPayment);

  if (!request) return <CaptainRideGuard />;

  const confirm = () => {
    haptic('success');
    collectPayment();
    router.replace('/captain/complete');
  };

  const options: { id: CaptainPayment; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'cash', label: 'Cash', icon: 'cash-outline' },
    { id: 'upi', label: 'UPI / Digital Payment', icon: 'qr-code-outline' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Collect Payment" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100 }}>
        {/* Destination reached */}
        <View style={styles.reached}>
          <View style={[styles.pin, { backgroundColor: theme.colors.danger }]}>
            <Ionicons name="location" size={30} color="#fff" />
          </View>
          <Text variant="h3" align="center">
            Destination Reached
          </Text>
          <Text variant="bodySm" tone="secondary" align="center">
            {request.dropTitle} · {request.dropAddress}
          </Text>
        </View>

        {/* Total fare */}
        <View style={[styles.fareCard, { backgroundColor: theme.colors.background }]}>
          <Text variant="display" tone="brand">
            NPR {request.fare}
          </Text>
          <Text variant="bodySm" tone="tertiary">
            Total Fare
          </Text>
        </View>

        {/* Method */}
        {options.map((o) => {
          const active = paymentMethod === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => {
                haptic('light');
                setPaymentMethod(o.id);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[
                styles.method,
                {
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  backgroundColor: active ? theme.colors.primarySubtle : theme.colors.surface,
                },
              ]}>
              <Ionicons name={o.icon} size={22} color={active ? theme.colors.primary : theme.colors.textSecondary} />
              <Text variant="bodyLg" style={styles.methodLabel}>
                {o.label}
              </Text>
              <View
                style={[
                  styles.radio,
                  { borderColor: active ? theme.colors.primary : theme.colors.border, backgroundColor: active ? theme.colors.primary : 'transparent' },
                ]}>
                {active ? <Ionicons name="checkmark" size={12} color={theme.colors.onPrimary} /> : null}
              </View>
            </Pressable>
          );
        })}

        {/* UPI QR */}
        {paymentMethod === 'upi' ? (
          <View style={styles.qrWrap}>
            <PaymentQR amount={request.fare} label={`SajhaRide · NPR ${request.fare}`} color={theme.colors.text} />
            <Text variant="bodySm" tone="secondary" align="center" style={styles.qrHint}>
              Ask {request.riderName.split(' ')[0]} to scan this from any bank app to pay.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <Button label="Confirm Payment" onPress={confirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  reached: { alignItems: 'center', marginTop: 12, gap: 4 },
  pin: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  fareCard: { alignItems: 'center', borderRadius: 20, paddingVertical: 24, marginTop: 24, gap: 2 },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 12,
  },
  methodLabel: { flex: 1, fontWeight: '500' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  qrWrap: { alignItems: 'center', marginTop: 20, gap: 12 },
  qrHint: { maxWidth: 260 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth * 2 },
});
