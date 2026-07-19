/**
 * Static demo data standing in for a backend. Coordinates are real Kathmandu
 * valley locations so the map looks right on a device.
 */

import type {
  Driver,
  LatLng,
  NamedPlace,
  SavedPlace,
  Vehicle,
} from '@/types/ride';

/** Default map centre — Balkumari, Lalitpur (the mock's pickup). */
export const DEFAULT_REGION = {
  latitude: 27.6667,
  longitude: 85.3333,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export const CURRENT_PICKUP: NamedPlace = {
  id: 'pickup-balkumari',
  title: 'Balkumari, Lalitpur',
  subtitle: 'Current location',
  coordinate: { latitude: 27.6667, longitude: 85.3333 },
};

export const SAVED_PLACES: SavedPlace[] = [
  {
    id: 'home',
    kind: 'home',
    title: 'Home',
    subtitle: 'Kupandole, Lalitpur',
    coordinate: { latitude: 27.6889, longitude: 85.3138 },
  },
  {
    id: 'work',
    kind: 'work',
    title: 'Work',
    subtitle: 'New Baneshwor',
    coordinate: { latitude: 27.6893, longitude: 85.3436 },
  },
  {
    id: 'exam',
    kind: 'custom',
    title: 'TU Exam Center',
    subtitle: 'Kirtipur',
    coordinate: { latitude: 27.6786, longitude: 85.2896 },
  },
];

export const RECENT_SEARCHES: NamedPlace[] = [
  {
    id: 'thamel',
    title: 'Thamel, Kathmandu',
    coordinate: { latitude: 27.7154, longitude: 85.3123 },
  },
  {
    id: 'tia',
    title: 'Tribhuvan International Airport (TIA)',
    coordinate: { latitude: 27.6966, longitude: 85.3591 },
  },
  {
    id: 'patan-durbar',
    title: 'Patan Durbar Square',
    coordinate: { latitude: 27.6727, longitude: 85.3255 },
  },
  {
    id: 'bhatbhateni',
    title: 'Bhatbhateni Supermarket, Koteshwor',
    coordinate: { latitude: 27.6784, longitude: 85.3497 },
  },
];

/** Searchable place catalogue (recent + a few extras). */
export const PLACE_CATALOGUE: NamedPlace[] = [
  ...RECENT_SEARCHES,
  { id: 'boudha', title: 'Boudhanath Stupa', coordinate: { latitude: 27.7215, longitude: 85.3620 } },
  { id: 'swayambhu', title: 'Swayambhunath', coordinate: { latitude: 27.7149, longitude: 85.2903 } },
  { id: 'durbarmarg', title: 'Durbar Marg, Kathmandu', coordinate: { latitude: 27.7118, longitude: 85.3197 } },
  { id: 'jawalakhel', title: 'Jawalakhel, Lalitpur', coordinate: { latitude: 27.6730, longitude: 85.3110 } },
  { id: 'pulchowk', title: 'Pulchowk, Lalitpur', coordinate: { latitude: 27.6789, longitude: 85.3169 } },
  { id: 'koteshwor', title: 'Koteshwor, Kathmandu', coordinate: { latitude: 27.6784, longitude: 85.3497 } },
];

// Nepal's ride-hailing market is bikes and autos — no cab/car tier.
export const VEHICLES: Vehicle[] = [
  {
    id: 'bike',
    name: 'Bike',
    tagline: 'Affordable rides for short distances',
    fare: 65,
    etaMinutes: 2,
    capacity: 1,
    icon: 'bicycle',
    image: require('../../assets/images/vehicles/bike.png'),
    recommended: true,
  },
  {
    id: 'auto',
    name: 'Auto',
    tagline: 'Quick and affordable auto rides',
    fare: 110,
    etaMinutes: 3,
    capacity: 3,
    icon: 'car-sport',
    image: require('../../assets/images/vehicles/auto.png'),
  },
];

export const DEMO_DRIVER: Driver = {
  id: 'driver-ramesh',
  name: 'Ramesh Shrestha',
  rating: 4.9,
  vehicleName: 'Honda Dio',
  plate: 'BA 12 PA 1234',
  vehicleColor: 'Yellow',
  photoInitials: 'RS',
};

/** Nearby idle vehicles scattered around the pickup, for the map. */
export const NEARBY_VEHICLES: { id: string; coordinate: LatLng; heading: number }[] = [
  { id: 'v1', coordinate: { latitude: 27.6698, longitude: 85.3301 }, heading: 40 },
  { id: 'v2', coordinate: { latitude: 27.6641, longitude: 85.3369 }, heading: 120 },
  { id: 'v3', coordinate: { latitude: 27.6712, longitude: 85.3358 }, heading: 200 },
  { id: 'v4', coordinate: { latitude: 27.6633, longitude: 85.3298 }, heading: 300 },
  { id: 'v5', coordinate: { latitude: 27.6689, longitude: 85.3388 }, heading: 260 },
];

/** Explore-nearby quick categories on the Home screen. */
export const EXPLORE_CATEGORIES: { id: string; label: string; icon: string; color: string }[] = [
  { id: 'airport', label: 'Airport', icon: 'airplane', color: '#4A90D9' },
  { id: 'hotel', label: 'Hotel', icon: 'bed', color: '#E0663B' },
  { id: 'shopping', label: 'Shopping', icon: 'bag-handle', color: '#3FA55A' },
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant', color: '#E0663B' },
  { id: 'hospital', label: 'Hospital', icon: 'medkit', color: '#3B9CE0' },
  { id: 'more', label: 'More', icon: 'ellipsis-horizontal', color: '#8A8A8E' },
];
