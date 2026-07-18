/**
 * Screen 8 — Location Permission.
 *
 * A dimmed map behind a permission card offering the three iOS-style choices.
 * "Allow" options request the real OS permission via expo-location; every path
 * proceeds to Home (a declined permission just means degraded features, not a
 * dead end).
 */

import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/theme';

import { MockMapBackdrop } from '@/components/map/mock-map-backdrop';

export function LocationPermissionScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const { width, height } = useWindowDimensions();

  const [requesting, setRequesting] = useState(false);

  const proceed = () => router.replace('/home');

  const requestAndProceed = async () => {
    setRequesting(true);
    haptic('medium');
    try {
      // The OS dialog is the real gate; we don't hard-block on the result.
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // Web / unsupported — proceed regardless.
    } finally {
      proceed();
    }
  };

  const decline = () => {
    haptic('light');
    proceed();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />

      {/* Dimmed map */}
      <View style={StyleSheet.absoluteFill}>
        <MockMapBackdrop width={width} height={height} showUserDot />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.scrim }]} />
      </View>

      {/* Permission card */}
      <View style={styles.cardWrap}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius['3xl'],
              paddingBottom: insets.bottom + theme.spacing.xl,
            },
            theme.elevation.lg,
          ]}>
          <View style={[styles.pinBadge, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="location" size={30} color={theme.colors.onPrimary} />
          </View>

          <Text variant="h3" align="center" style={styles.title}>
            Allow SajhaRide to access this device&apos;s location?
          </Text>
          <Text variant="body" tone="secondary" align="center" style={styles.body}>
            We use your location to find nearby drivers and provide better service.
          </Text>

          <View style={styles.actions}>
            <Button label="Allow While Using App" loading={requesting} onPress={requestAndProceed} />
            <Button label="Allow Once" variant="secondary" onPress={requestAndProceed} />
            <Button label="Don't Allow" variant="ghost" haptic={false} onPress={decline} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  cardWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  pinBadge: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 12 },
  body: { marginTop: 10, maxWidth: 300 },
  actions: {
    marginTop: 28,
    alignSelf: 'stretch',
    gap: 12,
  },
});
