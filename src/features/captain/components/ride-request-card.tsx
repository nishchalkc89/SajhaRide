/**
 * Incoming ride-request card (Rapido-style): rider, route, fare/distance, and
 * Accept / Decline with an auto-expiring countdown. The countdown bar drains
 * left→right; if it empties, the request auto-declines.
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

      <View style={styles.header}>
        <View style={styles.riderRow}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="bodyLg" tone="onPrimary">
              {request.riderName
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>
          <View>
            <Text variant="bodyLg" style={styles.name}>
              {request.riderName}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={theme.colors.primary} />
              <Text variant="caption" tone="secondary">
                {request.riderRating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.fareTag, { backgroundColor: theme.colors.primarySubtle }]}>
          <Text variant="h3" tone="brand">
            NPR {request.fare}
          </Text>
          <Text variant="caption" tone="secondary">
            {request.distanceKm} km
          </Text>
        </View>
      </View>

      {/* Route */}
      <View style={[styles.route, { borderColor: theme.colors.border }]}>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
          <Text variant="body" numberOfLines={1} style={styles.routeText}>
            {request.pickupTitle}
          </Text>
        </View>
        <View style={[styles.routeLine, { backgroundColor: theme.colors.border }]} />
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
          <Text variant="body" numberOfLines={1} style={styles.routeText}>
            {request.dropTitle}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Decline"
          variant="secondary"
          fullWidth={false}
          style={styles.declineBtn}
          onPress={onDecline}
        />
        <Button
          label={`Accept · ${secondsLeft}s`}
          fullWidth={false}
          style={styles.acceptBtn}
          onPress={onAccept}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  fareTag: { alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  route: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 2, height: 18, marginLeft: 4, marginVertical: 3 },
  routeText: { flex: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  declineBtn: { flex: 1 },
  acceptBtn: { flex: 2 },
});
