/**
 * Wallet tab — balance card, quick top-up amounts, payment methods and a
 * transaction history. All demo data.
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

type Txn = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  kind: 'debit' | 'credit';
  icon: keyof typeof Ionicons.glyphMap;
};

const TRANSACTIONS: Txn[] = [
  { id: 't1', title: 'Ride to Thamel', subtitle: 'Today, 10:24 AM', amount: -65, kind: 'debit', icon: 'bicycle' },
  { id: 't2', title: 'Wallet Top-up', subtitle: 'Yesterday, 6:10 PM', amount: 500, kind: 'credit', icon: 'add-circle' },
  { id: 't3', title: 'Ride to Airport', subtitle: 'Jul 15, 8:02 AM', amount: -210, kind: 'debit', icon: 'car' },
  { id: 't4', title: 'Referral Reward', subtitle: 'Jul 14, 2:30 PM', amount: 100, kind: 'credit', icon: 'gift' },
];

const TOPUP_AMOUNTS = [200, 500, 1000, 2000];

export function WalletScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.screenTitle}>
          Wallet
        </Text>

        {/* Balance card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.text }]}>
          <Text variant="bodySm" style={{ color: theme.colors.background, opacity: 0.7 }}>
            Available Balance
          </Text>
          <Text variant="display" style={{ color: theme.colors.background, marginTop: 4 }}>
            NPR 1,240
          </Text>
          <View style={styles.balanceActions}>
            <Button
              label="Add Money"
              size="md"
              fullWidth={false}
              leadingIcon={<Ionicons name="add" size={18} color={theme.colors.onPrimary} />}
              onPress={() => toast('Top up via eSewa, Khalti or bank — coming soon')}
            />
            <Button
              label="Withdraw"
              size="md"
              variant="secondary"
              fullWidth={false}
              onPress={() => toast('Withdrawals open once KYC is verified')}
            />
          </View>
        </View>

        {/* Quick top-up */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Quick Top-up
          </Text>
          <View style={styles.topupRow}>
            {TOPUP_AMOUNTS.map((amt) => (
              <Pressable
                key={amt}
                onPress={() => toast(`Adding NPR ${amt} to your wallet…`, 'success')}
                accessibilityRole="button"
                accessibilityLabel={`Top up NPR ${amt}`}
                style={[
                  styles.topupChip,
                  { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
                ]}>
                <Text variant="bodyLg" style={styles.topupText}>
                  {amt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Recent Transactions
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            {TRANSACTIONS.map((t, i) => (
              <View key={t.id}>
                {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                <View style={styles.txnRow}>
                  <View
                    style={[
                      styles.txnIcon,
                      {
                        backgroundColor:
                          t.kind === 'credit' ? theme.colors.successSubtle : theme.colors.surfaceMuted,
                      },
                    ]}>
                    <Ionicons
                      name={t.icon}
                      size={18}
                      color={t.kind === 'credit' ? theme.colors.success : theme.colors.textSecondary}
                    />
                  </View>
                  <View style={styles.txnBody}>
                    <Text variant="bodyLg" numberOfLines={1} style={styles.txnTitle}>
                      {t.title}
                    </Text>
                    <Text variant="caption" tone="tertiary">
                      {t.subtitle}
                    </Text>
                  </View>
                  <Text
                    variant="bodyLg"
                    tone={t.kind === 'credit' ? 'success' : 'primary'}
                    style={styles.txnAmount}>
                    {t.kind === 'credit' ? '+' : '−'}NPR {Math.abs(t.amount)}
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
  screenTitle: { paddingHorizontal: 20, marginBottom: 16 },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
  },
  balanceActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { marginBottom: 14 },
  topupRow: { flexDirection: 'row', gap: 10 },
  topupChip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topupText: { fontWeight: '600' },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnBody: { flex: 1, gap: 2 },
  txnTitle: { fontWeight: '500' },
  txnAmount: { fontWeight: '600' },
});
