/**
 * PrimaryButton and friends.
 *
 * Matches the CTA in the mocks: 54pt tall, 14pt radius, amber fill, black
 * label, optional trailing arrow. Press feedback is a Reanimated spring on the
 * UI thread so it stays smooth while the JS thread is busy (e.g. map work).
 *
 * STRUCTURE: a plain `Pressable` (the press target + a11y button) wrapping an
 * `Animated.View` (the visible, scaling pill). We deliberately do NOT wrap
 * Pressable in `createAnimatedComponent` — that HOC expects a host component
 * and drops Pressable's press gesture, so `onPress` silently never fires. The
 * inner-Animated.View pattern keeps events on a plain Pressable and animation
 * on a view, which is reliable on every platform.
 */

import { forwardRef, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useHaptics, type HapticFeedback } from '@/hooks/use-haptics';
import { CAN_ANIMATE, useTheme } from '@/theme';

import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Rendered left of the label. */
  leadingIcon?: React.ReactNode;
  /** Rendered right of the label — the arrow on "Next" / "Confirm". */
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  haptic?: HapticFeedback | false;
  style?: StyleProp<ViewStyle>;
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    label,
    variant = 'primary',
    size = 'lg',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = true,
    haptic = 'light',
    disabled,
    onPress,
    style,
    ...rest
  },
  ref
) {
  const theme = useTheme();
  const triggerHaptic = useHaptics();
  const scale = useSharedValue(1);

  const isInteractive = !disabled && !loading;

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const { container, labelTone } = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.surface,
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: theme.colors.border,
          },
          labelTone: 'primary' as const,
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          labelTone: 'primary' as const,
        };
      case 'danger':
        return {
          container: { backgroundColor: theme.colors.danger },
          labelTone: 'onPrimary' as const,
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: theme.colors.primary },
          labelTone: 'onPrimary' as const,
        };
    }
  }, [variant, theme]);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      accessibilityLabel={label}
      disabled={!isInteractive}
      onPressIn={() => {
        // No worklet runtime on web → skip the spring rather than write a
        // shared value that will never be read (see motion-utils).
        if (CAN_ANIMATE) scale.value = withSpring(theme.motion.pressScale, theme.motion.springFast);
      }}
      onPressOut={() => {
        if (CAN_ANIMATE) scale.value = withSpring(1, theme.motion.springFast);
      }}
      onPress={(e) => {
        if (haptic) triggerHaptic(haptic);
        onPress?.(e);
      }}
      style={{ alignSelf: fullWidth ? 'stretch' : 'flex-start' }}
      {...rest}>
      <Animated.View
        style={[
          styles.pill,
          container,
          {
            height: size === 'lg' ? theme.sizing.buttonHeight : 44,
            borderRadius: theme.radius.lg,
            paddingHorizontal: theme.spacing.xl,
            gap: theme.spacing.sm,
            opacity: isInteractive ? 1 : 0.5,
          },
          variant === 'primary' || variant === 'danger' ? theme.elevation.sm : theme.elevation.none,
          animatedStyle,
          style,
        ]}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.primary} />
        ) : (
          <>
            {leadingIcon}
            <Text variant="label" tone={labelTone}>
              {label}
            </Text>
            {trailingIcon}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Fills the Pressable so a stretched button spans full width.
    alignSelf: 'stretch',
  },
});
