/**
 * Open external turn-by-turn navigation in Google Maps.
 *
 * Web  → opens the Google Maps Directions URL in a new tab.
 * Native → deep-links into the Google Maps app (falls back to the web URL).
 */

import { Linking, Platform } from 'react-native';

import type { LatLng } from '@/types/ride';

export function openGoogleNavigation(destination: LatLng, origin?: LatLng) {
  const dest = `${destination.latitude},${destination.longitude}`;
  const originStr = origin ? `${origin.latitude},${origin.longitude}` : undefined;

  const webUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving` +
    (originStr ? `&origin=${originStr}` : '');

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.open(webUrl, '_blank', 'noopener');
    return;
  }

  // Prefer the native turn-by-turn intent; fall back to the universal URL.
  const nativeUrl = `google.navigation:q=${dest}`;
  Linking.canOpenURL(nativeUrl)
    .then((ok) => Linking.openURL(ok ? nativeUrl : webUrl))
    .catch(() => Linking.openURL(webUrl));
}
