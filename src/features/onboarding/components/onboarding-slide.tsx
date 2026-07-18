/**
 * One onboarding page: a 3D illustration over a title/body block.
 *
 * The illustration parallaxes at a slower rate than the page itself, so the
 * scene feels set back behind the copy while swiping.
 */

import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { CAN_ANIMATE, useTheme } from '@/theme';

import type { Slide } from '../data';

/** Fraction of a page-width the art drifts — lower is further "back". */
const PARALLAX_FACTOR = 0.28;

export type OnboardingSlideProps = {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
};

export function OnboardingSlideView({ slide, index, scrollX, pageWidth }: OnboardingSlideProps) {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  // Art is sized off viewport height so short devices don't crowd the copy.
  const artSize = Math.min(height * 0.34, pageWidth - theme.spacing['3xl'] * 2, 320);

  const artStyle = useAnimatedStyle(() => {
    if (!CAN_ANIMATE) return {};

    const range = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            range,
            [pageWidth * PARALLAX_FACTOR, 0, -pageWidth * PARALLAX_FACTOR],
            Extrapolation.CLAMP
          ),
        },
      ],
      // Neighbouring pages fade out so only the settled slide reads.
      opacity: interpolate(scrollX.value, range, [0, 1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={[styles.page, { width: pageWidth, paddingHorizontal: theme.spacing['3xl'] }]}>
      <View style={styles.artSlot}>
        <Animated.View style={artStyle}>
          <Image
            source={slide.image}
            style={{ width: artSize, height: artSize }}
            resizeMode="contain"
            // Illustration is decorative; the title/body carry the meaning.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </Animated.View>
      </View>

      <View style={styles.copy}>
        <Text variant="h1" align="center">
          {slide.title}
        </Text>
        <Text variant="body" tone="secondary" align="center" style={styles.body}>
          {slide.body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
  },
  artSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Art must never intercept the pager's swipe.
    pointerEvents: 'none',
  },
  copy: {
    alignItems: 'center',
  },
  body: {
    marginTop: 12,
    maxWidth: 300,
  },
});
