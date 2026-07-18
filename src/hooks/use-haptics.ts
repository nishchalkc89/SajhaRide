/**
 * Haptics wrapper that respects the user's setting and no-ops on web.
 *
 * Every call is fire-and-forget: a failed haptic must never reject into a
 * component's render or press handler.
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { useSettingsStore } from '@/store/settings-store';

export type HapticFeedback = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.hapticsEnabled);

  return useCallback(
    (type: HapticFeedback = 'light') => {
      if (!enabled || Platform.OS === 'web') return;

      const run = () => {
        switch (type) {
          case 'light':
            return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          case 'medium':
            return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          case 'heavy':
            return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          case 'success':
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          case 'warning':
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          case 'error':
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      };

      void run()?.catch(() => {});
    },
    [enabled]
  );
}
