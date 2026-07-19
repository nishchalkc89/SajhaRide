/**
 * Simulates a vehicle driving from `from` to `to` over `durationMs`, returning
 * the current interpolated position (and 0→1 progress). Used to make the bike
 * marker move "live" along the route during navigation.
 *
 * Pure JS timers (no worklet/native driver) so it ticks on web and native
 * alike; consumers pass the position to the map to follow it.
 */

import { useEffect, useRef, useState } from 'react';

import type { LatLng } from '@/types/ride';

const TICK_MS = 900;

export function useDriveSimulation(
  from: LatLng | undefined,
  to: LatLng | undefined,
  active: boolean,
  durationMs = 12000
): { position: LatLng | undefined; progress: number } {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !from || !to) {
      startRef.current = null;
      setProgress(0);
      return;
    }
    startRef.current = Date.now();
    setProgress(0);

    const id = setInterval(() => {
      if (startRef.current == null) return;
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);
      if (p >= 1) clearInterval(id);
    }, TICK_MS);

    return () => clearInterval(id);
  }, [active, from, to, durationMs]);

  const position =
    from && to
      ? {
          latitude: from.latitude + (to.latitude - from.latitude) * progress,
          longitude: from.longitude + (to.longitude - from.longitude) * progress,
        }
      : undefined;

  return { position, progress };
}
