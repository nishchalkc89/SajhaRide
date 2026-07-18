/**
 * Indeterminate "searching" bar — a bright amber segment sweeping left→right
 * across a muted track, looping.
 *
 * Built on React Native's core `Animated` (not Reanimated): core Animated has a
 * working web driver, so this animates in the browser preview too, where
 * Reanimated is inert.
 */

import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { useTheme } from '@/theme';

export function SearchingBar({ height = 6 }: { height?: number }) {
  const theme = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  // Segment spans ~40% of the track and sweeps fully across and off each side.
  const segmentWidth = Math.max(60, trackWidth * 0.4);

  useEffect(() => {
    if (trackWidth === 0) return;
    const anim = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [trackWidth, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-segmentWidth, trackWidth],
  });

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
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
