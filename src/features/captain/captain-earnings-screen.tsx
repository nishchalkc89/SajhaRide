/**
 * Captain Earnings — today's payout, a weekly bar chart, an incentive-progress
 * card and a trip breakdown. Reads the running totals from the captain store.
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useCaptainStore } from '@/store/captain-store';
import { useTheme } from '@/theme';

const WEEK = [
  { day: 'Mon', amount: 720 },
  { day: 'Tue', amount: 540 },
  { day: 'Wed', amount: 960 },
  { day: 'Thu', amount: 610 },
  { day: 'Fri', amount: 1180 },
  { day: 'Sat', amount: 840 },
  { day: 'Sun', amount: 0 },
];

const INCENTIVE_TARGET = 10;

export function CaptainEarningsScreenView() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const earningsToday = useCaptainStore((s) => s.earningsToday);
  const tripsToday = useCaptainStore((s) => s.tripsToday);
  const onlineMinutes = useCaptainStore((s) => s.onlineMinutes);

  const maxWeek = Math.max(...WEEK.map((w) => w.amount), 1);
  const weekTotal = WEEK.reduce((sum, w) => sum + w.amount, 0);
  const incentivePct = Math.min(1, tripsToday / INCENTIVE_TARGET);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Earnings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        {/* Today card */}
        <View style={[styles.todayCard, { backgroundColor: theme.colors.text }]}>
          <Text variant="bodySm" style={{ color: theme.colors.background, opacity: 0.7 }}>
            Today's Earnings
          </Text>
          <Text variant="display" style={{ color: theme.colors.background, marginTop: 4 }}>
            NPR {earningsToday}
          </Text>
          <View style={styles.todayStats}>
            <TodayStat icon="bicycle" label={`${tripsToday} trips`} theme={theme} />
            <TodayStat icon="time" label={`${Math.floor(onlineMinutes / 60)}h ${onlineMinutes % 60}m online`} theme={theme} />
          </View>
        </View>

        {/* Weekly chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">This Week</Text>
            <Text variant="bodyLg" tone="brand" style={styles.bold}>
              NPR {weekTotal}
            </Text>
          </View>
          <View style={[styles.chart, { backgroundColor: theme.colors.background }]}>
            {WEEK.map((w) => (
              <View key={w.day} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(w.amount / maxWeek) * 100}%`,
                        backgroundColor: w.amount === maxWeek ? theme.colors.primary : theme.colors.primarySubtle,
                      },
                    ]}
                  />
                </View>
                <Text variant="caption" tone="tertiary">
                  {w.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Incentive */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitleGap}>
            Daily Incentive
          </Text>
          <View style={[styles.incentiveCard, { backgroundColor: theme.colors.primarySubtle }]}>
            <View style={styles.incentiveTop}>
              <Ionicons name="gift" size={22} color={theme.colors.primary} />
              <Text variant="bodyLg" style={styles.bold}>
                Complete {INCENTIVE_TARGET} trips → earn NPR 300 bonus
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface }]}>
              <View
                style={[styles.progressFill, { width: `${incentivePct * 100}%`, backgroundColor: theme.colors.primary }]}
              />
            </View>
            <Text variant="caption" tone="secondary">
              {tripsToday} of {INCENTIVE_TARGET} trips completed
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TodayStat({
  icon,
  label,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.todayStat}>
      <Ionicons name={icon} size={16} color={theme.colors.background} style={{ opacity: 0.8 }} />
      <Text variant="bodySm" style={{ color: theme.colors.background, opacity: 0.85 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  todayCard: { borderRadius: 24, padding: 24, marginTop: 4 },
  todayStats: { flexDirection: 'row', gap: 20, marginTop: 16 },
  todayStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  section: { marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitleGap: { marginBottom: 14 },
  bold: { fontWeight: '700' },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    borderRadius: 16,
    padding: 16,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 8, height: '100%' },
  barTrack: { flex: 1, width: 14, justifyContent: 'flex-end' },
  bar: { width: 14, borderRadius: 7, minHeight: 4 },
  incentiveCard: { borderRadius: 16, padding: 16, gap: 12 },
  incentiveTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
});
