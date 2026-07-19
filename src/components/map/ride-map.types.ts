/** Shared contract for RideMap so the native and web variants stay in sync. */

import type { StyleProp, ViewStyle } from 'react-native';

import type { LatLng } from '@/types/ride';

export type MapVehicle = {
  id: string;
  coordinate: LatLng;
  /** Bearing in degrees; rotates the vehicle marker. */
  heading: number;
};

export type RideMapProps = {
  /** Green pickup pin + the user's blue dot. */
  pickup?: LatLng;
  /** Red destination pin. */
  destination?: LatLng;
  /** Idle vehicles scattered on the map (Home / searching states). */
  nearbyVehicles?: MapVehicle[];
  /** The assigned driver's live position, if any. */
  driverLocation?: LatLng;
  /** Draw the dashed pickup→destination route. */
  showRoute?: boolean;
  /**
   * Navigation mode: center/follow this live position (the moving bike) with a
   * centered vehicle marker, instead of framing the whole route.
   */
  follow?: LatLng;
  /** Region to frame, [pickup, destination, driver] auto-fit otherwise. */
  style?: StyleProp<ViewStyle>;
  /** Overlay content (FABs, cards) rendered above the map. */
  children?: React.ReactNode;
};
