/**
 * Captain Home — the driver-side hub, modelled on Rapido Captain.
 *
 * One map with a bottom panel whose content follows the captain lifecycle:
 * offline → online (waiting) → requested → accepted (to pickup) → arrived
 * (verify PIN) → riding → completed. Going online auto-surfaces a demo request
 * after a short delay; accepting drives the rest of the flow.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RideMap } from '@/components/map/ride-map';
import { Button } from '@/components/ui/button';
import { PaymentQR } from '@/components/ui/payment-qr';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { OtpInput } from '@/features/auth/components/otp-input';
import { useHaptics } from '@/hooks/use-haptics';
import { CAPTAIN_START_PIN, useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { RideRequestCard } from './components/ride-request-card';
import { nextDemoRequest } from './demo-requests';

/** Delay before a demo request appears after going online. */
const REQUEST_DELAY_MS = 4000;

export function CaptainHomeScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const stage = useCaptainStore((s) => s.stage);
  const request = useCaptainStore((s) => s.request);
  const earningsToday = useCaptainStore((s) => s.earningsToday);
  const tripsToday = useCaptainStore((s) => s.tripsToday);
  const onlineMinutes = useCaptainStore((s) => s.onlineMinutes);

  const goOnline = useCaptainStore((s) => s.goOnline);
  const goOffline = useCaptainStore((s) => s.goOffline);
  const receiveRequest = useCaptainStore((s) => s.receiveRequest);
  const acceptRequest = useCaptainStore((s) => s.acceptRequest);
  const declineRequest = useCaptainStore((s) => s.declineRequest);
  const arriveAtPickup = useCaptainStore((s) => s.arriveAtPickup);
  const startRide = useCaptainStore((s) => s.startRide);
  const completeRide = useCaptainStore((s) => s.completeRide);
  const dismissCompleted = useCaptainStore((s) => s.dismissCompleted);

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const isOnline = stage !== 'offline';

  // While idling online, surface a demo request after a short delay.
  const requestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'online') return;
    requestTimer.current = setTimeout(() => {
      receiveRequest(nextDemoRequest());
      haptic('heavy');
    }, REQUEST_DELAY_MS);
    return () => {
      if (requestTimer.current) clearTimeout(requestTimer.current);
    };
  }, [stage, receiveRequest, haptic]);

  const verifyPin = (code: string) => {
    if (code.length !== 4) return;
    if (code !== CAPTAIN_START_PIN) {
      setPinError(true);
      setPin('');
      haptic('error');
      return;
    }
    haptic('success');
    setPin('');
    startRide();
    toast('Ride started — drive safe!', 'success');
  };

  const toggleOnline = (value: boolean) => {
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

      {/* Map */}
      <View style={styles.mapArea}>
        <RideMap
          pickup={request?.pickupCoord}
          destination={stage === 'riding' ? request?.dropCoord : request?.pickupCoord}
          driverLocation={request?.pickupCoord}
          showRoute={stage === 'accepted' || stage === 'riding'}>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <ScreenHeader
              title="Captain"
              onBack={() => router.replace('/(tabs)/home')}
              right={
                <View style={[styles.statusPill, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isOnline ? theme.colors.success : theme.colors.textTertiary },
                    ]}
                  />
                  <Text variant="caption" tone="secondary">
                    {isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              }
            />
          </View>
        </RideMap>
      </View>

      {/* Bottom panel */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius['3xl'],
            borderTopRightRadius: theme.radius['3xl'],
            paddingBottom: insets.bottom + 20,
          },
          theme.elevation.sheet,
        ]}>
        {stage === 'requested' && request ? (
          // Request overlay handles its own layout (incl. handle bar).
          <RideRequestCard
            request={request}
            onAccept={() => {
              haptic('success');
              acceptRequest();
              toast('Ride accepted — head to pickup');
            }}
            onDecline={declineRequest}
          />
        ) : (
          <>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

            {/* Earnings summary — always visible while not mid-request. */}
            <View style={styles.earningsRow}>
              <Stat label="Today" value={`NPR ${earningsToday}`} theme={theme} />
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <Stat label="Trips" value={`${tripsToday}`} theme={theme} />
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <Stat label="Online" value={`${Math.floor(onlineMinutes / 60)}h ${onlineMinutes % 60}m`} theme={theme} />
              <Pressable
                onPress={() => router.push('/captain/earnings')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="View earnings">
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
              {stage === 'offline' ? (
                <PanelMessage
                  theme={theme}
                  icon="power"
                  title="You're offline"
                  subtitle="Go online to start receiving ride requests."
                />
              ) : null}

              {stage === 'online' ? (
                <PanelMessage
                  theme={theme}
                  icon="radio"
                  title="You're online"
                  subtitle="Looking for ride requests near you…"
                  pulse
                />
              ) : null}

              {(stage === 'accepted' || stage === 'arrived') && request ? (
                <View style={styles.tripBlock}>
                  <Text variant="h3">
                    {stage === 'accepted' ? 'Head to pickup' : 'Verify PIN to start'}
                  </Text>
                  <ActiveRoute request={request} theme={theme} />

                  {stage === 'arrived' ? (
                    <View style={styles.pinBlock}>
                      <Text variant="bodySm" tone="secondary" style={styles.pinHint}>
                        Ask {request.riderName.split(' ')[0]} for their PIN
                      </Text>
                      <OtpInput
                        length={4}
                        value={pin}
                        onChange={(v) => {
                          setPin(v);
                          if (pinError) setPinError(false);
                        }}
                        onComplete={verifyPin}
                        hasError={pinError}
                      />
                      {pinError ? (
                        <Text variant="caption" tone="danger" align="center" style={styles.pinErr}>
                          Incorrect PIN. Ask the rider again.
                        </Text>
                      ) : (
                        <Text variant="caption" tone="tertiary" align="center" style={styles.pinErr}>
                          Demo PIN: {CAPTAIN_START_PIN}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {stage === 'riding' && request ? (
                <View style={styles.tripBlock}>
                  <Text variant="h3">Ride in progress</Text>
                  <ActiveRoute request={request} theme={theme} />
                </View>
              ) : null}

              {stage === 'completed' && request ? (
                <View style={styles.tripBlock}>
                  <Text variant="h3" align="center">
                    Trip completed
                  </Text>
                  <Text variant="bodySm" tone="secondary" align="center">
                    Show this QR — {request.riderName.split(' ')[0]} scans it to pay NPR {request.fare} to your wallet.
                  </Text>
                  <View style={styles.qrWrap}>
                    <PaymentQR
                      amount={request.fare}
                      label={`SajhaRide · NPR ${request.fare}`}
                      color={theme.colors.text}
                    />
                    <Text variant="h2" tone="brand" style={styles.qrAmount}>
                      NPR {request.fare}
                    </Text>
                  </View>
                </View>
              ) : null}
            </ScrollView>

            {/* Primary action per stage */}
            <View style={styles.action}>
              {stage === 'offline' ? (
                <Button label="Go Online" onPress={() => toggleOnline(true)} />
              ) : null}
              {stage === 'online' ? (
                <View style={styles.onlineToggle}>
                  <Text variant="bodyLg" style={styles.toggleLabel}>
                    Go offline
                  </Text>
                  <Switch
                    value
                    onValueChange={(v) => toggleOnline(v)}
                    trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                    thumbColor="#fff"
                  />
                </View>
              ) : null}
              {stage === 'accepted' ? (
                <Button label="Arrived at Pickup" onPress={arriveAtPickup} />
              ) : null}
              {stage === 'riding' ? (
                <Button
                  label="End Ride"
                  onPress={() => {
                    completeRide();
                    haptic('success');
                  }}
                />
              ) : null}
              {stage === 'completed' ? (
                <Button
                  label="Collect Cash & Done"
                  onPress={() => {
                    dismissCompleted();
                    toast('Payment collected. Back online!', 'success');
                  }}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function Stat({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.stat}>
      <Text variant="bodyLg" style={styles.statValue}>
        {value}
      </Text>
      <Text variant="caption" tone="tertiary">
        {label}
      </Text>
    </View>
  );
}

function PanelMessage({
  theme,
  icon,
  title,
  subtitle,
  pulse,
}: {
  theme: ReturnType<typeof useTheme>;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  pulse?: boolean;
}) {
  return (
    <View style={styles.panelMessage}>
      <View
        style={[
          styles.panelIcon,
          { backgroundColor: pulse ? theme.colors.primarySubtle : theme.colors.surfaceMuted },
        ]}>
        <Ionicons name={icon} size={30} color={pulse ? theme.colors.primary : theme.colors.textSecondary} />
      </View>
      <Text variant="h3" align="center" style={styles.panelTitle}>
        {title}
      </Text>
      <Text variant="body" tone="secondary" align="center" style={styles.panelSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

function ActiveRoute({
  request,
  theme,
}: {
  request: NonNullable<ReturnType<typeof useCaptainStore.getState>['request']>;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.activeRoute, { borderColor: theme.colors.border }]}>
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
        <Text variant="bodyLg" style={styles.routeFare}>
          NPR {request.fare}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mapArea: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  sheet: { maxHeight: '64%', paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  stat: { flex: 1, alignItems: 'center', gap: 1 },
  statValue: { fontWeight: '700' },
  statDivider: { width: StyleSheet.hairlineWidth * 2, height: 28 },
  body: { paddingHorizontal: 20 },
  panelMessage: { alignItems: 'center', paddingVertical: 24 },
  panelIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  panelTitle: { marginTop: 16 },
  panelSubtitle: { marginTop: 6, maxWidth: 280 },
  tripBlock: { paddingVertical: 12, gap: 12, alignItems: 'stretch' },
  activeRoute: { borderWidth: StyleSheet.hairlineWidth * 2, borderRadius: 14, padding: 14 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 2, height: 18, marginLeft: 4, marginVertical: 3 },
  routeText: { flex: 1 },
  routeFare: { fontWeight: '700' },
  pinBlock: { marginTop: 8, gap: 12 },
  pinHint: { textAlign: 'center' },
  pinErr: { marginTop: 4 },
  qrWrap: { alignItems: 'center', gap: 10, marginTop: 8 },
  qrAmount: { fontWeight: '700' },
  action: { paddingHorizontal: 20, paddingTop: 12 },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  toggleLabel: { fontWeight: '600' },
});
