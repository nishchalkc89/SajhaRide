/**
 * App-level preferences. Persisted to MMKV so the choice survives a cold start.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys, zustandStorage } from '@/services/storage';

/** `system` defers to the OS; the other two are explicit user overrides. */
export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  themePreference: ThemePreference;
  hapticsEnabled: boolean;
  setThemePreference: (pref: ThemePreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      hapticsEnabled: true,
      setThemePreference: (themePreference) => set({ themePreference }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: StorageKeys.settings,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
