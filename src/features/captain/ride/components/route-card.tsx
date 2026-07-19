/**
 * Shared captain ride-flow pieces: the pickup→drop route card and a
 * Call/Chat contact row. Used across the accepted → navigate → arrived →
 * riding screens so the trip context is consistent.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { RideRequest } from '@/store/captain-store';
import { useTheme } from '@/theme';

export function RouteCard({ request, compact }: { request: RideRequest; compact?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.route}>
      <View style={styles.railRow}>
        <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
        <View style={styles.railText}>
          <Text variant="bodyLg" numberOfLines={1} style={styles.place}>
            {request.pickupTitle}
          </Text>
          {!compact ? (
            <Text variant="caption" tone="tertiary" numberOfLines={1}>
              {request.pickupAddress}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.line, { borderColor: theme.colors.border }]} />
      <View style={styles.railRow}>
        <Ionicons name="location" size={16} color={theme.colors.danger} style={styles.pinIcon} />
        <View style={styles.railText}>
          <Text variant="bodyLg" numberOfLines={1} style={styles.place}>
            {request.dropTitle}
          </Text>
          {!compact ? (
            <Text variant="caption" tone="tertiary" numberOfLines={1}>
              {request.dropAddress}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function ContactRow({ name }: { name: string }) {
  const theme = useTheme();
  const router = useRouter();
  const contact = encodeURIComponent(name);
  return (
    <View style={styles.contactRow}>
      <Pressable
        onPress={() => router.push(`/call?name=${contact}`)}
        accessibilityRole="button"
        accessibilityLabel="Call customer"
        style={[styles.contactBtn, { borderColor: theme.colors.border }]}>
        <Ionicons name="call" size={18} color={theme.colors.success} />
        <Text variant="label">Call Customer</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push(`/chat?name=${contact}`)}
        accessibilityRole="button"
        accessibilityLabel="Chat with customer"
        style={[styles.contactBtn, { borderColor: theme.colors.border }]}>
        <Ionicons name="chatbubble-ellipses" size={18} color={theme.colors.info} />
        <Text variant="label">Chat</Text>
      </Pressable>
    </View>
  );
}

/** A pair of metric tiles, e.g. "2.3 km Pickup" · "8.7 km Total". */
export function MetricPair({
  left,
  right,
}: {
  left: { value: string; label: string };
  right: { value: string; label: string };
}) {
  const theme = useTheme();
  return (
    <View style={[styles.metrics, { borderColor: theme.colors.border }]}>
      <View style={styles.metric}>
        <Text variant="h3">{left.value}</Text>
        <Text variant="caption" tone="tertiary">
          {left.label}
        </Text>
      </View>
      <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />
      <View style={styles.metric}>
        <Text variant="h3">{right.value}</Text>
        <Text variant="caption" tone="tertiary">
          {right.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  route: { gap: 2 },
  railRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  pinIcon: { marginLeft: -2 },
  railText: { flex: 1 },
  place: { fontWeight: '600' },
  line: { borderLeftWidth: 1.5, borderStyle: 'dashed', height: 16, marginLeft: 5, marginVertical: 4 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  metrics: { flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth * 2, borderRadius: 14, paddingVertical: 14 },
  metric: { flex: 1, alignItems: 'center', gap: 2 },
  metricDivider: { width: StyleSheet.hairlineWidth * 2 },
});
