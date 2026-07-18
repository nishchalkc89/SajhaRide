/**
 * Pagination dots. The active dot widens into an amber pill; neighbours stay
 * small and grey.
 *
 * TWO RENDER PATHS, chosen by motion capability:
 *
 * - Native: each dot is an Animated.View driven by the pager's scroll offset,
 *   so the pill grows and recolours *continuously* as the finger drags.
 *
 * - Web (no worklet runtime): `useAnimatedStyle` applies once at mount and does
 *   NOT re-run on a plain re-render, so a scroll- OR state-driven animated dot
 *   would freeze at its initial value. We instead render plain Views whose
 *   style is computed from the settled `activeIndex` — discrete, but correct
 *   and reactive to taps/swipes. (This is why the fallback lives here at the
 *   component level, not inside a useAnimatedStyle branch.)
 */

import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { CAN_ANIMATE, useTheme } from '@/theme';

const DOT_SIZE = 7;
const DOT_ACTIVE_WIDTH = 22;

/** Scroll-linked dot — native only. */
function AnimatedDot({
  index,
  scrollX,
  pageWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const theme = useTheme();
  const inactive = theme.colors.border;
  const active = theme.colors.primary;

  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];
    return {
      width: interpolate(scrollX.value, range, [DOT_SIZE, DOT_ACTIVE_WIDTH, DOT_SIZE], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(scrollX.value, range, [inactive, active, inactive]),
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

/** Discrete dot — web fallback, reacts to settled index via plain re-render. */
function StaticDot({ isActive }: { isActive: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dot,
        {
          width: isActive ? DOT_ACTIVE_WIDTH : DOT_SIZE,
          backgroundColor: isActive ? theme.colors.primary : theme.colors.border,
        },
      ]}
    />
  );
}

export type PaginationDotsProps = {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
  /** Settled page index. Drives the static (web) path. */
  activeIndex: number;
};

export function PaginationDots({ count, scrollX, pageWidth, activeIndex }: PaginationDotsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, i) =>
        CAN_ANIMATE ? (
          <AnimatedDot key={i} index={i} scrollX={scrollX} pageWidth={pageWidth} />
        ) : (
          <StaticDot key={i} isActive={i === activeIndex} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
