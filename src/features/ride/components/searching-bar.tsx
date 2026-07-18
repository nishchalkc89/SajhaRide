/**
 * Indeterminate "searching" bar — a bright amber segment sweeping left→right
 * across a muted track, looping.
 *
 * Built on React Native's core `Animated` (not Reanimated): core Animated has a
 * working web driver, so this animates in the browser preview too, where
 * Reanimated is inert.
 *
 * Width handling: `onLayout` is unreliable on react-native-web (it can fail to
 * fire), so the track width is seeded from the window and only *refined* by
 * onLayout — the animation always has a non-zero span to sweep. The native
 * driver is skipped on web, where it isn't supported.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import { useTheme } from '@/theme';

export function SearchingBar({ height = 6 }: { height?: number }) {
  const theme = useTheme();
  const window = useWindowDimensions();

  // Seed with a best-guess span so the loop can start before/without onLayout.
  const [trackWidth, setTrackWidth] = useState(Math.min(window.width - 48, 520));
  const progress = useRef(new Animated.Value(0)).current;

  // Segment spans ~40% of the track and sweeps across and off each side.
  const segmentWidth = Math.max(60, trackWidth * 0.4);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    anim.start();
    return () => anim.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-segmentWidth, trackWidth],
  });

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0 && Math.abs(w - trackWidth) > 1) setTrackWidth(w);
      }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: theme.colors.surfaceMuted }]}>
      <Animated.View
        style={[
          styles.segment,
          {
            width: segmentWidth,
            borderRadius: height / 2,
            backgroundColor: theme.colors.primary,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
});
