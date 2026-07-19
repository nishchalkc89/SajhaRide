/**
 * Captain bottom tab bar — Home · Earnings · History · Profile.
 * Same floating style as the rider tab bar, amber active tint.
 */

import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

const TABS: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { icon: 'home', label: 'Home' },
  earnings: { icon: 'wallet', label: 'Earnings' },
  history: { icon: 'time', label: 'History' },
  profile: { icon: 'person', label: 'Profile' },
};

export function CaptainTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: insets.bottom + 8, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
        theme.elevation.lg,
      ]}>
      {state.routes.map((route, index) => {
        const config = TABS[route.name];
        if (!config) return null;
        const focused = state.index === index;
        const color = focused ? theme.colors.primary : theme.colors.textTertiary;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={config.label}
            onPress={() => {
              haptic('light');
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.tab}>
            <Ionicons
              name={focused ? config.icon : (`${config.icon}-outline` as keyof typeof Ionicons.glyphMap)}
              size={24}
              color={color}
            />
            <Text variant="caption" style={[styles.label, { color }]} numberOfLines={1}>
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth * 2 },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 11 },
});
