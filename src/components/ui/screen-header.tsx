/**
 * ScreenHeader — a circular back button, optional centered title, optional
 * right slot. Matches the floating back control used across the mocks.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './text';

export type ScreenHeaderProps = {
  title?: string;
  /** Override the default router.back() behaviour. */
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, onBack, showBack = true, right }: ScreenHeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={[styles.row, { paddingHorizontal: theme.screenPadding }]}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={[
              styles.iconButton,
              {
                width: theme.sizing.iconButton,
                height: theme.sizing.iconButton,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.surface,
              },
              theme.elevation.sm,
            ]}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </Pressable>
        ) : null}
      </View>

      {title ? (
        <Text variant="h3" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}

      <View style={[styles.side, styles.rightSide]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    minWidth: 40,
    justifyContent: 'center',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
