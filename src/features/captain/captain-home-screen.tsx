/**
 * Captain Home Dashboard (Pages 19–20) + incoming request overlay (Page 22).
 *
 * Header greeting, today's earnings/trips, a big Online/Offline toggle over the
 * map with a high-demand shortcut. Going online surfaces a demo request after a
 * short delay; Accept opens the ride-details screen and the routed ride flow.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { CURRENT_PICKUP } from '@/services/mock-data';
import { useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { RideRequestCard } from './components/ride-request-card';
import { nextDemoRequest } from './demo-requests';

const REQUEST_DELAY_MS = 4000;

export function CaptainHomeScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const stage = useCaptainStore((s) => s.stage);
  const request = useCaptainStore((s) => s.request);
  const profile = useCaptainStore((s) => s.profile);
  const earningsToday = useCaptainStore((s) => s.earningsToday);
  const tripsToday = useCaptainStore((s) => s.tripsToday);
  const goOnline = useCaptainStore((s) => s.goOnline);
  const goOffline = useCaptainStore((s) => s.goOffline);
  const receiveRequest = useCaptainStore((s) => s.receiveRequest);
  const declineRequest = useCaptainStore((s) => s.declineRequest);

  const online = stage !== 'offline';
  const firstName = profile?.fullName?.split(' ')[0] ?? 'Captain';

  // While idling online, surface a demo request after a short delay.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'online') return;
    timer.current = setTimeout(() => {
      receiveRequest(nextDemoRequest());
      haptic('heavy');
    }, REQUEST_DELAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [stage, receiveRequest, haptic]);

  const toggle = (value: boolean) => {
    haptic('medium');
    if (value) {
      goOnline();
      toast("You're online — waiting for rides");
    } else {
      goOffline();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.greetRow}>
          <Pressable
            onPress={() => router.push('/captain/profile')}
            accessibilityLabel="Captain profile"
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={20} color={theme.colors.onPrimary} />
          </Pressable>
          <View>
            <Text variant="h3">Hello {firstName}</Text>
            <Text variant="bodySm" tone="secondary">
              {online ? 'Keep going!' : 'Ready to earn?'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => toast('You have no new notifications')}
          accessibilityLabel="Notifications"
          style={[styles.bell, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <Ionicons name="notifications-outline" size={20} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Earnings + trips */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <Text variant="caption" tone="tertiary">
            Today&apos;s Earnings
          </Text>
          <Text variant="h1" style={styles.statValue}>
            NPR {earningsToday.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
          <Text variant="caption" tone="tertiary">
            Trips
          </Text>
          <Text variant="h1" style={styles.statValue}>
            {tripsToday}
          </Text>
        </View>
      </View>

      {/* Toggle */}
      <Pressable
        onPress={() => toggle(!online)}
        style={[
          styles.toggle,
          {
            backgroundColor: online ? theme.colors.primary : theme.colors.surfaceMuted,
          },
          online ? theme.elevation.sm : theme.elevation.none,
        ]}>
        <Text variant="label" tone={online ? 'onPrimary' : 'secondary'}>
          {online ? 'ONLINE' : 'OFFLINE'}
        </Text>
        <Switch
          value={online}
          onValueChange={toggle}
          trackColor={{ true: 'rgba(0,0,0,0.2)', false: theme.colors.border }}
          thumbColor="#fff"
        />
      </Pressable>
      <Text variant="caption" tone="tertiary" align="center" style={styles.toggleHint}>
        {online ? 'You are receiving ride requests' : 'Go Online to start earning'}
      </Text>

      {/* Map */}
      <View style={[styles.mapWrap, { borderRadius: theme.radius.xl }]}>
        <RideMap pickup={CURRENT_PICKUP.coordinate}>
          {online ? (
            <Pressable
              onPress={() => router.push('/captain/heatmap')}
              style={[styles.demandChip, { backgroundColor: theme.colors.surface }, theme.elevation.md]}>
              <Ionicons name="flame" size={14} color={theme.colors.danger} />
              <Text variant="caption" tone="secondary">
                High demand area
              </Text>
            </Pressable>
          ) : null}
        </RideMap>
      </View>

      {/* Incoming request overlay */}
      {stage === 'requested' && request ? (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={styles.requestSlot}>
            <RideRequestCard
              request={request}
              onAccept={() => {
                haptic('success');
                router.push('/captain/ride-details');
              }}
              onDecline={declineRequest}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bell: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, gap: 4 },
  statValue: { marginTop: 2 },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 16,
    height: 58,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  toggleHint: { marginTop: 8 },
  mapWrap: { flex: 1, marginHorizontal: 20, marginTop: 16, marginBottom: 12, overflow: 'hidden' },
  demandChip: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  requestSlot: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
