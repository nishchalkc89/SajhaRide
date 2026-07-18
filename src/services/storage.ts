/**
 * MMKV-backed synchronous key/value storage.
 *
 * Exposed as a Zustand `StateStorage` so any store can persist itself without
 * knowing the driver. MMKV is synchronous, so rehydration happens on the first
 * render — no loading flash.
 */

import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

// MMKV v4 is a Nitro module: `MMKV` is a type only, instances come from the
// factory. (v2/v3's `new MMKV()` no longer exists.)
export const storage = createMMKV({ id: 'sajharide' });

export const StorageKeys = {
  settings: 'settings',
  onboarding: 'onboarding',
  auth: 'auth',
  recentSearches: 'recent-searches',
} as const;

/** Adapter that lets Zustand's `persist` middleware write to MMKV. */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => void storage.remove(name),
};
