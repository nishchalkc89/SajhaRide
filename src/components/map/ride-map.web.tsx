/**
 * RideMap — WEB variant.
 *
 * react-native-maps has no web renderer, so on web we embed a real **Google
 * Maps** view via the keyless embed endpoint (maps.google.com/maps?...&output=
 * embed). With a pickup+destination and showRoute we embed Google Directions
 * (saddr/daddr); otherwise we centre on the most relevant point. The native
 * build uses the Google Maps SDK through react-native-maps.
 *
 * Rendering a raw <iframe> is fine here: react-native-web runs on React DOM.
 */

import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { LatLng } from '@/types/ride';

import type { RideMapProps } from './ride-map.types';

/** Kathmandu valley centre — only used if we have no point at all. */
const DEFAULT_CENTER: LatLng = { latitude: 27.7017, longitude: 85.3206 };

const fmt = (p: LatLng) => `${p.latitude},${p.longitude}`;

/** Build a keyless Google Maps embed URL for the given ride state. */
function buildGoogleUrl(
  pickup: LatLng | undefined,
  destination: LatLng | undefined,
  driver: LatLng | undefined,
  showRoute: boolean | undefined
): string {
  // Route view: Google Directions between pickup and destination.
  if (showRoute && pickup && destination) {
    return `https://maps.google.com/maps?saddr=${fmt(pickup)}&daddr=${fmt(destination)}&z=14&output=embed`;
  }
  // Otherwise centre on the driver (if tracking) then pickup then default.
  const center = driver ?? pickup ?? DEFAULT_CENTER;
  return `https://maps.google.com/maps?q=${fmt(center)}&z=15&output=embed`;
}

export function RideMap({
  pickup,
  destination,
  driverLocation,
  showRoute,
  style,
  children,
}: RideMapProps) {
  const src = buildGoogleUrl(pickup, destination, driverLocation, showRoute);

  return (
    <View style={[styles.root, style]}>
      {createElement('iframe', {
        key: src,
        src,
        title: 'Map',
        loading: 'lazy',
        referrerPolicy: 'no-referrer-when-downgrade',
        style: { border: 'none', width: '100%', height: '100%' },
      })}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E9ECF0',
  },
});
