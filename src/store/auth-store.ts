/**
 * Auth session. No backend yet — login/verify are mocked, but the shape mirrors
 * a real token flow so wiring an API later is a drop-in.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StorageKeys, zustandStorage } from '@/services/storage';

export type AuthUser = {
  fullName: string;
  phone: string; // national number, no dial code
  email?: string;
};

type AuthState = {
  user: AuthUser | null;
  /** Number currently mid-verification (between login/signup and OTP). */
  pendingPhone: string | null;
  isAuthenticated: boolean;
  startVerification: (phone: string, user?: Partial<AuthUser>) => void;
  /** Completes the mocked OTP step and marks the session authenticated. */
  confirmVerification: () => void;
  signOut: () => void;
};

/** Carried across the OTP screen without persisting (cleared on confirm). */
let pendingUser: Partial<AuthUser> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingPhone: null,
      isAuthenticated: false,

      startVerification: (phone, user) => {
        pendingUser = user ?? null;
        set({ pendingPhone: phone });
      },

      confirmVerification: () => {
        const phone = get().pendingPhone;
        if (!phone) return;
        set({
          isAuthenticated: true,
          pendingPhone: null,
          user: {
            fullName: pendingUser?.fullName ?? 'Sajha Rider',
            phone,
            email: pendingUser?.email,
          },
        });
        pendingUser = null;
      },

      signOut: () => set({ user: null, isAuthenticated: false, pendingPhone: null }),
    }),
    {
      name: StorageKeys.auth,
      storage: createJSONStorage(() => zustandStorage),
      // Only the durable session is persisted; pendingPhone is transient.
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
