/**
 * Screen 5 — Login.
 *
 * Phone + password, with social sign-in below. Validation runs through
 * react-hook-form; a valid submit starts OTP verification (mocked) and routes
 * to the OTP screen. Keyboard-avoiding + scrollable so the CTA is reachable on
 * small devices with the keyboard up.
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
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useHaptics } from '@/hooks/use-haptics';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import { useTheme } from '@/theme';

import { AuthDivider } from './components/auth-divider';
import { DialPrefix } from './components/dial-prefix';
import { SocialButton } from './components/social-button';

type LoginForm = {
  phone: string;
  password: string;
};

/** Nepali mobile numbers are 10 digits starting with 98/97. */
const PHONE_PATTERN = /^9[78]\d{8}$/;

export function LoginScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const startVerification = useAuthStore((s) => s.startVerification);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { phone: '', password: '' } });

  const onSubmit = (data: LoginForm) => {
    haptic('success');
    startVerification(data.phone);
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
          {/* Heading */}
          <View style={styles.heading}>
            <Text variant="h1">Welcome Back!</Text>
            <Text variant="body" tone="secondary" style={styles.subtitle}>
              Login to continue your rides
            </Text>
          </View>

          {/* Phone */}
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
                textContentType="telephoneNumber"
                prefix={<DialPrefix />}
                error={errors.phone?.message}
                containerStyle={styles.field}
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Enter your password',
              minLength: { value: 6, message: 'At least 6 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                secureTextEntry={!showPassword}
                textContentType="password"
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

          <Pressable
            onPress={() => toast('Password reset link sent to your number')}
            hitSlop={8}
            accessibilityRole="button"
            style={styles.forgot}>
            <Text variant="bodySm" tone="brand">
              Forgot Password?
            </Text>
          </Pressable>

          <Button
            label="Login"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={styles.cta}
          />

          <View style={styles.dividerWrap}>
            <AuthDivider />
          </View>

          <View style={styles.socials}>
            <SocialButton provider="google" onPress={() => toast('Google sign-in — coming soon')} />
            <SocialButton provider="apple" onPress={() => toast('Apple sign-in — coming soon')} />
          </View>

          <View style={styles.footer}>
            <Text variant="body" tone="secondary">
              Don&apos;t have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/signup')} hitSlop={8}>
              <Text variant="body" tone="brand">
                Sign Up
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
  content: {
    flexGrow: 1,
    paddingTop: 8,
  },
  heading: {
    marginBottom: 28,
  },
  subtitle: {
    marginTop: 6,
  },
  field: {
    marginBottom: 16,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 24,
  },
  cta: {
    marginBottom: 24,
  },
  dividerWrap: {
    marginBottom: 24,
  },
  socials: {
    gap: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 32,
  },
});
