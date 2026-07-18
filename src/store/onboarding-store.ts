/**
 * Tracks whether the user has cleared onboarding. Persisted, so the carousel
 * is shown exactly once per install.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys, zustandStorage } from '@/services/storage';

type OnboardingState = {
  hasCompleted: boolean;
  complete: () => void;
  /** Dev/QA affordance — lets the flow be replayed without reinstalling. */
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompleted: false,
      complete: () => set({ hasCompleted: true }),
      reset: () => set({ hasCompleted: false }),
    }),
    {
      name: StorageKeys.onboarding,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
