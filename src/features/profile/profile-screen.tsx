/**
 * Profile tab — user header + a settings menu, including the theme switch and
 * sign-out. Reads the mocked auth user.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore, type ThemePreference } from '@/store/settings-store';
import { useTheme } from '@/theme';

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
};

export function ProfileScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const themePref = useSettingsStore((s) => s.themePreference);
  const setThemePref = useSettingsStore((s) => s.setThemePreference);

  const cycleTheme = () => {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themePref) + 1) % order.length];
    haptic('light');
    setThemePref(next);
  };

  const handleSignOut = () => {
    haptic('warning');
    signOut();
    router.replace('/login');
  };

  const groups: { title: string; rows: Row[] }[] = [
    {
      title: 'Account',
      rows: [
        { icon: 'person-outline', label: 'Edit Profile' },
        { icon: 'location-outline', label: 'Saved Places' },
        { icon: 'card-outline', label: 'Payment Methods' },
      ],
    },
    {
      title: 'Preferences',
      rows: [
        {
          icon: theme.scheme === 'dark' ? 'moon' : 'sunny-outline',
          label: `Theme: ${themePref[0].toUpperCase()}${themePref.slice(1)}`,
          onPress: cycleTheme,
        },
        { icon: 'notifications-outline', label: 'Notifications' },
        { icon: 'shield-checkmark-outline', label: 'Safety' },
      ],
    },
    {
      title: 'Support',
      rows: [
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => router.push('/support') },
        { icon: 'document-text-outline', label: 'Terms & Privacy' },
        { icon: 'log-out-outline', label: 'Sign Out', onPress: handleSignOut, danger: true },
      ],
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Text variant="h2" style={styles.screenTitle}>
          Profile
        </Text>

        {/* User header */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="h2" tone="onPrimary">
              {(user?.fullName ?? 'S R')
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text variant="h3" numberOfLines={1}>
              {user?.fullName ?? 'Sajha Rider'}
            </Text>
            <Text variant="body" tone="secondary">
              +977 {user?.phone ?? '9800000000'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
        </View>

        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text variant="overline" tone="tertiary" style={styles.groupTitle}>
              {group.title.toUpperCase()}
            </Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              {group.rows.map((row, i) => (
                <View key={row.label}>
                  {i > 0 ? <View style={[styles.divider, { backgroundColor: theme.colors.border }]} /> : null}
                  <Pressable
                    onPress={row.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={row.label}
                    style={styles.row}>
                    <Ionicons
                      name={row.icon}
                      size={20}
                      color={row.danger ? theme.colors.danger : theme.colors.textSecondary}
                    />
                    <Text
                      variant="bodyLg"
                      tone={row.danger ? 'danger' : 'primary'}
                      style={styles.rowLabel}>
                      {row.label}
                    </Text>
                    {!row.danger ? (
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    ) : null}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text variant="caption" tone="tertiary" align="center" style={styles.version}>
          SajhaRide v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screenTitle: { paddingHorizontal: 20, marginBottom: 16 },
  userCard: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, gap: 2 },
  group: { marginTop: 24, paddingHorizontal: 20 },
  groupTitle: { marginBottom: 8, marginLeft: 4 },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  divider: { height: StyleSheet.hairlineWidth * 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 14,
  },
  rowLabel: { flex: 1, fontWeight: '500' },
  version: { marginTop: 28 },
});
