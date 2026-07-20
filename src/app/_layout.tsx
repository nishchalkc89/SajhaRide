/**
 * Root layout — the single place providers are composed.
 *
 * Order matters: GestureHandlerRootView must wrap everything that gestures
 * (bottom sheets, map pans); SafeAreaProvider must sit above any screen reading
 * insets; ThemeProvider must sit above anything calling useTheme().
 */

import '@/global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DesktopFrame } from '@/components/layout/desktop-frame';
import { ToastHost } from '@/components/ui/toast-host';
import { ThemeProvider } from '@/theme/theme-provider';

// Hold the native splash until fonts resolve, so the branded screen never
// renders with a fallback typeface and then reflows into Inter.
void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Ride/geo data goes stale fast; a short staleTime is the safer default.
      staleTime: 30_000,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Proceed on error too — a missing font must not wedge the app on a blank screen.
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {/* Frames the app as a centered phone on desktop; no-op on mobile. */}
            <DesktopFrame>
              <Stack
                screenOptions={{
                  // Every screen in this app draws its own chrome; the native
                  // header is never used.
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              {/* Global toast layer, above every screen. */}
              <ToastHost />
            </DesktopFrame>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
