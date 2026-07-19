/**
 * Incoming ride-request card (Page 22). Big pickup distance, route, fare + rating,
 * and Accept / Decline with an auto-expiring countdown. Auto-declines on expiry.
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CountdownBar } from '@/features/captain/components/countdown-bar';
import type { RideRequest } from '@/store/captain-store';
import { useTheme } from '@/theme';

const WINDOW_SECONDS = 15;

export function RideRequestCard({
  request,
  onAccept,
  onDecline,
}: {
  request: RideRequest;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const theme = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(WINDOW_SECONDS);
  const declineRef = useRef(onDecline);
  declineRef.current = onDecline;

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          declineRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
        theme.elevation.sheet,
      ]}>
      <CountdownBar durationSeconds={WINDOW_SECONDS} />

      {/* Title row */}
      <View style={styles.titleRow}>
        <Text variant="h3">New Ride Request</Text>
        <View style={[styles.timer, { backgroundColor: theme.colors.primarySubtle }]}>
          <Ionicons name="time" size={13} color={theme.colors.primary} />
          <Text variant="caption" tone="brand" style={styles.bold}>
            {secondsLeft}s
          </Text>
        </View>
      </View>

      {/* Pickup distance */}
      <Text variant="display" style={styles.distance}>
        {request.pickupDistanceKm} km
      </Text>
      <Text variant="bodySm" tone="tertiary">
        Pickup distance
      </Text>

      {/* Route + fare */}
      <View style={styles.routeFare}>
        <View style={styles.routeCol}>
          <View style={styles.railRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
            <View style={styles.railText}>
              <Text variant="bodyLg" numberOfLines={1} style={styles.bold}>
                {request.pickupTitle}
              </Text>
              <Text variant="caption" tone="tertiary" numberOfLines={1}>
                {request.pickupAddress}
              </Text>
            </View>
          </View>
          <View style={[styles.line, { borderColor: theme.colors.border }]} />
          <View style={styles.railRow}>
            <Ionicons name="location" size={14} color={theme.colors.danger} />
            <View style={styles.railText}>
              <Text variant="bodyLg" numberOfLines={1} style={styles.bold}>
                {request.dropTitle}
              </Text>
              <Text variant="caption" tone="tertiary" numberOfLines={1}>
                {request.dropAddress}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.fareBox, { borderColor: theme.colors.border }]}>
          <Text variant="h3" tone="brand">
            NPR {request.fare}
          </Text>
          <Text variant="caption" tone="tertiary">
            Est. Fare
          </Text>
        </View>
      </View>

      {/* Meta */}
      <View style={[styles.meta, { borderTopColor: theme.colors.border }]}>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={14} color={theme.colors.primary} />
          <Text variant="bodySm" tone="secondary">
            {request.riderRating.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.vehicleTag, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons name={request.vehicle === 'auto' ? 'car-sport' : 'bicycle'} size={13} color={theme.colors.textSecondary} />
          <Text variant="caption" tone="secondary">
            {request.vehicle === 'auto' ? 'Auto' : 'Bike'} Ride
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button label="Decline" variant="danger" fullWidth={false} style={styles.action} onPress={onDecline} />
        <Button label="Accept" fullWidth={false} style={styles.action} onPress={onAccept} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  bold: { fontWeight: '700' },
  distance: { marginTop: 12 },
  routeFare: { flexDirection: 'row', gap: 12, marginTop: 16, alignItems: 'center' },
  routeCol: { flex: 1 },
  railRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  railText: { flex: 1 },
  line: { borderLeftWidth: 1.5, borderStyle: 'dashed', height: 14, marginLeft: 5, marginVertical: 3 },
  fareBox: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth * 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth * 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vehicleTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  action: { flex: 1 },
});
