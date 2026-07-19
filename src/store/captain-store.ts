/**
 * Captain (driver) session — mirrors the Rapido captain flow.
 *
 * Lifecycle:
 *   offline → online (waiting) → requested (incoming) → accepted (to pickup)
 *   → arrived (enter PIN) → riding → completed → back to online.
 *
 * Earnings/trip counters persist for the day; the active request is ephemeral.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/storage';
import type { LatLng, VehicleId } from '@/types/ride';

/** The 4-digit start PIN the captain collects from the rider (Rapido Rapid PIN). */
export const CAPTAIN_START_PIN = '4242';

export type CaptainStage =
  | 'offline'
  | 'online' // waiting for requests
  | 'requested' // an incoming request is on screen
  | 'accepted' // heading to pickup
  | 'arrived' // at pickup, verifying PIN
  | 'riding' // trip underway
  | 'completed';

export type RideRequest = {
  id: string;
  riderName: string;
  riderRating: number;
  pickupTitle: string;
  pickupCoord: LatLng;
  dropTitle: string;
  dropCoord: LatLng;
  distanceKm: number;
  fare: number;
  vehicle: VehicleId;
};

type CaptainState = {
  stage: CaptainStage;
  request: RideRequest | null;
  /** Today's totals. */
  earningsToday: number;
  tripsToday: number;
  onlineMinutes: number;

  goOnline: () => void;
  goOffline: () => void;
  receiveRequest: (request: RideRequest) => void;
  acceptRequest: () => void;
  declineRequest: () => void;
  arriveAtPickup: () => void;
  startRide: () => void;
  completeRide: () => void;
  dismissCompleted: () => void;
};

export const useCaptainStore = create<CaptainState>()(
  persist(
    (set, get) => ({
      stage: 'offline',
      request: null,
      earningsToday: 840,
      tripsToday: 6,
      onlineMinutes: 214,

      goOnline: () => set({ stage: 'online' }),
      goOffline: () => set({ stage: 'offline', request: null }),

      receiveRequest: (request) => {
        // Only surface a request while genuinely idle-online.
        if (get().stage === 'online') set({ stage: 'requested', request });
      },
      declineRequest: () => set({ stage: 'online', request: null }),
      acceptRequest: () => {
        if (get().request) set({ stage: 'accepted' });
      },
      arriveAtPickup: () => set({ stage: 'arrived' }),
      startRide: () => set({ stage: 'riding' }),

      completeRide: () => {
        const { request, earningsToday, tripsToday } = get();
        set({
          stage: 'completed',
          earningsToday: earningsToday + (request?.fare ?? 0),
          tripsToday: tripsToday + 1,
        });
      },
      dismissCompleted: () => set({ stage: 'online', request: null }),
    }),
    {
      name: 'captain',
      storage: createJSONStorage(() => zustandStorage),
      // Persist the day's tallies only; session stage/request stay in memory.
      partialize: (s) => ({
        earningsToday: s.earningsToday,
        tripsToday: s.tripsToday,
        onlineMinutes: s.onlineMinutes,
      }),
    }
  )
);
