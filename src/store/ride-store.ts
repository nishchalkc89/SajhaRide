/**
 * Ride session state — the single source of truth for the booking flow.
 *
 * Not persisted: a ride is ephemeral. Screens read pickup/destination/vehicle
 * and drive `stage` forward. Fare is derived from the selected vehicle.
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

type RideState = {
  pickup: NamedPlace;
  destination: NamedPlace | null;
  vehicle: Vehicle;
  stage: RideStage;
  driver: Driver | null;
  paymentMethod: PaymentMethod;
  rating: number;

  setPickup: (place: NamedPlace) => void;
  setDestination: (place: NamedPlace | null) => void;
  selectVehicle: (id: VehicleId) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setStage: (stage: RideStage) => void;
  assignDriver: () => void;
  setRating: (rating: number) => void;
  fareBreakdown: () => FareBreakdown;
  reset: () => void;
};

const DEFAULT_VEHICLE = VEHICLES.find((v) => v.recommended) ?? VEHICLES[0];

/**
 * Pure fare breakdown from a vehicle's headline fare. Kept standalone so screens
 * can `useMemo` it — calling it inside a Zustand selector would allocate a new
 * object every render and trip the "getSnapshot should be cached" loop.
 */
export function computeFareBreakdown(vehicle: Vehicle): FareBreakdown {
  const base = 50;
  const remainder = Math.max(0, vehicle.fare - base);
  const distance = Math.round(remainder * 0.8);
  const time = vehicle.fare - base - distance;
  return { base, distance, time, total: vehicle.fare, distanceKm: 3.2, durationMin: 10 };
}

export const useRideStore = create<RideState>((set, get) => ({
  pickup: CURRENT_PICKUP,
  destination: null,
  vehicle: DEFAULT_VEHICLE,
  stage: 'idle',
  driver: null,
  paymentMethod: 'cash',
  rating: 0,

  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  selectVehicle: (id) => {
    const vehicle = VEHICLES.find((v) => v.id === id);
    if (vehicle) set({ vehicle });
  },
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStage: (stage) => set({ stage }),
  assignDriver: () => set({ driver: DEMO_DRIVER, stage: 'assigned' }),
  setRating: (rating) => set({ rating }),

  fareBreakdown: () => computeFareBreakdown(get().vehicle),

  reset: () =>
    set({
      destination: null,
      vehicle: DEFAULT_VEHICLE,
      stage: 'idle',
      driver: null,
      rating: 0,
      paymentMethod: 'cash',
    }),
}));
