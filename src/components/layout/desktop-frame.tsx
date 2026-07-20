/**
 * DesktopFrame — presents the mobile UI inside a centered "phone" on wide
 * (desktop/tablet) web viewports, with a soft backdrop. On phones (and any
 * viewport narrower than the breakpoint) it's a transparent pass-through, so
 * the mobile experience is completely unchanged.
 *
 * This exists because the whole app is designed at phone width; stretched full
 * across a desktop window it looks off (buttons a metre wide, etc.).
 */

import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/theme';

/** Below this width we assume a real phone and don't frame anything. */
const DESKTOP_MIN_WIDTH = 700;
/** The framed "device" dimensions. */
const PHONE_WIDTH = 430;
const PHONE_MAX_HEIGHT = 932;

export function DesktopFrame({ children }: PropsWithChildren) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Native, or a narrow web window → render the app exactly as-is.
  if (Platform.OS !== 'web' || width < DESKTOP_MIN_WIDTH) {
    return <>{children}</>;
  }

  const backdrop = theme.scheme === 'dark' ? '#000000' : '#E7E9EE';

  return (
    <View style={[styles.backdrop, { backgroundColor: backdrop }]}>
      <View
        style={[
          styles.phone,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  phone: {
    width: PHONE_WIDTH,
    height: '100%',
    maxHeight: PHONE_MAX_HEIGHT,
    borderRadius: 44,
    borderWidth: 1,
    overflow: 'hidden',
    // Soft floating-device shadow (cross-platform; web reads boxShadow via these).
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 48,
    shadowOffset: { width: 0, height: 24 },
    elevation: 24,
  },
});
