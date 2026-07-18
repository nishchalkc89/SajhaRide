/**
 * Resolves OS colour scheme + persisted user preference into one `Theme`, and
 * keeps NativeWind's `dark:` variant in sync with it.
 */

import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useEffect, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings-store';

import { darkTheme, lightTheme, ThemeContext, type ColorSchemeName } from './index';

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);
  const { setColorScheme } = useNativeWindColorScheme();

  const scheme: ColorSchemeName =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  // NativeWind keeps its own scheme state; without this, `dark:` classes and
  // useTheme() would disagree whenever the user overrides the system setting.
  useEffect(() => {
    setColorScheme(scheme);
  }, [scheme, setColorScheme]);

  const theme = useMemo(() => (scheme === 'dark' ? darkTheme : lightTheme), [scheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
