/**
 * Screen 6 — Sign Up.
 *
 * Full name, phone, email, password + a terms checkbox. Same validation and
 * verification handoff as Login: a valid submit seeds the pending user and
 * routes to OTP.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/theme';

import { DialPrefix } from './components/dial-prefix';

type SignupForm = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

const PHONE_PATTERN = /^9[78]\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const startVerification = useAuthStore((s) => s.startVerification);

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: { fullName: '', phone: '', email: '', password: '' },
  });

  const onSubmit = (data: SignupForm) => {
    if (!agreed) {
      setAgreedError(true);
      haptic('error');
      return;
    }
    haptic('success');
    startVerification(data.phone, { fullName: data.fullName, email: data.email });
    router.push('/otp');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: theme.screenPadding, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.heading}>
            <Text variant="h1">Create Account</Text>
            <Text variant="body" tone="secondary" style={styles.subtitle}>
              Sign up to get started
            </Text>
          </View>

          <Controller
            control={control}
            name="fullName"
            rules={{ required: 'Enter your full name', minLength: { value: 2, message: 'Too short' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Full Name"
                autoCapitalize="words"
                textContentType="name"
                leadingIcon={
                  <Ionicons name="person-outline" size={20} color={theme.colors.textTertiary} />
                }
                error={errors.fullName?.message}
                containerStyle={styles.field}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Enter your mobile number',
              pattern: { value: PHONE_PATTERN, message: 'Enter a valid 10-digit number' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Mobile Number"
                keyboardType="number-pad"
                maxLength={10}
                prefix={<DialPrefix />}
                error={errors.phone?.message}
                containerStyle={styles.field}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Enter your email',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                leadingIcon={
                  <Ionicons name="mail-outline" size={20} color={theme.colors.textTertiary} />
                }
                error={errors.email?.message}
                containerStyle={styles.field}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Create a password',
              minLength: { value: 6, message: 'At least 6 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                secureTextEntry={!showPassword}
                textContentType="newPassword"
                leadingIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textTertiary} />
                }
                trailingSlot={
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={theme.colors.textTertiary}
                    />
                  </Pressable>
                }
                error={errors.password?.message}
                containerStyle={styles.field}
              />
            )}
          />

          {/* Terms */}
          <View style={styles.terms}>
            <Checkbox
              checked={agreed}
              onChange={(v) => {
                setAgreed(v);
                if (v) setAgreedError(false);
              }}
              accessibilityLabel="Agree to terms and conditions"
            />
            <Text variant="bodySm" tone="secondary" style={styles.termsText}>
              I agree to the <Text variant="bodySm" tone="brand">Terms & Conditions</Text>
            </Text>
          </View>
          {agreedError ? (
            <Text variant="caption" tone="danger" style={styles.termsError}>
              Please accept the terms to continue
            </Text>
          ) : null}

          <Button
            label="Sign Up"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={styles.cta}
          />

          <View style={styles.footer}>
            <Text variant="body" tone="secondary">
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.replace('/login')} hitSlop={8}>
              <Text variant="body" tone="brand">
                Login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingTop: 8 },
  heading: { marginBottom: 24 },
  subtitle: { marginTop: 6 },
  field: { marginBottom: 16 },
  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 20,
  },
  termsText: { flexShrink: 1 },
  termsError: { marginTop: -12, marginBottom: 16, marginLeft: 4 },
  cta: { marginBottom: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
});
