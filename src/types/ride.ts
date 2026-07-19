/** Domain models for the ride-hailing flow. */

export type LatLng = { latitude: number; longitude: number };

export type NamedPlace = {
  id: string;
  /** Short label, e.g. "Thamel, Kathmandu". */
  title: string;
  /** Optional second line, e.g. a neighbourhood or category. */
  subtitle?: string;
  coordinate: LatLng;
};

export type SavedPlaceKind = 'home' | 'work' | 'custom';

export type SavedPlace = NamedPlace & {
  kind: SavedPlaceKind;
};

export type VehicleId = 'bike' | 'auto';

export type Vehicle = {
  id: VehicleId;
  name: string;
  tagline: string;
  /** Fare in NPR. */
  fare: number;
  etaMinutes: number;
  capacity: number;
  /** Ionicons glyph name representing the vehicle (fallback / map marker). */
  icon: string;
  /** 3D render of the vehicle shown in the ride picker. */
  image: import('react-native').ImageSourcePropType;
  /** Marks the "Recommended / Best for you" option. */
  recommended?: boolean;
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  vehicleName: string;
  plate: string;
  vehicleColor: string;
  photoInitials: string;
};

export type PaymentMethod = 'cash' | 'wallet' | 'card';

/** The lifecycle of a single ride request. */
export type RideStage =
  | 'idle'
  | 'searching' // finding a driver
  | 'assigned' // driver matched, en route to pickup
  | 'arrived' // driver at pickup
  | 'in_progress' // trip underway
  | 'completed';

export type FareBreakdown = {
  base: number;
  distance: number;
  time: number;
  total: number;
  distanceKm: number;
  durationMin: number;
};
