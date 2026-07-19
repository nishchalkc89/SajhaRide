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

import { Ionicons } from '@expo/vector-icons';
import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
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
  showRoute: boolean | undefined,
  follow: LatLng | undefined
): string {
  // Navigation: keep the moving vehicle centred and zoomed in.
  if (follow) {
    return `https://maps.google.com/maps?q=${fmt(follow)}&z=17&output=embed`;
  }
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
  follow,
  style,
  children,
}: RideMapProps) {
  const theme = useTheme();
  const src = buildGoogleUrl(pickup, destination, driverLocation, showRoute, follow);

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

      {/* Live vehicle marker pinned to the map centre while navigating. */}
      {follow ? (
        <View pointerEvents="none" style={styles.followMarkerWrap}>
          <View style={[styles.followMarker, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="bicycle" size={20} color={theme.colors.onPrimary} />
          </View>
        </View>
      ) : null}

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
  followMarkerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});
