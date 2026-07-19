/**
 * Captain (driver) session — a Rapido-style multi-screen flow.
 *
 * The ride pipeline is a stage machine; the captain UI is a set of routed
 * screens that read/advance `stage`:
 *   offline → online → requested → accepted → to_pickup → arrived → waiting
 *   → riding → reached → completed → (rate) → online
 *
 * Identity/wallet/day-totals persist; the active request + stage are ephemeral.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/storage';
import type { LatLng, VehicleId } from '@/types/ride';

/** The 4-digit OTP the captain collects from the customer to start the ride. */
export const CAPTAIN_START_PIN = '4242';

export type CaptainStage =
  | 'offline'
  | 'online' // waiting for requests
  | 'requested' // an incoming request card is on screen
  | 'accepted' // accepted, "Ride Accepted" confirmation
  | 'to_pickup' // navigating to the pickup
  | 'arrived' // reached pickup, waiting for the customer
  | 'riding' // OTP verified, trip underway
  | 'reached' // destination reached, collecting payment
  | 'completed'; // paid + credited

export type CaptainPayment = 'cash' | 'upi';

export type RideRequest = {
  id: string;
  riderName: string;
  riderRating: number;
  riderRides: number;
  pickupTitle: string;
  pickupAddress: string;
  pickupCoord: LatLng;
  dropTitle: string;
  dropAddress: string;
  dropCoord: LatLng;
  /** Distance from the captain to the pickup. */
  pickupDistanceKm: number;
  /** Total trip distance pickup→drop. */
  totalDistanceKm: number;
  etaMinutes: number;
  fare: number;
  vehicle: VehicleId;
};

/** The captain's registered identity + vehicle. */
export type CaptainProfile = {
  fullName: string;
  phone: string;
  email: string;
  citizenshipNo: string;
  licenseNo: string;
  vehicleType: VehicleId;
  vehicleModel: string;
  plate: string;
  rating: number;
  documents: { bikePhoto: boolean; license: boolean; citizenship: boolean };
};

type CaptainState = {
  stage: CaptainStage;
  request: RideRequest | null;
  paymentMethod: CaptainPayment;
  profile: CaptainProfile | null;
  walletBalance: number;
  earningsToday: number;
  tripsToday: number;
  onlineMinutes: number;

  registerCaptain: (profile: CaptainProfile) => void;
  creditWallet: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  goOnline: () => void;
  goOffline: () => void;
  receiveRequest: (request: RideRequest) => void;
  acceptRequest: () => void;
  declineRequest: () => void;
  startNavigation: () => void;
  arriveAtPickup: () => void;
  startRide: () => void;
  reachDestination: () => void;
  setPaymentMethod: (method: CaptainPayment) => void;
  collectPayment: () => void;
  finishRide: () => void;
};

export const useCaptainStore = create<CaptainState>()(
  persist(
    (set, get) => ({
      stage: 'offline',
      request: null,
      paymentMethod: 'cash',
      profile: null,
      walletBalance: 2480,
      earningsToday: 1240,
      tripsToday: 12,
      onlineMinutes: 214,

      registerCaptain: (profile) => set({ profile }),
      creditWallet: (amount) => set({ walletBalance: get().walletBalance + amount }),
      withdraw: (amount) => {
        if (amount <= 0 || amount > get().walletBalance) return false;
        set({ walletBalance: get().walletBalance - amount });
        return true;
      },

      goOnline: () => set({ stage: 'online' }),
      goOffline: () => set({ stage: 'offline', request: null }),

      receiveRequest: (request) => {
        if (get().stage === 'online') set({ stage: 'requested', request });
      },
      declineRequest: () => set({ stage: 'online', request: null }),
      acceptRequest: () => {
        if (get().request) set({ stage: 'accepted' });
      },
      startNavigation: () => set({ stage: 'to_pickup' }),
      arriveAtPickup: () => set({ stage: 'arrived' }),
      startRide: () => set({ stage: 'riding' }),
      reachDestination: () => set({ stage: 'reached' }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      collectPayment: () => {
        const { request, earningsToday, tripsToday, walletBalance } = get();
        const fare = request?.fare ?? 0;
        set({
          stage: 'completed',
          earningsToday: earningsToday + fare,
          tripsToday: tripsToday + 1,
          walletBalance: walletBalance + fare,
        });
      },
      finishRide: () => set({ stage: 'online', request: null, paymentMethod: 'cash' }),
    }),
    {
      name: 'captain',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({
        profile: s.profile,
        walletBalance: s.walletBalance,
        earningsToday: s.earningsToday,
        tripsToday: s.tripsToday,
        onlineMinutes: s.onlineMinutes,
      }),
    }
  )
);
