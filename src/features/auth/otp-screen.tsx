/**
 * Screen 7 — OTP Verification.
 *
 * Six-digit code entry with a resend countdown. Auto-verifies on the sixth
 * digit (any code is accepted — the check is mocked) and routes to the location
 * permission screen. The number being verified comes from the auth store.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/theme';

import { OtpInput } from './components/otp-input';

const RESEND_SECONDS = 45;
const CODE_LENGTH = 6;

/**
 * Demo verification code. There is no SMS backend yet, so a fixed code stands
 * in for a real one-time password — it's validated like the real thing (wrong
 * codes are rejected) and surfaced on-screen so the flow is testable.
 * Replace this check with a server call when the OTP API lands.
 */
const DEMO_OTP = '123456';

/** mm:ss from a second count. */
function formatCountdown(total: number): string {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function OtpScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();

  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const confirmVerification = useAuthStore((s) => s.confirmVerification);

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resend countdown.
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1 && timerRef.current) clearInterval(timerRef.current);
        return Math.max(0, s - 1);
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const verify = useCallback(
    (fullCode: string) => {
      if (fullCode.length !== CODE_LENGTH) return;

      // Reject anything but the demo code, mirroring a real OTP check.
      if (fullCode !== DEMO_OTP) {
        setError(true);
        setCode('');
        haptic('error');
        return;
      }

      setVerifying(true);
      haptic('success');
      // Simulate a network round-trip before granting the session.
      setTimeout(() => {
        confirmVerification();
        router.replace('/location-permission');
      }, 650);
    },
    [confirmVerification, router, haptic]
  );

  const resend = () => {
    if (secondsLeft > 0) return;
    haptic('light');
    setSecondsLeft(RESEND_SECONDS);
    setCode('');
    setError(false);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1 && timerRef.current) clearInterval(timerRef.current);
        return Math.max(0, s - 1);
      });
    }, 1000);
  };

  // Format the masked destination number, e.g. "+977 9812345678".
  const displayNumber = pendingPhone ? `+977 ${pendingPhone}` : '+977 98••••••••';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader />

      <View style={[styles.content, { paddingHorizontal: theme.screenPadding }]}>
        <Text variant="h1">Verify Your Number</Text>
        <View style={styles.sentTo}>
          <Text variant="body" tone="secondary">
            Enter the 6-digit code sent to{' '}
          </Text>
          <View style={styles.numberRow}>
            <Text variant="body" tone="primary" style={styles.number}>
              {displayNumber}
            </Text>
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Edit number">
              <Ionicons name="pencil" size={15} color={theme.colors.primary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.otpWrap}>
          <OtpInput
            value={code}
            onChange={(next) => {
              setCode(next);
              if (error) setError(false);
            }}
            onComplete={verify}
            hasError={error}
          />
        </View>

        {error ? (
          <Text variant="bodySm" tone="danger" align="center" style={styles.errorText}>
            Incorrect code. Try again.
          </Text>
        ) : null}

        {/* Demo affordance — no SMS backend, so surface the accepted code. */}
        <Pressable
          onPress={() => {
            setError(false);
            setCode(DEMO_OTP);
            verify(DEMO_OTP);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Use demo code ${DEMO_OTP}`}
          style={[
            styles.demoHint,
            { backgroundColor: theme.colors.infoSubtle, borderRadius: theme.radius.full },
          ]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.info} />
          <Text variant="bodySm" tone="secondary">
            Demo code <Text variant="bodySm" style={{ color: theme.colors.info }}>{DEMO_OTP}</Text> — tap to autofill
          </Text>
        </Pressable>

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Text variant="body" tone="secondary">
              Resend code in{' '}
              <Text variant="body" tone="brand">
                {formatCountdown(secondsLeft)}
              </Text>
            </Text>
          ) : (
            <Pressable onPress={resend} hitSlop={8} accessibilityRole="button">
              <Text variant="body" tone="brand">
                Resend code
              </Text>
            </Pressable>
          )}
        </View>

        {/* Envelope motif */}
        <View style={styles.illustration}>
          <View
            style={[
              styles.envelope,
              { backgroundColor: theme.colors.primarySubtle, borderColor: theme.colors.primary },
            ]}>
            <Ionicons name="mail-open-outline" size={52} color={theme.colors.primary} />
            <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label="Verify"
          loading={verifying}
          disabled={code.length !== CODE_LENGTH}
          onPress={() => verify(code)}
          style={{ marginBottom: insets.bottom + 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingTop: 8 },
  sentTo: { marginTop: 8 },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  number: { fontWeight: '600' },
  otpWrap: { marginTop: 32 },
  errorText: { marginTop: 12 },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 20,
  },
  resendRow: { marginTop: 20, alignItems: 'center' },
  illustration: { alignItems: 'center', marginTop: 40 },
  envelope: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
