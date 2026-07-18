/**
 * Motion capability detection + graceful degradation.
 *
 * WHY THIS EXISTS
 * ---------------
 * Reanimated 4 delegates its worklet runtime to `react-native-worklets`, which
 * ships no web implementation — `WorkletsModule` is literally `null` in the web
 * build. Shared values therefore never advance under react-native-web: an
 * element declared as `useSharedValue(0)` for opacity stays invisible forever,
 * and the screen previews as a blank canvas.
 *
 * Web is not a shipping target for SajhaRide (it's a native app), but it *is*
 * the fastest way to review layout during development. So rather than let the
 * design disappear there, screens declare both ends of their entrance and we
 * collapse to the final state wherever motion can't be driven.
 *
 * This is the same shape as honouring reduce-motion: when animation is
 * unavailable, present the destination, never the origin.
 */

import { Platform } from 'react-native';

/**
 * True only where Reanimated actually has a runtime to drive shared values.
 * Verified 2026-07-17 against Reanimated 4.5 / worklets 0.10.
 */
export const CAN_ANIMATE = Platform.OS !== 'web';

/**
 * Pick a shared value's starting point.
 *
 * Where motion works, animations start at `origin` and are driven to their
 * destination by the screen's entrance effect. Where it doesn't, they start at
 * `destination` so the composition is still reviewable.
 *
 * @example
 * const opacity = useSharedValue(entranceFrom(0, 1));
 */
export function entranceFrom<T>(origin: T, destination: T): T {
  return CAN_ANIMATE ? origin : destination;
}
