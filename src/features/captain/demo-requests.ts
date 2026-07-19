/** Sample incoming ride requests for the captain demo. */

import type { RideRequest } from '@/store/captain-store';

export const DEMO_REQUESTS: RideRequest[] = [
  {
    id: 'req-1',
    riderName: 'Rahul Sharma',
    riderRating: 4.8,
    riderRides: 124,
    pickupTitle: 'Balkumari',
    pickupAddress: 'Balkumari Chowk, Lalitpur 44700',
    pickupCoord: { latitude: 27.6667, longitude: 85.3333 },
    dropTitle: 'Thamel',
    dropAddress: 'Thamel Marg, Kathmandu 44600',
    dropCoord: { latitude: 27.7154, longitude: 85.3123 },
    pickupDistanceKm: 2.3,
    totalDistanceKm: 8.7,
    etaMinutes: 18,
    fare: 165,
    vehicle: 'bike',
  },
  {
    id: 'req-2',
    riderName: 'Anisha Gurung',
    riderRating: 4.9,
    riderRides: 86,
    pickupTitle: 'Pulchowk',
    pickupAddress: 'Pulchowk, Lalitpur 44700',
    pickupCoord: { latitude: 27.6789, longitude: 85.3169 },
    dropTitle: 'Koteshwor',
    dropAddress: 'Koteshwor, Kathmandu 44600',
    dropCoord: { latitude: 27.6784, longitude: 85.3497 },
    pickupDistanceKm: 1.4,
    totalDistanceKm: 4.1,
    etaMinutes: 12,
    fare: 120,
    vehicle: 'auto',
  },
  {
    id: 'req-3',
    riderName: 'Bibek Thapa',
    riderRating: 4.6,
    riderRides: 42,
    pickupTitle: 'Jawalakhel',
    pickupAddress: 'Jawalakhel, Lalitpur 44700',
    pickupCoord: { latitude: 27.673, longitude: 85.311 },
    dropTitle: 'Boudhanath',
    dropAddress: 'Boudha, Kathmandu 44600',
    dropCoord: { latitude: 27.7215, longitude: 85.362 },
    pickupDistanceKm: 3.1,
    totalDistanceKm: 9.4,
    etaMinutes: 22,
    fare: 210,
    vehicle: 'bike',
  },
];

/** Pick a pseudo-random request. */
export function nextDemoRequest(): RideRequest {
  const i = Math.floor(Math.random() * DEMO_REQUESTS.length);
  return { ...DEMO_REQUESTS[i], id: `req-${Date.now()}` };
}
