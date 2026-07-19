/**
 * CountdownBar — NATIVE. A bar that drains from full to empty over
 * `durationSeconds`, using core Animated (works on native). Web uses the CSS
 * sibling file.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/theme';

export function CountdownBar({ durationSeconds }: { durationSeconds: number }) {
  const theme = useTheme();
  const width = useWindowDimensions().width;
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: durationSeconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress, durationSeconds]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, width] });

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
      <Animated.View style={[styles.fill, { width: barWidth, backgroundColor: theme.colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, width: '100%', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%' },
});
