/**
 * RideMap — NATIVE variant (Android/iOS) using react-native-maps.
 *
 * Requires a Google Maps API key in app.json under
 * `android.config.googleMaps.apiKey` / `ios.config.googleMapsApiKey`, and a dev
 * build (not Expo Go). Without a key the map tiles render blank but the app
 * still runs.
 *
 * The web counterpart (ride-map.web.tsx) draws a styled mock instead.
 */

import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type MapViewProps } from 'react-native-maps';

import { DEFAULT_REGION } from '@/services/mock-data';
import { useTheme } from '@/theme';
import type { LatLng } from '@/types/ride';

import type { RideMapProps } from './ride-map.types';

/** Padding used when auto-fitting the camera to all points of interest. */
const FIT_EDGE_PADDING = { top: 120, right: 80, bottom: 320, left: 80 };

export function RideMap({
  pickup,
  destination,
  nearbyVehicles,
  driverLocation,
  showRoute,
  style,
  children,
}: RideMapProps) {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  // Whenever the set of key points changes, frame them all.
  useEffect(() => {
    const points: LatLng[] = [pickup, destination, driverLocation].filter(
      (p): p is LatLng => !!p
    );
    if (points.length < 2 || !mapRef.current) return;

    const id = setTimeout(() => {
      mapRef.current?.fitToCoordinates(points, {
        edgePadding: FIT_EDGE_PADDING,
        animated: true,
      });
    }, 350);
    return () => clearTimeout(id);
  }, [pickup, destination, driverLocation]);

  // On Android, Google is the only provider; on iOS default to Google too for
  // parity with the reference (Apple Maps styling differs noticeably).
  const provider: MapViewProps['provider'] =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_GOOGLE;

  return (
    <View style={[styles.root, style]}>
      <MapView
        ref={mapRef}
        provider={provider}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={!!pickup}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}>
        {pickup ? (
          <Marker coordinate={pickup} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <PickupDot color={theme.colors.success} />
          </Marker>
        ) : null}

        {destination ? (
          <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <Pin color={theme.colors.danger} />
          </Marker>
        ) : null}

        {driverLocation ? (
          <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <VehicleMarker color={theme.colors.text} />
          </Marker>
        ) : null}

        {(nearbyVehicles ?? []).map((v) => (
          <Marker
            key={v.id}
            coordinate={v.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={v.heading}
            flat
            tracksViewChanges={false}>
            <VehicleMarker color={theme.colors.text} />
          </Marker>
        ))}

        {showRoute && pickup && destination ? (
          <Polyline
            coordinates={[pickup, destination]}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
            lineDashPattern={[2, 6]}
          />
        ) : null}
      </MapView>

      {children}
    </View>
  );
}

/** Green pickup dot with a white ring. */
function PickupDot({ color }: { color: string }) {
  return <View style={[styles.pickupDot, { backgroundColor: color }]} />;
}

/** Teardrop destination pin. */
function Pin({ color }: { color: string }) {
  return (
    <View style={styles.pinWrap}>
      <View style={[styles.pinHead, { backgroundColor: color }]} />
      <View style={[styles.pinTail, { borderTopColor: color }]} />
    </View>
  );
}

/** Small top-down car glyph for nearby/assigned vehicles. */
function VehicleMarker({ color }: { color: string }) {
  return <View style={[styles.vehicle, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  pickupDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#fff',
  },
  pinWrap: { alignItems: 'center' },
  pinHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: '#fff',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  vehicle: {
    width: 22,
    height: 12,
    borderRadius: 3,
  },
});
