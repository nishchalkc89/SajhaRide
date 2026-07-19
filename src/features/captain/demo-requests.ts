/** Sample incoming ride requests for the captain demo. */

import type { RideRequest } from '@/store/captain-store';

export const DEMO_REQUESTS: RideRequest[] = [
  {
    id: 'req-1',
    riderName: 'Anisha Gurung',
    riderRating: 4.8,
    pickupTitle: 'Balkumari, Lalitpur',
    pickupCoord: { latitude: 27.6667, longitude: 85.3333 },
    dropTitle: 'Thamel, Kathmandu',
    dropCoord: { latitude: 27.7154, longitude: 85.3123 },
    distanceKm: 6.2,
    fare: 165,
    vehicle: 'bike',
  },
  {
    id: 'req-2',
    riderName: 'Bibek Thapa',
    riderRating: 4.6,
    pickupTitle: 'Pulchowk, Lalitpur',
    pickupCoord: { latitude: 27.6789, longitude: 85.3169 },
    dropTitle: 'Koteshwor, Kathmandu',
    dropCoord: { latitude: 27.6784, longitude: 85.3497 },
    distanceKm: 4.1,
    fare: 120,
    vehicle: 'auto',
  },
  {
    id: 'req-3',
    riderName: 'Sarita Maharjan',
    riderRating: 4.9,
    pickupTitle: 'Jawalakhel, Lalitpur',
    pickupCoord: { latitude: 27.673, longitude: 85.311 },
    dropTitle: 'Boudhanath Stupa',
    dropCoord: { latitude: 27.7215, longitude: 85.362 },
    distanceKm: 8.4,
    fare: 210,
    vehicle: 'bike',
  },
];

/** Pick a pseudo-random request. */
export function nextDemoRequest(): RideRequest {
  const i = Math.floor(Math.random() * DEMO_REQUESTS.length);
  return { ...DEMO_REQUESTS[i], id: `req-${Date.now()}` };
}
