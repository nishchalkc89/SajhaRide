/**
 * Screen 2 — Onboarding.
 *
 * A three-page horizontal pager. The reference numbers these as three screens,
 * but they share pagination dots and a swipe gesture, so they are one route
 * with three pages — splitting them into separate routes would break both.
 *
 * Scroll offset is the single source of truth for the dots and the illustration
 * parallax; the settled index only drives discrete things (the CTA label).
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useHaptics } from '@/hooks/use-haptics';
import { useOnboardingStore } from '@/store/onboarding-store';
import { CAN_ANIMATE, useTheme } from '@/theme';

import { OnboardingSlideView } from './components/onboarding-slide';
import { PaginationDots } from './components/pagination-dots';
import { SLIDES } from './data';

export function OnboardingScreenView() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const triggerHaptic = useHaptics();
  const completeOnboarding = useOnboardingStore((s) => s.complete);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const onAnimatedScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  /** Settles the page index. Also the only scroll source where motion is dead. */
  const syncIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      setIndex((prev) => (prev === next ? prev : next));
    },
    [width]
  );

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/role-select');
  }, [completeOnboarding, router]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    const next = index + 1;
    // Settle the index up front so the dots + CTA label update deterministically
    // on tap, rather than waiting on onMomentumScrollEnd. A swipe still corrects
    // it via syncIndex; this only removes the button's dependency on scroll
    // events firing (which they don't, reliably, under react-native-web).
    setIndex(next);
    scrollRef.current?.scrollTo({ x: width * next, animated: true });
  }, [isLast, finish, index, width]);

  const handleSkip = useCallback(() => {
    triggerHaptic('light');
    finish();
  }, [triggerHaptic, finish]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface, paddingTop: insets.top }]}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />

      {/* Skip is always reachable, including on the last page. */}
      <View style={[styles.header, { paddingHorizontal: theme.screenPadding }]}>
        <Pressable
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={16}>
          <Text variant="body" tone="secondary">
            Skip
          </Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // Reanimated's handler is a worklet; where there's no runtime to run it
        // the plain JS handler keeps the index (and therefore the dots) alive.
        onScroll={CAN_ANIMATE ? onAnimatedScroll : syncIndex}
        onMomentumScrollEnd={syncIndex}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.pager}>
        {SLIDES.map((slide, i) => (
          <OnboardingSlideView
            key={slide.id}
            slide={slide}
            index={i}
            scrollX={scrollX}
            pageWidth={width}
          />
        ))}
      </Animated.ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: theme.spacing['3xl'],
            paddingBottom: insets.bottom + theme.spacing.xl,
          },
        ]}>
        <PaginationDots count={SLIDES.length} scrollX={scrollX} pageWidth={width} activeIndex={index} />

        <Button
          label={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          // The arrow signals "more ahead"; the terminal CTA drops it.
          trailingIcon={isLast ? undefined : <ArrowRight color={theme.colors.onPrimary} />}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

/** Inline chevron-arrow, sized to sit on the label's baseline. */
function ArrowRight({ color }: { color: string }) {
  return (
    <View style={styles.arrow}>
      <View style={[styles.arrowShaft, { backgroundColor: color }]} />
      <View style={[styles.arrowHead, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pager: { flex: 1 },
  footer: {
    gap: 28,
    alignItems: 'center',
  },
  cta: { alignSelf: 'stretch' },
  arrow: {
    width: 16,
    height: 12,
    justifyContent: 'center',
  },
  arrowShaft: {
    height: 2,
    width: 14,
    borderRadius: 1,
  },
  arrowHead: {
    position: 'absolute',
    right: 0,
    width: 7,
    height: 7,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
});
