/**
 * RideMap — WEB variant.
 *
 * react-native-maps has no web renderer, so on web we embed a real
 * OpenStreetMap tile map (free, no API key) framed on the ride's points, and
 * overlay the pins/route hint on top. The native build uses Google Maps.
 *
 * Rendering a raw <iframe> is fine here: react-native-web runs on React DOM, so
 * intrinsic DOM elements render normally.
 */

import { createElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import type { LatLng } from '@/types/ride';

import type { RideMapProps } from './ride-map.types';

/** Kathmandu valley centre — fallback when no points are supplied. */
const DEFAULT_CENTER: LatLng = { latitude: 27.7017, longitude: 85.3206 };

/** Build an OpenStreetMap embed URL framing the given points. */
function buildOsmUrl(points: LatLng[], marker: LatLng): string {
  const lats = points.map((p) => p.latitude);
  const lons = points.map((p) => p.longitude);
  // Pad the bounding box so pins aren't flush against the frame edge.
  const pad = 0.012;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLon = Math.min(...lons) - pad;
  const maxLon = Math.max(...lons) + pad;
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker.latitude},${marker.longitude}`;
}

export function RideMap({
  pickup,
  destination,
  driverLocation,
  showRoute,
  style,
  children,
}: RideMapProps) {
  const theme = useTheme();

  const points = [pickup, destination, driverLocation].filter((p): p is LatLng => !!p);
  const framePoints = points.length ? points : [DEFAULT_CENTER];
  const marker = destination ?? pickup ?? DEFAULT_CENTER;
  const src = buildOsmUrl(framePoints, marker);

  return (
    <View style={[styles.root, style]}>
      {/* Real OSM map. key forces a reload when the framed area changes. */}
      {createElement('iframe', {
        key: src,
        src,
        title: 'Map',
        style: {
          border: 'none',
          width: '100%',
          height: '100%',
          // Muted so the amber UI and pins stay dominant.
          filter: theme.scheme === 'dark' ? 'grayscale(0.3) brightness(0.7)' : 'saturate(0.9)',
        },
      })}

      {/* Route + destination hint overlay (approximate — OSM handles the marker). */}
      {showRoute && destination ? (
        <View pointerEvents="none" style={styles.overlay}>
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }, theme.elevation.sm]} />
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
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 0, height: 0 },
});
