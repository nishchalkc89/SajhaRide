/**
 * Ride session state — the single source of truth for the booking flow.
 *
 * Not persisted: a ride is ephemeral. Screens read pickup/destination/vehicle
 * and drive `stage` forward. Fare is DISTANCE-BASED: derived from the road
 * distance between pickup and destination and the selected vehicle's rate card.
 */

import { create } from 'zustand';

import { CURRENT_PICKUP, DEMO_DRIVER, VEHICLES } from '@/services/mock-data';
import type {
  Driver,
  FareBreakdown,
  NamedPlace,
  PaymentMethod,
  RideStage,
  Vehicle,
  VehicleId,
} from '@/types/ride';
import { roadDistanceKm } from '@/utils/geo';

type RideState = {
  pickup: NamedPlace;
  destination: NamedPlace | null;
  vehicle: Vehicle;
  /** Road distance pickup→destination in km (0 until a destination is set). */
  distanceKm: number;
  stage: RideStage;
  driver: Driver | null;
  paymentMethod: PaymentMethod;
  rating: number;
  /** Rapido-style fixed 4-digit start PIN the rider shares with the captain. */
  ridePin: string;

  setPickup: (place: NamedPlace) => void;
  setDestination: (place: NamedPlace | null) => void;
  selectVehicle: (id: VehicleId) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setStage: (stage: RideStage) => void;
  assignDriver: () => void;
  setRating: (rating: number) => void;
  /** Fare for the current trip with the selected vehicle. */
  currentFare: () => number;
  fareBreakdown: () => FareBreakdown;
  reset: () => void;
};

const DEFAULT_VEHICLE = VEHICLES.find((v) => v.recommended) ?? VEHICLES[0];

/** Estimated trip minutes from distance (≈22 km/h average city speed). */
export function estimateMinutes(km: number): number {
  return Math.max(3, Math.round((km / 22) * 60));
}

/**
 * Distance-based fare: flag-down + per-km, floored at the vehicle's minimum.
 * Rounded to the nearest NPR 5. Pure, so screens can `useMemo` it safely.
 */
export function computeFare(vehicle: Vehicle, km: number): number {
  if (km <= 0) return vehicle.minFare;
  const raw = vehicle.baseFare + vehicle.perKm * km;
  const rounded = Math.round(raw / 5) * 5;
  return Math.max(vehicle.minFare, rounded);
}

/** Itemised breakdown from the vehicle + distance. */
export function computeFareBreakdown(vehicle: Vehicle, km: number): FareBreakdown {
  const distanceKm = km > 0 ? Math.round(km * 10) / 10 : 0;
  const total = computeFare(vehicle, distanceKm);
  const durationMin = estimateMinutes(distanceKm);
  const distanceCharge = Math.round(vehicle.perKm * distanceKm);
  const base = vehicle.baseFare;
  // Any rounding/minimum adjustment lands in a small "time & surge" line.
  const time = Math.max(0, total - base - distanceCharge);
  return { base, distance: distanceCharge, time, total, distanceKm, durationMin };
}

export const useRideStore = create<RideState>((set, get) => ({
  pickup: CURRENT_PICKUP,
  destination: null,
  vehicle: DEFAULT_VEHICLE,
  distanceKm: 0,
  stage: 'idle',
  driver: null,
  paymentMethod: 'cash',
  rating: 0,
  ridePin: '4 2 4 2',

  setPickup: (pickup) => {
    const { destination } = get();
    set({ pickup, distanceKm: destination ? roadDistanceKm(pickup.coordinate, destination.coordinate) : 0 });
  },
  setDestination: (destination) => {
    const { pickup } = get();
    set({ destination, distanceKm: destination ? roadDistanceKm(pickup.coordinate, destination.coordinate) : 0 });
  },
  selectVehicle: (id) => {
    const vehicle = VEHICLES.find((v) => v.id === id);
    if (vehicle) set({ vehicle });
  },
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStage: (stage) => set({ stage }),
  assignDriver: () => set({ driver: DEMO_DRIVER, stage: 'assigned' }),
  setRating: (rating) => set({ rating }),

  currentFare: () => computeFare(get().vehicle, get().distanceKm),
  fareBreakdown: () => computeFareBreakdown(get().vehicle, get().distanceKm),

  reset: () =>
    set({
      destination: null,
      vehicle: DEFAULT_VEHICLE,
      distanceKm: 0,
      stage: 'idle',
      driver: null,
      rating: 0,
      paymentMethod: 'cash',
    }),
}));
