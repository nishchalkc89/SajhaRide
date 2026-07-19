/**
 * Captain Wallet — withdrawable balance (fed by QR ride payments), quick
 * withdraw to bank, and a credit/debit history.
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

const WITHDRAW_AMOUNTS = [500, 1000, 2000];

export function CaptainWalletScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const balance = useCaptainStore((s) => s.walletBalance);
  const withdraw = useCaptainStore((s) => s.withdraw);
  const tripsToday = useCaptainStore((s) => s.tripsToday);

  const [history, setHistory] = useState<{ id: string; label: string; amount: number; kind: 'credit' | 'debit' }[]>([
    { id: 'h1', label: 'Ride payment · Thamel', amount: 165, kind: 'credit' },
    { id: 'h2', label: 'Ride payment · Koteshwor', amount: 120, kind: 'credit' },
    { id: 'h3', label: 'Withdrawal to NIC Asia', amount: 1500, kind: 'debit' },
    { id: 'h4', label: 'Ride payment · Patan', amount: 95, kind: 'credit' },
  ]);

  const doWithdraw = (amount: number) => {
    if (withdraw(amount)) {
      haptic('success');
      setHistory((h) => [{ id: `w-${Date.now()}`, label: 'Withdrawal to bank', amount, kind: 'debit' }, ...h]);
      toast(`NPR ${amount} sent to your bank account`, 'success');
    } else {
      haptic('error');
      toast('Insufficient balance', 'error');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Captain Wallet" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        {/* Balance */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.text }]}>
          <Text variant="bodySm" style={{ color: theme.colors.background, opacity: 0.7 }}>
            Withdrawable Balance
          </Text>
          <Text variant="display" style={{ color: theme.colors.background, marginTop: 4 }}>
            NPR {balance.toLocaleString()}
          </Text>
          <View style={styles.balanceMeta}>
            <Ionicons name="trending-up" size={16} color={theme.colors.background} style={{ opacity: 0.8 }} />
            <Text variant="bodySm" style={{ color: theme.colors.background, opacity: 0.85 }}>
              {tripsToday} trips paid today
            </Text>
          </View>
        </View>

        {/* Withdraw */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Withdraw to Bank
          </Text>
          <View style={styles.withdrawRow}>
            {WITHDRAW_AMOUNTS.map((amt) => (
              <Pressable
                key={amt}
                onPress={() => doWithdraw(amt)}
                accessibilityRole="button"
                accessibilityLabel={`Withdraw NPR ${amt}`}
                style={[styles.withdrawChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
                <Text variant="bodyLg" style={styles.bold}>
                  {amt}
                </Text>
              </Pressable>
            ))}
          </View>
          <Button
            label="Withdraw All"
            variant="secondary"
            onPress={() => doWithdraw(balance)}
            leadingIcon={<Ionicons name="cash-outline" size={18} color={theme.colors.text} />}
            style={styles.withdrawAll}
          />
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Transactions
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
            {history.map((t, i) => (
              <View key={t.id}>
                {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                <View style={styles.txnRow}>
                  <View
                    style={[
                      styles.txnIcon,
                      { backgroundColor: t.kind === 'credit' ? theme.colors.successSubtle : theme.colors.surfaceMuted },
                    ]}>
                    <Ionicons
                      name={t.kind === 'credit' ? 'qr-code' : 'arrow-up'}
                      size={16}
                      color={t.kind === 'credit' ? theme.colors.success : theme.colors.textSecondary}
                    />
                  </View>
                  <Text variant="bodyLg" numberOfLines={1} style={styles.txnLabel}>
                    {t.label}
                  </Text>
                  <Text variant="bodyLg" tone={t.kind === 'credit' ? 'success' : 'primary'} style={styles.bold}>
                    {t.kind === 'credit' ? '+' : '−'}NPR {t.amount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  balanceCard: { borderRadius: 24, padding: 24, marginTop: 4 },
  balanceMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  section: { marginTop: 28 },
  sectionTitle: { marginBottom: 14 },
  bold: { fontWeight: '700' },
  withdrawRow: { flexDirection: 'row', gap: 10 },
  withdrawChip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawAll: { marginTop: 12 },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  txnIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txnLabel: { flex: 1, fontWeight: '500' },
});
