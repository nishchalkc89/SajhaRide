/**
 * ToastHost — renders the active toast near the bottom of the screen and auto-
 * dismisses it. Mounted once in the root layout, above all screens.
 *
 * Kept animation-free (a plain conditional mount) so it behaves identically on
 * web and native, where the animation drivers differ.
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore, type ToastVariant } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { Text } from './text';

const DISMISS_MS = 2800;

const ICON: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  default: 'information-circle',
  success: 'checkmark-circle',
  error: 'alert-circle',
};

export function ToastHost() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const id = useToastStore((s) => s.id);
  const message = useToastStore((s) => s.message);
  const variant = useToastStore((s) => s.variant);
  const hide = useToastStore((s) => s.hide);

  // Re-arm the timer whenever a new toast is shown (id changes).
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, DISMISS_MS);
    return () => clearTimeout(t);
  }, [id, message, hide]);

  if (!message) return null;

  const accent =
    variant === 'success'
      ? theme.colors.success
      : variant === 'error'
        ? theme.colors.danger
        : theme.colors.primary;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: insets.bottom + 90 }]}>
      <Pressable
        onPress={hide}
        accessibilityRole="alert"
        accessibilityLabel={message}
        style={[styles.toast, { backgroundColor: theme.colors.text }, theme.elevation.lg]}>
        <Ionicons name={ICON[variant]} size={20} color={accent} />
        <Text variant="bodySm" numberOfLines={2} style={[styles.text, { color: theme.colors.background }]}>
          {message}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  text: { flexShrink: 1 },
});
