/**
 * Screen 1 — Splash.
 *
 * Full-bleed amber canvas, centred logo lockup, Kathmandu skyline anchored to
 * the bottom edge. Entrance is staged so the eye lands mark → wordmark →
 * tagline → city, then routes onward.
 *
 * All animation runs on the UI thread via Reanimated; the only JS-thread work
 * is the single navigation call at the end.
 */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { LogoMark } from '@/components/brand/logo-mark';
import { Text } from '@/components/ui/text';
import { CAN_ANIMATE, entranceFrom, useTheme } from '@/theme';

import { KathmanduSkyline } from './components/kathmandu-skyline';

/** Beats of the entrance, in ms. Tuned so the whole thing lands under motion.duration.splash. */
const BEAT = {
  mark: 120,
  wordmark: 380,
  tagline: 560,
  skyline: 260,
} as const;

/** The tagline reads as secondary against the wordmark, never at full strength. */
const TAGLINE_OPACITY = 0.75;

export function SplashScreenView() {
  const theme = useTheme();
  const router = useRouter();
  // Clamp to the phone-frame width so the skyline doesn't over-scale on desktop.
  const { width: rawWidth } = useWindowDimensions();
  const width = Math.min(rawWidth, 460);

  // --- Shared values -------------------------------------------------------
  // Each declares origin → destination; `entranceFrom` collapses to the
  // destination where Reanimated has no runtime to drive it (see motion-utils).
  const markScale = useSharedValue(entranceFrom(0.72, 1));
  const markOpacity = useSharedValue(entranceFrom(0, 1));
  const wordmarkY = useSharedValue(entranceFrom(14, 0));
  const wordmarkOpacity = useSharedValue(entranceFrom(0, 1));
  const taglineOpacity = useSharedValue(entranceFrom(0, TAGLINE_OPACITY));
  const skylineY = useSharedValue(entranceFrom(28, 0));
  const skylineOpacity = useSharedValue(entranceFrom(0, 1));

  useEffect(() => {
    if (!CAN_ANIMATE) return; // Already composed at the destination state.

    // Mark: overshoot slightly, then settle — reads as "stamped down".
    markOpacity.value = withDelay(BEAT.mark, withTiming(1, { duration: 260 }));
    markScale.value = withDelay(
      BEAT.mark,
      withSequence(
        withSpring(1.06, { damping: 12, stiffness: 200 }),
        withSpring(1, theme.motion.spring)
      )
    );

    wordmarkOpacity.value = withDelay(BEAT.wordmark, withTiming(1, { duration: 300 }));
    wordmarkY.value = withDelay(BEAT.wordmark, withSpring(0, theme.motion.spring));

    // Tagline fades to 0.75, not 1 — it sits under the wordmark in the hierarchy.
    taglineOpacity.value = withDelay(BEAT.tagline, withTiming(TAGLINE_OPACITY, { duration: 400 }));

    // Skyline rises into place — a slow parallax against the faster lockup.
    skylineOpacity.value = withDelay(BEAT.skyline, withTiming(1, { duration: 700 }));
    skylineY.value = withDelay(
      BEAT.skyline,
      withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, [
    markOpacity,
    markScale,
    wordmarkOpacity,
    wordmarkY,
    taglineOpacity,
    skylineOpacity,
    skylineY,
    theme.motion.spring,
  ]);

  // Hold the brand moment, then advance. `replace` so Back can't return here.
  useEffect(() => {
    const goNext = () => router.replace('/onboarding');
    const id = setTimeout(goNext, theme.motion.duration.splash);
    return () => clearTimeout(id);
  }, [router, theme.motion.duration.splash]);

  // --- Animated styles -----------------------------------------------------
  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ scale: markScale.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));

  const skylineStyle = useAnimatedStyle(() => ({
    opacity: skylineOpacity.value,
    transform: [{ translateY: skylineY.value }],
  }));

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.primary }]}>
      {/* Amber is light, so the status bar needs dark glyphs regardless of scheme. */}
      <StatusBar style="dark" />

      {/* Lockup is optically centred — nudged up so the skyline doesn't crowd it. */}
      <View style={styles.lockup}>
        <Animated.View style={markStyle}>
          <LogoMark size={104} color={theme.colors.onPrimary} apertureColor={theme.colors.primary} />
        </Animated.View>

        <Animated.View style={[styles.wordmarkBlock, wordmarkStyle]}>
          <Text variant="display" tone="onPrimary" align="center">
            SajhaRide
          </Text>
          <Animated.View style={taglineStyle}>
            <Text variant="bodySm" tone="onPrimary" align="center" style={styles.tagline}>
              Ride Together, Anytime.
            </Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Skyline is pinned to the bottom edge and bleeds past it. */}
      <Animated.View style={[styles.skyline, skylineStyle]}>
        <KathmanduSkyline width={width} height={width * 0.46} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockup: {
    alignItems: 'center',
    // Pull the lockup above true centre so it reads against the skyline mass.
    marginBottom: '18%',
  },
  wordmarkBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  tagline: {
    marginTop: 6,
  },
  skyline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Decorative only — must never intercept touches.
    pointerEvents: 'none',
  },
});
