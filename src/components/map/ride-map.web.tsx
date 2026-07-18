/**
 * RideMap — WEB variant.
 *
 * react-native-maps has no web renderer, so on web we draw the styled mock
 * backdrop and place abstract pins over it. This exists so the ride screens are
 * still reviewable in the browser preview; the device runs the real map.
 */

import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { MockMapBackdrop } from './mock-map-backdrop';
import type { RideMapProps } from './ride-map.types';

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

  return (
    <View style={[styles.root, style]}>
      <View style={StyleSheet.absoluteFill}>
        <MockMapBackdrop width={1000} height={1000} showUserDot={!!pickup} />
      </View>

      {/* Abstract pins laid out relative to the frame (no projection on web). */}
      {destination ? (
        <View style={[styles.pin, styles.destPin, { backgroundColor: theme.colors.danger }]} />
      ) : null}
      {driverLocation ? (
        <View style={[styles.pin, styles.driverPin, { backgroundColor: theme.colors.text }]} />
      ) : null}
      {showRoute && destination ? (
        <View style={[styles.routeHint, { borderColor: theme.colors.textTertiary }]} />
      ) : null}

      {/* Nearby vehicle dots */}
      {(nearbyVehicles ?? []).slice(0, 5).map((v, i) => (
        <View
          key={v.id}
          style={[
            styles.vehicleDot,
            {
              backgroundColor: theme.colors.text,
              left: `${20 + i * 14}%`,
              top: `${30 + (i % 3) * 16}%`,
            },
          ]}
        />
      ))}

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
  pin: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#fff',
  },
  destPin: { left: '62%', top: '46%' },
  driverPin: { left: '38%', top: '40%' },
  routeHint: {
    position: 'absolute',
    left: '46%',
    top: '44%',
    width: 90,
    height: 40,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  vehicleDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
