/**
 * DesktopFrame — turns the web build into an attractive product landing page on
 * desktop, while leaving the mobile experience completely untouched.
 *
 *   - Native, or width < 640 (phones)  → transparent pass-through.
 *   - 640–1024 (tablets)               → the app centred in a phone frame.
 *   - ≥ 1024 (desktop)                 → a marketing hero (headline, features,
 *                                        vehicles, CTAs) beside the LIVE app
 *                                        running in a phone mockup.
 *
 * The CTAs drive the embedded app via the router, so the landing page and the
 * device preview are one interactive experience.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Image, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { LogoMark } from '@/components/brand/logo-mark';
import { Text } from '@/components/ui/text';
import { VEHICLES } from '@/services/mock-data';
import { useTheme } from '@/theme';

const TABLET_MIN = 640;
const DESKTOP_MIN = 1024;
const PHONE_WIDTH = 400;
const PHONE_MAX_HEIGHT = 860;

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  { icon: 'bicycle', title: 'Bikes & Autos', body: 'Affordable rides across Nepal in seconds.' },
  { icon: 'shield-checkmark', title: 'Verified Captains', body: 'Every captain is background-checked.' },
  { icon: 'navigate', title: 'Live Tracking', body: 'Follow your ride on the map, in real time.' },
  { icon: 'qr-code', title: 'Easy Payments', body: 'Pay by cash or scan-to-pay QR.' },
];

export function DesktopFrame({ children }: PropsWithChildren) {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Native or a genuinely phone-sized web window → app exactly as-is.
  if (Platform.OS !== 'web' || width < TABLET_MIN) {
    return <>{children}</>;
  }

  const backdrop = theme.scheme === 'dark' ? '#0A0B0D' : '#EEF0F4';
  const phone = (
    <View
      style={[
        styles.phone,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
        },
      ]}>
      {children}
    </View>
  );

  // Tablet: just the centred device.
  if (width < DESKTOP_MIN) {
    return <View style={[styles.center, { backgroundColor: backdrop }]}>{phone}</View>;
  }

  // Desktop: marketing hero + live device.
  const gradient =
    theme.scheme === 'dark'
      ? (['#0A0B0D', '#141518', '#0A0B0D'] as const)
      : (['#FFF8E7', '#EEF0F4', '#EAF2FE'] as const);

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.desktopRoot}>
      {/* Top nav */}
      <View style={styles.nav}>
        <View style={styles.brandRow}>
          <LogoMark size={30} color={theme.colors.text} apertureColor="transparent" />
          <Text variant="h3">
            Sajha<Text variant="h3" tone="brand">Ride</Text>
          </Text>
        </View>
        <View style={styles.navRight}>
          <Text variant="bodySm" tone="secondary">
            Nepal · Bike &amp; Auto
          </Text>
          <Pressable
            onPress={() => router.push('/login')}
            accessibilityRole="button"
            accessibilityLabel="Open App"
            style={[styles.navCta, { backgroundColor: theme.colors.primary }]}>
            <Text variant="label" tone="onPrimary">
              Open App
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroInner}>
          {/* Left: marketing */}
          <View style={styles.left}>
            <View style={[styles.badge, { backgroundColor: theme.colors.primarySubtle }]}>
              <Ionicons name="location" size={14} color={theme.colors.primary} />
              <Text variant="caption" tone="brand" style={styles.badgeText}>
                Nepal&apos;s ride-hailing app
              </Text>
            </View>

            <Text style={[styles.headline, { color: theme.colors.text }]}>
              Ride Together,{'\n'}
              <Text style={[styles.headline, { color: theme.colors.primary }]}>Anytime.</Text>
            </Text>

            <Text variant="body" tone="secondary" style={styles.subhead}>
              Book a bike or auto in seconds. Verified captains, live tracking, transparent
              distance-based fares and cash or QR payments — built for Nepal.
            </Text>

            {/* Features */}
            <View style={styles.features}>
              {FEATURES.map((f) => (
                <View key={f.title} style={styles.feature}>
                  <View style={[styles.featureIcon, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
                    <Ionicons name={f.icon} size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.featureText}>
                    <Text variant="bodyLg" style={styles.featureTitle}>
                      {f.title}
                    </Text>
                    <Text variant="bodySm" tone="secondary">
                      {f.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* CTAs */}
            <View style={styles.ctas}>
              <Pressable
                onPress={() => router.push('/login')}
                accessibilityRole="button"
                accessibilityLabel="Book a Ride"
                style={[styles.ctaPrimary, { backgroundColor: theme.colors.primary }, theme.elevation.sm]}>
                <Ionicons name="bicycle" size={18} color={theme.colors.onPrimary} />
                <Text variant="label" tone="onPrimary">
                  Book a Ride
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/captain/register')}
                accessibilityRole="button"
                accessibilityLabel="Become a Captain"
                style={[styles.ctaGhost, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                <Ionicons name="speedometer" size={18} color={theme.colors.text} />
                <Text variant="label">Become a Captain</Text>
              </Pressable>
            </View>

            {/* Vehicles */}
            <View style={styles.vehicles}>
              {VEHICLES.map((v) => (
                <View key={v.id} style={styles.vehicleChip}>
                  <Image source={v.image} style={styles.vehicleImg} resizeMode="contain" />
                  <Text variant="bodySm" tone="secondary">
                    {v.name}
                  </Text>
                </View>
              ))}
              <Text variant="caption" tone="tertiary" style={styles.tryLive}>
                Try the live demo →
              </Text>
            </View>
          </View>

          {/* Right: live device */}
          <View style={styles.right}>{phone}</View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  phone: {
    width: PHONE_WIDTH,
    height: '100%',
    maxHeight: PHONE_MAX_HEIGHT,
    borderRadius: 44,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 56,
    shadowOffset: { width: 0, height: 30 },
    elevation: 24,
  },

  desktopRoot: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingVertical: 22,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  navCta: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },

  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 48, paddingBottom: 32 },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 64,
    width: '100%',
    maxWidth: 1180,
  },
  left: { flex: 1, maxWidth: 620 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontWeight: '600' },
  headline: { fontFamily: 'Inter_700Bold', fontSize: 56, lineHeight: 60, letterSpacing: -1.5, marginTop: 20 },
  subhead: { marginTop: 18, maxWidth: 520, lineHeight: 24 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 32, maxWidth: 560 },
  feature: { flexDirection: 'row', gap: 12, width: 260, alignItems: 'center' },
  featureIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1 },
  featureTitle: { fontWeight: '700' },
  ctas: { flexDirection: 'row', gap: 14, marginTop: 36 },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    height: 54,
    borderRadius: 14,
  },
  ctaGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  vehicles: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40 },
  vehicleChip: { alignItems: 'center', gap: 4 },
  vehicleImg: { width: 56, height: 56 },
  tryLive: { marginLeft: 8 },
  right: { height: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
});
