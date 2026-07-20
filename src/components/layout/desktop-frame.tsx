/**
 * DesktopFrame — three faces on web, transparent on mobile:
 *
 *   - Marketing routes (splash / onboarding / role-select) → a product landing
 *     hero beside the LIVE app in a phone mockup.
 *   - Auth routes (login / signup / otp / …)               → the app centred in
 *     a phone frame (forms read best narrow).
 *   - App routes (home, booking, wallet, captain, …)       → a full desktop app
 *     shell: a left sidebar + a spacious content area that fills the screen.
 *
 * Native, or any web viewport < 640px, is a pure pass-through so mobile is
 * completely unchanged.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Image, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { LogoMark } from '@/components/brand/logo-mark';
import { Text } from '@/components/ui/text';
import { VEHICLES } from '@/services/mock-data';
import { useTheme, type Theme } from '@/theme';

const TABLET_MIN = 640;
const DESKTOP_MIN = 1024;
const PHONE_WIDTH = 400;
const PHONE_MAX_HEIGHT = 860;

/** Routes that show the marketing hero. */
const MARKETING = new Set(['/', '/onboarding', '/role-select']);
/** Routes that show a narrow centred phone (auth forms). */
const AUTH = new Set(['/login', '/signup', '/otp', '/location-permission', '/captain/register']);

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  { icon: 'bicycle', title: 'Bikes & Autos', body: 'Affordable rides across Nepal in seconds.' },
  { icon: 'shield-checkmark', title: 'Verified Captains', body: 'Every captain is background-checked.' },
  { icon: 'navigate', title: 'Live Tracking', body: 'Follow your ride on the map, in real time.' },
  { icon: 'qr-code', title: 'Easy Payments', body: 'Pay by cash or scan-to-pay QR.' },
];

export function DesktopFrame({ children }: PropsWithChildren) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  // Native or phone-sized web → app exactly as-is.
  if (Platform.OS !== 'web' || width < TABLET_MIN) return <>{children}</>;

  const isMarketing = MARKETING.has(pathname);
  const isAuth = AUTH.has(pathname);
  const isApp = !isMarketing && !isAuth;

  // App routes on a wide screen get the full desktop shell.
  if (isApp && width >= DESKTOP_MIN) {
    return <DesktopAppShell theme={theme} pathname={pathname}>{children}</DesktopAppShell>;
  }

  // Marketing hero (desktop only).
  if (isMarketing && width >= DESKTOP_MIN) {
    return <MarketingHero theme={theme}>{children}</MarketingHero>;
  }

  // Otherwise (auth, or tablet width) → centred phone.
  const backdrop = theme.scheme === 'dark' ? '#0A0B0D' : '#EEF0F4';
  return (
    <View style={[styles.center, { backgroundColor: backdrop }]}>
      <PhoneFrame theme={theme}>{children}</PhoneFrame>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Phone mockup                                                        */
/* ------------------------------------------------------------------ */

function PhoneFrame({ theme, children }: PropsWithChildren<{ theme: Theme }>) {
  return (
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
}

/* ------------------------------------------------------------------ */
/* Desktop app shell — sidebar + content                              */
/* ------------------------------------------------------------------ */

type NavItem = { label: string; icon: keyof typeof Ionicons.glyphMap; path: string };

const RIDER_NAV: NavItem[] = [
  { label: 'Home', icon: 'home', path: '/home' },
  { label: 'Bookings', icon: 'receipt', path: '/bookings' },
  { label: 'Wallet', icon: 'wallet', path: '/wallet' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];
const CAPTAIN_NAV: NavItem[] = [
  { label: 'Home', icon: 'home', path: '/captain' },
  { label: 'Earnings', icon: 'wallet', path: '/captain/earnings' },
  { label: 'History', icon: 'time', path: '/captain/history' },
  { label: 'Profile', icon: 'person', path: '/captain/profile' },
];

function DesktopAppShell({ theme, pathname, children }: PropsWithChildren<{ theme: Theme; pathname: string }>) {
  const router = useRouter();
  const isCaptain = pathname.startsWith('/captain');
  const nav = isCaptain ? CAPTAIN_NAV : RIDER_NAV;
  const backdrop = theme.scheme === 'dark' ? '#0A0B0D' : '#E7E9EE';

  return (
    <View style={[styles.shell, { backgroundColor: backdrop }]}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { backgroundColor: theme.colors.surface, borderRightColor: theme.colors.border }]}>
        <View style={styles.sidebarBrand}>
          <LogoMark size={28} color={theme.colors.text} apertureColor="transparent" />
          <Text variant="h3">
            Sajha<Text variant="h3" tone="brand">Ride</Text>
          </Text>
        </View>

        <View style={styles.navList}>
          {nav.map((item) => {
            const active = pathname === item.path;
            return (
              <Pressable
                key={item.path}
                onPress={() => router.push(item.path as never)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                style={[styles.navItem, active && { backgroundColor: theme.colors.primarySubtle }]}>
                <Ionicons
                  name={active ? item.icon : (`${item.icon}-outline` as keyof typeof Ionicons.glyphMap)}
                  size={22}
                  color={active ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text variant="bodyLg" tone={active ? 'brand' : 'secondary'} style={styles.navLabel}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sidebarFooter}>
          <Pressable
            onPress={() => router.replace((isCaptain ? '/home' : '/captain') as never)}
            accessibilityRole="button"
            style={[styles.switchBtn, { borderColor: theme.colors.border }]}>
            <Ionicons name="swap-horizontal" size={18} color={theme.colors.text} />
            <Text variant="label">{isCaptain ? 'Passenger Mode' : 'Captain Mode'}</Text>
          </Pressable>
          <Text variant="caption" tone="tertiary" align="center" style={styles.version}>
            SajhaRide · Nepal
          </Text>
        </View>
      </View>

      {/* Content area — a spacious app panel */}
      <View style={styles.contentArea}>
        <View
          style={[
            styles.contentPanel,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}>
          {children}
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Marketing hero                                                      */
/* ------------------------------------------------------------------ */

function MarketingHero({ theme, children }: PropsWithChildren<{ theme: Theme }>) {
  const router = useRouter();
  const gradient =
    theme.scheme === 'dark'
      ? (['#0A0B0D', '#141518', '#0A0B0D'] as const)
      : (['#FFF8E7', '#EEF0F4', '#EAF2FE'] as const);

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroRoot}>
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

      <View style={styles.hero}>
        <View style={styles.heroInner}>
          <View style={styles.left}>
            <View style={[styles.badge, { backgroundColor: theme.colors.primarySubtle }]}>
              <Ionicons name="location" size={14} color={theme.colors.primary} />
              <Text variant="caption" tone="brand" style={styles.bold}>
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

            <View style={styles.features}>
              {FEATURES.map((f) => (
                <View key={f.title} style={styles.feature}>
                  <View style={[styles.featureIcon, { backgroundColor: theme.colors.surface }, theme.elevation.sm]}>
                    <Ionicons name={f.icon} size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.featureText}>
                    <Text variant="bodyLg" style={styles.bold}>
                      {f.title}
                    </Text>
                    <Text variant="bodySm" tone="secondary">
                      {f.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

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

          <View style={styles.right}>
            <PhoneFrame theme={theme}>{children}</PhoneFrame>
          </View>
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

  // App shell
  shell: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 260, paddingHorizontal: 16, paddingVertical: 24, borderRightWidth: 1, justifyContent: 'space-between' },
  sidebarBrand: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, marginBottom: 28 },
  navList: { flex: 1, gap: 6 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14 },
  navLabel: { fontWeight: '600' },
  sidebarFooter: { gap: 14 },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  version: {},
  contentArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  contentPanel: {
    width: '100%',
    maxWidth: 560,
    height: '100%',
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },

  // Marketing
  heroRoot: { flex: 1 },
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
  heroInner: { flexDirection: 'row', alignItems: 'center', gap: 64, width: '100%', maxWidth: 1180 },
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
  bold: { fontWeight: '700' },
  headline: { fontFamily: 'Inter_700Bold', fontSize: 56, lineHeight: 60, letterSpacing: -1.5, marginTop: 20 },
  subhead: { marginTop: 18, maxWidth: 520, lineHeight: 24 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 32, maxWidth: 560 },
  feature: { flexDirection: 'row', gap: 12, width: 260, alignItems: 'center' },
  featureIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1 },
  ctas: { flexDirection: 'row', gap: 14, marginTop: 36 },
  ctaPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, height: 54, borderRadius: 14 },
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
