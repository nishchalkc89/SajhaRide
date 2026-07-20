/** Geo helpers: great-circle distance for fare/ETA estimation. */

import type { LatLng } from '@/types/ride';

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Haversine distance between two coordinates, in kilometres. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Road distance is longer than the straight line — scale the great-circle
 * distance by a typical urban winding factor for a realistic estimate.
 */
export function roadDistanceKm(a: LatLng, b: LatLng): number {
  return distanceKm(a, b) * 1.35;
}
