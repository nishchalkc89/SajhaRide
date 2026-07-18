/**
 * Custom bottom tab bar for the main app shell.
 *
 * Floating rounded surface, amber active tint, safe-area aware. Renders the
 * icons for the four primary destinations; the active tab's icon lifts and
 * colours in.
 */

import { Ionicons } from '@expo/vector-icons';
// expo-router ships its own bottom-tabs types; using @react-navigation's here
// produces a subtly incompatible BottomTabBarProps.
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

/** Icon + label per route name. */
const TABS: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  home: { icon: 'home', label: 'Home' },
  bookings: { icon: 'receipt', label: 'Bookings' },
  wallet: { icon: 'wallet', label: 'Wallet' },
  profile: { icon: 'person', label: 'Profile' },
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
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
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.tab}>
            <Ionicons
              name={focused ? config.icon : (`${config.icon}-outline` as keyof typeof Ionicons.glyphMap)}
              size={24}
              color={color}
            />
            <Text
              variant="caption"
              style={[styles.label, { color }]}
              // Active label is a touch heavier.
              numberOfLines={1}>
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
  },
});
