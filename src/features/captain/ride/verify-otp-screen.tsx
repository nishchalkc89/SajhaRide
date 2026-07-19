/** Page 28 — OTP Verification to Start Ride. */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { OtpInput } from '@/features/auth/components/otp-input';
import { useHaptics } from '@/hooks/use-haptics';
import { CAPTAIN_START_PIN, useCaptainStore } from '@/store/captain-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { CaptainRideGuard } from './components/ride-guard';

export function VerifyOtpScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const request = useCaptainStore((s) => s.request);
  const startRide = useCaptainStore((s) => s.startRide);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);

  if (!request) return <CaptainRideGuard />;

  const verify = (code: string) => {
    if (code.length !== 4) return;
    if (code !== CAPTAIN_START_PIN) {
      setError(true);
      setOtp('');
      haptic('error');
      return;
    }
    haptic('success');
    startRide();
    toast('Ride started — drive safe!', 'success');
    router.replace('/captain/ride');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader title="Verify OTP" />

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.center}>
          <View style={[styles.shield, { backgroundColor: theme.colors.info }]}>
            <Ionicons name="shield-checkmark" size={40} color="#fff" />
          </View>
          <Text variant="h2" align="center" style={styles.title}>
            Ask customer for OTP
          </Text>
          <Text variant="body" tone="secondary" align="center">
            Enter the 4-digit OTP to start the ride
          </Text>
        </View>

        <View style={styles.otpWrap}>
          <OtpInput
            length={4}
            value={otp}
            onChange={(v) => {
              setOtp(v);
              if (error) setError(false);
            }}
            onComplete={verify}
            hasError={error}
          />
        </View>
        {error ? (
          <Text variant="bodySm" tone="danger" align="center" style={styles.err}>
            Incorrect OTP. Ask the customer again.
          </Text>
        ) : (
          <Text variant="caption" tone="tertiary" align="center" style={styles.err}>
            Demo OTP: {CAPTAIN_START_PIN}
          </Text>
        )}

        <View style={styles.spacer} />

        <Button label="Start Ride" disabled={otp.length !== 4} onPress={() => verify(otp)} style={styles.cta} />
        <Pressable onPress={() => toast('Ask the customer to open their SajhaRide app')} style={styles.helpLink}>
          <Text variant="bodySm" tone="brand" align="center">
            Customer cannot find OTP?
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  center: { alignItems: 'center', marginTop: 24 },
  shield: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { marginBottom: 6 },
  otpWrap: { marginTop: 36, paddingHorizontal: 20 },
  err: { marginTop: 16 },
  spacer: { flex: 1 },
  cta: { marginBottom: 12 },
  helpLink: { paddingVertical: 4 },
});
