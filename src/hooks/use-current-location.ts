/**
 * Cross-platform current-location hook.
 *
 * Web  → navigator.geolocation + OSM Nominatim reverse geocode (keyless).
 * Native → expo-location (permission + position + reverseGeocodeAsync).
 *
 * Returns the coordinate and a best-effort place name so the map can centre on
 * the user's ACTUAL position rather than a hardcoded city.
 */

import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import type { LatLng, NamedPlace } from '@/types/ride';

async function reverseGeocodeWeb(coord: LatLng): Promise<{ title: string; subtitle?: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coord.latitude}&lon=${coord.longitude}&zoom=16&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    const data = await res.json();
    const a = data?.address ?? {};
    const title =
      a.suburb || a.neighbourhood || a.village || a.town || a.city_district || a.city || a.county || 'Current Location';
    const subtitle = a.city || a.town || a.county || a.state;
    return { title, subtitle: subtitle && subtitle !== title ? subtitle : undefined };
  } catch {
    return { title: 'Current Location' };
  }
}

async function reverseGeocodeNative(coord: LatLng): Promise<{ title: string; subtitle?: string }> {
  try {
    const [place] = await Location.reverseGeocodeAsync(coord);
    if (!place) return { title: 'Current Location' };
    const title = place.district || place.subregion || place.city || place.name || 'Current Location';
    const subtitle = place.city || place.region || undefined;
    return { title, subtitle: subtitle && subtitle !== title ? subtitle : undefined };
  } catch {
    return { title: 'Current Location' };
  }
}

export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);

  /** Fetch the current position as a NamedPlace, or null if unavailable/denied. */
  const fetchLocation = useCallback(async (): Promise<NamedPlace | null> => {
    setLoading(true);
    try {
      let coord: LatLng;

      if (Platform.OS === 'web') {
        if (!('geolocation' in navigator)) return null;
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 30000,
          })
        );
        coord = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return null;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        coord = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      }

      const name = Platform.OS === 'web' ? await reverseGeocodeWeb(coord) : await reverseGeocodeNative(coord);

      return {
        id: 'current-location',
        title: name.title,
        subtitle: name.subtitle ?? 'Your current location',
        coordinate: coord,
      };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchLocation };
}
