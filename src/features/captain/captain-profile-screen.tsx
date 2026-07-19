/**
 * Captain Profile — a driver-oriented profile, distinct from the passenger's:
 * vehicle + documents, rating, quick links to Earnings and Wallet, online
 * status, and a switch back to the passenger side.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

export function CaptainProfileScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const profile = useCaptainStore((s) => s.profile);
  const balance = useCaptainStore((s) => s.walletBalance);
  const earningsToday = useCaptainStore((s) => s.earningsToday);
  const tripsToday = useCaptainStore((s) => s.tripsToday);

  const name = profile?.fullName ?? 'SajhaRide Captain';
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  const links: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; onPress: () => void }[] = [
    { icon: 'wallet', label: 'Wallet', value: `NPR ${balance.toLocaleString()}`, onPress: () => router.push('/captain/wallet') },
    { icon: 'stats-chart', label: 'Earnings', value: `NPR ${earningsToday} today`, onPress: () => router.push('/captain/earnings') },
    { icon: 'car-sport', label: 'Vehicle', value: profile?.vehicleModel ?? '—', onPress: () => toast('Vehicle details') },
    { icon: 'document-text', label: 'Documents', value: 'Verified', onPress: () => toast('Documents verified') },
    { icon: 'shield-checkmark', label: 'Safety Center', onPress: () => toast('Safety center') },
    { icon: 'help-circle', label: 'Help & Support', onPress: () => router.push('/support') },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Captain Profile" onBack={() => router.replace('/captain')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 24 }}>
        {/* Identity */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="h2" tone="onPrimary">
              {initials}
            </Text>
          </View>
          <Text variant="h3" style={styles.name}>
            {name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={theme.colors.primary} />
            <Text variant="bodySm" tone="secondary">
              {(profile?.rating ?? 5).toFixed(1)} · {profile?.vehicleType === 'auto' ? 'Auto' : 'Bike'} Captain
            </Text>
          </View>
          {profile?.plate ? (
            <View style={[styles.plate, { backgroundColor: theme.colors.surfaceMuted }]}>
              <Text variant="bodySm" style={styles.plateText}>
                {profile.plate}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stat strip */}
        <View style={[styles.stats, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <Stat value={`${tripsToday}`} label="Trips today" theme={theme} />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <Stat value={`NPR ${earningsToday}`} label="Earned today" theme={theme} />
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <Stat value="98%" label="Acceptance" theme={theme} />
        </View>

        {/* Links */}
        <View style={[styles.linkCard, { backgroundColor: theme.colors.surface }]}>
          {links.map((l, i) => (
            <View key={l.label}>
              {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
              <Pressable onPress={l.onPress} accessibilityRole="button" accessibilityLabel={l.label} style={styles.linkRow}>
                <Ionicons name={l.icon} size={20} color={theme.colors.textSecondary} />
                <Text variant="bodyLg" style={styles.linkLabel}>
                  {l.label}
                </Text>
                {l.value ? (
                  <Text variant="bodySm" tone="secondary" style={styles.linkValue}>
                    {l.value}
                  </Text>
                ) : null}
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Switch back to passenger */}
        <Pressable
          onPress={() => {
            haptic('medium');
            router.replace('/(tabs)/home');
          }}
          accessibilityRole="button"
          style={[styles.switchBtn, { borderColor: theme.colors.border }]}>
          <Ionicons name="swap-horizontal" size={18} color={theme.colors.text} />
          <Text variant="label">Switch to Passenger</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label, theme }: { value: string; label: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.stat}>
      <Text variant="bodyLg" style={styles.statValue}>
        {value}
      </Text>
      <Text variant="caption" tone="tertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { alignItems: 'center', borderRadius: 20, padding: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  plate: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  plateText: { fontWeight: '700', letterSpacing: 1 },
  stats: { flexDirection: 'row', borderRadius: 16, paddingVertical: 16, marginTop: 16 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontWeight: '700' },
  statDivider: { width: StyleSheet.hairlineWidth * 2 },
  linkCard: { borderRadius: 16, paddingHorizontal: 16, marginTop: 16 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 14 },
  linkLabel: { flex: 1, fontWeight: '500' },
  linkValue: { marginRight: 4 },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 24,
  },
});
